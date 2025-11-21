import request from '@/utils/request'

export function userList(query){
    return request({
        url: '/tsp/user/list',
        method: 'post',
        data: query
    })
}


export function add(data){
    return request({
        url: '/tsp/user/add',
        method: 'post',
        data: data
    })
}

export function edit(data){
    return request({
        url: '/tsp/user/edit',
        method: 'put',
        data: data
    })
}

export function get(tspUserId){
    return request({
        url: `/tsp/user/get/${tspUserId}`,
        method: 'get',
    })
}

export function find(tspUserId){
    return request({
        url: `/tsp/user/find/${tspUserId}`,
        method: 'get',
    })
}

export function findHistory(tspUserId){
    return request({
        url: `/tsp/user/findHistory/${tspUserId}`,
        method: 'get',
    })
}

export function deletes(tspUserIds){
    return request({
        url: `/tsp/user/deletes/${tspUserIds}`,
        method: 'delete',
    })
}


export function importUser(params){
    return request({
        url: '/tsp/user/importUser',
        method: 'post',
        params: params
    })
}

export function importTemplate(){
    return request({
        url: '/tsp/user/importTemplate',
        method: 'get',
    })
}

export function exportUser(query){
    return request({
        url: '/tsp/user/exportUser',
        method: 'get',
        params:query
    })
}
