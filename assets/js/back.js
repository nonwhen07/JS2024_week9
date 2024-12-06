import axios from "./utils/axiosConfig.js";

// 預設 JS，請不要修改此處
let menuOpenBtn = document.querySelector(".menuToggle");
let linkBtn = document.querySelectorAll(".topBar-menu a");
let menu = document.querySelector(".topBar-menu");
menuOpenBtn.addEventListener("click", menuToggle);

linkBtn.forEach((item) => {
  item.addEventListener("click", closeMenu);
});

function menuToggle() {
  if (menu.classList.contains("openMenu")) {
    menu.classList.remove("openMenu");
  } else {
    menu.classList.add("openMenu");
  }
}
function closeMenu() {
  menu.classList.remove("openMenu");
}

//主頁的產品功能需求
const api_Url = import.meta.env.VITE_API_URL_ADMIN;
const api_Path = import.meta.env.VITE_API_PATH;
const api_Token = import.meta.env.VITE_API_TOKEN;

const headers = {
  headers: {
    Authorization: api_Token,
  },
};
const orderPage_table = document.querySelector(".orderPage-table");
let orderData = [];
let chartDataType = [];
let chartData = [];

getOrders();

function getOrders() {
  let orders = [];
  const api_function = "orders";

  axios
    .get(`${api_Url}/${api_Path}/${api_function}`, headers)
    .then(function (res) {
      orders = res.data.orders;
      let productList = [];
      let typeList = [];
      let dataItem = `<thead>
                <tr>
                  <th>訂單編號</th>
                  <th>聯絡人</th>
                  <th>聯絡地址</th>
                  <th>電子郵件</th>
                  <th>訂單品項</th>
                  <th>訂單日期</th>
                  <th>訂單狀態</th>
                  <th>操作</th>
                </tr>
              </thead>`;

      orders.forEach((item) => {
        //因為一般 timestamp 取得的是秒數，但在 JavaScript 中要帶入的是毫秒，所以要 new Date(timestamp * 1000)：
        let createdAt = new Date(item.createdAt * 1000)
          .toISOString()
          .split("T")[0];
        let products = "";
        let orderStatus = "";
        item.products.forEach((product, idx) => {
          products += `${product.title} * ${product.quantity}`;
          if (idx !== item.products.length - 1) {
            products += "<br/>";
          }
          for (let i = 0; i < product.quantity; i++) {
            productList.push(product.title); //紀錄名稱
            typeList.push(product.category); //紀錄種類
          }
        });

        //orderStatus
        if (item.paid) {
          orderStatus = `<a href="#"" >已處理</a>`;
        } else {
          orderStatus = `<a href="#" onclick="putOrder('${item.id}');" >未處理</a>`;
        }

        dataItem += `<tr>
                    <td> ${item.id} </td>
                    <td> ${item.user.name} </td>
                    <td> ${item.user.address} </td>
                    <td> ${item.user.email} </td>
                    <td> ${products} </td>
                    <td> ${createdAt} </td>
                    <td class="orderStatus">
                      ${orderStatus}
                    </td>
                    <td class="discardBtn">
                      <input type="button" class="delSingleOrder-Btn" value="刪除" onclick="deleOrder('${item.id}');">
                    </td>
                </tr>`;
      });

      orderPage_table.innerHTML = dataItem;

      renderList(productList, typeList);
      renderC3();
      renderC3Type();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deleOrder(orderId) {
  const api_function = "orders";
  axios
    .delete(`${api_Url}/${api_Path}/${api_function}/${orderId}`, headers)
    .then(function (res) {
      getOrders();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function deleAllOrders() {
  const api_function = "orders";
  axios
    .delete(`${api_Url}/${api_Path}/${api_function}`, headers)
    .then(function (res) {
      getOrders();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
// 修改訂單狀態 -
function putOrder(ordersId) {
  const api_function = "orders";
  axios
    .put(
      `${api_Url}/${api_Path}/${api_function}`,
      {
        data: {
          id: ordersId,
          paid: true,
        },
      },
      headers
    )
    .then(function (res) {
      getOrders();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function renderList(data, dataType) {
  // 產品圓餅圖
  let toatlObj = {};
  chartData = []; // 重置 chartData
  data.forEach((item) => {
    // 將所有資料轉換成 屬性: 比數
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
  sortable.sort(function (a, b) {
    //return a[1] - b[1];
    return b[1] - a[1];
  });
  // console.log('sortable', sortable)

  // 以下參考Shu Chi Chen同學的 top3分離，在這邊快做完突然卡死不曉得怎麼分離top3 //
  let top3 = sortable.slice(0, 3); // 前 3 名
  // console.log('top3', top3)
  let others = sortable.slice(3); // 其他
  let othersSum = others.reduce((acc, curr) => acc + curr[1], 0);
  // 結束 //

  chartData = [...top3, ["其他", othersSum]];
  // 由於sort調整rray，這邊可以改掉
  // let newData = Object.keys(toatlObj);
  // newData.forEach((item) => {
  //   let ary = [];
  //   ary.push(item);
  //   ary.push(toatlObj[item]);
  //   chartData.push(ary);
  // });

  // 種類圓餅圖
  let toatlType = {};
  chartDataType = [];
  dataType.forEach((item) => {
    // 將所有資料轉換成 屬性: 比數
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

function renderC3() {
  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
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
  // C3.js
  let chart = c3.generate({
    bindto: "#chartType", // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartDataType.sort(),
    },
    color: {
      pattern: ["#301E5F", "#9D7FEA", "#5434A7", "#DACBFF"],
    },
  });
}
