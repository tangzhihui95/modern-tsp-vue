import request from "@/utils/request";

export function list(query) {
  return request({
    url: "/tsp/vehicle/historyAlert/list",
    method: "post",
    data: query,
  });
}

export function historyAlertExport(query) {
  return request({
    url: "/tsp/vehicle/historyAlert/export",
    method: "post",
    data: query
  });
}

export function get(tspVehicleAlertId) {
  return request({
    url: `/tsp/vehicle/historyAlert/get/${tspVehicleAlertId}`,
    method: "get",
  });
}

export function handleState(data) {
  return request({
    url: '/tsp/vehicle/historyAlert/handleState',
    method: "put",
    data: data,
  });
}

export function historyList(query) {
  return request({
    url: '/tsp/vehicle/alert/historyList',
    method: "post",
    data: query,
  });
}

export function getAlert(vehicleAlertId) {
  return request({
    url: `/tsp/vehicle/alert/get/${vehicleAlertId}`,
    method: "get",
  });
}

export function deal(data) {
  return request({
    url: `/tsp/vehicle/alert/deal`,
    method: "post",
    data:data
  });
}
