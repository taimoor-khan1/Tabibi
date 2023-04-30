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
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import ReactNativeModal from 'react-native-modal';
import Modal from 'react-native-modalbox';
import {flags} from '../../assets/flags';
import {CountryCodes} from '../../assets/flags/CountryCodes';
import {ButtonGradient, GreadientHeader, Button} from '../../components';
import moment from 'moment';
import DrUtility from '../../config/DrUtility';
import {useSelector, useDispatch} from 'react-redux';
import {addEstDoctors} from '../../store/actions';

const DrAddDoctor = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {uploadDocLoading} = useSelector((state) => state.Auth);

  // Declare state variables
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [frontImgBase64, setFrontImgBase64] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImgBase64, setBackImgBase64] = useState('');
  const [backImage, setBackImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);
  const [mobileNo, setMobileNo] = useState('');
  const [phoneCodeList] = useState(CountryCodes);
  const [searchFlag, setSearchFlag] = useState('');
  const [documents, setDocuments] = useState([]);
  const [cameraPerm, setCameraPerm] = useState(false);
  const [uploadDocSelection, setUploadDocSelection] = useState('');

  // Declare input reference field
  const refLastName = useRef();
  const refEmail = useRef();
  const refPhoneNo = useRef();
  const refPhoto = useRef();

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
        console.log('Response =============> ', response);
        refPhoto.current.close();
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          // console.log(response);
          if (type == 'avatar') {
            // console.log(from);
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
                  response.fileName.length,
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
    console.log(documents);
  };
  const onDoctorAdd = () => {
    const payload = {
      firstName: fname,
      lastName: lname,
      email: email,
      countryCode: countryCode,
      mobileNumber: mobileNo,
      license: frontImage,
      document: documents?.length ? documents : [],
    };
    // console.log(payload);
    DrUtility.estDoctors(navigation, payload, dispatch);
  };
  return (
    <View style={[styles.container]}>
      <ScrollView
        bounces={false}
        style={styles.backgroundColor(colors.themeWhite)}
        showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={colors.themeColor} />
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.addDoctor}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <View style={[styles.mH(30)]}>
          <View style={[styles.height(20)]} />
          <Input
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.name}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType="email-address"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="next"
            autoCapitalize="none"
            onChangeText={(text) => {
              setFname(text.replace(/[^a-zA-Z\s\.]/g, ''));
            }}
            value={fname}
            onSubmitEditing={() => {
              refLastName.current.focus();
            }}
          />
          <Input
            ref={refLastName}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.lname}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType="email-address"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="next"
            autoCapitalize="none"
            onChangeText={(text) => {
              setLname(text.replace(/[^a-zA-Z\s\.]/g, ''));
            }}
            value={lname}
            onSubmitEditing={() => {
              refEmail.current.focus();
            }}
          />
          <Input
            ref={refEmail}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.email}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType="email-address"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="done"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
          />
          <View style={[styles.mobileFeildCont]}>
            <View style={[styles.flex(0.3), styles.mR(10)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown]}
                onPress={() => {
                  setModalVisible(true);
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
                underlineColorAndroid="transparent"
                autoCorrect={false}
                inputStyle={[styles.inputStyle]}
                selectionColor={colors.green}
                maxLength={10}
                keyboardType="phone-pad"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="next"
                autoCapitalize="none"
                onChangeText={(text) => setMobileNo(text)}
                value={mobileNo}
                onSubmitEditing={() => {}}
              />
            </View>
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
          <Text style={[styles.h2, styles.mT(5), styles.fontSize(14)]}>
            {labels.license}
          </Text>
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
              title={labels.add}
              type={false}
              gradient={true}
              onBtnPress={() => onDoctorAdd()}
            />
          )}
        </View>
      </ScrollView>

      {/* UPLOAD IMAGE MODAL PICKER */}
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
                    if (uploadDocSelection === 'front') choosePhoto('front');
                    else if (uploadDocSelection === 'back') choosePhoto('back');
                    else uploadDocument();
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
                <Text style={[styles.fontPoppinsRegularBlack14, styles.mT(10)]}>
                  {labels.camera}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default DrAddDoctor;
