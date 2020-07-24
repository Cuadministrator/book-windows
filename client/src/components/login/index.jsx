import React, { useState, useCallback, forwardRef } from 'react'
import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import { inject } from 'mobx-react'
import { AtButton } from 'taro-ui'

// utils
import { login } from '../../utils/func'

// style
import './index.scss'

const Login = inject(store => store)(forwardRef((props, ref) => {
  const getUserInfo = useCallback(
    async (e) => {
      const { target: { userInfo } } = e
      const res = await Taro.cloud.callFunction({
        name: "login",
        data: {}
      })
      if (res && res.result) {
        const { userInfo: cloudUserInfo } = res.result
        props.globalStore.changeLoginUser(userInfo)
      }
    },
    [],
  )
  return (
    <View className='login-box'>
      <AtButton
        type='primary'
        openType='getUserInfo'
        onGetUserInfo={getUserInfo}
      >登陆</AtButton>
    </View>
  )
}))

export default Login
