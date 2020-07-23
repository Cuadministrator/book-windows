import React, { forwardRef } from 'react'
import { View } from '@tarojs/components'
import { inject, useObserver } from 'mobx-react'

// components
import Login from '../../components/login'

// store
import { Global } from '../../store/global'

import './index.scss'

interface IProps {
  globalStore: Global
}

const Index = inject(store => store)(forwardRef((props: IProps, ref) => {
  return useObserver(() => (
    <View className='page'>
      <Login />
    </View>
  ))
}))

export default Index
