import request from "@/util/request";

// const env = process.env.NODE_ENV !== "production" ? "-dev" : "";

/**
 * 获取试题列表
 * @param {*} params
 * @returns
 */
export function getExamList(params) {
  return request({
    url: `/api/exams`,
    method: "get",
    params,
  });
}

/**
 * 获取试题内容
 * @param {*} id
 * @returns
 */
export function getExamById(id) {
  return request({
    url: `/api/examdata`,
    method: "get",
    params: {
      id,
    },
  });
}

/**
 * 新增试题
 * @param {*} data
 * @returns
 */
export function addExam(data) {
  return request({
    url: `/api/exam`,
    method: "post",
    data,
  });
}

/**
 * 修改试题
 * @param {*} data
 * @returns
 */
export function updateExam(data) {
  return request({
    url: `/api/exam`,
    method: "put",
    data,
  });
}

/**
 * 删除试题
 * @param {*} id
 * @returns
 */
export function deleteExam(id) {
  return request({
    url: `/api/exam`,
    method: "delete",
    data: {
      id,
    },
  });
}

/**
 * 获取分类列表
 * @param {*} params
 * @returns
 */
export function getBaseCateList() {
  return request({
    url: `/api/examcate`,
    method: "get",
  });
}
