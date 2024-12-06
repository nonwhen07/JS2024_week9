// // 模擬三種模式的連結
// const links = {
//   front: [
//     { href: "#bedAdvantage", text: "床墊優勢" },
//     { href: "#recommendation", text: "好評推薦" },
//     { href: "#transport", text: "運送方式" },
//     { href: "#orderInfo", text: "立即預訂" },
//   ],
//   admin: [
//     { href: "#", text: "後台管理" },
//     { href: "#", text: "管理員登入" },
//   ],
//   member: [
//     { href: "#profile", text: "會員資料" },
//     { href: "#orders", text: "我的訂單" },
//     { href: "#logout", text: "登出" },
//   ],
// };

//header部分
// goTop;
const goTop = document.getElementById("goTopBtn");

// menu 切換
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
