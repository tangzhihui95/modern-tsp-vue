import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/tag/list",
    method: "post",
    data: query,
  });
}

export function add(query) {
  return request({
    url: "tsp/tag/add",
    method: "post",
    data: query,
  });
}

export function edit(query) {
  return request({
    url: "tsp/tag/edit",
    method: "put",
    data: query,
  });
}

export function remove(id) {
  return request({
    url: `tsp/tag/delete/${id}`,
    method: "get",
  });
}

export function get(id) {
  return request({
    url: `tsp/tag/get/${id}`,
    method: "get",
  });
}

export function getLabel(tagType) {
  return request({
    url: `tsp/tag/getLabel/${tagType}`,
    method: "get",
  });
}
