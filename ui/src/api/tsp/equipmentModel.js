import request from '@/utils/request'

export function add(data){
    return request({
        url:'/tsp/equipmentModel/add',
        method: 'post',
        data: data
    });
}

export function edit(data){
    return request({
        url:'/tsp/equipmentModel/edit',
        method: 'put',
        data: data
    })
}

export function removeModel(tspEquipmentModelId){
    return request({
        url: `/tsp/equipmentModel/delete/${tspEquipmentModelId}`,
        method: 'delete',
    })
}

export function importEquipmentModel(params){
    return request({
        url: '/tsp/equipmentModel/importEquipmentModel',
        method: 'post',
        params: params
    })
}

export function importTemplate(){
    return request({
        url: '/tsp/equipmentModel/importTemplate',
        method: 'get',
    })
}
