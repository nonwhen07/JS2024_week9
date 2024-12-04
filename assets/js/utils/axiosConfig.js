import axios from "axios";

// 全局配置 Axios（可選）
axios.defaults.baseURL = import.meta.env.VITE_API_URL; // 從環境變數中讀取 API URL
axios.defaults.headers.common["Authorization"] = `Bearer ${
  (import.meta.env.VITE_API_URL, import.meta.env.VITE_API_TOKEN)
}`; // 設定 API Token
axios.defaults.headers.post["Content-Type"] = "application/json";

// 讓其他模組可以直接使用配置好的 axios
export default axios;

// 初始化應用（假設你有其他初始化邏輯）
// console.log("Main.js 初始化完成");
