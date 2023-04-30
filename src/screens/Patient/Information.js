import React, {useRef, useState} from 'react'
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  I18nManager,
  Platform,
} from 'react-native'
import {Input, Icon} from 'react-native-elements'
import DocumentPicker from 'react-native-document-picker'
import DatePicker from 'react-native-date-picker'
import {launchImageLibrary} from 'react-native-image-picker'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import {flags} from '../../assets/flags'
import ReactNativeModal from 'react-native-modal'
import {CountryCodes} from '../../assets/flags/CountryCodes'
import {ButtonGradient, HeaderBack, Button} from '../../components'
import moment from 'moment'
import Utility from '../../config/Utility'
import {useDispatch} from 'react-redux'
import {addInformation} from '../../store/actions'

const Information = ({navigation, route}) => {
  // Declare state variables
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState('')
  const [showDate, setShowDate] = useState(false)
  const [updateDate, setUpdateDate] = useState(new Date())
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('')
  const [bloodGroupPopup, setBloodGroupPopup] = useState(false)
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [insuranceDetail, setInsuranceDetail] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [groupNo, setGroupNo] = useState('')
  const [frontImgBase64, setFrontImgBase64] = useState('')
  const [frontImage, setFrontImage] = useState('')
  const [backImgBase64, setBackImgBase64] = useState('')
  const [backImage, setBackImage] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode)
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0])
  const [countryCodes, setCountryCodes] = useState(CountryCodes)
  const [phoneCodeList] = useState(CountryCodes)
  const [searchFlag, setSearchFlag] = useState('')
  const [pdf, setPDF] = useState(false)

  // Declare input reference field
  const refCity = useRef()
  const refAddress = useRef()
  const refInsurance = useRef()
  const refCardNo = useRef()
  const refGroupNo = useRef()
  const refHeight = useRef()
  const refWeight = useRef()

  const dispatch = useDispatch()

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
  const choosePhoto = type => {
    const options = {
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.6,
      includeBase64: true,
    }
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
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
  const uploadDocument = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      })
      for (const res of results) {
        // console.log(res);
        setPDF(res.type)
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }
  const bloodGroups = [
    {id: 0, group: 'A+'},
    {id: 1, group: 'A-'},
    {id: 2, group: 'B+'},
    {id: 3, group: 'B-'},
    {id: 4, group: 'O+'},
    {id: 5, group: 'O-'},
    {id: 6, group: 'AB+'},
    {id: 7, group: 'AB-'},
  ]
  const didPress = () => {
    const params = {
      firstName: route.params.params.firstName,
      lastName: route.params.params.lastName,
      height: height,
      weight: weight,
      bloodGroup: selectedBloodGroup,
      // dob: moment(date).format('DD-MM-YYYY'),
      dob: date,
      country: selectedCountry.name,
      city: city.trim(),
      address: address.trim(),
      insuranceDetail: insuranceDetail.trim(),
      cardNumber: cardNo.trim(),
      groupNumber: groupNo.trim(),
      phoneNumber: route.params.params.phoneNumber,
      countryCode: route.params.params.countryCode,
    }
    frontImage && frontImage ? (params['insuranceCardFront'] = frontImage) : '',
      backImage && backImage ? (params['insuranceCardBack'] = backImage) : '',
      // console.log(params);
      Utility.updateProfileDr(params, navigation, addInformation, dispatch)
  }
  return (
    <View style={[styles.container]}>
      <ScrollView
        bounces={false}
        style={styles.backgroundColor(colors.themeWhite)}
        showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={colors.themeColor} />
        <Image source={assets.login_bg} style={[styles.position]} />
        <HeaderBack
          showLeftIcon={true}
          showCenterIcon={assets.logo_header}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <View style={[styles.mH(30)]}>
          <Text style={[styles.Heading, styles.mT(10), styles.mB(40)]}>
            {labels.Information}
          </Text>
          <Input
            ref={refHeight}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.height}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType='default'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='next'
            autoCapitalize='none'
            onChangeText={text => {
              setHeight(text.replace(/[^0-9\s']/g, ''))
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
            placeholder={labels.weight}
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
                style={styles.pickerCont}
              />
            </>
          )}
          <View style={[styles.countryFeildCont]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dropDown, styles.flex(1)]}
              onPress={() => {
                setBloodGroupPopup(!bloodGroupPopup)
              }}>
              <View style={[styles.flexRow]}>
                <View style={[styles.leftFeild]}>
                  <Text style={[styles.fontSize(14), styles.mL(20)]}>
                    {selectedBloodGroup !== ''
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
                    style={[
                      styles.containerCenter,
                      styles.bloodGroupContainer,
                    ]}>
                    <Text style={[styles.fontSize(14), styles.mL(20)]}>
                      {data.group}
                    </Text>
                  </TouchableOpacity>
                )
              })}
              <View style={styles.height(10)} />
            </View>
          </ReactNativeModal>
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
                    {selectedCountry.emoji}
                  </Text>
                  <Text style={[styles.fontSize(14), styles.mL(10)]}>
                    {selectedCountry.name}
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
          <Modal
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
          </Modal>
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
            onChangeText={text => setCity(text)}
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
            onChangeText={text => setAddress(text)}
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
            onChangeText={text => setInsuranceDetail(text)}
            value={insuranceDetail}
            onSubmitEditing={() => {
              refCardNo.current.focus()
            }}
          />
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
            onChangeText={text => setCardNo(text)}
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
            onChangeText={text => setGroupNo(text)}
            value={groupNo}
            // onSubmitEditing={() => {

            // }}
          />
          <Text style={[styles.h2, styles.mT(5), styles.fontSize(14)]}>
            {labels.uploadInsurance}
          </Text>
          <View style={styles.flexRow}>
            <View style={[styles.flex(0.5), styles.justifyContent]}>
              {frontImgBase64 ? (
                <View>
                  <Image source={{uri: frontImgBase64}} style={styles.insImg} />
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
                  onBtnPress={() => choosePhoto('front')}
                />
              )}
            </View>
            <View style={[styles.flex(0.5), styles.justifyContent]}>
              {backImgBase64 ? (
                <View>
                  <Image
                    source={{uri: backImgBase64}}
                    style={[styles.insImg, styles.mL(3)]}
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
                <Button title={labels.back} onBtnPress={() => choosePhoto()} />
              )}
            </View>
          </View>
          <View style={[styles.justifyContent]}>
            {pdf ? (
              <Image source={assets.download} />
            ) : (
              <Button
                title={labels.uploadDocument}
                onBtnPress={() => uploadDocument()}
              />
            )}
          </View>
          <ButtonGradient
            title={labels.add}
            type={false}
            onBtnPress={() => didPress()}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default Information
