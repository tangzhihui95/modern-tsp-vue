import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/dealer/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/dealer/add",
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return request({
    url: "tsp/dealer/edit",
    method: "put",
    data: query,
  });
}

export function remove(id) {
  return request({
    url: `tsp/dealer/delete/${id}`,
    method: "delete",
  });
}

export function deletes(dealerIds) {
  return request({
    url: `tsp/dealer/deletes/${dealerIds}`,
    method: "delete",
  });
}

export function get(id) {
  return request({
    url: `tsp/dealer/get/${id}`,
    method: "get",
  });
}
