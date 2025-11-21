import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function list(query) {
  return request({
    url: '/move/alert/list',
    method: 'get',
    params: {
      ...query
    }
  })
}
// 查询【请填写功能名称】列表
export function updateForHandle(params) {
  return request({
    url: '/move/alert/updateForHandle',
    method: 'post',
    data: params
  })
}
// 查询【请填写功能名称】列表
export function updateForMonitor(params) {
  return request({
    url: '/move/alert/updateForMonitor',
    method: 'post',
    data: params
  })
}
// 查询【请填写功能名称】列表
export function getById(id) {
  return request({
    url: '/move/alert/getById/'+id,
    method: 'get'
  })
}
// 查询【请填写功能名称】列表
export function count() {
  return request({
    url: '/move/alert/count',
    method: 'get'
  })
}
