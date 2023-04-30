import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal as RNModal,
  Platform,
  FlatList,
  I18nManager,
  KeyboardAvoidingView,
} from 'react-native'
import {Icon, Input} from 'react-native-elements'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {GreadientHeader, ModalMap, ButtonGradient} from '../../components'
import {useDispatch, useSelector} from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Toast from 'react-native-simple-toast'
import {
  drAddLocationDetail,
  getAllLocations,
  deleteLocation,
  getDetail,
} from '../../store/actions'
import {flags} from '../../assets/flags'
import {CountryCodes} from '../../assets/flags/CountryCodes'
import Snackbar from 'react-native-snackbar'
import fonts from '../../assets/fonts'

const DrAddLocation = ({navigation}) => {
  // REDUX STORE
  const dispatch = useDispatch()
  const {profile, role} = useSelector(state => state.Auth)
  const {getProfileDetail, getlocation} = useSelector(state => state.Doctor)

  // Declare state variables'
  const [streetAddress, setStreetAddress] = useState('')
  const [streetAddress2, setStreetAddress2] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipCode] = useState('')
  const [phone, setPhone] = useState('')
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [location, setLocation] = useState([])
  const [locations, setLocations] = useState([])
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode)
  const [countryCodes, setCountryCodes] = useState(CountryCodes)
  const [phoneCodeList] = useState(CountryCodes)
  const [searchFlag, setSearchFlag] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0])

  // Declare input reference field
  const refStreet2 = useRef()
  const refCity = useRef()
  const refZip = useRef()
  const refPhone = useRef()

  // GET USER PROFILE DATA
  useEffect(() => {
    dispatch(getAllLocations(true))
  }, [])

  useEffect(() => {
    setCity(profile?.city)
    var code = profile?.mobileNumber.split(' ', 2)
    setPhone(code[1])
    CountryCodes.map(country => {
      if (country.phoneCode === code[0]) {
        setSelectedCountry(country)
      }
    })
  }, [profile])
  //SET PROFILE DETAILS DATA
  useEffect(() => {
    setLocations(getlocation.length ? getlocation : [])
  }, [getlocation])

  // Check empty feilds
  const checkFeild = () => {
    var validation = `${
      !streetAddress.trim()
        ? labels.validStreet
        : !city.trim()
        ? labels.validationCity
        : !zipcode.trim()
        ? labels.validPostalcode
        : !phone.trim()
        ? labels.validPhone
        : phone.length < 7
        ? labels.invalidMobileNumber
        : lat === 0 && long === 0
        ? labels.pinpoint
        : true
    }`
    if (validation === 'true') {
      setLocations([
        ...locations,
        {
          address: streetAddress,
          addressTwo: streetAddress2,
          latitude: lat,
          longitude: long,
          phoneNumber: `${countryCode} ${phone}`,
          city: city,
          zipCode: zipcode,
        },
      ])
      if (location.length) {
        setLocation([
          ...location,
          {
            address: streetAddress,
            addressTwo: streetAddress2,
            latitude: lat,
            longitude: long,
            phoneNumber: `${countryCode} ${phone}`,
            city: city,
            zipCode: zipcode,
          },
        ])
      } else {
        setLocation([
          {
            address: streetAddress,
            addressTwo: streetAddress2,
            latitude: lat,
            longitude: long,
            phoneNumber: `${countryCode} ${phone}`,
            city: city,
            zipCode: zipcode,
          },
        ])
      }
      Snackbar.show({
        text: labels.locationSucess,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      })
      clearfeild()
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      })
    }
  }
  // clear feilds
  const clearfeild = () => {
    setStreetAddress('')
    setStreetAddress2('')
    setCity('')
    setPhone('')
    setZipCode('')
    setLat('')
    setLong('')
  }
  // Search flag filter: by country name
  const searchFlagFilter = text => {
    const newData = phoneCodeList.filter(item => {
      const itemData = item.name.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    setCountryCodes(newData)
  }

  function renderFlagItem ({item}) {
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

  //On Press Save
  const onSave = () => {
    if (locations.length) {
      const payload = {
        locations: location,
      }
      console.log(payload)
      dispatch(drAddLocationDetail(payload)).then(res => {
        if (res === 200) {
          dispatch(getAllLocations())
          dispatch(getDetail({from: role}))
          navigation.goBack()
        }
      })
    } else {
      Snackbar.show({
        text: 'Please add atleast 1 location',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      })
    }
  }

  //On Delete
  const onDelete = id => {
    // console.log(id);
    dispatch(deleteLocation({id}, true)).then(res => {
      if (res === 200) {
        dispatch(getAllLocations(true))
        dispatch(getDetail({from: role}))
      }
    })
  }
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.addLocation}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <KeyboardAvoidingView
          style={styles.flex(1)}
          behavior={Platform.OS == 'ios' && 'padding'}>
          <ScrollView
            bounces={false}
            style={styles.backgroundColor(colors.themeWhite)}
            showsVerticalScrollIndicator={false}>
            <View style={styles.height(15)} />
            <View style={{width: '90%', alignSelf: 'center'}}>
              <ModalMap
                mapHeight={190}
                markerPostion={e => {
                  setLat(e.latitude)
                  setLong(e.longitude)
                }}
              />
            </View>
            <View style={styles.height(20)} />
            <View style={styles.mH(15)}>
              <Input
                inputContainerStyle={[
                  styles.popupLocContainer,
                  styles.shadowbb,
                ]}
                placeholder={labels.street}
                containerStyle={[styles.pH(0), styles.mV(-6)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType='default'
                importantForAutofill='no'
                selectTextOnFocus={false}
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text =>
                  setStreetAddress(text.replace(/[^a-zA-Z0-9\s\.]/g, ''))
                }
                onSubmitEditing={() => {
                  refStreet2.current.focus()
                }}
                value={streetAddress}
              />
              <Input
                ref={refStreet2}
                inputContainerStyle={[
                  styles.popupLocContainer,
                  styles.shadowbb,
                ]}
                placeholder={labels.street2}
                containerStyle={[styles.pH(0), styles.mV(-6)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType='default'
                importantForAutofill='no'
                selectTextOnFocus={false}
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text =>
                  setStreetAddress2(text.replace(/[^a-zA-Z0-9\s\.]/g, ''))
                }
                onSubmitEditing={() => {
                  refCity.current.focus()
                }}
                value={streetAddress2}
              />
              <Input
                ref={refCity}
                inputContainerStyle={[
                  styles.popupLocContainer,
                  styles.shadowbb,
                ]}
                placeholder={labels.City}
                containerStyle={[styles.pH(0), styles.mV(-6)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType='default'
                importantForAutofill='no'
                selectTextOnFocus={false}
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text =>
                  setCity(text.replace(/[^a-zA-Z0-9\s\.]/g, ''))
                }
                onSubmitEditing={() => {
                  refZip.current.focus()
                }}
                value={city}
              />
              <Input
                ref={refZip}
                inputContainerStyle={[
                  styles.popupLocContainer,
                  styles.shadowbb,
                ]}
                placeholder={labels.zipcode}
                containerStyle={[styles.pH(0), styles.mV(-6)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                maxLength={12}

                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType='number-pad'
                importantForAutofill='no'
                selectTextOnFocus={false}
                returnKeyType='next'
                autoCapitalize='none'
                onChangeText={text => setZipCode(text.replace(/[^0-9]/g, ''))}
                onSubmitEditing={() => {
                  refPhone.current.focus()
                }}
                value={zipcode}
              />
              <View
                style={[
                  styles.mobileFeildCont,
                  {width: '90%', alignSelf: 'center'},
                ]}>
                <View style={[styles.flex(0.33)]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.dropDownLoc]}
                    onPress={() => {
                      setModalVisible(true)
                    }}>
                    <View style={styles.flexRow}>
                      <Text style={styles.dropDownText}>
                        {selectedCountry.emoji}
                      </Text>
                      <Text style={[styles.fontSize(14), styles.mL(4)]}>
                        {selectedCountry.phoneCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex(0.8), styles.height(45)]}>
                  <Input
                    ref={refPhone}
                    inputContainerStyle={[
                      styles.popupLocContainer,
                      styles.shadowbb,
                    ]}
                    placeholder={labels.phoneNumber}
                    containerStyle={[styles.pH(0), styles.mV(-6)]}
                    placeholderTextColor={colors.text}
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    maxLength={10}
                    inputStyle={styles.inputStyle}
                    selectionColor={colors.green}
                    keyboardType='phone-pad'
                    importantForAutofill='no'
                    selectTextOnFocus={false}
                    returnKeyType='done'
                    autoCapitalize='none'
                    onChangeText={text =>
                      setPhone(text.replace(/[^0-9\.]/g, ''))
                    }
                    value={phone}
                  />
                </View>
              </View>
              <RNModal
                animationType='slide'
                transparent={false}
                visible={modalVisible}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[
                    styles.flexRow,
                    {
                      ...(Platform.OS === 'ios'
                        ? styles.mT(40)
                        : styles.margin(10)),
                    },
                  ]}>
                  {I18nManager.isRTL ? (
                    <Icon
                      name='chevron-right'
                      color={colors.heading}
                      style={styles.mT(5)}
                    />
                  ) : (
                    <Icon
                      name='chevron-left'
                      color={colors.heading}
                      style={styles.mT(5)}
                    />
                  )}
                  <Text style={[styles.mV(8), styles.color(colors.heading)]}>
                    {labels.back}
                  </Text>
                </TouchableOpacity>
                <Input
                  inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
                  placeholder={labels.search}
                  inputStyle={[styles.inputStyle]}
                  autoCapitalize='none'
                  returnKeyType='search'
                  value={searchFlag}
                  onChangeText={text => {
                    setSearchFlag(text)
                    searchFlagFilter(text)
                  }}
                />
                <View style={styles.mT(0)}>
                  <FlatList
                    data={countryCodes}
                    renderItem={renderFlagItem}
                    keyExtractor={item => item.code}
                  />
                </View>
              </RNModal>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => checkFeild()}
                style={{
                  width: 40,
                  alignSelf: 'flex-end',
                  marginRight: 20,
                  marginBottom: 10,
                }}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.containerCenter, styles.gradientAddIcon]}
                  colors={[colors.btngr3, colors.btngr2, colors.btngr1]}>
                  <Image source={assets.addWhite} />
                </LinearGradient>
              </TouchableOpacity>
              {locations?.map(data => {
                return (
                  <>
                    <View
                      style={[
                        styles.languageContainer,
                        styles.flexRow,
                        styles.backgroundColor(colors.white),
                        styles.mB(0),
                      ]}>
                      <View style={[styles.flex(0.1)]}>
                        <Text
                          style={[
                            styles.h2,
                            styles.color(colors.themeColor),
                            styles.mL(10),
                          ]}>
                          {'•'}
                        </Text>
                      </View>
                      <View style={styles.flex(0.8)}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode={'tail'}
                          style={[
                            styles.h3,
                            styles.color(colors.black),
                            styles.textAlignLeft,
                            styles.mL(0),
                          ]}>
                          {data.address}
                        </Text>
                      </View>
                      <View style={[styles.flex(0.1), styles.mL(5)]}>
                        <TouchableOpacity
                          hitSlop={styles.hitSlop}
                          style={[styles.mR(0)]}
                          onPress={() => {
                            if (data?.id) {
                              onDelete(data?.id)
                              clearfeild()
                            } else {
                              var filtered = locations.filter((item, index) => {
                                return item?.id !== data.id
                              })
                              setLocations(filtered)
                              clearfeild()
                            }
                          }}>
                          <Image source={assets.closeRed} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.mV(10)]} />
                  </>
                )
              })}
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => onSave()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default DrAddLocation
