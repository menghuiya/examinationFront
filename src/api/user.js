import request from "@/util/request";

// const env = process.env.NODE_ENV !== "production" ? "-dev" : "";

/**
 * 获取用户列表
 * @param {*} params
 * @returns
 */
export function getUserList(params) {
  return request({
    url: `/api/users`,
    method: "get",
    params,
  });
}
/**
 * 新增用户
 * @param {*} params
 * @returns
 */
export function postUser(data) {
  return request({
    url: `/api/register`,
    method: "post",
    data,
  });
}
/**
 * 更新用户
 * @param {*} params
 * @returns
 */
export function updateUser(id, userData) {
  return request({
    url: `/api/user`,
    method: "put",
    data: {
      id,
      userData,
    },
  });
}
/**
 * 删除用户
 * @param {*} params
 * @returns
 */
export function deleteUser(id) {
  return request({
    url: `/api/user`,
    method: "delete",
    data: {
      id,
    },
  });
}

/**
 * 用户登录
 * @param {*} params
 * @returns
 */
export function postLogin(data) {
  return request({
    url: `/api/login`,
    method: "post",
    data,
  });
}

/**
 * 用户退出
 * @param {*} params
 * @returns
 */
export function postLogout() {
  return request({
    url: `/api/logout`,
    method: "post",
  });
}
