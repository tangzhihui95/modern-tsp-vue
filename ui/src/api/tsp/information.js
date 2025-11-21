import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/information/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/information/add",
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return request({
    url: "tsp/information/edit",
    method: "put",
    data: query,
  });
}

export function offline(id) {
  return request({
    url: `tsp/information/unload/${id}`,
    method: "patch"
  });
}

export function get(id) {
  return request({
    url: `tsp/information/get/${id}`,
    method: "get",
  });
}
