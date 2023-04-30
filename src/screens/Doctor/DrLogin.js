import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInputBase,
  TextInput,
} from 'react-native';
import { Icon, Input } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { ButtonGradient } from '../../components';
import { useDispatch } from 'react-redux';
import DrUtility from '../../config/DrUtility';
import { drlogin } from '../../store/actions';

const DrLogin = ({ navigation }) => {
  // Declare state variables
  const [email, setEmail] = useState(__DEV__ ? "doctor105@mailinator.com" : '');
  const [password, setPassword] = useState(__DEV__ ? "User@test123" : '');
  // Declare input reference field
  const [showPassword, setShowPassword] = useState(false)
  const refPassword = useRef();
  const dispatch = useDispatch();
  const didPressSignIn = () => {
    const params = {
      email: email,
      password: password,
    };
    DrUtility.drlogin(params, navigation, drlogin, dispatch);
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView
          bounces={false}
          style={styles.backgroundColor(colors.themeWhite)}
          showsVerticalScrollIndicator={false}>
          <Image source={assets.login_bg} style={[styles.position]} />
          <StatusBar backgroundColor={colors.themeColor} />
          <View style={styles.height(70)} />
          <View style={[styles.splash_logo]}>
            <Image source={assets.login_logo} style={styles.logo} />
          </View>
          <View style={styles.height(30)} />
          <View style={[styles.mH(30)]}>
            <Text style={[styles.Heading, styles.mT(30), styles.mB(60)]}>
              {labels.login}
            </Text>
            <Input
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
                refPassword.current.focus();
              }}
            />
            <View
              style={[
                styles.inputContainer,
                styles.borderShadow,
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

                // inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
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
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                value={password}
                onSubmitEditing={() => didPressSignIn()}
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

            <ButtonGradient
              title={labels.signIn}
              type={false}
              gradient={true}
              onBtnPress={() => didPressSignIn()}
            />
            <Text
              onPress={() => navigation.navigate('DrForgotPassword')}
              style={[
                styles.lable,
                styles.mT(27),
                styles.color(colors.darkBlue),
              ]}>
              {labels.forgot}
            </Text>
          </View>
          <Text
            style={[
              styles.lable,
              styles.mT(55),
              styles.mB(10),
              styles.color(colors.darkBlue),
            ]}>
            {labels.dont}
            <Text
              onPress={() => navigation.navigate('DrPreferedOrganization')}
              style={[styles.let]}>
              {labels.lets}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DrLogin;
