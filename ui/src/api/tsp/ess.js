import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/ess/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleEss(query){
  return request({
      url: '/tsp/vehicle/ess/export',
      method: 'post',
      data: query,
  })
}