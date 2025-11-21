import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/tsp/vehicle/alertEvent/list",
    method: "post",
    data: query,
  });
}

export function remove(tspAlertEventId) {
  return request({
    url: `/tsp/vehicle/alertEvent/remove/${tspAlertEventId}`,
    method: "delete",
  });
}

export function add(data) {
  return request({
    url: "/tsp/vehicle/alertEvent/add/",
    method: "post",
    data: data,
  });
}

export function edit(data) {
  return request({
    url: "/tsp/vehicle/alertEvent/edit/",
    method: "put",
    data: data,
  });
}

export function get(tspAlertEventId) {
  return request({
    url: `/tsp/vehicle/alertEvent/get/${tspAlertEventId}`,
    method: "get",
  });
}

export function setState(tspAlertEventId){
  return request({
    url: `/tsp/vehicle/alertEvent/setState/${tspAlertEventId}`,
    method: "patch",
  });
}
