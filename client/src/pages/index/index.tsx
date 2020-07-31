import React, { useRef, forwardRef, useEffect, useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { inject, useObserver, observer } from 'mobx-react'
import {
  AtTabBar,
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtMessage,
} from 'taro-ui'

// components
import Mine from '../mine'
import Book from '../book'
import Record from '../record'
import User from '../user'

// store
import { Global } from '../../store/global'

// config
import { userRoleEnum } from '../../config'

import './index.scss'

interface TabItem {
  id: string;
  title: string;
  iconType: string;
  iconPrefixClass?: string;
}

interface IProps {
  globalStore: Global
  current: number
}

const Index = inject('globalStore')(observer(forwardRef((props: IProps, ref) => {
  const [initEnd, setInitEnd] = useState(false)
  const [current, setCurrent] = useState(props.current || 0)
  const [tabList, setTabList] = useState<TabItem[]>(userRoleEnum[2].tab)
  const [modalVisible, setModalVisible] = useState(true)
  const bookRef = useRef<any>(null)
  const recordRef = useRef<any>(null)
  const userRef = useRef<any>(null)
  const mineRef = useRef<any>(null)

  useEffect(() => {

  }, [])

  useEffect(() => {
    setInitEnd(false)
    setTabList(
      userRoleEnum[
        props.globalStore.loginUser?.role || 3
      ].tab
    )
    setInitEnd(true)
  }, [props.globalStore.loginUser])

  const onAtTabBarPress = useCallback(
    async (index) => {
      if (tabList[index].id === 'book') {
      } else if (tabList[index].id === 'record') {
        if (recordRef.current) {
          recordRef.current.initData()
        }
      } else if (tabList[index].id === 'user') {
        if (userRef.current) {
          userRef.current.initData()
        }
      } else if (tabList[index].id === 'mine') {
      }
      setCurrent(index)

    },
    [recordRef, tabList, userRef],
  )

  const showMessage = useCallback(
    (message: '正在加载中', type: 'info') => {
      Taro.atMessage({
        message: message,
        type: type,
      })
    },
    []
  )

  if (!initEnd) return useObserver(() => null)

  return useObserver(() => (
    <View className='page-home'>
      <AtTabs
        current={current}
        tabList={[]}
        height='100%'
        onClick={onAtTabBarPress}
      >
        {
          tabList.map((item, index) => {
            if (item.id === 'book') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index} >
                  <Book ref={bookRef} showMessage={showMessage} />
                </AtTabsPane>
              )
            } else if (item.id === 'record') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <Record ref={recordRef} />
                </AtTabsPane>
              )
            } else if (item.id === 'user') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <User ref={userRef} showMessage={showMessage} />
                </AtTabsPane>
              )
            } else if (item.id === 'mine') {
              return (
                <AtTabsPane className='at-tab-pan' current={current} index={index}>
                  <Mine ref={mineRef} globalStore={props.globalStore} />
                </AtTabsPane>
              )
            } else {
              return null
            }
          })
        }
      </AtTabs>
      <AtTabBar
        current={current}
        tabList={tabList}
        fontSize={12}
        onClick={onAtTabBarPress}
      />
      <AtModal
        isOpened={modalVisible}
      >
        <AtModalHeader>
          <View className='modal-header'>西格林科技</View>
          <View className='modal-header'>WEST GREEN TECH</View>
        </AtModalHeader>
        <AtModalContent>
          {
            [
              'Westgreen office是四川省西格林科技有限公司的办公基地，项目所处的大楼成都国际科技节能大厦是LEED金级认证+国家绿色建筑二星运营双认证，项目位于大楼A座703-704，产权面积为454.38㎡。westgreen office以WELL金级和美国LEED0+M铂金级为建设目标，从设计施工运营全过程全面贯彻健康建筑、健康办公的理念。',
              '西格林办公室致力于西南片区第一个WELL金级认证的办公室，为健康理念融入各类办公项目中起到先锋作用。该项目于2020年6月获得WELL中期认证证书，办公室于2020年7月正式投入使用，预计9月底取得WELL及LEED运营认证。',
              '公司以人为本的设计理念贯穿到整个Westgreen office，项目将WELL标准的十大概念（空气、水、光环境、营养、热舒适、声环境、材料、社区、精神、运动）充分融入到办公环境，例如：办公室室内污染物常年保持在0.2ppm以内，提供纯净的水源和果蔬、提供符合人体工学所设计的工位，提供冥想室、健身区、电话亭等空间。',
              '为更好推广交流WELL健康办公理念，结合西格林公司实际情况，定于每周三面向社会及行业开放免费参观',
              'Westgreen office期待您的到来！'
            ].map((item, index) =>
              <View key={index} className='modal-context'>{item}</View>
            )
          }
        </AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => { setModalVisible(false) }}
          >进入预约</Button>
        </AtModalAction>
      </AtModal>
      <AtMessage />
    </View>
  ))
})))

export default Index
