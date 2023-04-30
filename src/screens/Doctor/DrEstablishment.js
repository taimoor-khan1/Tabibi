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
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { flags } from '../../assets/flags';
import { CountryCodes } from '../../assets/flags/CountryCodes';
import { ButtonGradient, HeaderBack } from '../../components';
import { useDispatch } from 'react-redux';

const DrEstablishment = ({ navigation }) => {
  // Declare state variables
  const dispatch = useDispatch();
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);
  const [phoneCodeList] = useState(CountryCodes);
  const [searchFlag, setSearchFlag] = useState('');
  const [phoneCode, setPhoneCode] = useState(CountryCodes[0].phoneCode);
  const [countriesData] = useState([CountryCodes[0].name]);

  // Declare input reference field
  const refRelation = useRef();
  const refCountry = useRef();
  const refCity = useRef();
  const refAddress = useRef();
  const refInsurance = useRef();
  const refCardNo = useRef();
  const refGroupNo = useRef();

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

  const didPressSubmit = () => {
    const params = {
      isEstablishment: true,
      establishmentTitle: name,
      country: selectedCountry.name,
      city: city,
      address: address,
    };
    // DrUtility.drInformation(navigation, params, dispatch, drRegistration);
    navigation.navigate('DrVerifcation', {
      from: 'DrEstablishment',
      data: { email: 'helloworld' },
      isForgotPass: false,
      isDoctor: true,
    });
  };

  return (
    <View style={[styles.container]}>
      <Image source={assets.login_bg} style={[styles.position]} />
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          // style={styles.backgroundColor(colors.white)}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <HeaderBack
            showLeftIcon={true}
            showCenterIcon={assets.inner_logoWhite}
            showLeftText={labels.back}
            back={true}
            leftRoute={() => navigation.goBack()}
          />
          <View style={styles.height(50)} />
          <View style={[styles.splash_logo]}>
            <Image source={assets.login_logo} style={styles.logo} />
          </View>
          <View style={styles.height(30)} />
          <View style={[styles.mH(30)]}>
            <Text style={[styles.Heading, styles.mT(10), styles.mB(30)]}>
              {`${labels.establishment} \n ${labels.Information}`}
            </Text>
            <View style={[styles.countryFeildCont1]}>
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
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.flexRow, { ...Platform.OS === 'ios' ? styles.mT(40) : styles.margin(10) }]}>
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
              onSubmitEditing={() => didPressSubmit()}
            />

            <ButtonGradient
              title={labels.resetBtn}
              type={false}
              onBtnPress={() => didPressSubmit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DrEstablishment;
