import request from '@/utils/request'

export function list(data){
    return request({
        url:'/tsp/equipmentType/list',
        method: 'post',
        data: data
    });
}

export function add(data){
    return request({
        url:'/tsp/equipmentType/add',
        method: 'post',
        data: data
    });
}

export function edit(data){
    return request({
        url:'/tsp/equipmentType/edit',
        method: 'put',
        data: data
    })
}


export function remove(equipmentTypeId){
    return request({
        url: `/tsp/equipmentType/delete/${equipmentTypeId}`,
        method: 'delete'
    })
}

export function deletes(equipmentTypeIds){
    return request({
        url: `/tsp/equipmentType/deletes/${equipmentTypeIds}`,
        method: 'delete'
    })
}

export function selectList(data){
    return request({
        url: '/tsp/equipmentType/selectList',
        method: 'post',
        data: data
    })
}

export function addModel(data){
    return request({
        url:'/tsp/equipmentType/addModel',
        method: 'post',
        data: data
    });
}

export function editModel(data){
    return request({
        url:'/tsp/equipmentType/editModel',
        method: 'put',
        data: data
    });
}

export function exportEquipmentType(params){
    return request({
        url: '/tsp/equipmentType/export/',
        method: 'get',
        params: params
    })
}

export function importEquipmentType(params){
    return request({
        url: '/tsp/equipmentType/importEquipmentType',
        method: 'post',
        params: params
    })
}

export function importEquipmentModel(params){
    return request({
        url: '/tsp/equipmentType/importEquipmentModel',
        method: 'post',
        params: params
    })
}

export function importModelTemplate(){
    return request({
        url: '/tsp/equipmentType/importModelTemplate',
        method: 'get',
    })
}

export function importTypeTemplate(){
    return request({
        url: '/tsp/equipmentType/importTypeTemplate',
        method: 'get',
    })
}
