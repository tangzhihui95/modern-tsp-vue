import request from '@/utils/request'


export function list(query){
    return request({
        url: '/tsp/useVehicleRecord/list',
        method: 'post',
        data: query
    })
}
