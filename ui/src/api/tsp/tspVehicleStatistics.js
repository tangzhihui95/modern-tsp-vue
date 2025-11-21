import request from '@/utils/request'

export function getAllVehicleDailyStatistics(params){
  return request({
    url: "tsp/statistics/daily/all-vehicle/list",
    method: "get",
    params: params,
  });
}

export function getVehicleDailyStatistics(params){
  return request({
    url: "tsp/statistics/daily/vehicle/list",
    method: "get",
    params: params,
  });
}