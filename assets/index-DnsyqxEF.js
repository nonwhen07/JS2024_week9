import{a as c}from"./axiosConfig-C-8zFsPD.js";document.addEventListener("DOMContentLoaded",function(){const n=document.querySelector(".recommendation-wall");n.style.cursor="grab";let t={top:0,left:0,x:0,y:0};const e=function(r){n.style.cursor="grabbing",n.style.userSelect="none",t={left:n.scrollLeft,top:n.scrollTop,x:r.clientX,y:r.clientY},document.addEventListener("mousemove",o),document.addEventListener("mouseup",a)},o=function(r){const q=r.clientX-t.x,w=r.clientY-t.y;n.scrollTop=t.top-w,n.scrollLeft=t.left-q},a=function(){n.style.cursor="grab",n.style.removeProperty("user-select"),document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",a)};n.addEventListener("mousedown",e)});const s="https://livejs-api.hexschool.io/api/livejs/v1/customer",d="goushs2024",m=document.querySelector(".shoppingCart-table"),$=document.querySelector(".productWrap"),h=document.querySelector(".productSelect"),C=document.querySelector(".shoppingCart"),_=document.querySelector(".orderInfo"),y=document.querySelector(".orderInfo-form"),l=document.querySelectorAll(".orderInfo-input");let p=[];function E(){u()}document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("goTopBtn");window.addEventListener("scroll",()=>{window.scrollY>200?n.style.display="block":n.style.display="none"}),n.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}),u(),i(),h&&h.addEventListener("change",E),$.addEventListener("click",t=>{if(t.target.classList.contains("addCardBtn")){t.preventDefault();const e=t.target.dataset.id;g(e)}}),m.addEventListener("click",t=>{if(t.preventDefault(),t.target.classList.contains("material-icons")){const e=t.target.closest(".updateQty");if(e){e.classList.add("disabled");const o=e.dataset.id,a=e.dataset.qty;v(o,a),e.classList.remove("disabled")}}if(t.target.classList.contains("deleCart")){const e=t.target.closest(".deleCart");e.classList.add("disabled");const o=t.target.dataset.id;f(o),e.classList.remove("disabled")}if(t.target.classList.contains("discardAllBtn")){const e=t.target.closest(".discardAllBtn");e.classList.add("disabled"),L(),e.classList.remove("disabled")}}),y.addEventListener("submit",t=>{t.preventDefault();const e="orders";if(k(l)){let a={};a.name=l[0].value,a.tel=l[1].value,a.email=l[2].value,a.address=l[3].value,a.payment=l[4].value,c.post(`${s}/${d}/${e}`,{data:{user:{name:a.name,tel:a.tel,email:a.email,address:a.address,payment:a.payment}}}).then(function(r){u(),i(),y.reset()}).catch(function(r){console.error("無法送出預訂資料：",r),alert("無法送出預訂資料，請稍後再試！")})}else return})});window.addCart=g;window.updateCart=v;window.deleCart=f;window.deleAllCart=L;function b(n){return`
    <li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${n.images}" alt="${n.title}" />
      <a href="#shoppingCart" class="addCardBtn" data-id="${n.id}">加入購物車</a>
      <h3>${n.title}</h3>
      <del class="originPrice">NT$${n.origin_price}</del>
      <p class="nowPrice">NT$${n.price}</p>
    </li>`}function S(n,t){t&&(t.innerHTML=n.map(b).join(""))}function u(){const n="products",t=document.querySelector(".productSelect").value;c.get(`${s}/${d}/${n}`).then(function(e){const o=e.data.products||[],a=t==="全部"?o:o.filter(r=>r.category===t);S(a,$)}).catch(function(e){console.error("獲取商品資料失敗：",e),alert("無法載入商品資料，請稍後再試！")})}function T(n){const{product:t,quantity:e,id:o}=n,{images:a="",price:r=0}=t;return`
    <tr>
      <td>
        <div class="cardItem-title">
          <img src="${a}" alt="" />
          <p>${t.title||"無標題"}</p>
        </div>
      </td>
      <td>NT$${r.toLocaleString()}</td>
      <td>${e}</td>

      <td class="updateBtn">
        <a href="#" class="updateQty" data-id="${o}" data-qty="1">
          <i class="material-icons">add_circle_outline</i>
        </a>
        <a href="#" class="updateQty" data-id="${o}" data-qty="-1">
          <i class="material-icons">remove_circle_outline</i>
        </a>
      </td>

      <td>NT$${(r*e).toLocaleString()}</td>
      <td class="discardBtn">
        <a href="#" class="deleCart" data-id="${o}">clear</a>
      </td>
    </tr>`}function P(n,t){if(!t)return;let e=0;const o=n.map(r=>(e+=r.product.price*r.quantity,T(r))).join(""),a=`
    <tr>
      <td>
        <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td></td>
      <td><p>總金額</p></td>
      <td>NT$${e.toLocaleString()}</td>
    </tr>`;t.innerHTML=`
    <tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="5%">數量</th>
      <th width="10%"></th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>
    ${o}
    ${a}`}function i(){c.get(`${s}/${d}/carts`).then(t=>{const e=t.data.carts||[];p=e,P(e,m);const o=e.length===0;C.style.display=o?"none":"block",_.style.display=o?"none":"block"}).catch(t=>{console.error("獲取購物車資料失敗：",t),alert("無法載入購物車資料，請稍後再試！")})}function g(n){const t="carts";let e=!1,o={};p.forEach(a=>{a.product.id==n&&(o.cart_id=a.id,o.product_id=a.product.id,o.quantity=a.quantity,e=!0)}),e?c.patch(`${s}/${d}/${t}`,{data:{id:o.cart_id,quantity:o.quantity+1}}).then(function(a){i()}).catch(function(a){console.error("無法加入購物車資料：",a),alert("無法加入購物車，請稍後再試！")}):c.post(`${s}/${d}/${t}`,{data:{productId:n,quantity:1}}).then(function(a){i()}).catch(function(a){console.error("無法加入購物車資料：",a),alert("無法加入購物車，請稍後再試！")})}function v(n,t){const e="carts";let o=!1,a={};p.forEach(r=>{r.id==n&&(a.cart_id=r.id,a.product_id=r.product.id,a.quantity=r.quantity,t==1?a.quantity++:a.quantity--,o=!0)}),o?a.quantity>0?c.patch(`${s}/${d}/${e}`,{data:{id:a.cart_id,quantity:a.quantity}}).then(function(r){i()}).catch(function(r){console.error("無法加入購物車資料：",r),alert("無法加入購物車，請稍後再試！")}):f(n):c.post(`${s}/${d}/${e}`,{data:{productId:n,quantity:1}}).then(function(r){i()}).catch(function(r){console.error("無法調整購物車資料：",r),alert("無法調整購物車資料，請稍後再試！")})}function f(n){c.delete(`${s}/${d}/carts/${n}`).then(function(e){u(),i()}).catch(function(e){console.error("無法刪除購物車資料：",e),alert("無法刪除購物車資料，請稍後再試！")})}function L(){c.delete(`${s}/${d}/carts`).then(function(t){u(),i()}).catch(function(t){console.error("無法刪除購物車資料：",t),alert("無法刪除購物車資料，請稍後再試！")})}function k(n){let t=[];return n.forEach(e=>{e.value.trim()===""?e.nextElementSibling.style.display="flex":(e.nextElementSibling.style.display="none",t.push("OK"))}),t.length===5}
