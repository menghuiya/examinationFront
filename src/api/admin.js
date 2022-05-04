import request from "@/util/request";

// const env = process.env.NODE_ENV !== "production" ? "-dev" : "";

/**
 * 获取分类列表
 * @param {*} params
 * @returns
 */
export function getCateList(params) {
  return request({
    url: `/api/category`,
    method: "get",
    params,
  });
}
/**
 * 新增分类
 * @param {*} params
 * @returns
 */
export function postCate(data) {
  return request({
    url: `/api/category`,
    method: "post",
    data,
  });
}
/**
 * 更新分类
 * @param {*} params
 * @returns
 */
export function updateCate(id, cateData) {
  return request({
    url: `/api/category`,
    method: "put",
    data: {
      id,
      cateData,
    },
  });
}
/**
 * 删除分类
 * @param {*} params
 * @returns
 */
export function deleteCate(id) {
  return request({
    url: `/api/category`,
    method: "delete",
    data: {
      id,
    },
  });
}
