import React, {useEffect, useRef, useState} from 'react'
import {
  Image,
  View,
  Text,
  StatusBar,
  I18nManager,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import styles from '../assets/styles'
import {Header, Icon, Rating} from 'react-native-elements'
import colors from '../config/Colors'
import LinearGradient from 'react-native-linear-gradient'
import {assets} from '../assets/images'
import {useDispatch, useSelector} from 'react-redux'
import {createVideoCall} from '../store/actions'
// import {connect} from 'react-redux';

const ProfileHeader = ({
  navigation,
  showLeftIcon = false,
  showRightIcon = false,
  showLeftText = false,
  showRightText = false,
  showCenterText = false,
  doctor = false,
  showCenterIcon = false,
  avatar = false,
  data = false,
  patientData = false,
  from = false,
  leftRoute = () => {},
  rightRoute = () => {},
}) => {
  // Declare state variables'
  const [patientDetail] = useState(data?.user)
  const [appointmentId] = useState(data?.id)
  const [posId] = useState(data?.posId)
  const [slotId] = useState(data?.slotId)
  //Redux Store
  const dispatch = useDispatch()
  const {role} = useSelector(state => state.Auth)
  //Appointment API CALLING
  useEffect(() => {
    if (doctor) {
      // dispatch(getAnAppointmentById(appointmentId, posId, slotId, false));
    }
  }, [])

  //Start Video session
  const onStartVidoeCall = () => {
    dispatch(createVideoCall(appointmentId, navigation, true, patientDetail))
  }

  return (
    <View>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle='light-content'
        translucent={true}
      />
      <LinearGradient
        colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={[
          styles.headerGradienCont,
          styles.borderShadow,
          styles.height(170),
        ]}>
        <Header
          containerStyle={[styles.headerContainer]}
          //////////////////////Left//////////////////////////
          leftComponent={
            <TouchableWithoutFeedback
              style={[styles.pmr10]}
              hitSlop={styles.hitSlop}
              onPress={() => leftRoute()}>
              <View
                style={[styles.justifyContent, styles.alignItems('center')]}>
                <View style={[styles.flexRow, styles.top(3)]}>
                  {I18nManager.isRTL ? (
                    <Icon name='chevron-right' color={colors.white} />
                  ) : (
                    <Icon name='chevron-left' color={colors.white} />
                  )}
                  <Text
                    style={[styles.headerLeftText, styles.color(colors.white)]}>
                    {showLeftText}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          }
          ///////////////////////Center/////////////////////////
          centerComponent={
            <View style={[styles.justifyContent, styles.alignItems('center')]}>
              {showCenterText && (
                <Text
                  style={[
                    styles.title,
                    styles.color(colors.white),
                    styles.PoppinsMedium,
                    styles.pT(5),
                    styles.fontSize(16),
                  ]}>
                  {showCenterText}
                </Text>
              )}
            </View>
          }
          ////////////////////////Right////////////////////////
          rightComponent={
            <TouchableWithoutFeedback
              style={styles.pml10}
              hitSlop={styles.hitSlop}
              onPress={() => rightRoute()}>
              <View
                style={[styles.justifyContent, styles.alignItems('flex-end')]}>
                {showRightIcon && (
                  <View
                    style={[
                      styles.justifyContent,
                      styles.alignItems('flex-end'),
                      styles.width_Percent(65),
                      styles.top(3),
                      styles.flexRow,
                    ]}>
                    {showRightText && (
                      <Text style={[styles.headerRightText]}>
                        {showRightText}
                      </Text>
                    )}
                    {showRightIcon && (
                      <Image
                        source={showRightIcon}
                        resizeMode='contain'
                        style={styles.left(5)}
                      />
                    )}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          }
        />
      </LinearGradient>

      {doctor ? (
        <View style={[styles.editProfileContTopDr]}>
          <View style={styles.flexRow}>
            <View style={[styles.flex(1), styles.alignItemCenter]}>
              {from ? (
                <TouchableOpacity
                  onPress={() => onStartVidoeCall()}
                  // onPress={() => navigation.navigate("DrCall")}
                  style={styles.top(37)}>
                  <Image
                    source={assets.videBlue}
                    borderRadius={100}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={[styles.flex(1), styles.alignItemCenter,styles.mT(10)]}>
              <Image
                style={
                  avatar
                    ? [styles.ProfileEditImg, styles.bw(1.5)]
                    : styles.ProfileEditImg
                }
                source={avatar ? {uri: avatar} : assets.avatar}
                borderRadius={100}
                // resizeMode={'contain'}
              />
            </View>
            <View style={[styles.flex(1), styles.alignItemCenter]}>
              {role === 'provider' ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DrChat', {
                      name: `${patientData?.firstName} ${patientData?.lastName}`,
                      image: patientData?.avatar
                        ? patientData?.avatar
                        : assets.profile?.uri,
                      id: patientData?.id,
                    })
                  }
                  style={styles.top(37)}>
                  <Image
                    source={assets.chatBlue}
                    borderRadius={100}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.editProfileContTop]}>
          <Image
            source={avatar ? {uri: avatar} : assets.avatar}
            style={
              avatar
                ? [styles.ProfileEditImg, styles.bw(1.5)]
                : styles.ProfileEditImg
            }
            borderRadius={100}
          />
        </View>
      )}
    </View>
  )
}
export default ProfileHeader
