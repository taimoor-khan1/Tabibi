import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {ProfileHeader, ProgressBar, ButtonGradient} from '../../components'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {getProfile} from '../../store/actions'
import {FlatList} from 'react-native-gesture-handler'

const MyProfile = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch()
  const {user, profile} = useSelector(state => state.Auth)

  // Declare state variables'
  const [avatar, setAvatar] = useState('')
  const [patientName, setPatientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [address, setAddress] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [insurance, setInsurance] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [groupNumber, setGroupNumber] = useState('')
  const [dob, setDob] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [frontImg, setFrontImg] = useState(false)
  const [backImg, setBackImg] = useState(false)
  const [documents, setDocuments] = useState([])
  const [barWidth, setBarWidth] = useState(0)
  const [modalVisible, seModalVisible] = useState(false)
  const [image, setImage] = useState('')

  // Action for get my profile
  useEffect(() => {
    const params = {
      user_id: user.userId,
    }
    dispatch(getProfile(params))
  }, [])

  //Action for set profile data
  useEffect(() => {
    setAvatar(profile?.avatar)
    setPatientName(profile?.firstName + ' ' + profile?.lastName)
    setPhoneNumber(profile?.phoneNumber)
    setEmail(profile?.email)
    setGender(profile?.gender)
    setAddress(profile?.address)
    setBloodGroup(profile?.bloodGroup)
    setInsurance(profile?.insuranceDetail)
    setCardNumber(profile?.cardNumber)
    setGroupNumber(profile?.groupNumber)
    setDob(profile?.dob)
    setCity(profile?.city)
    setCountry(profile?.country)
    setHeight(profile?.height)
    setWeight(profile?.weight)
    setFrontImg(profile?.insuranceCardFront)
    setBackImg(profile?.insuranceCardBack)
    setDocuments(
      profile?.medicalDocument?.length ? profile?.medicalDocument : [],
    )
    setCompletedBar()
  }, [profile])

  // PROGRESS BAR COMPLETEION FUNCTION
  const setCompletedBar = async () => {
    const allowedFields = [
      'avatar',
      'firstName',
      'phoneNumber',
      'cardNumber',
      'groupNumber',
      'insuranceDetail',
      'email',
      'gender',
      'address',
      'bloodGroup',
      'height',
      'weight',
      'insuranceCardFront',
      'insuranceCardBack',
    ]
    let count = 0
    for (let i = 0; i < allowedFields.length; i++) {
      if (profile[allowedFields[i]]) {
        count += 1
      }
    }
    setBarWidth(Math.round((count / allowedFields.length) * 100))
  }

  //Fuctions
  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <ProfileHeader
          showLeftIcon={true}
          showRightIcon={assets.editPencile}
          showCenterText={labels.profile}
          showLeftText={labels.back}
          showRightText={labels.edit}
          avatar={avatar && avatar}
          leftRoute={() => navigation.goBack()}
          rightRoute={() =>
            navigation.navigate('EditProfile', {
              user: profile,
            })
          }
        />
        <View style={[styles.height(70)]} />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <Text
          style={[
            styles.textSemiBold,
            styles.fontSize(19),
            styles.textAlign,
            {textTransform: 'capitalize'},
          ]}
          numberOfLines={1}
          ellipsizeMode='tail'>
          {patientName}
        </Text>
        <View style={styles.mH(25)}>
          <View style={[styles.imageRow]}>
            <Image source={assets.call} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {`${phoneNumber}`}
            </Text>
          </View>
          <View style={[styles.imageRow]}>
            <Image source={assets.email} style={styles.mR(4)} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {email}
            </Text>
          </View>
          <View style={[styles.imageRow]}>
            <Image source={assets.locationPin} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {`${address ? address : labels.notFound}`}
            </Text>
          </View>
          {city && country ? (
            <View style={[styles.imageRow]}>
              <Text
                style={[styles.textR]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {`${city}, ${country}`}
              </Text>
            </View>
          ) : null}
          <ProgressBar percent={`${barWidth.toFixed(2)}%`} color={'#fff'} />
          <View style={styles.profileContBottom}>
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.height +
                ': ' +
                (height ? `${height} ft` : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.weight +
                ': ' +
                (weight ? `${weight} kg` : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.dateOB +
                (dob ? moment(dob).format('DD MMM YYYY') : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.blood +
                ': ' +
                (bloodGroup ? bloodGroup : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.gender + (gender ? gender : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.InsuranceCompany +
                (insurance ? insurance : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.cardNo +
                ': ' +
                (cardNumber ? cardNumber : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.groupNo +
                ': ' +
                (groupNumber ? groupNumber : labels.notFound)}
            </Text>
            <View style={[styles.spacer, styles.mT(10)]} />
            <Text style={[styles.profileText, styles.mT(10)]}>
              {labels.backFront}
            </Text>
            <View style={styles.flexRow}>
              <View style={[styles.flex(0.5)]}>
                <TouchableOpacity
                  onPress={() => {
                    setImage(frontImg)
                    seModalVisible(true)
                  }}>
                  <Image
                    source={frontImg ? {uri: frontImg} : assets.dummy}
                    style={styles.insImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.flex(0.5)]}>
                <TouchableOpacity
                  onPress={() => {
                    setImage(backImg)
                    seModalVisible(true)
                  }}>
                  <Image
                    source={backImg ? {uri: backImg} : assets.dummy}
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
              data={profile?.medicalDocument}
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
                      {/* <Image source={assets.cross} /> */}
                      <View style={[styles.flex(0.9)]}>
                        <TouchableOpacity
                          onPress={() =>
                            item?.location
                              ? Linking.openURL(item?.location)
                              : showToast()
                          }>
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
            <ButtonGradient
              title={labels.changePwd}
              type={false}
              arrow={true}
              onBtnPress={() => navigation.navigate('ChangePassword')}
            />
            <ButtonGradient
              title={labels.payment}
              type={false}
              arrow={true}
              onBtnPress={() =>
                navigation.navigate('CreditCard', {from: true, push: false})
              }
            />
            <ButtonGradient
              title={labels.lovedOnes}
              type={false}
              arrow={true}
              onBtnPress={() => navigation.navigate('LovedOne', {from: false})}
            />
          </View>
        </View>
      </ScrollView>

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
    </>
  )
}

export default MyProfile
