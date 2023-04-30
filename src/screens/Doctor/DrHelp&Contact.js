import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  I18nManager,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import { flags } from '../../assets/flags';
import { CountryCodes } from '../../assets/flags/CountryCodes';
import { Input, Icon } from 'react-native-elements';
import { GreadientHeader, ButtonGradient } from '../../components';
import Snackbar from 'react-native-snackbar';
import { contactUs } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';

const DrHelpContact = ({ navigation }) => {
  //Redux STORE
  const dispatch = useDispatch();
  const { profile, role } = useSelector((state) => state.Auth);
  const phoneStart = CountryCodes.find(item => item.phoneCode === (profile?.mobileNumber).slice(0, 3))

  // Declare state variables'
  const [fname, setFname] = useState(profile?.name);
  const [email, setEmail] = useState(profile?.email);
  const [mobileNo, setMobileNo] = useState((profile?.mobileNumber).slice(4));
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  // const [selectedCountry, setSelectedCountry] = useState({ phoneCode: ((profile?.mobileNumber).slice(0, 3)) });
  const [selectedCountry, setSelectedCountry] = useState(phoneStart);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);
  const [phoneCodeList] = useState(CountryCodes);
  const [searchFlag, setSearchFlag] = useState('');

  CountryCodes.map((item) => {
    // console.log(item)
  })
  // Declare input reference field
  const refMessage = useRef();
  const refPhoneNo = useRef();
  const refEmail = useRef();
  //Fuctions
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
  const validateEmail = (email) => {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  const onsubmit = () => {
    const validation = `${!fname.trim()
      ? 'Please enter name'
      : !email
        ? labels.validationEmail
        : !validateEmail(email)
          ? labels.validEmail
          : !mobileNo
            ? labels.validPhone
            : mobileNo < 7
              ? labels.invalidMobileNumber
              : !message
                ? labels.validationMessage
                : true
      }`;
    if (validation === 'true') {
      const payload = {
        fullName: fname,
        email: email,
        phoneNumber: `${countryCode} ${mobileNo}`,
        message: message,
        role: role,
      };
      // console.log(payload);
      dispatch(contactUs(payload, navigation)).then((res) => {
        if (res === 200) {
          navigation.goBack();
          showToast();
        }
      });
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  };
  const showToast = () => {
    Snackbar.show({
      text: 'Request Submited',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
    });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.helpCenter}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            style={styles.flex(1)}
            behavior={Platform.OS == 'ios' && 'padding'}>
            <View style={styles.height(40)} />
            <View style={styles.mH(20)}>
              <Input
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                // disabled={true}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.fname}
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
                  refEmail.current.focus();
                }}
              />
              <Input
                ref={refEmail}
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                // disabled={true}

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
              <View style={[styles.mobileFeildCont, styles.mB(50)]}>
                <View style={[styles.flex(0.3), styles.mR(10), styles.height(55)]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    // disabled={true}
                    style={[styles.dropDown]}
                    onPress={() => {
                      setModalVisible(true);
                    }}>
                    <View style={styles.flexRow}>
                      <Text style={styles.dropDownText}>
                        {selectedCountry?.emoji}
                      </Text>
                      <Text style={[styles.fontSize(14), styles.mL(4)]}>
                        {selectedCountry?.phoneCode}
                        {/* {(profile?.mobileNumber).slice(0, 3)} */}

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
                    // disabled={true}

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
                      refMessage.current.focus();
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
                  style={[styles.flexRow, styles.margin(10)]}>
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
              <TextInput
                ref={refMessage}
                placeholder={labels.message}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                returnKeyType="next"
                clearTextOnFocus={false}
                underlineColorAndroid="transparent"
                multiline={true}
                numberOfLines={6}
                style={[[styles.loginInputContBig]]}
                returnKeyType={'next'}
                onChangeText={(text) => setMessage(text)}
                value={message}
                onSubmitEditing={() => {
                  onsubmit();
                }}
              />
              <View style={styles.mH(10)}>
                <ButtonGradient
                  title={labels.save}
                  gradient={true}
                  type={false}
                  onBtnPress={() => onsubmit()}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </>
  );
};

export default DrHelpContact;
