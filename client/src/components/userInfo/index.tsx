import React, { forwardRef } from 'react'
import { View, Text } from "@tarojs/components"
import { inject } from 'mobx-react'
import { AtAvatar } from 'taro-ui'

import { userRoleEnum } from '../../config'

// style
import './index.scss'
import { Global } from 'src/store/global'

interface IProps {
  globalStore: Global
}

const Login = inject(store => store)(forwardRef((props: IProps, ref) => {
  if (!props.globalStore.loginUser) return null
  const { avatarUrl, name, role } = props.globalStore.loginUser
  const roleName = userRoleEnum[role || 1].name
  return (
    <View className='user-info-box'>
      <AtAvatar image={avatarUrl} size='large' />
      {
        !!roleName && <Text className='user-info-title' >{roleName}</Text>
      }
      <Text className='user-info-text'>{name}</Text>
    </View>
  )
}))

export default Login
