import request from '@/utils/request'

export function getPatientById(patientId) {
  return request({
    url: `/patient/${patientId}`,
    method: 'get'
  })
}