const fetchDataBtn = document.getElementById("Fetch-Data-Btn");
const mainDiv = document.getElementById("Main");
const loaderDiv = document.querySelector(".loader");

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
    const tableBody = document.createElement("tbody");

    const ordersArr = res.data;
    let c = 1;
    for (const i of ordersArr) {
      let currentRow = document.createElement("tr");
      let currentSlNo = document.createElement("td");
      let currentItemNameTd = document.createElement("td");
      let currentTotalPriceTd = document.createElement("td");
      let currentOrderIdTd = document.createElement("td");
      currentOrderIdTd.style.overflow = "auto";
      let date = document.createElement("td");
      let time = document.createElement("td");
      let quantityTd = document.createElement("td");
      currentTotalPriceTd.className = "total-price";
      currentSlNo.innerText = c;
      currentOrderIdTd.innerText = i.order_id;
      currentItemNameTd.innerText = i.items[0].item;
      currentTotalPriceTd.innerText = i.total;
      quantityTd.innerText = i.items[0].quantity;
      date.innerText = i.date;
      time.innerText = i.time;
      currentRow.appendChild(currentSlNo);
      currentRow.appendChild(date);
      currentRow.appendChild(time);
      currentRow.appendChild(currentOrderIdTd);
      currentRow.appendChild(currentItemNameTd);
      currentRow.appendChild(quantityTd);
      currentRow.appendChild(currentTotalPriceTd);
      tableBody.appendChild(currentRow);
      c++;
    }

    table.appendChild(tableBody);
  } catch (error) {
    console.error(error.message, " err happened when fetching ");
  }
}

if (fetchDataBtn) {
  fetchDataBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    loaderDiv.style.display = "block";
    getLabels().finally(() => {
      loaderDiv.style.display = "none";
      const allTotalPriceElements = document.querySelectorAll(".total-price");
      let totalPrice = 0;
      allTotalPriceElements.forEach((el) => {
        totalPrice += Number(el.lastChild.data);
      });
      console.log(allTotalPriceElements);
      const tableFooter = document.createElement("tfoot");
      const table = document.getElementById("Expenditures-Table");
      const totalEle = document.createElement("strong");
      totalEle.innerText = totalPrice.toString();
      tableFooter.appendChild(totalEle);

      table.appendChild(tableFooter);
    });
  });
}
