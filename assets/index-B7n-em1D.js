import{a}from"./axiosConfig-CVz2lRb3.js";document.addEventListener("DOMContentLoaded",function(){const e=document.querySelector(".recommendation-wall");e.style.cursor="grab";let t={top:0,left:0,x:0,y:0};const n=function(c){e.style.cursor="grabbing",e.style.userSelect="none",t={left:e.scrollLeft,top:e.scrollTop,x:c.clientX,y:c.clientY},document.addEventListener("mousemove",r),document.addEventListener("mouseup",o)},r=function(c){const L=c.clientX-t.x,w=c.clientY-t.y;e.scrollTop=t.top-w,e.scrollLeft=t.left-L},o=function(){e.style.cursor="grab",e.style.removeProperty("user-select"),document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",o)};e.addEventListener("mousedown",n)});const s="https://livejs-api.hexschool.io/api/livejs/v1/customer",d="goushs2024",h=document.querySelector(".shoppingCart-table"),m=document.querySelector(".productWrap"),p=document.querySelector(".productSelect"),C=document.querySelector(".shoppingCart"),E=document.querySelector(".orderInfo"),f=document.querySelector(".orderInfo-form"),l=document.querySelectorAll(".orderInfo-input");let y=[];function S(){u()}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("goTopBtn");window.addEventListener("scroll",()=>{window.scrollY>200?e.style.display="block":e.style.display="none"}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),u(),i(),p&&p.addEventListener("change",S),m.addEventListener("click",t=>{if(t.target.classList.contains("addCardBtn")){t.preventDefault();const n=t.target.dataset.id;$(n)}}),h.addEventListener("click",t=>{if(t.preventDefault(),t.target.classList.contains("deleCart")){const n=t.target.dataset.id;g(n)}t.target.classList.contains("discardAllBtn")&&v()}),f.addEventListener("submit",t=>{t.preventDefault();const n="orders";if(k(l)){let o={};o.name=l[0].value,o.tel=l[1].value,o.email=l[2].value,o.address=l[3].value,o.payment=l[4].value,a.post(`${s}/${d}/${n}`,{data:{user:{name:o.name,tel:o.tel,email:o.email,address:o.address,payment:o.payment}}}).then(function(c){u(),i(),f.reset()}).catch(function(c){console.log(c.message),console.error("無法送出預訂資料：",c),alert("無法送出預訂資料，請稍後再試！")})}else return})});window.addCart=$;window.deleCart=g;window.deleAllCart=v;function q(e){return`
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${e.images}" alt="${e.title}" />
      <a href="#shoppingCart" class="addCardBtn" data-id="${e.id}">加入購物車</a>
      <h3>${e.title}</h3>
      <del class="originPrice">NT$${e.origin_price}</del>
      <p class="nowPrice">NT$${e.price}</p>
    </li>`}function T(e,t){t&&(t.innerHTML=e.map(q).join(""))}function u(){const e="products",t=document.querySelector(".productSelect").value;a.get(`${s}/${d}/${e}`).then(function(n){const r=n.data.products||[],o=t==="全部"?r:r.filter(c=>c.category===t);T(o,m)}).catch(function(n){console.error("獲取商品資料失敗：",n),alert("無法載入商品資料，請稍後再試！")})}function _(e){const{product:t,quantity:n,id:r}=e,{images:o="",price:c=0}=t;return`
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${o}" alt="" />
          <p>${t.title||"無標題"}</p>
        </div>
      </td>
      <td>NT$${c.toLocaleString()}</td>
      <td>${n}</td>
      <td>NT$${(c*n).toLocaleString()}</td>
      <td class="discardBtn">
        <a href="#" class="deleCart" data-id="${r}">clear</a>
      </td>
    </tr>`}function b(e,t){if(!t)return;let n=0;const r=e.map(c=>(n+=c.product.price*c.quantity,_(c))).join(""),o=`
    <tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td><p>總金額</p></td>
      <td>NT$${n.toLocaleString()}</td>
    </tr>`;t.innerHTML=`
    <tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>
    ${r}
    ${o}`}function i(){a.get(`${s}/${d}/carts`).then(t=>{const n=t.data.carts||[];y=n,b(n,h);const r=n.length===0;C.style.display=r?"none":"block",E.style.display=r?"none":"block"}).catch(t=>{console.error("獲取購物車資料失敗：",t),alert("無法載入購物車資料，請稍後再試！")})}function $(e){const t="carts";let n=!1,r={};y.forEach(o=>{o.product.id==e&&(r.cart_id=o.id,r.product_id=o.product.id,r.quantity=o.quantity,n=!0)}),n?a.patch(`${s}/${d}/${t}`,{data:{id:r.cart_id,quantity:r.quantity+1}}).then(function(o){i()}).catch(function(o){console.error("無法加入購物車資料：",o),alert("無法加入購物車，請稍後再試！")}):a.post(`${s}/${d}/${t}`,{data:{productId:e,quantity:1}}).then(function(o){i()}).catch(function(o){console.error("無法加入購物車資料：",o),alert("無法加入購物車，請稍後再試！")})}function g(e){a.delete(`${s}/${d}/carts/${e}`).then(function(n){u(),i()}).catch(function(n){console.error("無法刪除購物車資料：",n),alert("無法刪除購物車資料，請稍後再試！")})}function v(){a.delete(`${s}/${d}/carts`).then(function(t){u(),i()}).catch(function(t){console.error("無法刪除購物車資料：",t),alert("無法刪除購物車資料，請稍後再試！")})}function k(e){let t=[];return e.forEach(n=>{n.value.trim()===""?n.nextElementSibling.style.display="flex":(n.nextElementSibling.style.display="none",t.push("OK"))}),t.length===5}
