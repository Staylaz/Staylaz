import request from '@/utils/request'

export function getTokenInfo() {
  return request({
    url: '/token/info',
    method: 'get'
  })
}
