import request from '@/utils/request'

export function getOssStsInfo(code) {
  return request({
    url: `/xx/xx/getStsInfo`,
    method: 'get'
  })
}
