import React, { forwardRef, useRef, useEffect, useCallback } from 'react'
import { View, Text } from "@tarojs/components"
import { toJS } from 'mobx'
import { inject } from 'mobx-react'
import { AtAvatar, AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'

import { userRoleEnum, tempMessage } from '../../config'

// style
import './index.scss'
import { Global } from 'src/store/global'
import { modifyUserSubscribeNumber } from '../../service/user'

interface IProps {
  globalStore: Global
}

const Login = inject(store => store)(forwardRef((props: IProps, ref) => {
  const timerRef = useRef<any>(null)
  if (!props.globalStore.loginUser) return null
  const { avatarUrl, name, role, subscribeNumber } = props.globalStore.loginUser
  const roleName = userRoleEnum[role || 1].name
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])
  const bookMsg = useCallback(
    async () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      const res = await Taro.requestSubscribeMessage({
        tmplIds: tempMessage
      })
      if (res && res.errMsg === 'requestSubscribeMessage:ok') {
        if (props.globalStore.loginUser) {
          const user = toJS(props.globalStore.loginUser)
          user.subscribeNumber += 1
          props.globalStore.changeLoginUser(user)
          timerRef.current = setTimeout(() => {
            modifyUserSubscribeNumber(user._id, user.subscribeNumber)
          }, 2000)
        }
      }
    },
    [props.globalStore.loginUser]
  )
  return (
    <View className='user-info-box'>
      <AtAvatar image={avatarUrl} size='large' />
      {
        !!roleName && <Text className='user-info-title' >{roleName}</Text>
      }
      <Text className='user-info-text'>{name}</Text>
      <AtButton className='user-info-msg-btn' type='primary' onClick={bookMsg}>订阅消息 (剩余{subscribeNumber}次)</AtButton>
    </View>
  )
}))

export default Login
