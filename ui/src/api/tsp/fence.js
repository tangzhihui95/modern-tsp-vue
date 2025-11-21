import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/fence/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/fence/add",
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return request({
    url: "tsp/fence/edit",
    method: "put",
    data: query,
  });
}

export function down(id) {
  return request({
    url: `tsp/fence/delete/${id}`,
    method: "get",
  });
}

export function get(id) {
  return request({
    url: `tsp/fence/get/${id}`,
    method: "get",
  });
}
