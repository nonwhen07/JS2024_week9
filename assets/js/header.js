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
