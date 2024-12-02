import './assets/scss/all.scss';
import axios from 'axios';

// 可選：設置全局基礎路徑
axios.defaults.baseURL = 'https://api.example.com';

// 可選：設置全局請求頭
axios.defaults.headers.common['Authorization'] = 'Bearer YOUR_TOKEN';

// 測試請求
axios.get('/test-endpoint')
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.log('Error:', error);
  });

console.log('Axios 已加載');
console.log("Hello world!");
