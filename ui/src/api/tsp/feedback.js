import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/feedback/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/feedback/add",
    method: "post",
    data: query,
  });
}

export function deal(query) {
  return request({
    url: "tsp/feedback/deal",
    method: "put",
    data: query,
  });
}

export function down(id) {
  return request({
    url: `tsp/feedback/delete/${id}`,
    method: "delete",
  });
}

export function get(id) {
  return request({
    url: `tsp/feedback/get/${id}`,
    method: "get",
  });
}
