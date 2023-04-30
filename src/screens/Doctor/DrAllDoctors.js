import React, {useEffect, useState} from 'react'
import {View, Text, Image, ScrollView, RefreshControl} from 'react-native'
import config from '../../config'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {
  GreadientHeader,
  PatientItem,
  NoRecordComponent,
  HeaderEst,
} from '../../components'
import {useDispatch, useSelector} from 'react-redux'
import {
  drGetProfile,
  getDetail,
  getEstDoctors,
  getSubscriptionUser,
} from '../../store/actions'

const DrAllDoctors = ({navigation}) => {
  //REDUX STORE
  const dispatch = useDispatch()
  const {user, role, profile} = useSelector(state => state.Auth)
  const {establishmentDoctor} = useSelector(state => state.Doctor)
  const [refreshing, setRefreshing] = useState(false)

  //Fuctions
  // GET My Patients Appointment list
  useEffect(() => {
    dispatch(getEstDoctors(false))
    dispatch(getSubscriptionUser({}, false))
  }, [])

  // GET PROFILE
  useEffect(() => {
    if (role !== null) {
      const params = {
        user_id: user?.userId,
        from: role,
      }
      dispatch(drGetProfile(params, true))
      dispatch(getDetail({from: role}))
    }
  }, [role])

  const setDoctor = item => {
    navigation.navigate('DrDashboard')
    dispatch({
      type: 'SET_EST_DOCTOR',
      payload: item,
    })
  }

  //Refresh funtion
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    dispatch(getEstDoctors(false))
    wait(1000).then(() => setRefreshing(false))
  }, [])
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <HeaderEst
          showLeftIcon={assets.menu}
          showRightIcon={assets.Notification}
          showCenterIcon={assets.inner_logoWhite}
          leftRoute={() => {
            navigation.toggleDrawer()
            profile?.status === false &&
              dispatch(drGetProfile({user_id: user?.userId, from: role}, false))
          }}
          rightRoute={() => navigation.navigate('DrNotification')}
          doctor={true}
          ExtraStyle={[styles.height(200)]}
          title={labels.welcome}
          meanHeading={`${profile?.name}`}
          subHeading={false}
        />
        <View
          style={[
            styles.mH(35),
            styles.mB(5),
            styles.mT(20),
            styles.flexRow,
            {justifyContent: 'space-between'},
          ]}>
          <Text style={[styles.textSemiBold, styles.fontSize(19)]}>
            {labels.pickDoctor}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={[styles.flexWrapContainer, styles.mH(10)]}>
            {establishmentDoctor?.length > 0 ? (
              establishmentDoctor?.map((item, index) => {
                return (
                  <PatientItem
                    show={item?.status === 'accepted' ? true : false}
                    status={item?.status}
                    key={index}
                    navigation={navigation}
                    image={item?.provider?.avatar}
                    title={item?.provider?.fullName}
                    onBtnPress={() => setDoctor(item)}
                  />
                )
              })
            ) : (
              <View style={[styles.mT(150), styles.mL(110)]}>
                <NoRecordComponent />
              </View>
            )}
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
        <Image source={assets.bottom_image} style={styles.bottomImg} />
      </View>
    </>
  )
}

export default DrAllDoctors
