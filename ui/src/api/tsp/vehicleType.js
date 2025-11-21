import request from '@/utils/request'

export function list(query){
    return request({
        url: '/tsp/vehicle/type/list',
        method: 'post',
        data: query
    })
}


export function add(data){
    return request({
        url: '/tsp/vehicle/type/add',
        method: 'post',
        data: data
    })
}

export function edit(data){
    return request({
        url: '/tsp/vehicle/type/edit',
        method: 'put',
        data: data
    })
}



export function removes(vehicleTypeIds){
    return request({
        url: `/tsp/vehicle/type/deletes/${vehicleTypeIds}`,
        method: 'delete',
    })
}

export function exportEquipment(params){
    return request({
        url: '/tsp/vehicle/type/export/',
        method: 'get',
        params: params
    })
}

export function importEquipment(params){
    return request({
        url: '/tsp/vehicle/type/importEquipment',
        method: 'post',
        params: params
    })
}

export function importTemplate(){
    return request({
        url: '/tsp/vehicle/type/importTemplate',
        method: 'get',
    })
}

export function selectList(tspVehicleTypeId){
    return request({
        url: '/tsp/vehicle/type/selectList',
        method: 'get',
        params: tspVehicleTypeId
    })
}
