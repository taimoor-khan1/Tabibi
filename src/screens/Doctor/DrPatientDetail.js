import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Linking,
  ImageBackground,
} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {ProfileHeader, ButtonGradient} from '../../components'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {getPatientDetailById, blockUser} from '../../store/actions'
import fonts from '../../assets/fonts'

const DrPatientDetail = ({navigation, route}) => {
  // console.log(route?.params)
  //REDUX STORE
  const dispatch = useDispatch()
  const {role, profile, estDoc} = useSelector(state => state.Auth)
  const {patientDetail} = useSelector(state => state.Doctor)

  // Declare state variables'
  const [data] = useState(route?.params?.data)
  const [patientId] = useState(route?.params?.id)
  const [modalVisible, seModalVisible] = useState(false)
  const [image, setImage] = useState('')
  const [blockStatus, setBlockStatus] = useState(Boolean)
  const [blockedUser, setBlockedUser] = useState([])
  // GET Patient Profile Detail API
  useEffect(() => {
    const payload = {
      id: patientId,
      from: role,
    }
    dispatch(getPatientDetailById(payload, true))
  }, [])
  //Fuctions

  useEffect(() => {
    // if (patientDetail?.blocked) {
    var blockList = patientDetail?.blocked
    var blockedUsers = blockList
      ?.filter(i => i.providerId === profile?.userId)
      ?.map((item, index) => {
        return item?.providerId
      })
    // console.log(blockedUsers, 'blockedUserExist');
    if (blockedUsers?.length > 0) {
      setBlockStatus(true)
    }
    setBlockedUser(blockedUsers)
    // }
  }, [patientDetail?.blocked, patientDetail])
  const showToast = () => {
    Snackbar.show({
      text: labels.URLnotFount,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.red,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
    })
  }

  const onblockUser = () => {
    const payload = {
      patientId: patientId,
      providerId: profile?.userId,
    }
    console.log(payload)
    dispatch(blockUser(payload, true)).then(res => {
      if (res === 200) {
        const payload = {
          id: patientId,
          from: role,
        }
        dispatch(getPatientDetailById(payload, true))
      }
    })
  }
  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <ProfileHeader
          navigation={navigation}
          showLeftIcon={true}
          // showRightIcon={assets.scheduleIcon}
          showCenterText={labels.patientDetail}
          showLeftText={labels.back}
          doctor={true}
          avatar={patientDetail?.avatar && patientDetail?.avatar}
          leftRoute={() => navigation.goBack()}
          rightRoute={() => navigation.navigate('')}
          data={data}
          patientData={patientDetail}
          from={route?.params?.from}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <Text
          style={[
            styles.textSemiBold,
            styles.fontSize(19),
            styles.textAlign,
            styles.mT(5),
          ]}
          numberOfLines={1}
          ellipsizeMode='tail'>
          {patientDetail?.name}
          {patientDetail?.name && (
            <Text
              style={[
                styles.textR,
                styles.mL(5),
                blockedUser?.length > 0
                  ? styles.color(colors.red)
                  : styles.color(colors.green1),
              ]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {blockedUser?.length > 0 ? ' (Blocked)' : ' (Active)'}
            </Text>
          )}
        </Text>
        <View style={styles.mH(25)}>
          <View style={[styles.imageRow]}>
            <Image source={assets.call} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {patientDetail?.phoneNumber}
            </Text>
          </View>
          <View style={[styles.imageRow]}>
            <Image source={assets.email} style={styles.mR(4)} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {patientDetail?.email}
            </Text>
          </View>
          <View style={[styles.imageRow]}>
            <Image source={assets.locationPin} style={styles.mR(4)} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {`${
                patientDetail?.address
                  ? patientDetail?.address
                  : labels.notFound
              }`}
            </Text>
          </View>
          {patientDetail?.city && patientDetail?.country ? (
            <View style={[styles.imageRow]}>
              <Text
                style={[styles.textR]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {`${patientDetail?.city}, ${patientDetail?.country}`}
              </Text>
            </View>
          ) : null}
          <View style={styles.profileContBottom}>
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.height +
                ': ' +
                (patientDetail?.height
                  ? `${patientDetail?.height} ft`
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.weight +
                ': ' +
                (patientDetail?.weight
                  ? `${patientDetail?.weight} kg`
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.dateOB +
                (patientDetail?.dob
                  ? moment(patientDetail?.dob).format('DD MMM YYYY')
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.blood +
                ': ' +
                (patientDetail?.bloodGroup
                  ? patientDetail?.bloodGroup
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.gender +
                (patientDetail?.gender
                  ? patientDetail?.gender
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.InsuranceCompany +
                (patientDetail?.insurance
                  ? patientDetail?.insurance
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.cardNo +
                ': ' +
                (patientDetail?.cardNumber
                  ? patientDetail?.cardNumber
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.groupNo +
                ': ' +
                (patientDetail?.groupNumber
                  ? patientDetail?.groupNumber
                  : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.backFront}
            </Text>
            <View style={styles.flexRow}>
              <View style={[styles.flex(0.5)]}>
                <TouchableOpacity
                  onPress={() => {
                    setImage(patientDetail?.insuranceCardFront)
                    seModalVisible(true)
                  }}>
                  <Image
                    source={
                      patientDetail?.insuranceCardFront
                        ? {uri: patientDetail?.insuranceCardFront}
                        : assets.dummy
                    }
                    style={styles.insImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.flex(0.5)]}>
                <TouchableOpacity
                  onPress={() => {
                    setImage(patientDetail?.insuranceCardBack)
                    seModalVisible(true)
                  }}>
                  <Image
                    source={
                      patientDetail?.insuranceCardBack
                        ? {uri: patientDetail?.insuranceCardBack}
                        : assets.dummy
                    }
                    style={[styles.insImg, styles.mL(2)]}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.spacer, styles.mV(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.MedicalDocument}
            </Text>
            <FlatList
              ListEmptyComponent={
                <Text
                  style={[
                    styles.paragraph,
                    styles.textAlign,
                    styles.fontSize(14),
                  ]}>
                  {labels.notFound}
                </Text>
              }
              data={patientDetail?.medicalDocument}
              keyExtractor={item => item.name}
              renderItem={({item}) => {
                return (
                  <View style={styles.mT(10)}>
                    <View
                      style={[
                        styles.mH(5),
                        styles.mB(5),
                        styles.flexRow,
                        styles.alignItemCenter,
                        styles.padding(10),
                        styles.backgroundColor(colors.white),
                        styles.bR(10),
                        styles.shadowbb,
                      ]}>
                      <View style={[styles.flex(0.9)]}>
                        <TouchableOpacity
                          onPress={() =>
                            item?.location
                              ? Linking.openURL(item?.location)
                              : showToast()
                          }
                          activeOpacity={0.7}>
                          <Text
                            ellipsizeMode='middle'
                            numberOfLines={1}
                            style={[styles.fontPoppinsRegularBlack14]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              }}
            />
            <View style={[styles.spacer, styles.mV(10)]} />
            {role === 'provider' && (
              <>
                <ButtonGradient
                  title={labels.chatHistory}
                  type={false}
                  arrow={true}
                  gradient={true}
                  onBtnPress={() =>
                    navigation.navigate('DrChat', {
                      name: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
                      image: patientDetail?.avatar
                        ? patientDetail?.avatar
                        : assets.profile?.uri,
                      id: patientDetail?.id,
                    })
                  }
                />

                <ButtonGradient
                  title={labels.prescriptionDetail}
                  type={false}
                  arrow={true}
                  gradient={true}
                  onBtnPress={() =>
                    navigation.navigate('DrPrescription', {
                      id: patientDetail?.id,
                    })
                  }
                />
                <ButtonGradient
                  title={labels.prescribeDrug}
                  type={false}
                  arrow={true}
                  gradient={true}
                  onBtnPress={() =>
                    navigation.navigate('DrAddPrescription', {
                      id: patientDetail?.id,
                    })
                  }
                />
                <ButtonGradient
                  title={
                    blockedUser?.length > 0
                      ? labels.unblockUser
                      : labels.blockUser
                  }
                  type={false}
                  disabled={true}
                  gradient={true}
                  cancel={true}
                  onBtnPress={() => onblockUser()}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.mH(0), styles.bottom(0)]}>
        <ButtonGradient
          gradient={true}
          bottom={true}
          title={labels.bookAnAppointment}
          onBtnPress={() =>
            navigation.navigate('DrWalkinAppoinment', {
              from: 'patientDetail',
              data: patientDetail,
              posId: null,
              slotId: null,
              start: null,
              end: null,
              title: null,
              date: null,
            })
          }
        />

        {/* MODAL FOR IMAGE ZOOM IN */}
        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => seModalVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.imageModalView}>
              <ImageBackground
                source={{uri: image}}
                resizeMode='contain'
                style={[styles.fullView, styles.flex(1)]}>
                <TouchableOpacity
                  style={styles.imageCross}
                  onPress={() => seModalVisible(false)}>
                  <Image source={assets.cross} />
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
}

export default DrPatientDetail
