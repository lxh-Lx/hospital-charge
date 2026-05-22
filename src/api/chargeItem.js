import request from '@/utils/request'

export function getChargeItemList() {
  return request({
    url: '/charge-item/list',
    method: 'get'
  })
}

export function addChargeItem(data) {
  return request({
    url: '/charge-item/add',
    method: 'post',
    data
  })
}

export function updateChargeItem(data) {
  return request({
    url: '/charge-item/update',
    method: 'post',
    data
  })
}

export function deleteChargeItem(itemId) {
  return request({
    url: `/charge-item/delete/${itemId}`,
    method: 'delete'
  })
}