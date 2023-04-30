import Api from '../../config/Api';
import Toast from '../../../node_modules/react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import {
  LOGIN,
  LOGIN_SUCCESS,
  REGISTRATION,
  ADD_DETAIL,
  GET_DETAIL,
  ADD_LOCATION,
  GET_LOCATION,
  DELETE_LOCATION,
  SET_TOKEN,
  MY_PROFILE,
  SET_ROLE,
  SEARCH_POC,
  CREATE_POC,
  GET_POS,
  ADD_POS,
  DELETE_POS,
  CREATE_SCHEDULE,
  GET_SCHEDULE,
  DELETE_SCHEDULE,
  UPLOAD_DOC_LOADING,
  GET_CONSULTATIONS,
  GET_PATIENTS,
  GET_PATIENT_DETAIL,
  MY_AVAILABLE_SLOTS,
  MY_AVAILABLE_SCHEDULE,
  SEARCH_PATIENT,
  ADD_PATIENT_APPOINTMENT,
  WALKIN_APPOINTMENT,
  ADD_EST_DOCTORS,
  GET_EST_DOCTORS,
  CANCEL_APPOINTMENT,
  COMPLETE_WALKIN_APPOINTMENT,
  GET_PROVIDER_PATIENTS,
  LOADING,
  DR_GET_CARD,
  DR_ADD_CARD,
  DR_DELETE_CARD,
  LOGOUT,
  MY_PATIENTS,
  DELETE_SLOT,
  EDIT_SLOT,
  DELETE_POC,
  GET_DR_DASHBOARD,
  GET_DR_APPOINTMENT,
  GET_DAY_APPOITMENT,
  GET_SCHEDULE_STATS,
  GET_APPOINTMENT_STATS,
  GET_MY_EARNINGS,
  GET_PATIENT_PAYMENT_DETAIL,
  GET_NOTIFICATION, //
  NOTIFICATION_SETTING,
  CREATE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  DELETE_NOTIFICATION,
  ACKNOLEDGEMENT_NOTIFICATION,
  GET_LOVED_ONES_BY_ID,
  BLOCK_USER,
  APP_VERSION,
  GET_PAYOUTS,
} from '../constants';
import {changeStack, navigate} from '../../config/NavigationService';
import {getAccessToken, getAnAppointment} from '.';
import fonts from '../../assets/fonts';
import colors from '../../config/Colors';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';

// URLs OF MICRO SERVICES
const AUTH_URL =
  'http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/';
const PROVIDER_URL =
  'http://tabibbiprovidersdev-env.eba-ntdnegug.us-east-2.elasticbeanstalk.com/';
const TRANSACTION_URL =
  'http://tabibbitransactionsdev-env.eba-7xiiumpk.us-east-2.elasticbeanstalk.com/';
const PATIENT_URL =
  'http://tabibbipatientsdev-env.eba-sxmhpapq.us-east-2.elasticbeanstalk.com/';
// const AUTH_URL = 'http://192.168.100.13:4000/'; TESTING

// FOR LOGIN, VERITY_CODE AND RESET_PASSWORD, FORGOT_PASSWORD const COMMON_URL = BASE_URL + CategoryEndPoint;

