import React, { useEffect, useRef, useState } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { flags } from '../../assets/flags';
import { CountryCodes } from '../../assets/flags/CountryCodes';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { ButtonGradient, HeaderBack } from '../../components';
import DrUtility from '../../config/DrUtility';
import { useDispatch } from 'react-redux';
import { checkEmail } from '../../store/actions';

const DrRegister = ({ navigation, route }) => {
  //from route
  const { data = {}, from } = route.params;
  const { isEstablishment: _isEstablishment } = data;
  const dispatch = useDispatch();
  // Declare state variables
  const [establishmentName, setEstablishmentName] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [date, setDate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateDate, setUpdateDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneCode, setPhoneCode] = useState(CountryCodes[0].phoneCode);
  const [countriesData] = useState([CountryCodes[0].name]);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);
  const [phoneCodeList] = useState(CountryCodes);
  const [searchFlag, setSearchFlag] = useState('');

  // Declare input reference field
  const refLastName = useRef();
  const refPhoneNo = useRef();
  const refEmail = useRef();
  const refPassword = useRef();
  const refConfirmPassword = useRef();

  // Search flag filter: by country name
  const searchFlagFilter = (text) => {
    const newData = phoneCodeList.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setCountryCodes(newData);
  };
  function renderFlagItem({ item }) {
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
  const didPressRegister = () => {
    const params = {
      email: email,
      mobileNumber: mobileNo,
      countryCode: countryCode,
      password: password,
      confirmPassword: confirmPassword,
    };
    if (from === 'doctor') {
      params['firstName'] = fname;
      params['lastName'] = lname;
      params['dob'] = date;
      DrUtility.drRegister(params, navigation, from, dispatch, checkEmail); //for individual register
    } else {
      params['name'] = establishmentName;
      DrUtility.esRegister(params, navigation, from, dispatch, checkEmail); // for establishment register
    }
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          // style={styles.backgroundColor(colors.bg)}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <Image source={assets.login_bg} style={[styles.position]} />
          <HeaderBack
            showLeftIcon={true}
            // showCenterIcon={assets.inner_logoWhite}
            showLeftText={labels.back}
            back={true}
            leftRoute={() => navigation.goBack()}
          />
          {/* <View style={styles.height(50)} /> */}
          <Image
            source={assets.login_logo}
            style={[styles.alignSelf, styles.height(90), styles.width(80)]}
            resizeMode={'contain'}
          />
          <View style={[styles.mH(30), styles.mT(10)]}>
            <Text style={[styles.Heading, styles.mT(30), styles.mB(40)]}>
              {from === 'doctor'
                ? labels.signUp
                : `${labels.establishment} ${labels.signUp}`}
            </Text>

            {from === 'doctor' ? (
              <View style={[styles.flexRow]}>
                <View style={[styles.flex(0.5), styles.pR(10)]}>
                  <Input
                    inputContainerStyle={[
                      styles.inputContainer,
                      styles.borderShadow,
                    ]}
                    containerStyle={[styles.pH(0), styles.height(65)]}
                    placeholder={labels.name}
                    maxLength={30}
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
                    onChangeText={(text) => setFname(text)}
                    value={fname}
                    onSubmitEditing={() => {
                      refLastName.current.focus();
                    }}
                  />
                </View>
                <View style={styles.flex(0.5)}>
                  <Input
                    ref={refLastName}
                    inputContainerStyle={[
                      styles.inputContainer,
                      styles.borderShadow,
                    ]}
                    containerStyle={[styles.pH(0), styles.height(65)]}
                    placeholder={labels.lname}
                    placeholderTextColor={colors.text}
                    underlineColorAndroid="transparent"
                    autoCorrect={false}
                    maxLength={30}
                    inputStyle={[styles.inputStyle]}
                    selectionColor={colors.green}
                    keyboardType="email-address"
                    importantForAutofill="no"
                    selectTextOnFocus={false}
                    returnKeyType="next"
                    autoCapitalize="none"
                    onChangeText={(text) => setLname(text)}
                    value={lname}
                    onSubmitEditing={() => {
                      refEmail.current.focus();
                    }}
                  />
                </View>
              </View>
            ) : (
              <Input
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.establish1}
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
                onChangeText={(text) => setEstablishmentName(text)}
                value={establishmentName}
                onSubmitEditing={() => {
                  refEmail.current.focus();
                }}
              />
            )}
            <Input
              ref={refEmail}
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(0), styles.height(65)]}
              placeholder={labels.email}
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
              onChangeText={(text) => setEmail(text)}
              value={email}
              onSubmitEditing={() => {
                setModalVisible(true);
              }}
            />
            <View style={[styles.mobileFeildCont]}>
              <View style={[styles.flex(0.3), styles.mR(10), styles.height(55)]}>
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
                  onSubmitEditing={() => {
                    refPassword.current.focus();
                  }}
                />
              </View>
            </View>
            <Modal
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
            </Modal>
            {from === 'doctor' && (
              <View style={[styles.countryFeildCont]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.dropDown, styles.flex(1)]}
                  onPress={() => {
                    setShowDate(!showDate);
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
                        type="evilicon"
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
                  onDateChange={(e) => {
                    setDate(e);
                    setUpdateDate(e);
                    //setShowDate(!showDate)
                  }}
                  style={[
                    styles.pickerCont,
                    styles.backgroundColor('white'),
                    styles.mB(10),
                  ]}
                />
              </>
            )}
            <View
              style={[
                styles.inputContainer,
                styles.borderShadow,
                styles.mB(15),

                {
                  justifyContent: 'space-between',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 25,
                },
              ]}>
              <TextInput
                ref={refPassword}
                style={{ width: '90%', paddingHorizontal: 15 }}
                // inputContainerStyle={[
                //   styles.inputContainer,
                //   styles.borderShadow,
                // ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.password}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                secureTextEntry={!showPassword ? true : false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="next"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                value={password}
                onSubmitEditing={() => refConfirmPassword.current.focus()}
              />
              <Icon
                onPress={() => {
                  if (showPassword) {
                    setShowPassword(false);
                  } else {
                    setShowPassword(true);
                  }
                }}
                name={showPassword ? 'eye' : 'eye-with-line'}
                color={colors.heading}
                type={'entypo'}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                styles.borderShadow,
                styles.mB(15),

                {
                  justifyContent: 'space-between',
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 25,
                },
              ]}>
              <TextInput
                ref={refConfirmPassword}
                style={{ width: '90%', paddingHorizontal: 15 }}
                // inputContainerStyle={[
                //   styles.inputContainer,
                //   styles.borderShadow,
                // ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.confirmPassword}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                secureTextEntry={!showConfirmPassword ? true : false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="next"
                autoCapitalize="none"
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                onSubmitEditing={() => didPressRegister()}
              />
              <Icon
                onPress={() => {
                  if (showConfirmPassword) {
                    setShowConfirmPassword(false);
                  } else {
                    setShowConfirmPassword(true);
                  }
                }}
                name={showConfirmPassword ? 'eye' : 'eye-with-line'}
                color={colors.heading}
                type={'entypo'}
              />
            </View>
            <View style={styles.mB(10)} />
            <ButtonGradient
              title={labels.next}
              type={false}
              gradient={true}
              onBtnPress={() => didPressRegister()}
            />
          </View>
          <Text
            style={[
              styles.lable,
              styles.mT(28),
              styles.mB(10),
              styles.color(colors.darkBlue),
            ]}>
            {labels.already}
            <Text
              onPress={() => navigation.navigate('DrLogin')}
              style={[styles.let]}>
              {labels.letsLogin}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DrRegister;
