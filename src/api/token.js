import request from "@/utils/request";
function getTokenInfo(token) {
  return request({
    url: "/token/info",
    method: "get",
    params: { token },
  });
}
function getHolders(config) {
  return request({
    url: "/token/holders",
    method: "get",
    params: { config },
  });
}
function getBill(config) {
  return request({
    url: "/token/bill",
    method: "get",
    params: { config },
  });
}
export default {
  getTokenInfo,
  getHolders,
  getBill,
};
