import request from "@/utils/request";

export function sendZhiYuanTboxSettingsQueryCommand(vin){
    return request({
        url: `/zhiyuan/tbox-settings/query/${vin}`,
        method: 'get',
    })
}

export function getZhiYuanTboxSettings(vin){
    return request({
        url: `/zhiyuan/tbox-settings/query-result/${vin}`,
        method: 'get',
    })
}

export function sendZhiYuanTboxSettingsUpdateCommand(data){
    return request({
        url: '/zhiyuan/tbox-settings/update',
        method: 'post',
        data: data
    })
}

export function getZhiYuanTboxSettingsUpdateResult(vin){
    return request({
        url: `/zhiyuan/tbox-settings/update-result/${vin}`,
        method: 'get',
    })
}

export function sendVehicleControlCommand(data) {
    return request({
      url: "/zhiyuan/vehicle-control/send",
      method: "post",
      data: data
    });
}

export function getVehicleControlCommandExecuteResult(vin) {
  return request({
    url: `/zhiyuan/vehicle-control/result/${vin}`,
    method: "get",
  });
}