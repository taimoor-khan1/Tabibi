import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal as RNModal,
  FlatList,
  I18nManager,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {Input, Icon} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {flags} from '../../assets/flags';
import {CountryCodes} from '../../assets/flags/CountryCodes';
import {ButtonGradient, HeaderBack, Button} from '../../components';
import DrUtility from '../../config/DrUtility';
import {useDispatch, useSelector} from 'react-redux';
import {drRegistration} from '../../store/actions';

const DrInformation = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {uploadDocLoading} = useSelector((state) => state.Auth);
  //From Navigation
  const {params, from} = route.params;

  // Declare state variables
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [frontImgBase64, setFrontImgBase64] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImgBase64, setBackImgBase64] = useState('');
  const [backImage, setBackImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);
  const [phoneCodeList] = useState(CountryCodes);
  const [documents, setDocuments] = useState([]);
  const [cameraPerm, setCameraPerm] = useState(false);
  const [uploadDocSelection, setUploadDocSelection] = useState('');
  const [searchFlag, setSearchFlag] = useState('');

  // Declare input reference field
  const refCity = useRef();
  const refAddress = useRef();
  const refPhoto = useRef();

  // Call Request Camera Permission
  useEffect(() => {
    requestCameraPermission();
  }, []);
  //Funtion for Request Camera Permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setCameraPerm(true);
        } else {
          Toast.show('Please provider Camera permission');
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setCameraPerm(true);
    }
  };
  // Search flag filter: by country name
  const searchFlagFilter = (text) => {
    const newData = phoneCodeList.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setCountryCodes(newData);
  };
  function renderFlagItem({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setCountryCode(item.phoneCode);
          setSelectedCountry(item);
          setModalVisible(false);
        }}>
        <View style={styles.countryFlagView}>
          <Text style={[styles.fontSize(12)]}>
            <Image source={flags[item.code]} resizeMode="contain" />
            {'  '}
            {item.name}
          </Text>
          <Text style={styles.fontSize(12)}>{item.phoneCode}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // License Image funtion
  const choosePhoto = (type, from = '') => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: true,
      saveToPhotos: true,
    };
    if (from === 'camera' && cameraPerm) {
      // CAMERA SELECTION
      launchCamera(options, (response) => {
        // console.log('Response =============> ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          refPhoto.current.close();
          if (type == 'avatar') {
            console.log(from);
            var image0 = `data:${response.type};base64,${response.base64}`;
            setAvatarImgBase64(image0);
            setAvatar(image0);
          } else if (type == 'front') {
            var image = `data:${response.type};base64,${response.base64}`;
            setFrontImgBase64(image);
            setFrontImage(image);
          } else {
            if (type === 'doc') {
              documents.push({
                fileCopyUri: response?.uri,
                size: response?.fileSize,
                uri: response?.uri,
                type: response?.type,
                name: response?.fileName?.substring(
                  25,
                  response?.fileName?.length,
                ),
              });
              setDocuments([...documents]);
            } else {
              var image1 = `data:${response.type};base64,${response.base64}`;
              setBackImgBase64(image1);
              setBackImage(image1);
            }
          }
        }
      });
    } else {
      // GALLERY SELECTION
      launchImageLibrary(options, (response) => {
        console.log('Response =============> ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          // console.log(response);
          refPhoto.current.close();
          if (type == 'avatar') {
            var image0 = `data:${response.type};base64,${response.base64}`;
            setAvatarImgBase64(image0);
            setAvatar(image0);
          } else if (type == 'front') {
            var image = `data:${response.type};base64,${response.base64}`;
            setFrontImgBase64(image);
            setFrontImage(image);
          } else {
            var image1 = `data:${response.type};base64,${response.base64}`;
            setBackImgBase64(image1);
            setBackImage(image1);
          }
        }
      });
    }
  };
  // Documents upload funtion
  const uploadDocument = async () => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });
      var oldData = [...documents];
      setDocuments([...oldData, ...results]);
      refPhoto.current.close();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  //Action for On Sumbit Btn
  const didPressSubmit = () => {
    const payload = {
      ...params,
      from,
      country: selectedCountry.name,
      city: city.trim(),
      address: address.trim(),
      license: frontImage,
      document: documents?.length ? documents : [],
    };
    // console.log(payload);
    DrUtility.drInformation(payload, navigation, dispatch, drRegistration);
  };
  return (
    <>
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
              {from === 'doctor'
                ? labels.Information
                : `${labels.establishment} ${labels.Information}`}
            </Text>
            <View style={[styles.countryFeildCont]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => {
                  setModalVisible(true);
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
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <RNModal
              animationType="slide"
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
                    name="chevron-right"
                    color={colors.heading}
                    style={styles.mT(5)}
                  />
                ) : (
                  <Icon
                    name="chevron-left"
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
                autoCapitalize="none"
                returnKeyType="search"
                value={searchFlag}
                onChangeText={(text) => {
                  setSearchFlag(text);
                  searchFlagFilter(text);
                }}
              />
              <View style={styles.mT(0)}>
                <FlatList
                  data={countryCodes}
                  renderItem={renderFlagItem}
                  keyExtractor={(item) => item.code}
                />
              </View>
            </RNModal>
            <Input
              ref={refCity}
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(0), styles.height(65)]}
              placeholder={labels.City}
              placeholderTextColor={colors.text}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              inputStyle={styles.inputStyle}
              selectionColor={colors.green}
              keyboardType="default"
              importantForAutofill="no"
              selectTextOnFocus={false}
              returnKeyType="done"
              autoCapitalize="none"
              onChangeText={(text) => setCity(text)}
              value={city}
              onSubmitEditing={() => {
                refAddress.current.focus();
              }}
            />
            <Input
              ref={refAddress}
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(0), styles.height(65)]}
              placeholder={labels.address}
              placeholderTextColor={colors.text}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              inputStyle={styles.inputStyle}
              selectionColor={colors.green}
              keyboardType="default"
              importantForAutofill="no"
              selectTextOnFocus={false}
              returnKeyType="done"
              autoCapitalize="none"
              onChangeText={(text) => setAddress(text)}
              value={address}
              onSubmitEditing={() => {}}
            />
            {frontImgBase64 ? (
              <View style={{backgroundColor: '#fff'}}>
                <Image
                  source={{uri: frontImgBase64}}
                  style={[styles.width(300), styles.height(200)]}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  onPress={() => {
                    setFrontImage('');
                    setFrontImgBase64('');
                  }}
                  style={styles.cross}>
                  <Image source={assets.cross} />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title={frontImage ? 'uploaded' : labels.uploadMedia}
                bgColor={'transparent'}
                onBtnPress={() => {
                  setUploadDocSelection('front'), refPhoto.current.open();
                }}
              />
            )}
            <FlatList
              data={documents}
              keyExtractor={(item) => item.name}
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
                          ellipsizeMode="middle"
                          numberOfLines={1}
                          style={[styles.fontPoppinsRegularBlack14]}>
                          {item.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          documents.splice(index, 1);
                          setDocuments([...documents]);
                        }}>
                        <Image source={assets.cross} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
            <View style={[styles.justifyContent]}>
              <Button
                title={labels.uploadDocument}
                onBtnPress={() => {
                  setUploadDocSelection('upload'), refPhoto.current.open();
                }}
              />
            </View>
            {uploadDocLoading ? (
              <View style={styles.mT(20)}>
                <ActivityIndicator size="large" color={colors.btngr1} />
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
                title={labels.resetBtn}
                type={false}
                gradient={true}
                onBtnPress={() => didPressSubmit()}
              />
            )}
          </View>
          <Text
            style={[
              styles.mT(15),
              styles.textMedium,
              styles.textAlign,
              styles.fontSize(15),
              styles.color(colors.darkBlue),
            ]}>
            {labels.bottomInfo}
          </Text>
          <View style={styles.height(30)} />
        </ScrollView>
        {/* UPLOAD IMAGE MODAL PICKER */}
        <Modal
          style={[
            styles.filterModalSmall,
            {height: Platform.OS === 'ios' ? '22%' : '25%'},
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
                      if (uploadDocSelection === 'front') choosePhoto('front');
                      else if (uploadDocSelection === 'back')
                        choosePhoto('back');
                      else uploadDocument();
                    }}>
                    <Image source={assets.gallery} />
                  </TouchableOpacity>
                  <Text
                    style={[styles.fontPoppinsRegularBlack14, styles.mT(10)]}>
                    {labels.gallery}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.fontPoppinsSemiBoldDarkTheme18,
                    styles.mT(10),
                  ]}>
                  {labels.or.toUpperCase()}
                </Text>
                <View style={[styles.alignItemCenter]}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!cameraPerm) {
                        return requestCameraPermission();
                      }
                      if (uploadDocSelection === 'front') {
                        choosePhoto('front', 'camera');
                      } else if (uploadDocSelection === 'back') {
                        choosePhoto('back', 'camera');
                      } else {
                        choosePhoto('doc', 'camera');
                      }
                    }}>
                    <Image source={assets.camera} />
                  </TouchableOpacity>
                  <Text
                    style={[styles.fontPoppinsRegularBlack14, styles.mT(10)]}>
                    {labels.camera}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default DrInformation;
