import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/extreme/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleExtreme(query){
  return request({
      url: '/tsp/vehicle/extreme/export',
      method: 'post',
      data: query,
  })
}