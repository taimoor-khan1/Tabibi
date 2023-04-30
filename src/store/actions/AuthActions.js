import {
  LOGIN,
  LOGIN_SUCCESS,
  REGISTRATION,
  MY_PROFILE,
  SET_TOKEN,
  SET_ROLE,
  LOGOUT,
  UPLOAD_DOC_LOADING,
  FCMTOKEN,
  HELP_CONTACT,
  COMPLAIN,
  APP_VERSION,
  VOIPTOKEN,
  SAVE_DOCTOR,
} from '../constants';
import Api from '../../config/Api';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import config from '../../config';
import {changeStack, navigate} from '../../config/NavigationService';
import {RNVoipPushKit} from 'react-native-voip-call';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';

import moment from 'moment';

// DECIDE ENDPOINT PROVIDER OR USER
const URL = config.api.version === 'DOCTOR' ? 'provider/' : 'user/'; // endpoint change for Doctor and Patient
const AUTH_URL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/${URL}`;
// const AUTH_URL =  `http://192.168.100.13:4000/${URL}`;

// Action for Patient registration only
export const registration = (navigation, params) => {
  return async (dispatch) => {
    var response = await Api._post(AUTH_URL, '', params, true);
    console.log('respone when register =====================>', response);
    if (response.status === 200) {
      // Toast.show(response.data.message)
      navigation.navigate('Verifcation', {
        data: {
          phoneNumber: response?.data?.data?.phoneNumber,
          countryCode: response?.data?.data?.countryCode,
          isVerified: false,
        },
      });
      await AsyncStorage.setItem(
        'token_detail',
        JSON.stringify(response.data.tokenDetails),
      );
      dispatch({
        type: REGISTRATION,
        payload: response.data.data,
      });
      dispatch({
        type: SET_TOKEN,
        payload: response.data.tokenDetails,
      });
      dispatch({
        type: SET_ROLE,
        payload: response.data.data.role,
      });
      let version = DeviceInfo.getVersion();
      let buildNumber = DeviceInfo.getBuildNumber();
      const ver = {
        version: `Version ${version} build (${buildNumber})`,
      };
      dispatch({type: APP_VERSION, payload: ver.version});
      dispatch(getAccessToken(response.data.data.role));
      let zone = RNLocalize.getTimeZone();
      const payload = {
        timeZone: zone,
      };
      var res = await Api._post(AUTH_URL, 'update-time-zone', payload, false);
    } else {
      console.log('registration error', response);
      Toast.show(response.message);
    }
  };
};
// Action for Patient Login Only
export const login = (params, navigation, saveDoctor) => {
  return async (dispatch) => {
    dispatch({type: LOGIN});
    var response = await Api._post(AUTH_URL, 'login', params, true);
    if (response.status === 200) {
      const {isVerified, phone, countryCode} = response?.data?.data;
      if (isVerified === false) {
        Toast.show(response.data.message);
        navigation.navigate('Verifcation', {
          data: {
            countryCode,
            isVerified,
            phoneNumber: phone,
          },
        });
      } else {
        await AsyncStorage.setItem(
          'user_detail',
          JSON.stringify(response.data.data),
        );
        await AsyncStorage.setItem(
          'token_detail',
          JSON.stringify(response.data.tokenDetails),
        );
        dispatch({
          type: LOGIN_SUCCESS,
          payload: response?.data?.data,
        });
        dispatch({
          type: SET_TOKEN,
          payload: response?.data?.tokenDetails,
        });
        dispatch({
          type: SET_ROLE,
          payload: response?.data?.data?.role,
        });
        if (saveDoctor === null) {
          changeStack('DrawerStack');
        } else {
          navigation.navigate('DrawerStack', {screen: 'Search'});
          const params = {
            user_id: response?.data?.data?.userId,
          };
          dispatch(getProfile(params));
        }
        // console.log(response.data.data.role);
        dispatch(getAccessToken(response.data.data.role));
        let version = DeviceInfo.getVersion();
        let buildNumber = DeviceInfo.getBuildNumber();
        const ver = {
          version: `Version ${version} build (${buildNumber})`,
        };
        dispatch({type: APP_VERSION, payload: ver.version});
        let zone = RNLocalize.getTimeZone();
        const payload = {
          timeZone: zone,
        };
        var res = await Api._post(AUTH_URL, 'update-time-zone', payload, false);
      }
    } else {
      Toast.show(response.message, Toast.LONG);
    }
  };
};
// Action for Check User Session
export const CheckUserSession = () => {
  return async (dispatch) => {
    var data = await AsyncStorage.getItem('user_detail');
    var token = await AsyncStorage.getItem('token_detail');
    if (data && typeof JSON.parse(data) === 'object') {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: JSON.parse(data),
      });
      dispatch({
        type: SET_TOKEN,
        payload: JSON.parse(token),
      });
      dispatch({
        type: SET_ROLE,
        payload: JSON.parse(data).role,
      });
      dispatch(getAccessToken(JSON.parse(data).role));
      let version = DeviceInfo.getVersion();
      let buildNumber = DeviceInfo.getBuildNumber();
      const payload = {
        version: `Version ${version} build (${buildNumber})`,
      };
      var res2 = await Api._post(AUTH_URL, 'update-version', payload, false);
      console.log(res2?.data?.message, payload);
      dispatch({type: APP_VERSION, payload: payload.version});
      let zone = RNLocalize.getTimeZone();
      const tz = {
        timeZone: zone,
      };
      var res = await Api._post(AUTH_URL, 'update-time-zone', tz, false);
      console.log(res?.data?.message, tz);
    }
  };
};
export const SaveDoctor = (data, navigation) => {
  return async (dispatch) => {
    dispatch({type: SAVE_DOCTOR, payload: data});
    navigation.navigate('LoginStack', {screen: 'Login'});
  };
};
// Action for Verification Code
export const verify_code = (navigation, params) => {
  console.log(params, 'PARAMS');
  return async (dispatch) => {
    var response = await Api._post(AUTH_URL, 'verify-phone', params, true);
    if (response.status === 200) {
      Toast.show(response.data.message);
      await AsyncStorage.setItem(
        'user_detail',
        JSON.stringify(response.data.data),
      );
      await AsyncStorage.removeItem('token_detail');
      await AsyncStorage.setItem(
        'token_detail',
        JSON.stringify(response.data.tokenDetails),
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.data,
      });
      navigation.reset({
        index: 0,
        routes: [
          {
            name:
              config.api.version === 'DOCTOR' ? 'DrInformation' : 'DrawerStack',
          },
        ],
      });
      // navigation.navigate('Home');
    } else {
      Toast.show(response.message);
    }
  };
};
// Action for Patient Get Prfile Only
export const getProfile = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(AUTH_URL, 'get-profile', params, loading);
    if (response.status == 200) {
      dispatch({
        type: MY_PROFILE,
        payload: {
          ...response.data.data,
          name:
            response?.data?.data?.firstName +
            ' ' +
            response?.data?.data?.lastName,
        },
      });
    } else {
      console.log('getProfile error', response);
      // Toast.show(response.message);
    }
  };
};
// Action for  Resend Code
export const resend_code = (params) => {
  return async (dispatch) => {
    var response = await Api._post(AUTH_URL, 'send-code', params, true);
    if (response.status) {
      Toast.show('Verification code send');
    } else {
      Toast.show(response.error.message);
    }
  };
};
// Action for  Change Password
export const changePassword = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._patch(AUTH_URL, 'change-password', params, true);
    if (response.status == 200) {
      Toast.show(response.data.message);
      navigation.goBack();
    } else {
      Toast.show(response.message);
      console.log('changePassword error ===> ', response.message);
    }
  };
};
// Action for Patient Update Profile Only
export const updateProfile = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._patch(AUTH_URL, 'update-profile', params, true);
    if (response.status == 200) {
      Toast.show(response.data.message);
      await AsyncStorage.setItem(
        'user_detail',
        JSON.stringify(response.data.data),
      );
      dispatch({
        type: MY_PROFILE,
        payload: {
          ...response.data.data,
          name:
            response.data.data.firstName + ' ' + response.data.data.lastName,
        },
      });
      navigation.goBack();
    } else {
      console.log('updateProfile error', response);
      Toast.show(response.message);
    }
  };
};
// Action for AddInformation
export const addInformation = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._patch(AUTH_URL, 'update-profile', params, true);
    if (response.status == 200) {
      Toast.show(response.data.message);
      await AsyncStorage.setItem(
        'user_detail',
        JSON.stringify(response.data.data),
      );
      dispatch({
        type: MY_PROFILE,
        payload: {
          ...response.data.data,
          name:
            response?.data?.data?.firstName +
            ' ' +
            response?.data?.data?.lastName,
        },
      });
      navigation.navigate('Verifcation', {
        data: response?.data?.data,
        phoneNumber: response?.data?.data?.phoneNumber,
        status: false,
        isForgotPass: false,
      });
    } else {
      console.log('updateProfile error', response);
      Toast.show(response.message);
    }
  };
};
// Actions for Forgot password
export const forgotPassword = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(AUTH_URL, 'forgot-password', params, true);
    console.log('response ====================>', response);
    if (response.status == 200) {
      Toast.show(response.data.message);
      if (config.api.version === 'DOCTOR') {
        navigation.navigate('DrVerifcation', {
          from: 'DrForgotPassword',
          email: params.email,
        });
      } else {
        navigation.navigate('Verifcation', {
          data: {email: response.data.data.email, isForgotPass: true},
        });
      }
    } else {
      Toast.show(response.message);
    }
  };
};
// Actions for Verify Forgot Passcode
export const verifyForgotPasscode = (navigation, params) => {
  return async (dispatch) => {
    var response = await Api._post(
      AUTH_URL,
      'forgot-password-verify',
      params,
      true,
    );
    if (response.status == 200) {
      Toast.show(response.data.message);
      if (config.api.version === 'DOCTOR') {
        navigation.replace('DrResetPassword', {email: params.email});
      } else {
        navigation.navigate('ResetPassword', {email: params.email});
      }
    } else {
      Toast.show(response.message);
    }
  };
};
// Actions for Reset Password
export const resetPassword = (navigation, params) => {
  return async (dispatch) => {
    var response = await Api._post(AUTH_URL, 'reset-password', params, true);
    if (response.status == 200) {
      Toast.show(response.data.message);
      if (config.api.version === 'DOCTOR') {
        navigation.navigate('DrLogin');
      } else {
        navigation.navigate('Login');
      }
    } else {
      Toast.show(response.message);
    }
  };
};
// Action for Logout
export const Logout = (navigation) => {
  const URL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/`;
  return async (dispatch) => {
    var response = await Api._post(URL, 'user/logout', {}, true);
    if (response.status) {
      await AsyncStorage.removeItem('user_detail');
      await AsyncStorage.removeItem('token_detail');
      dispatch({
        type: LOGOUT,
        payload: {},
      });
      Toast.show(response.data.message);
      navigation.replace('LoginStack', {screen: 'Login'});
    } else {
      Toast.show(response.error.message);
    }
  };
};
// Action for Upload Document (Patient)
export const UploadDocument = (params, navigation, callback = () => {}) => {
  return async (dispatch) => {
    const doc_location = [],
      doc_uri = [];

    params.medicalDocument?.map((item) => {
      if (item.hasOwnProperty('uri')) {
        doc_uri.push(item);
      } else {
        doc_location.push(item);
      }
    });
    if (doc_uri?.length) {
      dispatch({type: UPLOAD_DOC_LOADING, payload: true});
      const URL =
        'http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/';

      const formdata = new FormData();
      doc_uri?.map((item) => {
        formdata.append('files', item);
      });

      const response = await Api._post(
        URL,
        'user/file-upload',
        formdata,
        false,
        {
          'Content-Type': 'multipart/form-data',
        },
      );
      if (response.status === 200) {
        dispatch({type: UPLOAD_DOC_LOADING, payload: false});

        let docs = doc_uri?.map((item, i) => ({
          name: item.name,
          ext: item.type,
          location: response?.data?.data[i]?.Location
            ? response?.data?.data[i]?.Location
            : '',
        }));
        const medicalDocument = doc_location.concat(docs);
        const payload = {
          ...params,
          medicalDocument: medicalDocument,
        };
        dispatch(callback(payload, navigation));
      } else {
        dispatch({type: UPLOAD_DOC_LOADING, payload: false});

        Toast.show(
          response.message
            ? response.message
            : 'Could not upload document, try again',
        );
      }
    } else {
      const payload = {
        ...params,
        medicalDocument: doc_location?.length ? doc_location : [],
      };
      dispatch(callback(payload, navigation));
    }
  };
};
// Action for FCM device token update
export const getAccessToken = (role) => {
  return async (dispatch) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    const fcmToken = await messaging().getToken();
    const AURL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/${role}`;
    const UURL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/user/`;
    if (Platform.OS === 'android') {
      if (fcmToken) {
        if (config.api.version === 'PATIENT') {
          await Api._post(
            UURL,
            'update-voip-token',
            {voipToken: fcmToken},
            false,
          );
          dispatch({type: VOIPTOKEN, payload: fcmToken});
        }
        console.log();
        await Api._post(
          AURL,
          '/update-device-token',
          {
            deviceToken: fcmToken,
            deviceTokenType: Platform.OS,
          },
          false,
        );
        dispatch({type: FCMTOKEN, payload: fcmToken});
      } else {
        console.log('Failed', 'No token received');
      }
    } else {
      if (config.api.version === 'PATIENT') {
        RNVoipPushKit.requestPermissions(); //Ios PushKit device token Listner
        RNVoipPushKit.getPushKitDeviceToken(async (res) => {
          if (res.deviceToken) {
            await Api._post(
              UURL,
              'update-voip-token',
              {voipToken: res.deviceToken},
              false,
            );
            dispatch({type: VOIPTOKEN, payload: res.deviceToken});
          }
        });
      }
      const payloadIos = {
        deviceToken: fcmToken,
        deviceTokenType: Platform.OS,
      };
      const result = await Api._post(
        AURL,
        '/update-device-token',
        payloadIos,
        false,
      );
      dispatch({type: FCMTOKEN, payload: fcmToken});
    }
  };
};
//Action for Help and Contact Us
export const contactUs = (params) => {
  const URL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/`;
  return async (dispatch) => {
    var response = await Api._post(
      URL,
      `contact-us?role=${params.role}`,
      params,
      true,
    );
    if (response.status) {
      dispatch({
        type: HELP_CONTACT,
        payload: response.data.data,
      });
      return 200;
    } else {
      Toast.show(response.error.message);
    }
  };
};
//Action for Complain
export const complains = (params, navigation) => {
  const URL = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/`;
  return async (dispatch) => {
    var response = await Api._post(URL, `complains`, params, true);
    if (response.status) {
      dispatch({
        type: COMPLAIN,
        payload: response.data.data,
      });
      Toast.show(response.data.message);
      return 200;
      // navigation.goBack()
    } else {
      Toast.show(response.error.message);
      return 400;
    }
  };
};
