import request from '@/utils/request'


export function add(data){
    return request({
        url: '/tsp/vehicle/stdModel/addStdModel',
        method: 'post',
        data: data
    })
}
export function edit(data){
    return request({
        url: '/tsp/vehicle/stdModel/edit/',
        method: 'put',
        data: data
    })
}

export function remove(tspVehicleStdModelId){
    return request({
        url: `/tsp/vehicle/stdModel/delete/${tspVehicleStdModelId}`,
        method: 'delete',
    })
}

export function get(tspVehicleStdModelId){
    return request({
        url: `/tsp/vehicle/stdModel/get/${tspVehicleStdModelId}`,
        method: 'get',
    })
}

export function select(params){
    return request({
        url: '/tsp/vehicle/stdModel/select',
        method: 'get',
        params: params
    })
}

export function getLabelMap(){
    return request({
        url: '/tsp/vehicle/stdModel/getLabelMap',
        method: 'get',
    })
}