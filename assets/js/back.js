import axios from "./utils/axiosConfig.js";

//主頁的產品功能需求
const api_Url = import.meta.env.VITE_API_URL_ADMIN;
const api_Path = import.meta.env.VITE_API_PATH;
const api_Token = import.meta.env.VITE_API_TOKEN;

const headers = {
  headers: {
    Authorization: api_Token,
  },
};

const orderWrap = document.querySelector(".orderWrap");
const deleAllBtn = document.querySelector(".deleAllOrderBtn");

let chartDataType = [];
let chartData = [];

//使用 DOMContentLoaded 確保 DOM 已加載 將所有 DOM 操作包裹在 DOMContentLoaded 事件中，避免在 DOM 尚未加載完成時執行 querySelector。
// document.addEventListener("DOMContentLoaded", () => {
//   //初始化畫面查詢訂單
//   getOrders();
//   //  orderWrap 使用事件代理綁定事件 加入處理單+刪除訂單
//   orderWrap.addEventListener("click", (e) => {
//     e.preventDefault(); // 防止默認的跳轉行為
//     const orderId = e.target.dataset.id; // 獲取訂單 ID，接著根據點擊 "修改訂單"、"刪除訂單"處理
//     if (e.target.classList.contains("putOrder")) {
//       putOrder(orderId);
//     }
//     if (e.target.classList.contains("deleOrderBtn")) {
//       deleOrder(orderId); // 刪除所有品項
//     }
//   });
//   //  deleAllBtn 使用事件代理綁定事件 刪除所有訂單
//   deleAllBtn.addEventListener("click", (e) => {
//     e.preventDefault(); // 防止默認的跳轉行為
//     deleAllOrders(); // 調用 addCart 函數
//   });
// });
document.addEventListener("DOMContentLoaded", init);

window.putOrder = putOrder; // 將函數掛載到全域作用域
window.deleOrder = deleOrder;
window.deleAllOrders = deleAllOrders;

function init() {
  getOrders();
  // 其他事件綁定
  bindOrderWrapEvents();
  bindDeleteAllButton();
}

function bindOrderWrapEvents() {
  orderWrap.addEventListener("click", (e) => {
    e.preventDefault();
    const orderId = e.target.dataset.id;
    // if (e.target.classList.contains("putOrder")) {
    //   putOrder(orderId);
    // }
    if (e.target.classList.contains("putOrder")) {
      const currentStatus = e.target.textContent === "已處理";
      putOrder(orderId, !currentStatus);
    }
    if (e.target.classList.contains("deleOrderBtn")) {
      deleOrder(orderId);
    }
  });
}

function bindDeleteAllButton() {
  deleAllBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleAllOrders();
  });
}

//模組化的渲染函數 for getProducts 來取代 組字串html
function generateOrderHTML(item) {
  // 確保數據完整性，避免空值出錯
  const {
    id = "",
    user: {
      //使用者資訊
      name = "",
      address = "",
      email = "",
    },
    products = [],
    createdAt = "",
    //orderStatus,
  } = item;

  // 訂單中的產品資料處理，抽出產品名稱和數量
  let productsList = "";
  //const productsArray = item.products;
  item.products.forEach((product, idx) => {
    productsList += `${product.title} * ${product.quantity}`;
    if (idx !== item.products.length - 1) {
      productsList += "<br/>";
    }
  });
  //timestamp 取得的是秒數，但在 JavaScript 中要帶入的是毫秒，所以要 new Date(timestamp * 1000)：
  return `
    <tr>
      <td> ${item.id} </td>
      <td> ${item.user.name} </td>
      <td> ${item.user.address} </td>
      <td> ${item.user.email} </td>
      <td> ${productsList} </td>
      <td> ${new Date(item.createdAt * 1000).toISOString().split("T")[0]} </td>
      <td class="orderBtn">
        ${
          item.paid
            ? `<a href="#" class="putOrder checkBtn" data-id="${item.id}">已處理</a>`
            : `<a href="#" class="putOrder unCheckBtn" data-id="${item.id}">未處理</a>`
        }
      </td>
      <td class="deleBtn">
        <a href="#" class="deleOrderBtn" data-id="${item.id}">刪除</a>
      </td>
    </tr>
    `;
}

function renderOrders(orders, container) {
  // 確保容器存在並清空容器內容
  if (!container) return;
  container.innerHTML = orders.map(generateOrderHTML).join("");
}

function getOrders() {
  const api_function = "orders";
  //const selectValue = document.querySelector(".orderSelect").value;
  axios
    .get(`${api_Url}/${api_Path}/${api_function}`, headers)
    .then(function (res) {
      const orders = res.data.orders || []; // 確保 orders 不為 null 或 undefined

      // //處理所有訂單的種類與數量，交由C3呈現圓餅圖
      // let productList = [];
      // let typeList = [];
      // orders.forEach((item) => {
      //   item.products.forEach((product, idx) => {
      //     for (let i = 0; i < product.quantity; i++) {
      //       productList.push(product.title); //紀錄名稱
      //       typeList.push(product.category); //紀錄種類
      //     }
      //   });
      // });

      const filteredOrders = filterOrders(orders); // 如果需要篩選，這裡可以修改篩選邏輯
      // 渲染產品到容器
      renderOrders(filteredOrders, orderWrap);
      //抽出並處理瑄染C3
      handleChartData(filteredOrders);
    })
    .catch(function (error) {
      console.error("無法取得訂單資料：", error);
      alert("無法取得訂單資料，請稍後再試！");
    });
}

