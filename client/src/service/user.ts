import Taro from '@tarojs/taro'

import { dbRequestResponse } from './index'

export const login = async (
  name?: string,
  avatarUrl?: string
) => {
  const cloudLoginRes: any = await Taro.cloud.callFunction(
    { name: 'login', data: {} }
  )
  if (
    cloudLoginRes &&
    cloudLoginRes.result &&
    cloudLoginRes.result.userInfo
  ) {
    const { openId } = cloudLoginRes.result.userInfo
    const res = await searchUser({_openid: openId})
    if (res.success && res.data && res.data.length > 0) {
      res.data = res.data[0]
      return res
    } else {
      if (name && avatarUrl) {
        const userRes = await addUser(name, 2, avatarUrl)
        if (userRes.success && userRes.data) {
          return userRes
        }
      } else {
        const userInfoRes = await Taro.getUserInfo()
        if (userInfoRes && userInfoRes.userInfo) {
          const { nickName, avatarUrl: headerImg } = userInfoRes.userInfo
          const userRes = await addUser(nickName, 2, headerImg)
          if (userRes.success && userRes.data) {
            return userRes
          }
        }
      }
    }
  }
  return dbRequestResponse(null)
}


export const addUser = async (name, role, avatarUrl?) => {
  const db = Taro.cloud.database()
  const res = await db.collection('users').add({
    data: {
      name,
      avatarUrl,
      role,
      createDt: new Date()
    }
  })
  if (res && res._id) {
    const userRes = await searchUser({_id: res._id})
    if (userRes.success && userRes.data && userRes.data.length > 0) {
      userRes.data = userRes.data[0]
      return userRes
    }
  }
  return dbRequestResponse(res)
}

export const searchUser = async (params) => {
  const db = Taro.cloud.database()
  const res = await db.collection('users').where(params).get()
  if (res && res.data && res.data.length > 0) {
    res.data.forEach((item, index) => {
      delete res.data[index]._openid
      delete res.data[index].createDt
    })
  }
  return dbRequestResponse(res)
}

