import request from '@/utils/request'

export function list(query){
    return request({
        url: '/tsp/vehicle/model/list',
        method: 'post',
        data: query
    })
}


export function add(data){
    return request({
        url: '/tsp/vehicle/model/add',
        method: 'post',
        data: data
    })
}

export function edit(data){
    return request({
        url: '/tsp/vehicle/model/edit',
        method: 'put',
        data: data
    })
}



export function removes(vehicleModelIds){
    return request({
        url: `/tsp/vehicle/model/deletes/${vehicleModelIds}`,
        method: 'delete',
    })
}

export function exportEquipment(params){
    return request({
        url: '/tsp/vehicle/model/export/',
        method: 'get',
        params: params
    })
}

export function importVehicleModel(params){
    return request({
        url: '/tsp/vehicle/model/importVehicleModel',
        method: 'post',
        params: params
    })
}

export function importVehicleStdModel(params){
    return request({
        url: '/tsp/vehicle/model/importVehicleStdModel',
        method: 'post',
        params: params
    })
}

export function importTemplateModel(){
    return request({
        url: '/tsp/vehicle/model/importTemplateModel',
        method: 'get',
    })
}

export function importTemplateStdModel(){
    return request({
        url: '/tsp/vehicle/model/importTemplateStdModel',
        method: 'get',
    })
}

export function selectList(tspVehicleModelId){
    return request({
        url: '/tsp/vehicle/model/selectList',
        method: 'get',
        params: tspVehicleModelId
    })
}

export function selectChildrenList(query){
    return request({
        url: `/tsp/vehicle/model/selectChildrenList`,
        method: 'post',
        data: query
    })
}

export function exportVehicleModel(params){
    return request({
        url: '/tsp/vehicle/model/export/',
        method: 'get',
        params: params
    })
}
