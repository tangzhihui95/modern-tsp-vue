import request from "@/utils/request";

export function getVehicleBasicAttributes(vin){
  return request({
      url: `/tsp/vehicle/data/basicAttributes/${vin}`,
      method: 'get',
  })
}

export function getVehicleLatestData(vin){
    return request({
        url: `/tsp/vehicle/data/latestData/${vin}`,
        method: 'get',
    })
}

export function getUserVehiclesLatestData(){
  return request({
      url: `/tsp/vehicle/data/userVehicles/latestData`,
      method: 'get',
  })
}