import React, { useEffect, forwardRef, useState, useCallback, useImperativeHandle } from 'react'
import { View, Text, BaseEventOrig } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { inject, useObserver } from 'mobx-react'

// component
import { AtMessage } from 'taro-ui'
import { AtList, AtListItem } from 'taro-ui'

import { ILoginUser } from '../../store/global'

// service
import { searchUser, modifyUserRole } from '../../service/user'

import './index.scss'

interface IData extends ILoginUser {
  visible: boolean
}

interface IProps {
}

const User = inject(store => store)(forwardRef((props: IProps, ref) => {
  const [initEnd, setInitEnd] = useState(false)
  const [data, setData] = useState<IData[]>([])
  const initData = useCallback(
    async () => {
      setInitEnd(false)
      const suRes = await searchUser({})
      if (suRes && suRes.success && suRes.data) {
        setData(suRes.data.map(item => ({...item, visible: item.role === 1})) || [])
      }
      setInitEnd(true)
    }, []
  )

  useImperativeHandle(ref, () => ({
    initData: () => {
      initData()
    }
  }))
  
  const onAtListItemPress = useCallback(
    async (e, index) => {
      if (!(e && e.detail)) return
      const { value } = e.detail
      const current = [...data]
      current[index].visible = value
      const res = await modifyUserRole(current[index]._id, value ? 1 : 2)
      let typeMsg: 'error' | 'success' = 'error'
      if (res && res.success && res.data) {
        setData(current)
        typeMsg = 'success'
      }
      Taro.atMessage({
        message: res.message,
        type: typeMsg,
      })
    },
    [data, setData]
  )
  useEffect(() => {
    initData()
  }, [initData])
  return useObserver(() => (
    <View className='page-record'>
      <AtMessage />
      {
        !!initEnd && (
          !!(data && data.length > 0)
          ? (
            <AtList>
              {
                data.map((item, index) => {
                  return (
                    <AtListItem
                      key={index}
                      thumb={item.avatarUrl}
                      title={item.name}
                      note={item.visible ? '管理员' : '普通用户'}
                      isSwitch
                      switchIsCheck={item.visible}
                      onSwitchChange={(value: BaseEventOrig<any>) => onAtListItemPress(value, index)}
                    />
                  )
                })
              }
            </AtList>
          )
          : (
            <View className='no-record-box'>
              <Text className='no-record-text'>暂无用户</Text>
            </View>
          )
        )
      }
    </View>
  ))
}))

export default User
