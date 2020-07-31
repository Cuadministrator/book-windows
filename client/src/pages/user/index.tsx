import React, { useEffect, forwardRef, useState, useCallback, useImperativeHandle } from 'react'
import { View, Text, BaseEventOrig, ScrollView } from '@tarojs/components'
import { inject, useObserver } from 'mobx-react'

// component
import { AtList, AtListItem, AtActivityIndicator } from 'taro-ui'

import { ILoginUser } from '../../store/global'

// service
import { searchUser, modifyUserRole } from '../../service/user'

import './index.scss'

interface IData extends ILoginUser {
  visible: boolean
}

interface IProps {
  showMessage: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void
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
      props.showMessage(res.message, typeMsg)
    },
    [data, setData]
  )

  useEffect(() => { initData() }, [initData])

  if (!initEnd) return useObserver(() => (<View className='page-user'><AtActivityIndicator mode='center' content='加载中...' /></View>))
  return useObserver(() => (
    <View className='page-user'>
      {
        !!initEnd && (
          !!(data && data.length > 0)
          ? (
            <ScrollView className='page-user-scroll' scrollY>
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
            </ScrollView>
          )
          : (
            <View className='no-user-box'>
              <Text className='no-record-text'>暂无用户</Text>
            </View>
          )
        )
      }
    </View>
  ))
}))

export default User
