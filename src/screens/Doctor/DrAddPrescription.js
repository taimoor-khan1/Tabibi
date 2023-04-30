import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Platform,
  PermissionsAndroid,
} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import DocumentPicker from 'react-native-document-picker'
import Snackbar from 'react-native-snackbar'
import fonts from '../../assets/fonts'
import Modal from 'react-native-modalbox'
import {Input, Icon} from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import {GreadientHeader, ButtonGradient} from '../../components'
import SignatureScreen from 'react-native-signature-canvas'
import {useDispatch, useSelector} from 'react-redux'
import {addPrescriptionUser, uploadPrescriptionUser} from '../../store/actions'

const {height, width} = Dimensions.get('screen')
const imgWidth = width - 50
const imgHeight = height / 2
const style = `.m-signature-pad {box-shadow: none; border: none; border-radius: 50px } 
              .m-signature-pad--body {border: none; border-radius: 50px}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`

const DrAddPrescription = ({navigation, route}) => {
  //Store
  const dispatch = useDispatch()
  const {uploadDocLoading} = useSelector(state => state.Auth)

  // Declare input reference field
  const [subject, setSubject] = useState('')
  const [notes, setNotes] = useState('')
  const [addignature, setAddSignature] = useState('')
  const [addignature64, setAddSignature64] = useState('')
  const [frontImgBase64, setFrontImgBase64] = useState('')
  const [cameraPerm, setCameraPerm] = useState(false)
  const [documents, setDocuments] = useState([])
  const [frontImage, setFrontImage] = useState(false)
  const [signatureState, setSignatureState] = useState('')

  // Declare input reference field
  const refSubject = useRef()
  const refNotes = useRef()
  const ref = useRef()
  const refPhoto = useRef()
  //Fuctions

  // GETTING MOBILE PERMISSION
  useEffect(() => {
    Platform.OS === 'ios' ? setCameraPerm(true) : requestCameraPermission()
  }, [])
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPerm(true)
      } else {
        Toast.show('Please provide Camera permission')
        // console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err)
    }
  }
  //Funtion for Take Photo
  const choosePhoto = () => {
    const options = {
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: true,
    }
    // CAMERA SELECTION
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        refPhoto.current.close()
        documents.push({
          fileCopyUri: response?.uri,
          size: response?.fileSize,
          uri: response?.uri,
          type: response?.type,
          name: response?.fileName?.substring(25, response?.fileName?.length),
        })
        setDocuments([...documents])
      }
    })
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
      // console.log(oldData, documents, [...documents, ...results]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        refPhoto.current.close()
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }
  // Function Upload Signature
  const uploadSignature = async () => {
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
        // console.log(image0)
        setAddSignature(image0)
        setAddSignature64(image0)
      }
    })
  }
  //On Sumbit Prescription
  const onSubmitPrescription = () => {
    var validation = `${
      !subject
        ? labels.validSubject
        : !notes
        ? labels.validNote
        : !addignature
        ? labels.validSignature
        : true
    }`
    if (validation === 'true') {
      const data = {
        subject: subject,
        notes: notes,
        document: documents?.length ? documents : [],
        id: route?.params?.id,
        signature: addignature,
      }
      // console.log(data, 'prescription');

      if (data?.document?.length) {
        return dispatch(uploadPrescriptionUser(data, navigation, true))
      }
      dispatch(addPrescriptionUser(data, navigation, true))
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
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        {/* <Image source={assets.bottom_image} style={styles.bottomImg} /> */}
        <KeyboardAvoidingView
          style={styles.flex(1)}
          behavior={Platform.OS == 'ios' && 'padding'}>
          <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
            <GreadientHeader
              showLeftIcon={true}
              showRightIcon={false}
              showCenterText={labels.addPrescription}
              showLeftText={labels.back}
              back={true}
              leftRoute={() => navigation.goBack()}
            />
            <View style={styles.height(40)} />
            <View style={styles.mH(35)}>
              <Input
                ref={refSubject}
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.subject}
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
                onChangeText={text => setSubject(text)}
                value={subject}
                onSubmitEditing={() => {
                  refNotes.current.focus()
                }}
              />
              <Input
                ref={refNotes}
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.addNotes}
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
                onChangeText={text => setNotes(text)}
                value={notes}
                // onSubmitEditing={() => {
                //   refMessage.current.focus();
                // }}
              />
              {documents.length ? (
                <FlatList
                  data={documents}
                  keyExtractor={item => item.name}
                  renderItem={({item, index}) => {
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
              ) : (
                <View style={[styles.countryFeildCont, styles.mB(5)]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.dropDown, styles.flex(1)]}
                    onPress={() => refPhoto.current.open()}>
                    <View style={[styles.flexRow]}>
                      <View style={[styles.leftFeild]}>
                        <Text
                          style={[
                            styles.inputStyle,
                            styles.fontSize(14),
                            styles.mL(10),
                            styles.mT(3),
                          ]}>
                          {labels.uploadFile}
                        </Text>
                      </View>
                      <View style={[styles.rightArrowDown]}>
                        <Image source={assets.uploadFiles} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {addignature64 ? (
                <View style={[styles.flex(1), styles.mR(10)]}>
                  <Image
                    source={{uri: addignature64}}
                    style={styles.signatureImg}
                    resizeMode='contain'
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setAddSignature('')
                      setAddSignature64('')
                    }}
                    style={styles.cross}>
                    <Image source={assets.cross}  />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[
                    styles.countryFeildCont,
                    styles.mB(10),
                    documents.length && styles.mT(20),
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.dropDown, styles.flex(1)]}
                    onPress={() => uploadSignature()}>
                    <View style={[styles.flexRow]}>
                      <View style={[styles.leftFeild]}>
                        <Text
                          style={[
                            styles.inputStyle,
                            styles.fontSize(14),
                            styles.mL(10),
                            styles.mT(3),
                          ]}>
                          {labels.signature}
                        </Text>
                      </View>
                      <View style={[styles.rightArrowDown]}>
                        <Image source={assets.uploadFiles} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <View style={[styles.mH(5), styles.mT(20)]}>
                {uploadDocLoading ? (
                  <View style={styles.mT(30)}>
                    <ActivityIndicator size='large' color={colors.btngr1} />
                    <Text
                      style={[
                        styles.fontPoppinsRegularBlack14,
                        styles.textAlign,
                        styles.color(colors.darkBlue),
                      ]}>
                      {labels.docUploadingLoader}
                    </Text>
                  </View>
                ) : (
                  <ButtonGradient
                    title={labels.create}
                    type={false}
                    gradient={true}
                    onBtnPress={() => onSubmitPrescription()}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {/* IMAGE PICKER MODAL */}
      <Modal
        style={[
          styles.filterModalSmall,
          {maxHeight: Platform.OS === 'ios' ? '22%' : '25%'},
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
                    uploadDocument()
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
                    choosePhoto('doc', 'camera')
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
    </>
  )
}

export default DrAddPrescription
