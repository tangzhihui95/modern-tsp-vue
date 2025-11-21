import request from "@/utils/request";

export function list() {
  return request({
    url: "tsp/model/list",
    method: "post",
  });
}

export function listModel(query) {
  return request({
    url: "tsp/model/listModel",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/model/add",
    method: "post",
    data: query,
  });
}

export function update(query) {
  return request({
    url: "tsp/model/edit",
    method: "put",
    data: query,
  });
}

export function remove(id) {
  return request({
    url: `tsp/model/delete/${id}`,
    method: "get",
  });
}

export function get(id) {
  return request({
    url: `tsp/model/get/${id}`,
    method: "get",
  });
}
