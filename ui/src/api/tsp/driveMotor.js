import request from "@/utils/request";

export function list(query) {
  return request({
    url: "tsp/vehicle/driveMotor/list",
    method: "post",
    data: query,
  });
}

export function exportVehicleDriveMotor(query){
  return request({
      url: '/tsp/vehicle/driveMotor/export',
      method: 'post',
      data: query,
  })
}