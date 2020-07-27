import React, { useEffect, forwardRef, useState, useCallback, useImperativeHandle } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import dayjs from 'dayjs'

import { AtAccordion, AtList, AtListItem } from 'taro-ui'

// service
import { getBookRecord, RecordDatum } from '../../service/book'

import './index.scss'

interface IData extends RecordDatum {
  visible: boolean
}

interface IProps {
}

const Record = forwardRef((props: IProps, ref) => {
  const [data, setData] = useState<IData[]>([])
  const [initEnd, setInitEnd] = useState(false)
  const initData = useCallback(
    async () => {
      setInitEnd(false)
      const brRes = await getBookRecord()
      if (brRes && brRes.success && brRes.data) {
        setData(brRes.data.map(item => ({...item, visible: false})) || [])
      }
      setInitEnd(true)
    }, []
  )

  useImperativeHandle(ref, () => ({
    initData: () => {
      initData()
    }
  }))
  
  const onAccordionPress = useCallback(
    (index: number, value: boolean) => {
      const current = [...data]
      current[index].visible = value
      setData(current)
    },
    [data, setData]
  )
  useEffect(() => {
    initData()
  }, [initData])
  return (
    <ScrollView className='page-record' scrollY>
      {
        !!initEnd && (
          !!(data && data.length > 0)
            ? data.map((item, index) => {
            return (
              <AtAccordion
                key={index}
                open={item.visible}
                onClick={(value: boolean) => onAccordionPress(index, value)}
                title={item.name}
              >
                <AtList hasBorder={false}>
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS2nRP.png'
                    note='姓名'
                    title={item.name}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS2QsS.png'
                    note='公司'
                    title={item.company}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS2uxf.png'
                    note='电话'
                    title={item.phone}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS23ZQ.png'
                    note='职位'
                    title={item.position}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS2MM8.png'
                    note='邮箱'
                    title={item.email}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS2lqg.png'
                    note='预约人数'
                    title={`${item.bookNumber}个`}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS28aj.png'
                    note='预约时间'
                    title={`${dayjs(item.bookStartDt).format('YYYY-MM-DD HH:mm:ss')} - ${dayjs(item.bookEndDt).format('HH:mm:ss')}`}
                  />
                  <AtListItem
                    thumb='https://s1.ax1x.com/2020/07/25/aS28aj.png'
                    note='创建时间'
                    title={`${dayjs(item.createDt).format('YYYY-MM-DD HH:mm:ss')}`}
                  />
                </AtList>
              </AtAccordion>
            )
          })
          : <View className='no-record-box'>
            <Text className='no-record-text'>暂无预约记录</Text>
          </View>
        )
      }
    </ScrollView>
  )
})

export default Record
