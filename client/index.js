const fetchDataBtn = document.getElementById("Fetch-Data-Btn");


async function getLabels() {
  const url = "http://localhost:6016/getLabels";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

if (fetchDataBtn) {
    fetchDataBtn.addEventListener("click", async () => {
      await getLabels();
    });
}


