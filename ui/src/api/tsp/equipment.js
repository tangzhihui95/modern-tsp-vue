import request from '@/utils/request'

export function list(query){
    return request({
        url: '/tsp/equipment/list',
        method: 'post',
        data: query
    })
}


export function add(data){
    return request({
        url: '/tsp/equipment/add',
        method: 'post',
        data: data
    })
}

export function edit(data){
    return request({
        url: '/tsp/equipment/edit',
        method: 'put',
        data: data
    })
}



export function removes(tspEquipmentIds){
    return request({
        url: `/tsp/equipment/deletes/${tspEquipmentIds}`,
        method: 'delete',
    })
}

export function exportEquipment(params){
    return request({
        url: '/tsp/equipment/export',
        method: 'get',
        params: params
    })
}

export function scrap(data){
    return request({
        url: '/tsp/equipment/scrap/',
        method: "put",
        data: data,
    })
}

export function importEquipment(params){
    return request({
        url: '/tsp/equipment/importEquipment',
        method: 'post',
        params: params
    })
}

export function importTemplate(){
    return request({
        url: '/tsp/equipment/importTemplate',
        method: 'get',
    })
}
