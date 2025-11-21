import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/alert/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleAlert(query){
  return request({
      url: '/tsp/vehicle/alert/export',
      method: 'post',
      data: query,
  })
}