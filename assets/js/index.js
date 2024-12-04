import axios from "./utils/axiosConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  const ele = document.querySelector(".recommendation-wall");
  ele.style.cursor = "grab";
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = function (e) {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };
  // Attach the handler
  ele.addEventListener("mousedown", mouseDownHandler);
});

//主頁的產品功能需求
const api_Url = import.meta.env.VITE_API_URL;
const api_Token = import.meta.env.VITE_API_TOKEN;

//const api = `${api_Url}/${api_Token}/${api_function}`;
const cartTable = document.querySelector(".shoppingCart-table");
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCart = document.querySelector(".shoppingCart");
const orderInfo = document.querySelector(".orderInfo");
const orderForm = document.querySelector(".orderInfo-form");
const orderInput = document.querySelectorAll(".orderInfo-input");

let cartData = []; //裝入全域的 cartData 後面可以用來比對是否第一筆加入購物車

// //處理產品資料篩選的邏輯
function filter() {
  getProducts();
}

//將上段改寫，使用 DOMContentLoaded 確保 DOM 已加載 將所有 DOM 操作包裹在 DOMContentLoaded 事件中，避免在 DOM 尚未加載完成時執行 querySelector。
document.addEventListener("DOMContentLoaded", () => {
  const goTop = document.getElementById("goTopBtn");

  // 滾動事件：顯示或隱藏按鈕
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      goTop.style.display = "block";
    } else {
      goTop.style.display = "none";
    }
  });

  // 點擊事件：返回頂部（平滑滾動）
  goTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 使用平滑滾動
    });
  });

  //初始化畫面查詢商品 + 現有購物車
  getProducts();
  getCarts();

  // productSelect 綁定事件
  if (productSelect) {
    productSelect.addEventListener("change", filter);
  }

  //  productWrap 使用事件代理綁定事件 加入購物車
  productWrap.addEventListener("click", (e) => {
    if (e.target.classList.contains("addCardBtn")) {
      e.preventDefault(); // 防止默認的跳轉行為
      const productId = e.target.dataset.id; // 取得 data-id
      addCart(productId); // 調用 addCart 函數
    }
  });
  // cartTable 使用事件代理綁定事件 刪除單一品項、刪除所有品項
  cartTable.addEventListener("click", (e) => {
    e.preventDefault(); // 防止默認行為
    if (e.target.classList.contains("deleCart")) {
      const productId = e.target.dataset.id; // 獲取產品 ID
      deleCart(productId);
    }
    if (e.target.classList.contains("discardAllBtn")) {
      deleAllCart(); // 刪除所有品項
    }
  });

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const api_function = "orders";
    let check = checkOrderData(orderInput); // check FormInput內容
    if (check) {
      let orderData = {};
      orderData.name = orderInput[0].value;
      orderData.tel = orderInput[1].value;
      orderData.email = orderInput[2].value;
      orderData.address = orderInput[3].value;
      orderData.payment = orderInput[4].value;
      axios
        .post(`${api_Url}/${api_Token}/${api_function}`, {
          data: {
            user: {
              name: orderData.name,
              tel: orderData.tel,
              email: orderData.email,
              address: orderData.address,
              payment: orderData.payment,
            },
          },
        })
        .then(function (res) {
          getProducts();
          getCarts();
          orderForm.reset(); // 套票欄位清空
        })
        .catch(function (error) {
          console.log(error.message);
          console.error("無法送出預訂資料：", error);
          alert("無法送出預訂資料，請稍後再試！");
        });
    } else {
      return;
    }
  });
});

window.addCart = addCart; // 將函數掛載到全域作用域
window.deleCart = deleCart;
window.deleAllCart = deleAllCart;

//模組化的渲染函數 for getProducts 來取代 組字串html
function generateProductHTML(item) {
  // 確保數據完整性，避免空值出錯
  const {
    images = "",
    title = "無標題",
    id = "",
    origin_price = 0,
    price = 0,
  } = item;

  return `
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="${item.title}" />
      <a href="#shoppingCart" class="addCardBtn" data-id="${item.id}">加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
    </li>`;
}

function renderProducts(products, container) {
  // 確保容器存在並清空容器內容
  if (!container) return;
  container.innerHTML = products.map(generateProductHTML).join("");
}

