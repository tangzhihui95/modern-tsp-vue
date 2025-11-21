import request from '@/utils/request'

export function volumeData(params) {
  return request({
    url: "tsp/vehicleData/volumeData",
    method: "post",
    data: params,
  });
}
export function volumeChartData(params) {
  return request({
    url: "tsp/vehicleData/volumeChartData",
    method: "post",
    data: params,
  });
}

export function distributionData(params){
  return request({
    url: "tsp/vehicleData/distributionData",
    method: "post",
    data: params
  });
}

export function alertData(params){
  return request({
    url: "tsp/vehicleData/alertData",
    method: "post",
    data: params
  });
}

//flowData 流量统计查询
export function flowData(params){
  return request({
    url: "tsp/vehicleData/flowData",
    method: "post",
    data: params
  });
}
//flowData 流量统计查询
export function flowDataExport(params){
  return request({
    url: "tsp/vehicleData/flowDataExport",
    method: "post",
    data: params
  });
}

/**
 * 通过roleId 查询当前角色关联的车辆信息
 * @param roleId
 * @returns {AxiosPromise} 回调
 */
export function queryVehicleRoleVOByRoleId(roleId){
  return request({
    url:"/tsp/vehicle-role/list-by-role/"+roleId,
    method:"get"
  })
}

//查询所有车辆角色关联信息
export function queryVehicleRoleVOOfAll(params){
  return request({
    url:"/tsp/vehicle-role/list",
    method:"get",
    params:params
  })
}

//批量添加车辆角色关联信息
export function saveOrUpdateVehicleRoleByRole(params){
  return request({
    url:"/tsp/vehicle-role/add-by-role",
    method:"post",
    data:params
  })
}
