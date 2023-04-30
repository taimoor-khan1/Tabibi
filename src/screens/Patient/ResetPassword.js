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
  TextInput,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {ButtonGradient, HeaderBack} from '../../components';
import Utility from '../../config/Utility';
import {resetPassword} from '../../store/actions';
import {useDispatch} from 'react-redux';

const ResetPassword = ({navigation, route}) => {
  // Declare state variables
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // const [nav, setNav] = useState(route.params.data);

  // Declare input reference field
  const refPassword = useRef();

  const didPressReset = () => {
    const params = {
      email: route.params.email,
      password: newPassword,
      confirmPassword: password,
    };
    Utility.resetPassword(navigation, params, resetPassword, dispatch);
  };

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
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.themeColor} />
          <HeaderBack
            showLeftIcon={true}
            showCenterIcon={assets.logo_header}
            showLeftText={labels.back}
            back={true}
            leftRoute={() => navigation.goBack()}
          />
          <View style={styles.height(70)} />
          <View style={[styles.splash_logo, styles.flex(1)]}>
            <Image source={assets.newpass} />
          </View>
          <View style={styles.height(40)} />
          <View style={[styles.mH(35), styles.flex(1)]}>
            <Text style={[styles.Heading, styles.mB(10)]}>{labels.reset}</Text>
            <Text
              style={[
                styles.textBlack,
                styles.mB(44),
                styles.fontSize(15),
                styles.PoppinsLight,
              ]}>
              {labels.resettext}
            </Text>
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
                      style={{width: '90%',paddingHorizontal:15}}

                // inputContainerStyle={[
                //   styles.inputContainer,
                //   styles.borderShadow,
                // ]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.newpassword}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                secureTextEntry={!showPassword ? true : false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
                onSubmitEditing={() => {
                  refPassword.current.focus();
                }}
              />
              <Icon
                onPress={() => {
                  if (showPassword) {
                    setShowPassword(false);
                  } else {
                    setShowPassword(true);
                  }
                }}
                name={showPassword ? 'eye':'eye-with-line'}
                color={colors.heading}
                type={'entypo'}
                style={{marginRight: 35}}
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
                ref={refPassword}
                style={{width: '90%',paddingHorizontal:15}}

                //   inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
                containerStyle={[styles.pH(0), styles.height(65)]}
                placeholder={labels.confirmPasswordN}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                secureTextEntry={!showConfirmPassword ? true : false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                value={password}
                onSubmitEditing={() => {}}
              />
              <Icon
                onPress={() => {
                  if (showConfirmPassword) {
                    setShowConfirmPassword(false);
                  } else {
                    setShowConfirmPassword(true);
                  }
                }}
                name={showConfirmPassword ? 'eye':'eye-with-line'}
                color={colors.heading}
                type={'entypo'}
              />
            </View>
            <ButtonGradient
              title={labels.resetBtn}
              type={true}
              onBtnPress={() => didPressReset()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;
