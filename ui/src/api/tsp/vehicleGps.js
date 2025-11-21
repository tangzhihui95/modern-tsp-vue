import request from '@/utils/request'


export function getVehicleBasicData(vin){
    return request({
        url: `/tsp/vehicle/gps/getGpsInfo/${vin}`,
        method: 'get',
    })
}

export function selectList(search){
    return request({
        url: '/tsp/vehicle/gps/selectList',
        method: 'post',
        data: search
    })
}

export function getVehicleCanData(vin){
    return request({
        url: `/tsp/vehicle/integrate/getData/${vin}`,
        method: 'get',
    })
}

export function findHistory(data){
    return request({
        url: '/tsp/vehicle/gps/findHistory',
        method: 'post',
        data: data
    })
}