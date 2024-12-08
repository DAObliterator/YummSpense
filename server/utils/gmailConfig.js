const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const cheerio = require("cheerio");
const { getRelevantInfoGeminiApi } = require("./geminiApiConfig.js");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
const authorize = async () => {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
};

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

const listOrders = async () => {
  const auth = await authorize();
  const gmail = google.gmail({ version: "v1", auth });
  let result;

  let arrayOfResults = [];
  let decodedBody;
  try {
    let req = await gmail.users.messages.list({
      userId: "me",
      q: "from:<support@petpooja.com>",
    });

    let arr = req.data.messages;

    let c = 0;

    for (const m of arr) {
      let resObj;
      /*if (c > 2) {
        break;
      }*/

      let message;

      let currentId = m.id;

      message = await gmail.users.messages.get({ userId: "me", id: currentId });
      // Extract the headers
      const headers = message.data.payload.headers;

      // Find the "Date" header
      const dateHeader = headers.find((header) => header.name === "Date");
      let date = "";
      let time = "";
      if (dateHeader) {
        console.log("Message sent on:", dateHeader.value);

        const emailDate = new Date(dateHeader.value);

        // Extract DD/MM/YY format
        date = emailDate.toLocaleDateString("en-GB").replace(/\//g, "/"); // DD/MM/YY in the UK locale

        // Extract time in AM/PM format
        time = emailDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        console.log("Date header not found.");
      }
      // Decode the body of the message
      const encodedBody =
        message.data.payload?.body?.data ||
        message.data.payload?.parts?.[0]?.body?.data;

      if (encodedBody) {
        // Decode from Base64 and convert to string
        decodedBody = Buffer.from(encodedBody, "base64").toString("utf-8");

        const $ = cheerio.load(decodedBody);

        const prompt = `extract order id items and total from this - ${decodedBody} and return as json , no additional data just the json`;

        result = await getRelevantInfoGeminiApi(prompt);

        result = result.replace(/```json|```/g, "").trim();
        
        try {
          resObj = JSON.parse(result);
          resObj.date = date;
          resObj.time = time;
          arrayOfResults.push(resObj);
          console.log(resObj, " --- resObj --- \n");
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
      }

      c++;
    }
  } catch (error) {
    console.log(error, "error happened : ( !!! \n");
  }

  return arrayOfResults;
};

module.exports = { listOrders };