// 篩選訂單的邏輯
function filterOrders(orders) {
  // 此處可以加入篩選條件，例如依據訂單狀態或其他條件來篩選訂單
  // 暫時回傳所有訂單，如需新增篩選條件可以根據需求進行修改
  return orders;
}

function deleOrder(orderId) {
  if (confirm("您確定要刪除此訂單嗎？")) {
    axios
      .delete(`${api_Url}/${api_Path}/orders/${orderId}`, headers)
      .then(function (res) {
        getOrders();
      })
      .catch(function (error) {
        console.error("無法刪除訂單資料：", error);
        alert("無法刪除訂單資料，請稍後再試！");
      });
  }
}

function deleAllOrders() {
  if (confirm("您確定要刪除全部訂單嗎？")) {
    axios
      .delete(`${api_Url}/${api_Path}/orders`, headers)
      .then(function (res) {
        getOrders();
      })
      .catch(function (error) {
        console.error("無法刪除所有訂單：", error);
        alert("無法刪除所有訂單，請稍後再試！");
      });
  }
}

// 修改完成訂單狀態
function putOrder(ordersId, status) {
  axios
    .put(
      `${api_Url}/${api_Path}/orders`,
      {
        data: {
          id: ordersId,
          paid: status,
        },
      },
      headers
    )
    .then(function (res) {
      getOrders();
    })
    .catch(function (error) {
      console.error("無法修改訂單狀態：", error);
      alert("無法修改訂單狀態，請稍後再試！");
    });
}

// 處理訂單資料並生成圖表數據
function handleChartData(orders) {
  let productList = [];
  let typeList = [];
  orders.forEach((item) => {
    item.products.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        productList.push(product.title); // 紀錄名稱
        typeList.push(product.category); // 紀錄種類
      }
    });
  });

  // 根據產品資料渲染圖表
  renderList(productList, typeList);
  renderC3();
  renderC3Type();
}

function renderList(data, dataType) {
  // 這部分的代碼和你原本提供的一樣，處理產品數據
  let toatlObj = {};
  chartData = [];
  data.forEach((item) => {
    if (toatlObj[item] == undefined) {
      toatlObj[item] = 1;
    } else {
      toatlObj[item] += 1;
    }
  });

  let sortable = [];
  for (var sortItem in toatlObj) {
    sortable.push([sortItem, toatlObj[sortItem]]);
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let top3 = sortable.slice(0, 3);
  let others = sortable.slice(3);
  let othersSum = others.reduce((acc, curr) => acc + curr[1], 0);

  chartData = [...top3, ["其他", othersSum]];

  let toatlType = {};
  chartDataType = [];
  dataType.forEach((item) => {
    if (toatlType[item] == undefined) {
      toatlType[item] = 1;
    } else {
      toatlType[item] += 1;
    }
  });
  for (var sortItem in toatlType) {
    chartDataType.push([sortItem, toatlType[sortItem]]);
  }
}

// 升級 C3 到相容 D3 v7 的版本
function renderC3() {
  // 原版 C3 + D3 v5
  // let chart = c3.generate({
  //   bindto: "#chart", // HTML 元素綁定
  //   data: {
  //     type: "pie",
  //     columns: chartData.sort(),
  //   },
  //   color: {
  //     pattern: ["#301E5F", "#9D7FEA", "#5434A7", "#DACBFF"],
  //   },
  // });
  // 升級 C3 到相容 D3 v7 的版本
  let chart = bb.generate({
    bindto: "#chart",
    data: {
      type: "pie",
      columns: chartData.sort(),
    },
    color: {
      pattern: ["#301E5F", "#9D7FEA", "#5434A7", "#DACBFF"],
    },
  });
}

function renderC3Type() {
  // 原版 C3 + D3 v5
  // let chart = c3.generate({
  //   bindto: "#chartType", // HTML 元素綁定
  //   data: {
  //     type: "pie",
  //     columns: chartDataType.sort(),
  //   },
  //   color: {
  //     pattern: ["#301E5F", "#9D7FEA", "#5434A7", "#DACBFF"],
  //   },
  // });
  // 升級 C3 到相容 D3 v7 的版本
  let chart = bb.generate({
    bindto: "#chartType",
    data: {
      type: "pie",
      columns: chartDataType.sort(),
    },
    color: {
      pattern: ["#301E5F", "#9D7FEA", "#5434A7", "#DACBFF"],
    },
  });
}
