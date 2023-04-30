import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, StatusBar, ScrollView, TextInput } from 'react-native'
import { Input, Icon } from 'react-native-elements'
import styles from '../../assets/styles'
import { assets } from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import { ButtonGradient } from '../../components'
import Utility from '../../config/Utility'
import { login } from '../../store/actions'
import { useDispatch, useSelector } from 'react-redux'

const Login = ({ navigation }) => {
  const { saveDoctor } = useSelector(state => state.Auth)
  // Declare state variables
  const [email, setEmail] = useState(__DEV__ ? "doctor155@mailinator.com" : "")
  const [password, setPassword] = useState(__DEV__ ? "User@test123" : "")
  const [showPassword, setShowPassword] = useState(false);

  // Declare input reference field
  const refPassword = useRef()
  const dispatch = useDispatch()

  const onLoginPressed = () => {
    Utility.login({ email, password }, navigation, login, dispatch, saveDoctor)
  }

  return (
    <View style={[styles.container]}>
      <Image source={assets.login_bg} style={[styles.position]} />
      <ScrollView
        bounces={false}
        // style={styles.backgroundColor(colors.themeWhite)}
        showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={colors.themeColor} />
        <View style={styles.height(50)} />
        <View style={[styles.splash_logo]}>
          <Image source={assets.login_logo} style={styles.logo} />
        </View>
        <View style={styles.height(30)} />
        <View style={[styles.mH(30)]}>
          <Text
            style={[
              styles.Heading,
              styles.mT(30),
              styles.mB(60),
              styles.color(colors.white),
            ]}>
            {labels.login}
          </Text>
          <Input
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.email}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            inputStyle={[styles.inputStyle]}
            selectionColor={colors.green}
            keyboardType='email-address'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='next'
            autoCapitalize='none'
            onChangeText={text => setEmail(text.trim())}
            value={email}
            onSubmitEditing={() => {
              refPassword.current.focus()
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
              containerStyle={[styles.pH(15), styles.height(65)]}
              placeholder={labels.password}
              placeholderTextColor={colors.text}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              secureTextEntry={!showPassword ? true : false}
              inputStyle={styles.inputStyle}
              selectionColor={colors.green}
              keyboardType='default'
              importantForAutofill='no'
              selectTextOnFocus={false}
              returnKeyType='done'
              autoCapitalize='none'
              onChangeText={text => setPassword(text.trim())}
              value={password}
              onSubmitEditing={onLoginPressed}
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
          {/* <Input
            ref={refPassword}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.password}
            placeholderTextColor={colors.text}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            secureTextEntry={true}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType='default'
            importantForAutofill='no'
            selectTextOnFocus={false}
            returnKeyType='done'
            autoCapitalize='none'
            onChangeText={text => setPassword(text.trim())}
            value={password}
            onSubmitEditing={onLoginPressed}
          /> */}
          <ButtonGradient
            title={labels.signIn}
            type={true}
            onBtnPress={onLoginPressed}
          />
          <Text
            onPress={() => navigation.navigate('ForgotPassword')}
            style={[styles.lable, styles.mT(27), styles.color(colors.white)]}>
            {labels.forgot}
          </Text>
        </View>
        <Text
          style={[
            styles.lable,
            styles.mT(47),
            styles.mB(10),
            styles.color(colors.white),
          ]}>
          {labels.dont}
          <Text
            onPress={() => navigation.navigate('Register')}
            style={[styles.let, styles.color(colors.white)]}>
            {labels.lets}
          </Text>
        </Text>
        <View style={styles.mB(20)} />
      </ScrollView>
    </View>
  )
}

export default Login