// DOCTOR AND ESTABLISHMENT REGISTERATION
export const drRegistration = (params, navigation) => {
  return async (dispatch) => {
    const URL =
      AUTH_URL + (params?.from === 'doctor' ? 'provider' : 'establishment');
    var response = await Api._post(URL, '', params, true);
    // console.log('drRegistration', response, params);
    if (response.status == 200) {
      // Toast.show(response.data.message)
      if (response?.data?.data?.isVerified == false) {
        navigation.navigate('DrVerifcation', {
          data: params,
          from: params?.from === 'doctor' ? 'DrInformation' : 'DrEstablishment',
          phoneNumber: response.data.data.phone,
          countryCode: response?.data?.data?.countryCode,
          status: false,
          isForgotPass: false,
        });
      } else {
        navigation.navigate('DrVerifcation', {
          from: params?.from === 'doctor' ? 'DrInformation' : 'DrEstablishment',
          data: response.data.data,
          phoneNumber: response?.data?.data?.phoneNumber,
          countryCode: response?.data?.data?.countryCode,
          isForgotPass: false,
          isDoctor: true,
        });
        await AsyncStorage.setItem(
          'token_detail',
          JSON.stringify(response.data.tokenDetails),
        );
        dispatch({
          type: LOGIN_SUCCESS,
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
        var res2 = await Api._post(
          AUTH_URL,
          `${response.data.data.role}/update-version`,
          ver,
          false,
        );
        dispatch({type: APP_VERSION, payload: ver.version});
        dispatch(getAccessToken(response.data.data.role));
        let zone = RNLocalize.getTimeZone();
        const payload = {
          timeZone: zone,
        };
        var res = await Api._post(
          AUTH_URL,
          `${response.data.data.role}/update-time-zone`,
          payload,
          false,
        );
      }
    } else {
      console.log('registration error', response);
      Toast.show(response.message);
    }
  };
};
// DOCTOR AND ESTABLISHMENT CHECK EMAIL UNIQE
export const checkEmail = (params, navigation, from) => {
  return async (dispatch) => {
    const URL =
      AUTH_URL + (params?.from === 'doctor' ? 'provider/' : 'establishment/');
    // console.log(params);
    var response = await Api._post(URL, 'check-email', params, true);
    // console.log('check_email', response, params);
    if (response.status == 200) {
      navigation.navigate('DrInformation', {params, from});
    } else {
      Toast.show(response.message);
    }
  };
};
// DOCTOR AND ESTABLISHMENT LOGIN
export const drlogin = (params, navigation) => {
  return async (dispatch) => {
    dispatch({type: LOGIN});
    var response = await Api._post(AUTH_URL, 'provider/login', params, true);
    // console.log(response);
    if (response.status == 200) {
      Toast.show(response.data.message);
      if (response?.data?.data?.isVerified == false) {
        navigation.navigate('DrVerifcation', {
          from: 'DrInformation',
          data: params,
          phoneNumber: response?.data?.data?.phone,
          countryCode: response?.data?.data?.countryCode,
          status: response?.data?.data?.isVerified,
          isForgotPass: false,
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
        changeStack('DrawerStack');
        let version = DeviceInfo.getVersion();
        let buildNumber = DeviceInfo.getBuildNumber();
        const ver = {
          version: `Version ${version} build (${buildNumber})`,
        };
        var res2 = await Api._post(
          AUTH_URL,
          `${response.data.data.role}/update-version`,
          ver,
          false,
        );
        dispatch({type: APP_VERSION, payload: ver.version});
        dispatch(getAccessToken(response.data.data.role));
        let zone = RNLocalize.getTimeZone();
        const payload = {
          timeZone: zone,
        };
        var res = await Api._post(
          AUTH_URL,
          `${response.data.data.role}/update-time-zone`,
          payload,
          false,
        );
        console.log(res?.data?.message, tz);
      }
    } else {
      Toast.show(response.message);
    }
  };
};
// Action for Dr Logout
export const Drlogout = (navigation, role) => {
  const URL =
    'http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/';
  return async (dispatch) => {
    // alert(role)
    var response = await Api._post(URL, `${role}/logout`, {}, true);
    // console.log(response);
    if (response.status) {
      await AsyncStorage.removeItem('user_detail');
      await AsyncStorage.removeItem('token_detail');
      dispatch({
        type: LOGOUT,
        payload: {},
      });
      Toast.show('Logout Successfully');
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginStack'}],
      });
    } else {
      Toast.show(response.error.message);
    }
  };
};
// VERIFY DOCTOR AND ESTABLISHMENT
export const drVerify_code = (navigation, params) => {
  return async (dispatch) => {
    var response = await Api._post(
      AUTH_URL,
      'provider/verify-phone',
      params,
      true,
    );
    // console.log('drVerify_code', response, params);
    if (response.status == 200) {
      Toast.show(response.data.message);
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
        payload: response.data.data,
      });
      dispatch({
        type: SET_ROLE,
        payload: response.data.data.role,
      });
      changeStack('DrawerStack');
    } else {
      Toast.show(response.message);
    }
  };
};
// GET DOCTOR AND ESTABLISHMENT PROFILE
export const drGetProfile = (params, loading = false) => {
  // console.log(params);
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    const URL =
      AUTH_URL +
      (params?.from === 'establishment' ? 'establishment/' : 'provider/');
    var response = await Api._get(URL, 'get-profile', params, loading);
    if (response.status == 200) {
      dispatch({
        type: MY_PROFILE,
        payload:
          params.from === 'provider'
            ? {
                ...response.data.data,
                name:
                  response.data.data.firstName +
                  ' ' +
                  response.data.data.lastName,
              }
            : response.data.data,
      });
      dispatch({type: LOADING, payload: false});
    } else {
      console.log('getdrProfile error', response);
      dispatch({type: LOADING, payload: false});
      // Toast.show(response.message);
    }
  };
};
// UPDATE DOCTOR AND ESTABLISHMENT PROFILE
export const drUpdateProfile = (params, navigation) => {
  return async (dispatch) => {
    const URL =
      AUTH_URL +
      (params?.from === 'establishment' ? 'establishment/' : 'provider/');
    var response = await Api._patch(URL, 'update-profile', params, true);
    // console.log(response.data.data)
    if (response.status == 200) {
      Toast.show(response.data.message);
      await AsyncStorage.setItem(
        'user_detail',
        JSON.stringify(response.data.data),
      );
      dispatch({
        type: MY_PROFILE,
        payload:
          params?.from === 'provider'
            ? {
                ...response.data.data,
                name:
                  response.data.data.firstName +
                  ' ' +
                  response.data.data.lastName,
              }
            : response.data.data,
      });
      navigation.goBack();
    } else {
      console.log('updateProfile error', response);
      Toast.show(response.message);
    }
  };
};
// ADD DOCTOR AND ESTABLISHMENT PROFILE DETAILS
export const drAddDetail = (params, role) => {
  return async (dispatch) => {
    const URL =
      PROVIDER_URL +
      (params?.from === 'provider' ? 'add-detail' : 'add-est-detail');
    var response = await Api._post(URL, '', params, true);
    // console.log('add-detail', response, params);
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({
        type: ADD_DETAIL,
        payload: true,
      });
      dispatch(getDetail({from: role}));
      // dispatch({
      //   type: GET_DETAIL,
      //   payload: response.data.data,
      // });
    } else {
      // Toast.show(response.message);
    }
  };
};
// ADD LOCATIONS DETAILS
export const drAddLocationDetail = (params) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'add-location', params, true);
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({
        type: ADD_LOCATION,
        payload: true,
      });
      return 200;
    } else {
      Toast.show(response.message);
      return 400;
    }
  };
};
// ADD LOCATIONS DETAILS
export const drEstEditLocation = (params) => {
  return async (dispatch) => {
    var response = await Api._patch(
      PROVIDER_URL,
      `edit-location/${params.id}`,
      params,
      true,
    );
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({
        type: ADD_LOCATION,
        payload: true,
      });
      return 200;
    } else {
      Toast.show(response.message);
      return 400;
    }
  };
};
// GET DOCTOR AND ESTABLISHMENT PROFILE DETAILS
export const getAllLocations = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(PROVIDER_URL, 'locations', {}, loading);
    if (response.status === 200) {
      dispatch({
        type: GET_LOCATION,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message);
    }
  };
};
// DELETE LOCATION
export const deleteLocation = (params) => {
  console.log(typeof params.id);
  return async (dispatch) => {
    var response = await Api._delete(
      PROVIDER_URL,
      `location/${params.id}`,
      {},
      true,
    );
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({
        type: DELETE_LOCATION,
      });
      return 200;
    } else {
      Toast.show(response.message);
      console.log('delete Schedule error', response);
      return 400;
    }
  };
};
// GET DOCTOR AND ESTABLISHMENT PROFILE DETAILS
export const getDetail = (params) => {
  return async (dispatch) => {
    const URL =
      PROVIDER_URL +
      (params?.from === 'establishment' ? 'get-est-detail' : 'get-detail');
    var response = await Api._get(URL, '', false);
    // console.log('get-detail', response);
    if (response.status === 200) {
      dispatch({
        type: GET_DETAIL,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message);
    }
  };
};
// Action for Upload Document (Doctor)
export const drUploadDocument = (params, navigation, callback = () => {}) => {
  return async (dispatch) => {
    const doc_location = [],
      doc_uri = [];
    params?.document?.map((item) => {
      if (item.hasOwnProperty('uri')) {
        doc_uri.push(item);
      } else {
        doc_location.push(item);
      }
    });
    if (doc_uri?.length) {
      dispatch({type: UPLOAD_DOC_LOADING, payload: true});
      const UPLOAD =
        'http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/';

      const formdata = new FormData();
      doc_uri?.map((item) => {
        formdata.append('files', item);
      });
      // console.log(formdata);
      const response = await Api._post(
        UPLOAD,
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
        // console.log('DOCS =============>', docs);
        const document = doc_location.concat(docs);
        const payload = {
          ...params,
          document: document,
        };
        dispatch(callback(payload, navigation)); // Register Call after upload
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
        document: doc_location?.length ? doc_location : [],
      };
      dispatch(callback(payload, navigation)); // dispatch(callback(payload, navigation)); // Register Call no upload
    }
  };
};
//Action for Search and Get Poc
export const searchPOC = ({title}) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `poc?title=${title}`,
      {},
      false,
    );
    // console.log('SEARCH POC', response.data.data);
    if (response.status === 200) {
      dispatch({
        type: SEARCH_POC,
        payload: response.data.data,
      });
    } else {
      console.log('SEARCH POC error', response);
    }
  };
};
//Action for Create POC
export const createPOC = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'poc', params, loading);
    // console.log('NEW POC', response);
    if (response.status === 200) {
      dispatch({
        type: CREATE_POC,
        payload: response.data.data,
      });

      return {status: 200, data: response.data.data};
    } else {
      Toast.show(response.message);
      return {status: 400, data: null};
    }
  };
};
// Action Doctor Delete POC
export const deletePOC = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._delete(
      PROVIDER_URL,
      `poc/${params.id}`,
      {},
      true,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: DELETE_POC,
      });
    } else {
      // Toast.show(response.message);
      console.log('addCard error', response);
    }
  };
};
// Action GET POS
export const getPOS = (loading = false, id = null) => {
  return async (dispatch) => {
    if (id) {
      console.log(id);
      var response = await Api._get(
        PROVIDER_URL,
        `pos?providerId=${id}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(PROVIDER_URL, 'pos', {}, loading);
    }
    // console.log('GET POS', response.data.data);
    if (response.status === 200) {
      dispatch({
        type: GET_POS,
        payload: response.data.data,
      });
    } else {
      console.log('GET POS error', response);
    }
  };
};
// Action ADD POS
export const addPOS = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'pos', params, loading);
    // console.log('ADD POS', response.data.data);
    if (response.status === 200) {
      dispatch({
        type: ADD_POS,
        payload: response.data.data,
      });
      return 200;
    } else {
      console.log('ADD POS error', response);
      return 400;
    }
  };
};
export const updatePOS = (id,params,loading = false) => {
  return async (dispatch) => {
    console.log('ADD POS ID', id);
    var response = await Api._patch(PROVIDER_URL, `pos/${id}`, params, loading);
    if (response.status === 200) {
      dispatch({
        type: ADD_POS,
        payload: response.data.data,
      });
      return 200;
    } else {
      console.log('ADD POS error', response);
      return 400;
    }
  };
};
// Action ADD POS
export const addPOSEst = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      PROVIDER_URL,
      `pos?providerId=${params?.providerId}`,
      params,
      loading,
    );
    // console.log('ADD POS', response.data.data);
    if (response.status === 200) {
      dispatch({
        type: ADD_POS,
        payload: response.data.data,
      });
      return 200;
    } else {
      console.log('ADD POS error', response);
      return 400;
    }
  };
};
// Action DELETE POS
export const deletePOS = (params) => {
  return async (dispatch) => {
    var response = await Api._delete(
      PROVIDER_URL,
      `pos/${params.id}`,
      {},
      false,
    );
    // console.log('DELETE POS', response.data.data);
    if (response.status === 200) {
      dispatch({
        type: DELETE_POS,
        payload: response.data.data,
      });
      return 200;
    } else {
      console.log('DELETE POS error', response);
      return 400;
    }
  };
};
//Action for Create Schedule
export const createSchedule = (params, navigation, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'schedule', params, loading);
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: CREATE_SCHEDULE,
        payload: true,
      });
      Toast.show(response.data.message);
      navigation.navigate('DrDashboard');
    } else {
      Toast.show(response.message);
    }
  };
};

// Action Doctor Delete Slot
export const deleteSchedule = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._delete(PROVIDER_URL, 'schedule', params, loading);
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({
        type: DELETE_SCHEDULE,
      });
      return 200;
    } else {
      // Toast.show(response.message);
      console.log('delete Schedule error', response);
      return 400;
    }
  };
};

//Action for Create Schedule Est
export const createSchedule2 = (params, navigation, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'schedule', params, loading);
    console.log('respone from API=================>', response);
    if (response.status === 200) {
      dispatch({
        type: CREATE_SCHEDULE,
        payload: true,
      });
      Toast.show(response.data.message);
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Get Schedule
export const getSchedule = ({period}, loading = false, id = null) => {
  console.log(period, 'period');
  return async (dispatch) => {
    if (id) {
      var response = await Api._get(
        PROVIDER_URL,
        `schedule?providerId=${id}&period=${period}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        PROVIDER_URL,
        `schedule?period=${period}`,
        {},
        loading,
      );
    }

    console.log(response, 'RESPONSE', period, 'params1');
    if (response.status === 200) {
      console.log(response.data.data, 'schedule');
      dispatch({
        type: GET_SCHEDULE,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Get Dr Dashboard
export const getDrDashboard = ({period}, loading = false, id = null) => {
  return async (dispatch) => {
    if (id) {
      var response = await Api._get(
        PROVIDER_URL,
        `provider/dashboard?providerId=${id}&period=${period}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        PROVIDER_URL,
        `provider/dashboard?period=${period}`,
        {},
        loading,
      );
    }
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: GET_DR_DASHBOARD,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message);
    }
  };
};
//Action for Get Dr Dashboard
export const getDrDashboardAppointment = (
  {period},
  loading = false,
  id = null,
) => {
  return async (dispatch) => {
    if (id) {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/by-period?providerId=${id}&period=${period}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/by-period?period=${period}`,
        {},
        loading,
      );
    }
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: GET_DR_APPOINTMENT,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message);
    }
  };
};
//Action for Get Day Appointments
export const getDayAppointments = ({date}, loading = false, id = null) => {
  return async (dispatch) => {
    if (id) {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/by-period?providerId=${id}&date=${date}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/by-period?date=${date}`,
        {},
        loading,
      );
    }

    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: GET_DAY_APPOITMENT,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message);
    }
  };
};
//Action for doctor consultation list by Id's
export const getConsultationList = (
  {status, consultationTypeId},
  loading = false,
  id = null,
) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    if (id) {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/consultations?providerId=${id}&status=${status}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        TRANSACTION_URL,
        `appointments/consultations?status=${status}`,
        {},
        loading,
      );
    }
    // console.log(response, 'response');
    if (response.status === 200) {
      dispatch({
        type: GET_CONSULTATIONS,
        payload: response?.data?.data?.consultations,
      });
      // console.log(response.data.data);
      if (response?.data?.data?.consultations.length > 0) {
        const patients = {
          patientIds: response?.data?.data?.patients,
        };
        const lovedOnes = {
          lovedOneIds: response?.data?.data?.lovedOnes,
        };
        dispatch(getPatientList(patients, false));
        dispatch(getLovedList(lovedOnes, false));
        dispatch({type: LOADING, payload: false});
      } else {
        dispatch({
          type: GET_PATIENTS,
          payload: [],
        });
        dispatch({
          type: GET_CONSULTATIONS,
          payload: [],
        });
        dispatch({type: LOADING, payload: false});
      }
    } else {
      Toast.show(response.message);
      dispatch({
        type: GET_CONSULTATIONS,
        payload: [],
      });
      dispatch({type: LOADING, payload: false});
    }
  };
};
//Action for Get Patients by ids
export const getPatientList = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PATIENT_URL, 'user', params, loading);
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: GET_PATIENTS,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      dispatch({
        type: GET_PATIENTS,
        payload: [],
      });
    }
  };
};
//Action for Get lovedById by ids
export const getLovedList = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      PATIENT_URL,
      'loved-ones/all',
      params,
      loading,
    );
    console.log(response.data.data);
    if (response.status === 200) {
      dispatch({
        type: GET_LOVED_ONES_BY_ID,
        payload: response.data.data,
      });
    } else {
      // Toast.show(response.message)
      dispatch({
        type: GET_LOVED_ONES_BY_ID,
        payload: [],
      });
    }
  };
};
// Action for Search Patients
export const searchPatient = (
  params,
  loading = false,
  // setSearchLoading = (e) => {}
) => {
  return async (dispatch) => {
    // console.log('SEARCH DOCTOR =========> ', params.title);
    var response = await Api._get(
      PATIENT_URL,
      `user/search?name=${params.title}`,
      {},
      loading,
    );
    // console.log('PatientSearch', response);
    if (response.status === 200) {
      // setSearchLoading(false);
      dispatch({
        type: SEARCH_PATIENT,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('PatientSearch error', response);
    }
  };
};
//Action for Get Patients Detail by their Id
export const getPatientDetailById = (params, loading = false) => {
  // console.log(params);
  return async (dispatch) => {
    var response = await Api._get(
      PATIENT_URL,
      `user/${params.id}`,
      params,
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: GET_PATIENT_DETAIL,
        payload:
          params.from === 'provider'
            ? {
                ...response.data.data,
                name:
                  response.data.data.firstName +
                  ' ' +
                  response.data.data.lastName,
              }
            : response.data.data,
      });
    } else {
      Toast.show(response.message);
      dispatch({
        type: GET_PATIENT_DETAIL,
        payload: [],
      });
    }
  };
};
//Action for Get Available Slots for doctor
export const getAvailableSlots = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `schedule/available-slots?date=${params.date}`,
      {},
      loading,
    );
    // console.log('AvailableSlots', response);
    if (response.status === 200) {
      dispatch({
        type: MY_AVAILABLE_SLOTS,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('AvailableSlots error', response);
    }
  };
};
//Action for Get Available Schedule
export const getAvailableSchedule = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `schedule/available?date=${params.date}`,
      {},
      loading,
    );
    // console.log('Available-Schedule', response);
    if (response.status === 200) {
      dispatch({
        type: MY_AVAILABLE_SCHEDULE,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('Available-Schedule error', response);
    }
  };
};
//Action for Get Edit Schedule
export const getEditSlot = (params, loading = false) => {
  return async (dispatch) => {
    // console.log(params);
    var response = await Api._put(
      PROVIDER_URL,
      `schedule/edit/${params.slotId}`,
      params,
      loading,
    );
    // console.log('Edit-Slot', response);
    if (response.status === 200) {
      dispatch({
        type: EDIT_SLOT,
      });
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Edit-Slot error', response);
      return 400;
    }
  };
};
//Action for Add Walk-in Patients for appointment
export const addWalkInPateints = (params, navigation, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      PATIENT_URL,
      'provider-patients',
      params,
      loading,
    );
    // console.log('Patient Walk-In', response);
    if (response.status === 200) {
      dispatch({
        type: ADD_PATIENT_APPOINTMENT,
        payload: response.data.data,
      });
      Snackbar.show({
        text: 'Walk-In Patient Added',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.darkTheme,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      navigation.goBack();
    } else {
      Toast.show(response.message);
      console.log('Patient Walk-In error', response);
    }
  };
};
//Action for Get Provider Patients by Id
export const getProviderPatient = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PATIENT_URL,
      `provider-patients/${params.id}`,
      {},
      loading,
    );
    // console.log('Get provider Patient by id', response);
    if (response.status === 200) {
      dispatch({
        type: GET_PROVIDER_PATIENTS,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('Get provider Patient by id error', response);
    }
  };
};
//Action for Update Walk-in Patients for appointment
export const updateWalkInPateints = (params, id, loading = false) => {
  // console.log(params, id);
  return async (dispatch) => {
    var response = await Api._patch(
      TRANSACTION_URL,
      `appointments/reschedule/${id}`,
      params,
      loading,
    );
    // console.log('Book Walk-In', response);
    if (response.status === 200) {
      dispatch(getConsultationList({status: 'booked'}, false));
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Update Appointments error', response);
      return 400;
    }
  };
};
//Action for Book Walk-in Patients for appointment
export const bookWalkInPateints = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      'appointments/walk-in',
      params,
      loading,
    );
    // console.log('Book Walk-In', response)
    if (response.status === 200) {
      dispatch({type: WALKIN_APPOINTMENT, payload: response.data.data});
      dispatch({type: ADD_PATIENT_APPOINTMENT, payload: {}});
      return {status: 200, data: response};
    } else {
      Toast.show(response.message);
      console.log('addAppointments error', response);
      return {status: 400, data: null};
    }
  };
};
//Action for Add Establisment Doctors
export const addEstDoctors = (params, navigation, loading = true) => {
  return async (dispatch) => {
    var response = await Api._post(
      PROVIDER_URL,
      'est-provider',
      params,
      loading,
    );
    // console.log('AddEstDoctors', response);
    if (response.status === 200) {
      dispatch({type: ADD_EST_DOCTORS, payload: response.data.data});
      Snackbar.show({
        text: 'Doctor Added',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.darkTheme,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      navigation.goBack();
      dispatch(getEstDoctors(false));
    } else {
      Toast.show(response.message);
      console.log('AddEstDoctors error', response);
    }
  };
};
//Action for Get Establisment Doctors
export const getEstDoctors = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(PROVIDER_URL, 'est-provider', {}, loading);
    // console.log('GetEstDoctors', response);
    if (response.status === 200) {
      dispatch({type: GET_EST_DOCTORS, payload: response.data.data});
    } else {
      Toast.show(response.message);
      console.log('GetEstDoctors error', response);
    }
  };
};
//Action for Create Schedule
export const createScheduleEst = (
  params,
  navigation,
  loading = false,
  back,
) => {
  return async (dispatch) => {
    var response = await Api._post(
      PROVIDER_URL,
      'schedule/by-est',
      params,
      loading,
    );
    // console.log(response, 'Schedule Est created');
    if (response.status === 200) {
      dispatch({
        type: CREATE_SCHEDULE,
        payload: true,
      });
      if (back) {
        navigation.goBack();
      }
      Toast.show(response.data.message);
    } else {
      Toast.show(response.message, 'Error Schedule Est created');
    }
  };
};
//Action for Get Schedule
export const getScheduleEst = ({period}, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `schedule?period=${period}`,
      {},
      loading,
    );

    if (response.status === 200) {
      console.log(response?.data?.data, 'checkSchedule');
      dispatch({
        type: GET_SCHEDULE,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
    }
  };
};
// Action for Cancel Appointment
export const cancelAppointment = (params, navigation, loading = false) => {
  return async (dispatch) => {
    var response = await Api._patch(
      TRANSACTION_URL,
      `appointments/${params.id}`,
      {},
      loading,
    );
    if (response.status === 200) {
      if (params.from === 'patient') {
        navigation.goBack();
        dispatch(getAnAppointment({status: 'booked'}, false));
      } else {
        dispatch(getConsultationList({status: 'booked'}, false));
      }
      dispatch({type: CANCEL_APPOINTMENT, payload: true});
      return 200;
    } else {
      // Toast.show(response.message);
      console.log('cancel appointments error', response);
      return 400;
    }
  };
};
// Action for Complete Walkin Appointment
export const completeWalkinAppointment = (
  appointmentId,
  navigation,
  loading = false,
) => {
  return async (dispatch) => {
    var response = await Api._patch(
      TRANSACTION_URL,
      `appointments/walk-in/${appointmentId}`,
      {},
      loading,
    );
    if (response.status === 200) {
      Snackbar.show({
        text: 'Appointment Completed',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.darkTheme,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      dispatch({
        type: COMPLETE_WALKIN_APPOINTMENT,
        payload: response.data.data,
      });
      return {status: 200, data: response?.data?.data};
    } else {
      Toast.show(response.message);
      console.log('cancel appointments error', response);
    }
  };
};
// Action for Incoming Notification ON/OFF
export const setIncomingNotificationDr = (params) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      'manage-incoming-notifications',
      {},
      true,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: MY_PROFILE,
        payload:
          params?.from === 'provider'
            ? {
                ...response.data.data,
                name:
                  response.data.data.firstName +
                  ' ' +
                  response.data.data.lastName,
              }
            : response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('manage-incoming-notifications Dr error', response);
    }
  };
};
// Action for SMS and Email Notification ON/OFF
export const setNotificationDr = (params) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `manage-incoming-notifications?type=${params.type}`,
      {},
      true,
    );
    // console.log(response,'notification type',params.type);
    if (response.status === 200) {
      dispatch({
        type: MY_PROFILE,
        payload:
          params?.from === 'provider'
            ? {
                ...response.data.data,
                name:
                  response.data.data.firstName +
                  ' ' +
                  response.data.data.lastName,
              }
            : response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('manage-incoming-notifications Dr error', response);
    }
  };
};
// Action Doctor Get Card
export const getDrCard = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'get-cards', {}, loading);
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: DR_GET_CARD,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('getDrCard error', response);
    }
  };
};
// Action Doctor Add Card
export const addDrCard = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'add-card', params, true);
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: DR_ADD_CARD,
        payload: response.data.data,
      });
      dispatch(getDrCard());
      navigation.goBack();
    } else {
      Toast.show(response.message);
      console.log('dr add Card error', response);
    }
  };
};
// Action Delete card
export const drdeleteCard = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._delete(
      PROVIDER_URL,
      `/delete-card`,
      params,
      loading,
    );
    if (response.status === 200) {
      dispatch({type: DR_DELETE_CARD});
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Delete card error', response);
      return 400;
    }
  };
};
//Action for Get All Booked Patients
export const getMyPatient = (loading = false, id = null) => {
  return async (dispatch) => {
    if (id) {
      var response = await Api._get(
        TRANSACTION_URL,
        `my-patients?providerId=${id}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        TRANSACTION_URL,
        'my-patients',
        {},
        loading,
      );
    }
    // console.log('Get all my patients', response);
    if (response.status === 200) {
      dispatch({
        type: MY_PATIENTS,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('Get all my patients error', response);
    }
  };
};
// Action Doctor Delete Slot
export const deleteSlot = (params, cancel = false) => {
  return async (dispatch) => {
    dispatch({type: LOADING, payload: true});
    if (cancel) {
      var response = await Api._patch(
        TRANSACTION_URL,
        `appointments/${params.id}`,
        {},
        false,
      );
      if (response.status === 200) {
        var response2 = await Api._delete(
          PROVIDER_URL,
          `schedule/${params.slotId}`,
          {},
          false,
        );
        if (response2.status === 200) {
          dispatch({
            type: DELETE_SLOT,
          });
          dispatch({type: LOADING, payload: false});
          return 200;
        } else {
          // Toast.show(response.message);
          console.log('delete slot error', response);
          return 400;
        }
      } else {
        // Toast.show(response.message);
        console.log('cancel appointments error', response);
      }
    } else {
      var res = await Api._delete(
        PROVIDER_URL,
        `schedule/${params.slotId}`,
        {},
        true,
      );
      if (res.status === 200) {
        dispatch({
          type: DELETE_SLOT,
        });
        return 200;
      } else {
        Toast.show(response.message);
        console.log('delete slot error', response);
        return 400;
      }
    }
  };
};
//Action for Get Notification Settings
export const getNotificationSettings = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(PROVIDER_URL, '/notification', {}, loading);
    // console.log(response, 'response')
    if (response.status === 200) {
      dispatch({type: NOTIFICATION_SETTING, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('Notification Setting error', response);
    }
  };
};
//Action for Create Notification
export const createNotifcation = (params, loading = false) => {
  console.log('paramas for notification', params);
  return async (dispatch) => {
    var response = await Api._post(
      PROVIDER_URL,
      '/notification',
      params,
      loading,
    );
    // console.log(createNotifcation, 'pp');
    if (response.status === 200) {
      console.log('response from notification', response);
      dispatch({type: CREATE_NOTIFICATION});
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Create Notification Setting error', response);
      return 400;
    }
  };
};
//Action for Update Notification
export const updateNotifcation = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._put(
      PROVIDER_URL,
      `/notification/${params.id}`,
      params,
      loading,
    );
    if (response.status === 200) {
      dispatch({type: UPDATE_NOTIFICATION});
    } else {
      console.log('Update Notification error', response);
    }
  };
};
//Action for Delete Notification
export const deleteNotifcation = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._delete(
      PROVIDER_URL,
      `/notification/${params.id}`,
      {},
      loading,
    );
    if (response.status === 200) {
      dispatch({type: DELETE_NOTIFICATION});
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Delete Notification error', response);
      return 400;
    }
  };
};
//Action for Acknowledge Notification
export const acknowledgeNotifcation = (params, loading = false) => {
  console.log(params);
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      `/notification/acknowledged/${params.id}`,
      {},
      loading,
    );
    if (response.status === 200) {
      dispatch({type: ACKNOLEDGEMENT_NOTIFICATION});
      return 200;
    } else {
      // Toast.show(response.message)
      console.log('Delete Notification error', response);
      return 400;
    }
  };
};
// Action for Get All Stats
export const getAllScheduleStats = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(PROVIDER_URL, `schedule/stats`, {}, loading);
    // console.log(response);
    if (response.status === 200) {
      dispatch({type: GET_SCHEDULE_STATS, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('GET STATS error', response);
    }
  };
};
export const getAllAppointmentStats = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      'appointments/stats',
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({type: GET_APPOINTMENT_STATS, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('GET STATS error', response);
    }
  };
};
// Action for Get My Earnings
export const getMyEarning = (loading = false, filter) => {
  return async (dispatch) => {
    if (filter?.startDate != '') {
      var response = await Api._get(
        TRANSACTION_URL,
        `provider/earnings?startDate=${filter.startDate}&endDate=${filter.endDate}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(
        TRANSACTION_URL,
        'provider/earnings',
        {},
        loading,
      );
    }
    if (response.status === 200) {
      dispatch({type: GET_MY_EARNINGS, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('GET MY EARNINGS error', response);
    }
  };
};
// Action for Get Patient Payment Detail
export const getPatientPaymentDetail = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `invoice/${params?.id}`,
      {},
      loading,
    );
    console.log(response);
    if (response.status === 200) {
      // return response;
      dispatch({
        type: GET_PATIENT_PAYMENT_DETAIL,
        payload: response?.data?.data,
      });
    } else {
      Toast.show(response.message);
      console.log('GET PATIENT PAYMENT DETAIL error', response);
    }
  };
};
// Action for Get Patient Payment Detail
export const blockUser = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._patch(
      PATIENT_URL,
      `user/${params?.patientId}/${params?.providerId}`,
      {},
      loading,
    );
    console.log(response);
    if (response.status === 200) {
      dispatch({
        type: BLOCK_USER,
      });
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Block User error', response);
      return 400;
    }
  };
};

//Action for Get Payouts
export const getPayouts = (loading = false, filter) => {
  return async (dispatch) => {
    if (filter?.startDate != '') {
      var response = await Api._get(
        TRANSACTION_URL,
        `payouts?startDate=${filter.startDate}&endDate=${filter.endDate}`,
        {},
        loading,
      );
    } else {
      var response = await Api._get(TRANSACTION_URL, 'payouts', {}, loading);
    }
    // console.log('Get payouts', response);
    if (response.status === 200) {
      dispatch({
        type: GET_PAYOUTS,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('Get payouts error', response);
    }
  };
};
