import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// 可选：引入测试组件
// import TestData from './components/TestData';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* 可选：同时展示测试组件 */}
    {/* <TestData /> */}
  </React.StrictMode>
);