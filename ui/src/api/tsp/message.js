import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/message/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/message/add",
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return request({
    url: "tsp/message/edit",
    method: "put",
    data: query,
  });
}

export function state(id) {
  return request({
    url: `tsp/message/state/${id}`,
    method: "patch"
  });
}

export function get(id) {
  return request({
    url: `tsp/message/get/${id}`,
    method: "get",
  });
}
