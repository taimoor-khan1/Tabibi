import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {flags} from '../../assets/flags';
import {CountryCodes} from '../../assets/flags/CountryCodes';
import {ButtonGradient, HeaderBack} from '../../components';
import Utility from '../../config/Utility';
import {forgotPassword} from '../../store/actions';
import {useDispatch} from 'react-redux';

const DrForgotPassword = ({navigation}) => {
  // Declare state variables'
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  const dispatch = useDispatch();

  // Declare input reference field
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

  const didPressSend = () => {
    const params = {
      email: email,
    };
    Utility.forgotPassword(params, forgotPassword, dispatch, navigation);
  };

  return (
    <View style={[styles.container]}>
      <Image
        source={assets.login_bg}
        style={[styles.position, styles.flex(1)]}
      />
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          // style={[styles.backgroundColor(colors.themeWhite)]}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <HeaderBack
            showLeftIcon={true}
            showCenterIcon={assets.logo_header}
            showLeftText={labels.back}
            back={true}
            leftRoute={() => navigation.goBack()}
          />
          <View style={styles.height(90)} />
          <View style={[styles.splash_logo, styles.flex(1)]}>
            <Image source={assets.forgotPwd} />
          </View>
          <View style={styles.height(70)} />
          <View style={[styles.mH(35), styles.flex(1)]}>
            <Text style={[styles.Heading, styles.mB(10)]}>{labels.forgot}</Text>
            <Text
              style={[
                styles.textBlack,
                styles.mB(69),
                styles.fontSize(15),
                styles.PoppinsLight,
              ]}>
              {labels.forgotSubText}
            </Text>
            <View style={[styles.flexRow]}>
              <View style={[styles.flex(1), styles.height(65)]}>
                <Input
                  inputContainerStyle={[
                    [styles.inputContainer, styles.borderShadow],
                  ]}
                  containerStyle={styles.pH(0)}
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
                  onSubmitEditing={() => {}}
                />
              </View>
            </View>
            <ButtonGradient
              title={'Send'}
              // type={false}
              gradient={true}
              onBtnPress={() => didPressSend()}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}>
            <View style={styles.mT(22)}>
              <FlatList
                data={CountryCodes}
                renderItem={renderFlagItem}
                keyExtractor={(item) => item.code}
              />
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DrForgotPassword;
