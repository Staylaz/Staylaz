import request from '@/utils/request'

export function getChat() {
  return request({
    url: '/telegram/chat',
    method: 'post'
  })
}

export function getChatRecord(data) {
  return request({
    url: '/telegram/message',
    method: 'post',
    data
  })
}

export function sendMessage(data) {
  return request({
    url: '/telegram/send',
    method: 'post',
    data
  })
}
