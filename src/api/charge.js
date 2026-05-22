import request from '@/utils/request'

export function getUnpaidItems(patientId) {
  return request({
    url: `/charge/unpaid/${patientId}`,
    method: 'get'
  })
}

export function settleCharge(data) {
  return request({
    url: '/charge/settle',
    method: 'post',
    data
  })
}

export function refundCharge(orderId) {
  return request({
    url: `/charge/refund/${orderId}`,
    method: 'post'
  })
}

export function getChargeList(params) {
  return request({
    url: '/charge/list',
    method: 'get',
    params
  })
}