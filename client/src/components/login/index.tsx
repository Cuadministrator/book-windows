import React, { useState, useCallback, forwardRef } from 'react'
import Taro, { Component } from "@tarojs/taro"
import { View, Text, BaseEventOrig } from "@tarojs/components"
import { inject } from 'mobx-react'
import { AtButton, AtMessage } from 'taro-ui'

// service
import { login } from '../../service/user'

// style
import './index.scss'
import { Global } from 'src/store/global'
import { ButtonProps } from '@tarojs/components/types/Button'

interface IProps {
  globalStore: Global
}

const Login = inject(store => store)(forwardRef((props: IProps, ref) => {
  const getUserInfo = useCallback(
    async (e?: BaseEventOrig<ButtonProps.onGetUserInfoEventDetail>) => {
      // Taro.atMessage({
      //   message: '登录成功',
      //   type: 'success'
      // })
      let name = ''
      let avatarUrl = ''
      if (e && e.detail && e.detail.userInfo) {
        name = e.detail.userInfo.nickName
        avatarUrl = e.detail.userInfo.avatarUrl
      }
      const loginRes = await login(name, avatarUrl)
      if (loginRes.success && loginRes.data) {
        console.warn('login success!!', loginRes.data)
        props.globalStore.changeLoginUser(loginRes.data)
      }
    },
    [],
  )
  return (
    <AtButton
      type='primary'
      openType='getUserInfo'
      onGetUserInfo={getUserInfo}
    >一键登录/注册</AtButton>
  )
}))

export default Login
