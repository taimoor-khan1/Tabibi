import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  FlatList,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Input, Header, Icon } from 'react-native-elements'
import { launchImageLibrary } from 'react-native-image-picker'
import styles from '../../assets/styles'
import { assets } from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { flags } from '../../assets/flags'
import { CountryCodes } from '../../assets/flags/CountryCodes'
import { ButtonGradient } from '../../components'
import LinearGradient from 'react-native-linear-gradient'
import { useSelector, useDispatch } from 'react-redux'
import Utility from '../../config/Utility'
import { drUpdateProfile } from '../../store/actions'

const DrEditProfile = ({ navigation, route }) => {
  //Redux store
  const dispatch = useDispatch()
  const { profile, role } = useSelector(state => state.Auth)
  const [user] = useState(route.params.user)

  const [avatar, setAvatar] = useState('')
  const [avatarImgBase64, setAvatarImgBase64] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [establishmentName, setEstablishmentName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [date, setDate] = useState('')
  const [updateDate, setUpdateDate] = useState(new Date())
  const [showDate, setShowDate] = useState(false)
  const [mobileNo, setMobileNo] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode)
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0])

  // Declare input reference field
  const refLastName = useRef()
  // const refBlood = useRef();
  const refCity = useRef()
  const refAddress = useRef()
  // const refInsurance = useRef();

  // Search flag filter: by country name
  function renderFlagItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setCountryCode(item.phoneCode)
          setSelectedCountry(item)
          setModalVisible(false)
        }}>
        <View style={styles.countryFlagView}>
          <Text style={[styles.fontSize(12)]}>
            <Image source={flags[item.code]} resizeMode='contain' />
            {'  '}
            {item.name}
          </Text>
          <Text style={styles.fontSize(12)}>{item.phoneCode}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  const choosePhoto = type => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: true,
    }
    launchImageLibrary(options, response => {
      // console.log('Response =============> ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        var image0 = `data:${response.type};base64,${response.base64}`
        // console.log(image0);
        setAvatarImgBase64(image0)
        setAvatar(image0)
      }
    })
  }

  useEffect(() => {
    setAvatarImgBase64(profile?.avatar)
    setEmail(profile?.email)
    setAddress(profile?.address)
    setDate(profile?.dob)
    var code = profile?.mobileNumber.split(' ', 2)
    setMobileNo(code[1])
    CountryCodes.map(country => {
      if (country.phoneCode === code[0]) {
        setSelectedCountry(country)
      }
    })
    role === 'provider'
      ? (setFname(profile?.firstName), setLname(profile?.lastName))
      : setEstablishmentName(profile?.name)
  }, [profile])

  const savePressed = () => {
    const params = {
      firstName: fname.trim(),
      lastName: lname.trim(),
      name: establishmentName.trim(),
      address: address,
      mobileNumber: user.mobileNumber,
      from: role,
    }
    avatar && avatar ? (params['avatar'] = avatar) : '',
      date && date ? (params['dob'] = date) : '',
      role === 'provider'
        ? Utility.updateProfileDr(params, navigation, drUpdateProfile, dispatch)
        : dispatch(drUpdateProfile(params, navigation))
  }

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          style={styles.backgroundColor(colors.themeWhite)}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <View style={styles.height(240)}>
            <LinearGradient
              colors={[colors.btngr1, colors.btngr2, colors.btngr3]}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.headerGradienCont,
                // styles.borderShadow,
                styles.height(170),
              ]}>
              <Header
                containerStyle={[styles.headerContainer]}
                //////////////////////Left//////////////////////////
                leftComponent={
                  <TouchableWithoutFeedback
                    style={[styles.pmr10]}
                    hitSlop={styles.hitSlop}
                    onPress={() => navigation.goBack()}>
                    <View
                      style={[
                        styles.justifyContent,
                        styles.alignItems('center'),
                      ]}>
                      <View style={[styles.flexRow]}>
                        {I18nManager.isRTL ? (
                          <Icon name='chevron-right' color={colors.white} />
                        ) : (
                          <Icon name='chevron-left' color={colors.white} />
                        )}
                        <Text
                          style={[
                            styles.headerLeftText,
                            styles.color(colors.white),
                          ]}>
                          {labels.back}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                }
                ///////////////////////Center/////////////////////////
                centerComponent={
                  <View
                    style={[
                      styles.justifyContent,
                      styles.alignItems('center'),
                    ]}>
                    <Text
                      style={[
                        styles.title,
                        styles.color(colors.white),
                        styles.PoppinsMedium,
                        styles.pT(5),
                        styles.fontSize(16),
                      ]}>
                      {labels.profile}
                    </Text>
                  </View>
                }
              />
            </LinearGradient>
            <View style={[styles.editProfileContTop]}>
              <Image
                source={
                  avatarImgBase64 ? { uri: avatarImgBase64 } : assets.avatar
                }
                borderRadius={120 / 2}
                style={
                  avatarImgBase64
                    ? [styles.ProfileEditImg, styles.bw(1.5)]
                    : [styles.ProfileEditImg]
                }
              />
              <TouchableOpacity
                onPress={() => choosePhoto('front')}
                style={styles.pencilCont}>
                <Image source={assets.UplaodProfile} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.height(10)]} />
          <View style={[styles.mH(30)]}>
            <View style={[styles.height(20)]} />
            {role === 'provider' ? (
              <>
                <Input
                  inputContainerStyle={[
                    styles.inputContainer,
                    styles.borderShadow,
                  ]}
                  containerStyle={[styles.pH(0), styles.height(65)]}
                  placeholder={labels.name}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  inputStyle={[styles.inputStyle]}
                  selectionColor={colors.green}
                  keyboardType='email-address'
                  importantForAutofill='no'
                  selectTextOnFocus={false}
                  returnKeyType='next'
                  autoCapitalize='none'
                  onChangeText={text => setFname(text)}
                  value={fname}
                  onSubmitEditing={() => {
                    refLastName.current.focus()
                  }}
                />
                <Input
                  ref={refLastName}
                  inputContainerStyle={[
                    styles.inputContainer,
                    styles.borderShadow,
                  ]}
                  containerStyle={[styles.pH(0), styles.height(65)]}
                  placeholder={labels.lname}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  inputStyle={[styles.inputStyle]}
                  selectionColor={colors.green}
                  keyboardType='email-address'
                  importantForAutofill='no'
                  selectTextOnFocus={false}
                  returnKeyType='next'
                  autoCapitalize='none'
                  onChangeText={text => setLname(text)}
                  value={lname}
                  onSubmitEditing={() => {
                    setModalVisible(true)
                  }}
                />
              </>
            ) : (
              <Input
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.establish1}
                placeholderTextColor={colors.text}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                inputStyle={[styles.inputStyle]}
                selectionColor={colors.green}
                keyboardType='email-address'
                importantForAutofill='no'
                selectTextOnFocus={false}
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text => setEstablishmentName(text)}
                value={establishmentName}
                disabled={true}
                onSubmitEditing={() => {
                  refEmail.current.focus()
                }}
              />
            )}
            {role === 'provider' && (
              <View style={[styles.countryFeildCont]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.dropDown, styles.flex(1)]}
                  onPress={() => {
                    setShowDate(!showDate)
                  }}>
                  <View style={[styles.flexRow]}>
                    <View style={[styles.leftFeild]}>
                      <Text style={[styles.fontSize(14), styles.mL(20)]}>
                        {date != '' ? moment(date).format('LL') : labels.dob}
                      </Text>
                    </View>
                    <View style={[styles.rightArrowDown]}>
                      <Icon
                        name={showDate ? 'chevron-up' : 'chevron-down'}
                        color={colors.heading}
                        type='evilicon'
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {showDate && (
              <>
                <DatePicker
                  date={updateDate}
                  mode={'date'}
                  maximumDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 17),
                    )
                  }
                  minimumDate={new Date(1950, 1, 1)}
                  onDateChange={e => {
                    setDate(e)
                    setUpdateDate(e)
                    setShowDate(!showDate)
                  }}
                  style={[
                    styles.pickerCont,
                    styles.backgroundColor('white'),
                    styles.mB(10),
                  ]}
                />
              </>
            )}
            <View style={[styles.mobileFeildCont1]}>
              <View style={[styles.flex(0.3), styles.mR(10), styles.height(55)]}>
                <TouchableOpacity
                  disabled
                  activeOpacity={0.7}
                  style={[styles.dropDown]}
                  onPress={() => {
                    setModalVisible(true)
                  }}>
                  <View style={styles.flexRow}>
                    <Text style={[styles.dropDownText]}>
                      {selectedCountry.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.fontSize(14),
                        styles.mL(4),
                        styles.color(colors.darkGrey),
                      ]}>
                      {selectedCountry.phoneCode}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.flex(0.7), styles.height(65)]}>
                <Input
                  inputContainerStyle={[
                    [styles.inputContainer, styles.borderShadow],
                  ]}
                  containerStyle={[styles.pH(0)]}
                  placeholder={labels.Mobile}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  inputStyle={[styles.inputStyle]}
                  selectionColor={colors.green}
                  maxLength={10}
                  keyboardType='phone-pad'
                  importantForAutofill='no'
                  selectTextOnFocus={false}
                  returnKeyType='next'
                  autoCapitalize='none'
                  onChangeText={text =>
                    setMobileNo(text.replace(/[^0-9]/g, ''))
                  }
                  value={mobileNo}
                  disabled={true}
                  onSubmitEditing={() => {
                    refCity.current.focus()
                  }}
                />
              </View>
            </View>
            <Modal
              animationType='slide'
              transparent={false}
              onRequestClose={() => setModalVisible(false)}
              visible={modalVisible}>
              <View style={styles.mT(22)}>
                <FlatList
                  data={CountryCodes}
                  renderItem={renderFlagItem}
                  keyExtractor={item => item.code}
                />
              </View>
            </Modal>
            <Input
              ref={refCity}
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(0), styles.height(65)]}
              placeholder={labels.email}
              placeholderTextColor={colors.text}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              inputStyle={styles.inputStyle}
              selectionColor={colors.green}
              keyboardType='default'
              importantForAutofill='no'
              selectTextOnFocus={false}
              returnKeyType='done'
              autoCapitalize='none'
              onChangeText={text => setEmail(text)}
              disabled={true}
              value={email}
              onSubmitEditing={() => {
                refAddress.current.focus()
              }}
            />
            <Input
              ref={refAddress}
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(0), styles.height(65)]}
              placeholder={labels.address}
              placeholderTextColor={colors.text}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              inputStyle={styles.inputStyle}
              selectionColor={colors.green}
              keyboardType='default'
              importantForAutofill='no'
              selectTextOnFocus={false}
              returnKeyType='done'
              autoCapitalize='none'
              onChangeText={text => setAddress(text)}
              value={address}
              onSubmitEditing={() => {
                savePressed()
              }}
            />
            <ButtonGradient
              title={labels.save}
              type={false}
              gradient={true}
              onBtnPress={() => savePressed()}
            />
          </View>
        </ScrollView>
        {/* <Image
        source={assets.bottom_image}
        style={[styles.bottomImg]}
      /> */}
      </KeyboardAvoidingView>
    </View>
  )
}

export default DrEditProfile
