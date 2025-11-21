import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/integrate/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleIntegrate(query){
  return request({
      url: '/tsp/vehicle/integrate/export',
      method: 'post',
      data: query,
  })
}