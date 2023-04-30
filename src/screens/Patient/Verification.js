import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {ButtonGradient, HeaderBack} from '../../components';
import Utility from '../../config/Utility';
import {
  verify_code,
  resend_code,
  verifyForgotPasscode,
  forgotPassword,
} from '../../store/actions';
import {useDispatch} from 'react-redux';

const Verifcation = ({navigation, route}) => {
  // ROUTE PARAMS
  const params = route?.params?.data;

  // STATE VARIABLES
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [nav, setNav] = useState(route.params.data);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const dispatch = useDispatch();

  // TIMER FIELDS
  var secs = 59,
    min = 1;

  useEffect(() => {
    // resendCode();
  }, []);

  const didPressSend = () => {
    // USER FORGOT PASSWORD
    if (params?.isForgotPass) {
      const paramss = {
        email: params?.email,
        verification: Number(value),
      };
      return Utility.verifyForgotPassCode(
        navigation,
        paramss,
        verifyForgotPasscode,
        dispatch,
      );
    }
    // USER VERIFIED PHONE NUMBER
    if (params?.isVerified === false) {
      let contact = params.phoneNumber.split(' ');
      console.log(contact, 'contact');
      const paramss = {
        phoneNumber: contact[1],
        countryCode: contact[0],
        code: Number(value),
      };
      Utility.verifyCode(navigation, paramss, verify_code, dispatch);
    }
  };

  // RESEND PIN CODE
  const resendCode = () => {
    console.log(route?.params?.data?.phoneNumber?.split(' '), 'resend');
    let contact = route?.params?.data?.phoneNumber?.split(' ');
    if (params.isVerified === false) {
      // OTP not aviable
      // return;
      const paramss = {
        phoneNumber: contact[1],
        countryCode: contact[0],
      };
      console.log(paramss, '33');
      return Utility.resendCode(paramss, resend_code, dispatch, navigation);
    }
    const paramss = {
      email: params.email,
    };
    Utility.forgotPassword(paramss, forgotPassword, dispatch, navigation);
  };

  useEffect(() => {
    if (show === true) {
      var interval = setInterval(() => {
        if (min === 0 && secs === 0) {
          setShow(false);
          clearInterval(interval);
        }

        if (secs === 0) {
          secs = 59;
          min -= 1;
        }

        if (secs < 10) setTime(`0${min} : 0${secs}`);
        else setTime(`0${min} : ${secs}`);

        secs--;
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [show]);

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <Image
          source={assets.login_bg}
          style={[styles.position]}
          resizeMode={'stretch'}
        />
        <ScrollView
          bounces={false}
          // style={styles.backgroundColor(colors.themeWhite)}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <HeaderBack
            showCenterIcon={assets.logo_header}
            // showLeftIcon={true}
            // showLeftText={labels.back}
            // leftRoute={() => navigation.goBack()}
            // back={true}
          />
          <View style={styles.height(80)} />
          {/* <View style={styles.height(0)} /> */}
          <View style={[styles.splash_logo, styles.flex(1)]}>
            <Image source={assets.verification} />
          </View>
          <View style={styles.height(30)} />
          <View style={[styles.mH(35), styles.flex(1)]}>
            <Text style={[styles.Heading, styles.mB(10)]}>
              {labels.verfication}
            </Text>
            <Text
              style={[
                styles.textBlack,
                styles.mB(10),
                styles.fontSize(15),
                styles.PoppinsLight,
              ]}>
              {params?.isForgotPass
                ? labels.verficationTextEmail
                : labels.verficationText}
            </Text>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={4}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({index, symbol, isFocused}) => (
                <Text
                  key={index}
                  style={[styles.cell, isFocused && styles.focusCell]}
                  onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <ButtonGradient
              title={labels.confirm}
              type={true}
              onBtnPress={() => didPressSend()}
            />

            {show && (
              <Text
                style={[
                  styles.let,
                  styles.fontSize(18),
                  styles.textAlign,
                  styles.mT(10),
                ]}>
                {time}
              </Text>
            )}
            <Text
              style={[styles.lable, styles.mT(show ? 5 : 20), styles.mB(10)]}>
              {labels.dontReceive}
              <Text
                onPress={() => {
                  !show && (resendCode(), setShow(true));
                }}
                style={[styles.let, show && styles.color(colors.grey)]}>
                {labels.resend}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Verifcation;
