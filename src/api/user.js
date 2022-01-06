import request from "@/utils/request";

export function getUserTags() {
  return request({
    url: "/user/tags",
    method: "post",
  });
}

export function addUserTag(data) {
  return request({
    url: "/user/addtag",
    method: "post",
    data,
  });
}

export function deleteUserTag(data) {
  return request({
    url: "/user/deltag",
    method: "post",
    data,
  });
}

export function getUserHeadImg(data) {
  return request({
    url: "/user/info",
    method: "post",
    data,
  });
}

export function addUserAddress(data) {
  return request({
    url: "user/addaddr",
    method: "post",
    data,
  });
}

export function deleteUserAddress(data) {
  return request({
    url: "user/deladdr",
    method: "post",
    data,
  });
}

export function getUserList() {
  return request({
    url: "user/list",
    method: "post",
  });
}
export function getUserBalances(data) {
  return request({
    url: "user/balance",
    method: "post",
    data,
  });
}
