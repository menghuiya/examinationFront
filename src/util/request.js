// http.ts
import axios from "axios";
import store from "@/store";
const service = axios.create({
  // 联调
  // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
  // baseURL: "http://81.71.123.189:3000",
  headers: {
    get: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    post: {
      "Content-Type": "application/json;charset=utf-8",
    },
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  // transformRequest: [
  //   (data) => {
  //     data = JSON.stringify(data);
  //     return data;
  //   },
  // ],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  transformResponse: [
    (data) => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    },
  ],
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    //获取token，并将其添加至请求头中
    //   let token = localStorage.getItem('token')
    //   if(token){
    //     config.headers.Authorization = `${token}`;
    //   }
    return config;
  },
  (error) => {
    // 错误抛到业务代码
    error.data = {};
    error.data.msg = "服务器异常，请联系管理员！";
    return Promise.resolve(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const status = response.status;
    if (status < 200 || status >= 300) {
      if (status === 401) {
        store.commit("deleteUser");
      }
      // 处理http错误，抛到业务代码
      return Promise.reject(response.data);
    } else {
      return response.data;
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("repeated request: " + error.message);
    } else {
      // handle error code
      // 错误抛到业务代码
      error.data = {};
      error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
    }
    return Promise.reject(error);
  }
);

export default service;
