import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, Keyboard, TextInput, TouchableOpacity} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {ButtonGradient, GreadientHeader} from '../../components';
import Utility from '../../config/Utility';
import {changePassword} from '../../store/actions';
import {useDispatch} from 'react-redux';

const ChangePassword = ({navigation, route}) => {
  // Declare state variables
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  useEffect(() => {
    setNotSame(newPassword === oldPassword);
  }, [newPassword, oldPassword]);
  const [notSame, setNotSame] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // const [nav, setNav] = useState(route.params.data);

  // Declare input reference field
  const refPassword = useRef();
  const refNPassword = useRef();

  const changePasswordApi = () => {
    Keyboard.dismiss();
    const params = {
      currentPassword: oldPassword,
      password: newPassword,
      confirmPassword: password,
    };
    Utility.changePassword(params, navigation, changePassword, dispatch);
  };

  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={labels.changePwd}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />
      <Image source={assets.bottom_image} style={styles.bottomImg} />
      <View style={styles.height(40)} />
      <View style={[styles.mH(35)]}>
        <View
          style={[
            styles.inputContainer,
            styles.borderShadow,
            styles.mB(15),
            {
              justifyContent: 'space-between',
              // flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 25,
            },
          ]}>
          <TextInput
            style={{width: '90%', paddingHorizontal: 15}}
            // inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.oldpassword}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            secureTextEntry={!showOldPassword ? true : false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            keyboardType="default"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="done"
            autoCapitalize="none"
            onChangeText={(text) => setOldPassword(text)}
            value={oldPassword}
            onSubmitEditing={() => {
              refNPassword.current.focus();
              Keyboard.dismiss();
            }}
          />
          <TouchableOpacity onPress={() => {
              if (showOldPassword) {
                setShowOldPassword(false);
              } else {
                setShowOldPassword(true);
              }
            }}>

          <Icon
            
            name={showOldPassword ? 'eye' : 'eye-with-line'}
            color={colors.heading}
            type={'entypo'}
            style={{marginRight: 35}}
          />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.inputContainer,
            styles.borderShadow,
            styles.mB(15),
            {
              justifyContent: 'space-between',
              // flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 25,
            },
          ]}>
          <TextInput
            ref={refNPassword}
            style={{width: '90%', paddingHorizontal: 15}}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[
              styles.pH(0),
              styles.height(
                oldPassword !== '' && newPassword !== '' && notSame ? 55 : 65,
              ),
            ]}
            placeholder={labels.newpassword}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            secureTextEntry={!showPassword ? true : false}
            inputStyle={styles.inputStyle}
            disabled={!oldPassword.length}
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
              Keyboard.dismiss();
            }}
          />
          <TouchableOpacity onPress={() => {
              if (showPassword) {
                setShowPassword(false);
              } else {
                setShowPassword(true);
              }
            }}>

          <Icon
            
            name={showPassword ? 'eye' : 'eye-with-line'}
            color={colors.heading}
            type={'entypo'}
            // style={{marginRight: 35}}
          />
          </TouchableOpacity>
        </View>
        {oldPassword !== '' && newPassword !== '' && notSame ? (
          <View style={styles.mB(10)}>
            <Text style={[styles.color(colors.red), {fontWeight: '200'}]}>
              {labels.newPassCantSame}
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.inputContainer,
            styles.borderShadow,
            styles.mB(15),
            {
              justifyContent: 'space-between',
              // flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 25,
            },
          ]}>
          <TextInput
            ref={refPassword}
            style={{width: '90%', paddingHorizontal: 15}}
            inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
            containerStyle={[styles.pH(0), styles.height(65)]}
            placeholder={labels.confirmPasswordN}
            placeholderTextColor={colors.text}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            secureTextEntry={!showConfirmPassword ? true : false}
            inputStyle={styles.inputStyle}
            selectionColor={colors.green}
            disabled={!oldPassword.length}
            keyboardType="default"
            importantForAutofill="no"
            selectTextOnFocus={false}
            returnKeyType="done"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
            value={password}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              changePasswordApi();
            }}
          />
          <TouchableOpacity     onPress={() => {
              if (showConfirmPassword) {
                setShowConfirmPassword(false);
              } else {
                setShowConfirmPassword(true);
              }
            }}>

          <Icon
        
            name={showConfirmPassword ? 'eye' : 'eye-with-line'}
            color={colors.heading}
            type={'entypo'}
          />
          </TouchableOpacity>
        </View>
        <ButtonGradient
          title={labels.save}
          type={false}
          // disabled={oldPassword !== "" && newPassword !== "" && notSame ? true : false}
          gradient={true}
          onBtnPress={() => changePasswordApi()}
        />
      </View>
    </View>
  );
};

export default ChangePassword;
