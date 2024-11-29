const fetchDataBtn = document.getElementById("Fetch-Data-Btn");

async function getLabels() {
  const url = "http://localhost:6016/getLabels";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();

    console.log("Parsed response:", res);

    console.log("Fetched data:", res.data);

    const table = document.getElementById("Expenditures-Table");

    const ordersArr = res.data;

    for (const i of ordersArr) {
      let currentRow = document.createElement("th");
      let currentItemNameTd = document.createElement("td");
      let currentTotalPriceTd = document.createElement("td");
      let currentOrderIdTd = document.createElement("td");
      let quantityTd = document.createElement("td");
      currentOrderIdTd.innerText = i.order_id;
      currentItemNameTd.innerText = i.items[0].item;
      currentTotalPriceTd.innerText = i.total;
      quantityTd.innerText = i.items[0].quantity;
      currentRow.appendChild(currentOrderIdTd);
      currentRow.appendChild(currentItemNameTd);
      currentRow.appendChild(quantityTd);
      currentRow.appendChild(currentTotalPriceTd);
      table.appendChild(currentRow);
    
    }
  } catch (error) {
    console.error(error.message, " err happened when fetching ");
  }
}

if (fetchDataBtn) {
  fetchDataBtn.addEventListener("click", async () => {
    await getLabels();
  });
}
