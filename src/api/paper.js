import request from "@/util/request";

// const env = process.env.NODE_ENV !== "production" ? "-dev" : "";

/**
 * 获取试卷列表
 * @param {*} params
 * @returns
 */
export function getPaperList(params) {
  return request({
    url: `/api/papers`,
    method: "get",
    params,
  });
}

/**
 * 获取试卷内容
 * @param {*} id
 * @returns
 */
export function getPaperById(id) {
  return request({
    url: `/api/paperexam`,
    method: "get",
    params: {
      id,
    },
  });
}

/**
 * 获取试卷内容-考完查看的
 * @param {*} id
 * @returns
 */
export function getCheckPaperById(id) {
  return request({
    url: `/api/checkpaper`,
    method: "get",
    params: {
      id,
    },
  });
}

/**
 * 更新试卷状态
 * @param {*} id
 * @returns
 */
export function updatePaper(id) {
  return request({
    url: `/api/updatepaper`,
    method: "post",
    data: {
      id: id,
    },
  });
}

/**
 * 提交试卷
 * @param {*} id
 * @returns
 */
export function postPaperById(id, data) {
  return request({
    url: `/api/paperexam`,
    method: "post",
    data: {
      id,
      paperData: data,
    },
  });
}

/**
 * 新增试卷
 * @param {*} data
 * @returns
 */
export function addPaper(data) {
  return request({
    url: `/api/paper`,
    method: "post",
    data,
  });
}

/**
 * 删除试卷
 * @param {*} id
 * @returns
 */
export function deletePaper(id) {
  return request({
    url: `/api/paper`,
    method: "delete",
    data: {
      id,
    },
  });
}

/**
 * 获取试卷列表
 * @param {*} params
 * @returns
 */
export function getRank(type) {
  return request({
    url: `/api/rank`,
    method: "get",
    params: {
      type,
    },
  });
}
