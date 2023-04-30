import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal as RNModal,
  FlatList,
  PermissionsAndroid,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Input, Icon } from 'react-native-elements'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'
import styles from '../../assets/styles'
import { assets } from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import { flags } from '../../assets/flags'
import moment from 'moment'
import Toast from 'react-native-simple-toast'
import ReactNativeModal from 'react-native-modal'
import Modal from 'react-native-modalbox'
import { CountryCodes } from '../../assets/flags/CountryCodes'
import { ButtonGradient, Button, GreadientHeader } from '../../components'
import DatePicker from 'react-native-date-picker'
import { addWalkInPateints } from '../../store/actions'
import DrUtility from '../../config/DrUtility'
import { useDispatch, useSelector } from 'react-redux'

const DrAddPatient = ({ navigation, route }) => {
  // STORE
  const dispatch = useDispatch()
  const { uploadDocLoading, user } = useSelector(state => state.Auth)

  // Declare state variables
  const [documents, setDocuments] = useState([])
  const [cameraPerm, setCameraPerm] = useState(false)
  const [uploadDocSelection, setUploadDocSelection] = useState('')
  const [avatar, setAvatar] = useState('')
  const [avatarImgBase64, setAvatarImgBase64] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [updateDate, setUpdateDate] = useState(new Date())
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [insuranceDetail, setInsuranceDetail] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [groupNo, setGroupNo] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode)
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0])
  const [countryCodes, setCountryCodes] = useState(CountryCodes)
  const [phoneCodeList] = useState(CountryCodes)
  const [searchFlag, setSearchFlag] = useState('')
  const [countriesData] = useState([CountryCodes[0].name])
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('')
  const [bloodGroupPopup, setBloodGroupPopup] = useState(false)
  const [bloodGroups] = useState([
    { id: 0, group: 'A+' },
    { id: 1, group: 'A-' },
    { id: 2, group: 'B+' },
    { id: 3, group: 'B-' },
    { id: 4, group: 'O+' },
    { id: 5, group: 'O-' },
    { id: 6, group: 'AB+' },
    { id: 7, group: 'AB-' },
  ])
  const [showDate, setShowDate] = useState(false)
  const [mobileNo, setMobileNo] = useState('')
  const [frontImgBase64, setFrontImgBase64] = useState('')
  const [frontImage, setFrontImage] = useState('')
  const [backImgBase64, setBackImgBase64] = useState('')
  const [backImage, setBackImage] = useState('')
  const [docUploaderLoader, setDocUploaderLoader] = useState(false)

  // Declare input reference field
  const refLastName = useRef()
  const refCity = useRef()
  const refAddress = useRef()
  const refInsurance = useRef()
  const refEmail = useRef()
  const refPhoneNo = useRef()
  const refCardNo = useRef()
  const refGroupNo = useRef()
  const refHeight = useRef()
  const refWeight = useRef()
  const refPhoto = useRef()

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
  const searchFlagFilter = text => {
    const newData = phoneCodeList.filter(item => {
      const itemData = item.name.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    setCountryCodes(newData)
  }

  //Selection For pictures
  const choosePhoto = (type, from = '') => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: true,
    }
    if (from === 'camera' && cameraPerm) {
      // CAMERA SELECTION
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else {
          refPhoto.current.close()
          if (type === 'front') {
            var image = `data:${response.type};base64,${response.base64}`
            setFrontImgBase64(image)
            setFrontImage(image)
          } else if (type === 'doc') {
            documents.push({
              fileCopyUri: response?.uri,
              size: response?.fileSize,
              uri: response?.uri,
              type: response?.type,
              name: response?.fileName?.substring(25, response.fileName.length),
            })
            setDocuments([...documents])
          } else {
            var image1 = `data:${response.type};base64,${response.base64}`
            setBackImgBase64(image1)
            setBackImage(image1)
          }
        }
      })
    } else {
      // GALLERY SELECTION
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        } else {
          refPhoto.current.close()
          if (type == 'avatar') {
            var image0 = `data:${response.type};base64,${response.base64}`
            setAvatarImgBase64(image0)
            setAvatar(image0)
          } else if (type == 'front') {
            var image = `data:${response.type};base64,${response.base64}`
            setFrontImgBase64(image)
            setFrontImage(image)
          } else {
            var image1 = `data:${response.type};base64,${response.base64}`
            setBackImgBase64(image1)
            setBackImage(image1)
          }
        }
      })
    }
  }

  //function for camera request
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCameraPerm(true)
        } else {
          Toast.show('Please provider Camera permission')
          console.log('Camera permission denied')
        }
      } catch (err) {
        console.warn(err)
      }
    } else {
      setCameraPerm(true)
    }
  }
  // Function Upload Documents
  const uploadDocument = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      })
      refPhoto.current.close()
      // console.log(results);
      var oldData = [...documents]
      setDocuments([...oldData, ...results])
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  //==============================API CALLINGS==============================================
  useEffect(() => {
    requestCameraPermission()
  }, [])

  // Add New Patient Api
  const onAddPatient = () => {
    const params = {
      firstName: fname?.trim(),
      lastName: lname?.trim(),
      email: email,
      height: height,
      weight: weight,
      gender: 'male',
      countryCode: countryCode,
      country: selectedCountry?.name,
      city: city?.trim(),
      address: address?.trim(),
      bloodGroup: selectedBloodGroup,
      insuranceDetail: insuranceDetail?.trim(),
      cardNumber: cardNo?.trim(),
      groupNumber: groupNo?.trim(),
      phoneNumber: mobileNo,
      medicalDocument: documents?.length ? documents : [],
      height: height,
      weight: weight,
      providerId: user?.userId,
    }
    if (date !== '') {
      params.dob = date
    }
    // avatar && avatar ? (params['avatar'] = avatar) : '';
    frontImage && (params['insuranceCardFront'] = frontImage)
    backImage && (params['insuranceCardBack'] = backImage)
    // console.log(params);ssss
    DrUtility.walkInPatient(navigation, params, dispatch)
  }
  return (
    <View style={[styles.container]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.addNewPatient}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />

      <ScrollView
        bounces={false}
        style={styles.backgroundColor(colors.themeWhite)}
        showsVerticalScrollIndicator={false}>
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={[styles.height(10)]} />
        <View style={[styles.mH(30)]}>
          <View style={[styles.height(20)]} />
          <Input
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
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
            onChangeText={text => {
              setFname(text.replace(/[^a-zA-Z\s\.]/g, ''))
            }}
            value={fname}
            onSubmitEditing={() => {
              refLastName.current.focus()
            }}
          />
          <Input
            ref={refLastName}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
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
            onChangeText={text => {
              setLname(text.replace(/[^a-zA-Z\s\.]/g, ''))
            }}
            value={lname}
            onSubmitEditing={() => {
              refHeight.current.focus()
            }}
          />
          <Input
            ref={refHeight}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={`${labels.heightFT} - ${labels.optional}`}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType='decimal-pad'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='next'
            autoCapitalize='none'
            onChangeText={text => {
              setHeight(text.replace(/[^0-9\.]/g, ''))
            }}
            value={height}
            onSubmitEditing={() => {
              refWeight.current.focus()
            }}
          />
          <Input
            ref={refWeight}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={`${labels.weightKG} - ${labels.optional}`}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType='number-pad'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='next'
            autoCapitalize='none'
            onChangeText={text => {
              setWeight(text.replace(/[^0-9]/g, ''))
            }}
            value={weight}
          />
          <View style={[styles.countryFeildCont]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dropDown, styles.flex(1)]}
              onPress={() => {
                setShowDate(!showDate)
              }}>
              <View style={[styles.flexRow]}>
                <View style={[styles.leftFeild]}>
                  <Text
                    style={[
                      styles.fontSize(13),
                      styles.mL(20),
                      styles.PoppinsLight,
                      styles.color(date != '' ? colors.black : colors.grey),
                    ]}>
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
          {showDate && (
            <>
              <DatePicker
                date={updateDate}
                mode={'date'}
                maximumDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear()),
                  )
                }
                minimumDate={new Date(1960, 1, 1)}
                onDateChange={e => {
                  setDate(e)
                  setUpdateDate(e)
                  setShowDate(!showDate)
                }}
                style={styles.pickerCont}
              />
            </>
          )}

          {/* <Input
            ref={refRelation}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.relationship}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType="default"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="next"
            autoCapitalize="none"
            onChangeText={(text) => {
              setRelationship(text.replace(/[^a-zA-Z\s\.]/g, ''));
            }}
            value={relationship}
          /> */}

          <View style={[styles.countryFeildCont]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dropDown, styles.flex(1)]}
              onPress={() => {
                setModalVisible(true)
              }}>
              <View style={[styles.flexRow]}>
                <View style={[styles.leftFeild]}>
                  <Text style={[styles.dropDownText, styles.mL(20)]}>
                    {Object.values(selectedCountry).length > 0
                      ? selectedCountry.emoji
                      : ''}
                  </Text>
                  <Text style={[styles.fontSize(14), styles.mL(10)]}>
                    {Object.values(selectedCountry).length > 0
                      ? selectedCountry.name
                      : 'Select Country'}
                  </Text>
                </View>
                <View style={[styles.rightArrowDown]}>
                  <Icon
                    name='chevron-down'
                    color={colors.heading}
                    type='evilicon'
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <RNModal
            animationType='slide'
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
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
          <View style={[styles.countryFeildCont]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dropDown, styles.flex(1)]}
              onPress={() => {
                setBloodGroupPopup(!bloodGroupPopup)
              }}>
              <View style={[styles.flexRow]}>
                <View style={[styles.leftFeild]}>
                  <Text
                    style={[
                      styles.fontSize(13),
                      styles.mL(20),
                      styles.PoppinsLight,
                      styles.color(
                        selectedBloodGroup != '' ? colors.black : colors.grey,
                      ),
                    ]}>
                    {selectedBloodGroup != ''
                      ? selectedBloodGroup
                      : labels.blood}
                  </Text>
                </View>
                <View style={[styles.rightArrowDown]}>
                  <Icon
                    name='chevron-down'
                    color={colors.heading}
                    type='evilicon'
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <Input
            ref={refCity}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.City}
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
            onChangeText={text => {
              setCity(text.replace(/[^a-zA-Z\s\.]/g, ''))
            }}
            value={city}
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
            onChangeText={text => {
              setAddress(text)
            }}
            value={address}
            onSubmitEditing={() => {
              refInsurance.current.focus()
            }}
          />
          <Input
            ref={refInsurance}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.insuranceDetail}
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
            onChangeText={text => {
              setInsuranceDetail(text.replace(/[^a-zA-Z\^0-9\s\.]/g, ''))
            }}
            value={insuranceDetail}
            onSubmitEditing={() => {
              refEmail.current.focus()
            }}
          />
          <Input
            ref={refEmail}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.email}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType='email-address'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='done'
            autoCapitalize='none'
            onChangeText={text => {
              setEmail(text)
            }}
            value={email}
          />
          <View style={[styles.mobileFeildCont]}>
            <View style={[styles.flex(0.3), styles.mR(10), styles.height(50)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown]}
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
            <View style={[styles.flex(0.7), styles.height(65)]}>
              <Input
                ref={refPhoneNo}
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
                onChangeText={text => setMobileNo(text)}
                value={mobileNo}
                onSubmitEditing={() => { }}
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
          <Input
            ref={refCardNo}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.cardNo}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType='number-pad'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='done'
            autoCapitalize='none'
            onChangeText={text => {
              setCardNo(text.replace(/[^a-zA-Z\^0-9\s\.]/g, ''))
            }}
            value={cardNo}
            onSubmitEditing={() => {
              refGroupNo.current.focus()
            }}
          />
          <Input
            ref={refGroupNo}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.groupNo}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType='number-pad'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='done'
            autoCapitalize='none'
            onChangeText={text => {
              setGroupNo(text.replace(/[^0-9]/g, ''))
            }}
            value={groupNo}
          />
          {/* INSURANCE IMAGES AND BUTTON */}
          <Text style={[styles.h2, styles.mT(5), styles.fontSize(14)]}>
            {labels.uploadInsurance}
          </Text>
          <View style={[styles.flexRow, styles.mT(10)]}>
            <View style={[styles.flex(0.5)]}>
              {frontImgBase64 ? (
                <View style={[styles.flex(1), styles.mR(10)]}>
                  <Image source={{ uri: frontImgBase64 }} style={styles.insImg} />
                  <TouchableOpacity
                    onPress={() => {
                      setFrontImage('')
                      setFrontImgBase64('')
                    }}
                    style={styles.cross}>
                    <Image source={assets.cross} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Button
                  title={labels.front}
                  onBtnPress={() => {
                    setUploadDocSelection('front'), refPhoto.current.open()
                  }}
                />
              )}
            </View>
            <View style={[styles.flex(0.5)]}>
              {backImgBase64 ? (
                <View style={[styles.flex(1), styles.mL(10)]}>
                  <Image
                    source={{ uri: backImgBase64 }}
                    resizeMode='cover'
                    style={[styles.insImg]}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setBackImage('')
                      setBackImgBase64('')
                    }}
                    style={styles.cross}>
                    <Image source={assets.cross} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Button
                  title={labels.back}
                  onBtnPress={() => {
                    setUploadDocSelection('back'), refPhoto.current.open()
                  }}
                />
              )}
            </View>
          </View>
          {/* UPLOADED DOCUMENTS */}
          <FlatList
            data={documents}
            contentContainerStyle={styles.mT(10)}
            keyExtractor={item => item.name}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.mT(10)}>
                  <View
                    style={[
                      styles.mH(5),
                      styles.mB(5),
                      styles.flexRow,
                      styles.alignItemCenter,
                      styles.justifyCntSP,
                      styles.padding(10),
                      styles.backgroundColor(colors.white),
                      styles.bR(10),
                      styles.shadowbb,
                    ]}>
                    <View style={styles.flex(0.9)}>
                      <Text
                        ellipsizeMode='middle'
                        numberOfLines={1}
                        style={[styles.fontPoppinsRegularBlack14]}>
                        {item.name}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        documents.splice(index, 1)
                        setDocuments([...documents])
                      }}>
                      <Image source={assets.cross} />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          />
          <Button
            title={labels.uploadDocument}
            onBtnPress={() => {
              setUploadDocSelection('upload'), refPhoto.current.open()
            }}
          />
          {/* LOADER FOR UPLOAD DOCUMENTS */}
          {uploadDocLoading ? (
            <View style={styles.mT(20)}>
              <ActivityIndicator size='large' color={colors.btngr1} />
              <Text
                style={[styles.fontPoppinsRegularBlack14, styles.textAlign]}>
                {labels.docUploadingLoader}
              </Text>
            </View>
          ) : (
            <ButtonGradient
              title={labels.add}
              type={false}
              gradient={true}
              onBtnPress={() => onAddPatient()}
            />
          )}
        </View>
        <View style={[styles.height(60)]} />
      </ScrollView>

      {/* BLOOD GROUP MODAK */}
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={bloodGroupPopup}
        onBackButtonPress={() => setBloodGroupPopup(!bloodGroupPopup)}>
        <View style={[styles.aboutMePopUpContainer]}>
          <TouchableOpacity
            style={[styles.modalCrossIcon]}
            onPress={() => setBloodGroupPopup(!bloodGroupPopup)}>
            <Image source={assets.close} />
          </TouchableOpacity>
          <Text style={[styles.h2, styles.textAlign]}>{labels.blood}</Text>
          {bloodGroups.map(data => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedBloodGroup(data.group)
                  setBloodGroupPopup(!bloodGroupPopup)
                }}
                style={[styles.containerCenter, styles.bloodGroupContainer]}>
                <Text style={[styles.fontSize(14), styles.mL(20)]}>
                  {data.group}
                </Text>
              </TouchableOpacity>
            )
          })}
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
      {/* IMAGE PICKER MODAL */}
      <Modal
        style={[
          styles.filterModalSmall,
          { maxHeight: Platform.OS === 'ios' ? '22%' : '25%' },
        ]}
        position={'center'}
        ref={refPhoto}
        backdropPressToClose={false}
        backdropOpacity={0.25}
        keyboardTopOffset={50}
        backButtonClose={true}
        swipeToClose={false}
        backdropColor={colors.black}>
        <View style={[styles.flex(1), styles.mH(5)]}>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            onPress={() => refPhoto.current.close()}>
            <Image source={assets.close} style={styles.close} />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                styles.self('center'),
                styles.fontPoppinsSemiBoldDarkTheme18,
              ]}>
              {labels.uploadBy}
            </Text>
            <View
              style={[
                styles.flexRow,
                styles.justifyCntSA,
                styles.alignItemCenter,
                styles.mT(20),
              ]}>
              <View style={[styles.alignItemCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    if (uploadDocSelection === 'front') choosePhoto('front')
                    else if (uploadDocSelection === 'back') choosePhoto('back')
                    else uploadDocument()
                  }}>
                  <Image source={assets.gallery} />
                </TouchableOpacity>
                <Text style={[styles.fontPoppinsRegularBlack14, styles.mT(10)]}>
                  {labels.gallery}
                </Text>
              </View>
              <Text
                style={[styles.fontPoppinsSemiBoldDarkTheme18, styles.mT(10)]}>
                {labels.or.toUpperCase()}
              </Text>
              <View style={[styles.alignItemCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    if (!cameraPerm) {
                      return requestCameraPermission()
                    }
                    if (uploadDocSelection === 'front') {
                      choosePhoto('front', 'camera')
                    } else if (uploadDocSelection === 'back') {
                      choosePhoto('back', 'camera')
                    } else {
                      choosePhoto('doc', 'camera')
                    }
                  }}>
                  <Image source={assets.camera} />
                </TouchableOpacity>
                <Text style={[styles.fontPoppinsRegularBlack14, styles.mT(10)]}>
                  {labels.camera}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default DrAddPatient
