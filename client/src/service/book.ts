import Taro from '@tarojs/taro'

import { getUserInfo } from './user'

import { dbRequestResponse } from './index'

export interface RecordDatum {
  name: string
  company: string
  phone: string
  position: string
  email: string
  bookNumber: number
  bookStartDt: Date
  bookEndDt: Date
  createDt: Date
}

const MAX_BOOK_NUM = 20

export const addBook = async (
  name: string,
  company: string,
  phone: string,
  position: string,
  email: string,
  bookNumber: number,
  bookStartDt: Date,
  bookEndDt: Date,
) => {
  const db = Taro.cloud.database()
  const sblRes = await searchBook({ bookStartDt })
  if (!(sblRes && sblRes.success)) return dbRequestResponse(null)
  if (sblRes.data && sblRes.data.length > 0) {
    let total = 0
    sblRes.data.forEach(item => {
      if (item.bookNumber > 0) total = total + item.bookNumber
    })
    if (total + bookNumber > MAX_BOOK_NUM) {
      return dbRequestResponse({data: null, errMsg: '超过了可预约的上限'})
    }
  }
  const res = await db.collection('record').add({
    data: {
      name,
      company,
      phone,
      position,
      email,
      bookNumber,
      bookStartDt,
      bookEndDt,
      createDt: new Date()
    }
  })
  if (res && res._id) {
    return dbRequestResponse({data: true, errMsg: '添加成功'})
  }
  return dbRequestResponse(null)
}

export const searchBook = async (params = {}, config?) => {
  const db = Taro.cloud.database()
  const res = await db
    .collection('record')
    .where(params)
    .get()
  if (res && res.data && res.data.length > 0) {
    res.data.forEach((item, index) => {
      if (!(config && config.stopDefault)) {
        delete res.data[index]._openid
      }
    })
  }
  return dbRequestResponse(res)
}

export const getBookRemain = async (bookStartDt) => {
  const sblRes = await searchBook({ bookStartDt })
  if (!(sblRes && sblRes.success)) return dbRequestResponse(null)
  let total = 0
  if (sblRes.data && sblRes.data.length > 0) {
    sblRes.data.forEach(item => {
      if (item.bookNumber > 0) total = total + item.bookNumber
    })
    if (total >= MAX_BOOK_NUM) {
      return dbRequestResponse({data: null, errMsg: '该时间段，超过了可预约上限'})
    }
  }
  return dbRequestResponse({data: { remain: MAX_BOOK_NUM - total > 0 ? MAX_BOOK_NUM - total : 0 }, message: ''})
}

export const getBookRecord = async () => {
  let params = {_openid: '{openid}'}
  const userRes = await getUserInfo()
  if (userRes && userRes.success && userRes.data && userRes.data.role === 1) {
    delete params._openid
  }
  const recordRes = await searchBook(params)
  if (recordRes && recordRes.success && recordRes.data && recordRes.data.length > 0) {
    recordRes.data.forEach((item, index) => {
      delete recordRes.data[index]._openid
    })
  }
  return dbRequestResponse(recordRes)
}
