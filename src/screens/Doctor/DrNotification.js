import React, {useEffect, useRef, useState} from 'react'
import {View, Image, Text, ScrollView, FlatList} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {
  GreadientHeader,
  NotificationItem,
  NoRecordComponent,
} from '../../components'
import {getNotification} from '../../store/actions'
import {useDispatch, useSelector} from 'react-redux'

const DrNotification = ({navigation}) => {
  //Redux STORE
  const dispatch = useDispatch()
  const {allNotification} = useSelector(state => state.Doctor)
  // Declare state variables'
  const [notificationList, setNotificationList] = useState([])
  // GET My Notification
  useEffect(() => {
    dispatch(getNotification(true))
  }, [])

  useEffect(() => {
    if (allNotification.length > 0) {
      var notification = allNotification
      const sorted = notification.sort((a, b) => {
        const dateA = new Date(`${a.createdAt}`).valueOf()
        const dateB = new Date(`${b.createdAt}`).valueOf()
        if (dateA < dateB) {
          return 1
        }
        return -1
      })
      setNotificationList(sorted)
    }
  }, [allNotification])
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.notification}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(40)} />
        <ScrollView bounces={false}>
          <View style={styles.mH(20)}>
            <FlatList
              scrollEnabled={true}
              data={notificationList}
              showsVerticalScrollIndicator={false}
              style={styles.flex(1)}
              ListEmptyComponent={
                <View style={styles.mT(150)}>
                  <NoRecordComponent
                    title='No notification found'
                    loading={true}
                  />
                </View>
              }
              renderItem={({item, index}) => (
                <>
                  <NotificationItem
                    title={item?.title}
                    date={item?.createdAt}
                    descripton={item?.description}
                  />
                </>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default DrNotification
