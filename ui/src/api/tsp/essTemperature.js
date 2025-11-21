import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/essTemperature/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleEssTemperature(query){
  return request({
      url: '/tsp/vehicle/essTemperature/export',
      method: 'post',
      data: query,
  })
}