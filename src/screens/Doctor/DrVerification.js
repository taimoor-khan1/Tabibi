import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
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
  verifyForgotPasscode,
  drVerify_code,
  resend_code,
  forgotPassword,
} from '../../store/actions';
import {useDispatch} from 'react-redux';

const DrVerifcation = ({navigation, route}) => {
  // console.log(route.params, '')
  // Declare state variables
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  // Declare input reference field
  const refPassword = useRef();
  const dispatch = useDispatch();
  var secs = 59,
    min = 1;

  useEffect(() => {
    // resendCode();
  }, []);

  const didPressConfirm = () => {
    if (route?.params?.from == 'DrInformation') {
      let contact = route?.params?.phoneNumber?.split(' ');
      const params = {
        mobileNumber: contact[1],
        countryCode: contact[0],
        code: Number(value),
      };
      console.log(params, 'verification-params');
      Utility.verifyCode(navigation, params, drVerify_code, dispatch);
    } else if (route?.params?.from == 'DrEstablishment') {
      let contact = route?.params?.phoneNumber?.split(' ');
      const params = {
        mobileNumber: contact[1],
        countryCode: contact[0],
        code: Number(value),
      };
      Utility.verifyCode(navigation, params, drVerify_code, dispatch);
    } else {
      Utility.verifyForgotPassCode(
        navigation,
        {email: route.params.email, verification: Number(value)},
        verifyForgotPasscode,
        dispatch,
      );
    }
  };

  // RESEND PIN CODE
  const resendCode = () => {
    if (route?.params?.from === 'DrForgotPassword') {
      const params = {
        email: route?.params?.email,
      };
      dispatch(forgotPassword(params, navigation));
    } else {
      let contact = route?.params?.phoneNumber?.split(' ');
      const paramss = {
        phoneNumber: contact[1],
        countryCode: contact[0],
      };
      console.log(contact[1], '123');
      Utility.resendCode(paramss, resend_code, dispatch, navigation);
    }
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
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          style={styles.backgroundColor(colors.white)}
          showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <Image
            source={assets.login_bg}
            style={[styles.position]}
            resizeMode={'stretch'}
          />
          <HeaderBack
            showCenterIcon={assets.logo_header}
            // showLeftIcon={true}
            // showLeftText={labels.back}
            // back={true}
            // leftRoute={() => navigation.goBack()}
          />
          <View style={styles.height(80)} />
          <View style={[styles.splash_logo, styles.flex(1)]}>
            <Image source={assets.verification} />
          </View>
          <View style={styles.height(50)} />
          <View style={[styles.mH(35), styles.flex(1)]}>
            <Text style={[styles.Heading, styles.mB(10)]}>
              {labels.verfication}
            </Text>
            <Text
              style={[
                styles.textBlack,
                styles.mB(41),
                styles.fontSize(15),
                styles.PoppinsLight,
              ]}>
              {route?.params?.from === 'DrForgotPassword'
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
              type={false}
              gradient={true}
              onBtnPress={() => didPressConfirm()}
            />
            {show && (
              <Text
                style={[
                  styles.let,
                  styles.fontSize(18),
                  styles.textAlign,
                  styles.mT(30),
                  styles.color(colors.darkBlue),
                ]}>
                {time}
              </Text>
            )}
            <Text
              style={[styles.lable, styles.mT(show ? 10 : 40), styles.mB(10)]}>
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
          <View style={styles.mB(40)} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DrVerifcation;