function getProducts() {
  const api_function = "products";
  const selectValue = document.querySelector(".productSelect").value;
  //let products = [];

  axios
    .get(`${api_Url}/${api_Token}/${api_function}`)
    .then(function (res) {
      const products = res.data.products || []; // 確保 products 不為 null 或 undefined

      // 篩選產品（如果有篩選條件）
      const filteredProducts =
        selectValue === "全部"
          ? products
          : products.filter((item) => item.category === selectValue);

      // 渲染產品到容器
      renderProducts(filteredProducts, productWrap);
    })
    .catch(function (error) {
      console.error("獲取商品資料失敗：", error);
      alert("無法載入商品資料，請稍後再試！");
    });
}

//模組化的渲染函數 for getCarts 來取代 組字串html
function generateCartRow(item) {
  const { product, quantity, id } = item;
  const { images = "", price = 0 } = product;

  return `
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${images}" alt="" />
          <p>${product.title || "無標題"}</p>
        </div>
      </td>
      <td>NT$${price.toLocaleString()}</td>
      <td>${quantity}</td>
      <td>NT$${(price * quantity).toLocaleString()}</td>
      <td class="discardBtn">
        <a href="#" class="deleCart" data-id="${id}">clear</a>
      </td>
    </tr>`;
}

function renderCart(carts, container) {
  if (!container) return;

  let totalCost = 0;

  // 生成購物車項目 HTML
  const rows = carts
    .map((item) => {
      totalCost += item.product.price * item.quantity;
      return generateCartRow(item);
    })
    .join("");

  // 添加總金額行
  const totalRow = `
    <tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td><p>總金額</p></td>
      <td>NT$${totalCost.toLocaleString()}</td>
    </tr>`;

  // 渲染到容器
  container.innerHTML = `
    <tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>
    ${rows}
    ${totalRow}`;
}

function getCarts() {
  const api_function = "carts";
  axios
    .get(`${api_Url}/${api_Token}/${api_function}`)
    .then((res) => {
      const carts = res.data.carts || []; // 確保 carts 不為 null 或 undefined
      cartData = carts; //裝入全域的 cartData 後面可以用來比對是否第一筆加入購物車
      renderCart(carts, cartTable);

      // 顯示或隱藏購物車和訂單信息
      const isCartEmpty = carts.length === 0;
      shoppingCart.style.display = isCartEmpty ? "none" : "block";
      orderInfo.style.display = isCartEmpty ? "none" : "block";
    })
    .catch((error) => {
      console.error("獲取購物車資料失敗：", error);
      alert("無法載入購物車資料，請稍後再試！");
    });
}

function addCart(productId) {
  const api_function = "carts";
  // 先比對現有的訂單內產品，有就patch、無就post
  let comparison = false;
  let selectProduct = {};
  cartData.forEach((item) => {
    if (item.product.id == productId) {
      selectProduct.cart_id = item.id;
      selectProduct.product_id = item.product.id;
      selectProduct.quantity = item.quantity;
      comparison = true;
    }
  });

  if (comparison) {
    axios
      .patch(`${api_Url}/${api_Token}/${api_function}`, {
        data: {
          id: selectProduct.cart_id,
          quantity: selectProduct.quantity + 1,
        },
      })
      .then(function (res) {
        getCarts();
      })
      .catch(function (error) {
        console.error("無法加入購物車資料：", error);
        alert("無法加入購物車，請稍後再試！");
      });
  } else {
    axios
      .post(`${api_Url}/${api_Token}/${api_function}`, {
        data: {
          productId: productId,
          quantity: 1,
        },
      })
      .then(function (res) {
        getCarts();
      })
      .catch(function (error) {
        console.error("無法加入購物車資料：", error);
        alert("無法加入購物車，請稍後再試！");
      });
  }
}

function deleCart(cartId) {
  const api_function = "carts";
  axios
    .delete(`${api_Url}/${api_Token}/${api_function}/${cartId}`)
    .then(function (res) {
      getProducts();
      getCarts();
    })
    .catch(function (error) {
      console.error("無法刪除購物車資料：", error);
      alert("無法刪除購物車資料，請稍後再試！");
    });
}

function deleAllCart() {
  const api_function = "carts";
  axios
    .delete(`${api_Url}/${api_Token}/${api_function}`)
    .then(function (res) {
      getProducts();
      getCarts();
    })
    .catch(function (error) {
      console.error("無法刪除購物車資料：", error);
      alert("無法刪除購物車資料，請稍後再試！");
    });
}

function checkOrderData(formInput) {
  let pass = []; //宣告空陣列
  formInput.forEach((item) => {
    if (item.value.trim() === "") {
      item.nextElementSibling.style.display = "flex";
    } else {
      item.nextElementSibling.style.display = "none";
      pass.push("OK");
    }
  });

  if (pass.length === 5) {
    //若pass 中有4個必田欄位的 ok則return true
    return true;
  } else {
    return false;
  }
}
