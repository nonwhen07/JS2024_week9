import{a as i}from"./axiosConfig-DW15gdN6.js";const c="https://livejs-api.hexschool.io/api/livejs/v1/admin",l="goushs2024",L="i0T3K2YLg6PFBZsuu4BkvMVJXQH3",u={headers:{Authorization:L}},O=document.querySelector(".orderWrap"),y=document.querySelector(".deleAllOrderBtn");let h=[],$=[];document.addEventListener("DOMContentLoaded",D);window.putOrder=A;window.deleOrder=g;window.deleAllOrders=v;function D(){f(),b(),B()}function b(){O.addEventListener("click",t=>{t.preventDefault();const e=t.target.dataset.id;if(t.target.classList.contains("putOrder")){const r=t.target.textContent==="已處理";A(e,!r)}t.target.classList.contains("deleOrderBtn")&&g(e)})}function B(){y.addEventListener("click",t=>{t.preventDefault(),v()})}function F(t){let e="";return t.products.forEach((r,n)=>{e+=`${r.title} * ${r.quantity}`,n!==t.products.length-1&&(e+="<br/>")}),`
    <tr>
      <td> ${t.id} </td>
      <td> ${t.user.name} </td>
      <td> ${t.user.address} </td>
      <td> ${t.user.email} </td>
      <td> ${e} </td>
      <td> ${new Date(t.createdAt*1e3).toISOString().split("T")[0]} </td>
      <td>
        ${t.paid?`<a href="#" class="putOrder" data-id="${t.id}">已處理</a>`:`<a href="#" class="putOrder" data-id="${t.id}">未處理</a>`}
      </td>
      <td class="deleBtn">
        <a href="#" class="deleOrderBtn" data-id="${t.id}">刪除</a>
      </td>
    </tr>
    `}function T(t,e){e&&(e.innerHTML=t.map(F).join(""))}function f(){i.get(`${c}/${l}/orders`,u).then(function(e){const r=e.data.orders||[],n=r;T(n,O),w(n)}).catch(function(e){console.error("無法取得訂單資料：",e),alert("無法取得訂單資料，請稍後再試！")})}function g(t){confirm("您確定要刪除此訂單嗎？")&&i.delete(`${c}/${l}/orders/${t}`,u).then(function(e){f()}).catch(function(e){console.error("無法刪除訂單資料：",e),alert("無法刪除訂單資料，請稍後再試！")})}function v(){confirm("您確定要刪除全部訂單嗎？")&&i.delete(`${c}/${l}/orders`,u).then(function(t){f()}).catch(function(t){console.error("無法刪除所有訂單：",t),alert("無法刪除所有訂單，請稍後再試！")})}function A(t,e){i.put(`${c}/${l}/orders`,{data:{id:t,paid:e}},u).then(function(r){f()}).catch(function(r){console.error("無法修改訂單狀態：",r),alert("無法修改訂單狀態，請稍後再試！")})}function w(t){let e=[],r=[];t.forEach(n=>{n.products.forEach(d=>{for(let s=0;s<d.quantity;s++)e.push(d.title),r.push(d.category)})}),C(e,r),S(),_()}function C(t,e){let r={};$=[],t.forEach(o=>{r[o]==null?r[o]=1:r[o]+=1});let n=[];for(var d in r)n.push([d,r[d]]);n.sort((o,p)=>p[1]-o[1]);let s=n.slice(0,3),E=n.slice(3).reduce((o,p)=>o+p[1],0);$=[...s,["其他",E]];let a={};h=[],e.forEach(o=>{a[o]==null?a[o]=1:a[o]+=1});for(var d in a)h.push([d,a[d]])}function S(){bb.generate({bindto:"#chart",data:{type:"pie",columns:$.sort()},color:{pattern:["#301E5F","#9D7FEA","#5434A7","#DACBFF"]}})}function _(){bb.generate({bindto:"#chartType",data:{type:"pie",columns:h.sort()},color:{pattern:["#301E5F","#9D7FEA","#5434A7","#DACBFF"]}})}
