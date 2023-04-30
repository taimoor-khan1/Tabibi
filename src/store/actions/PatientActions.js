import {
  GET_LOVED_ONES,
  GET_LOVED_ONES_BY_ID,
  ADD_LOVED_ONES,
  SEARCH_DOCTOR,
  SEARCH_DOCTOR_PROFILE,
  GET_POC,
  GET_CONSULTATION_TYPE,
  GET_CARD,
  ADD_CARD,
  DELETE_CARD,
  BOOK_APPOINTMENT,
  PROVIDERS_LIST,
  APPOINTMENT_DETAIL,
  SEARCH_EST_PROFILE,
  GET_PATIENT_EST_DOCTORS,
  DOCTOR_SUGGESTION,
  INVOICE_BY_ID,
  MY_PROFILE,
  GET_NOTIFICATION,
  HOME_DASHBOARD,
  SLOT_INFO,
  GET_DOCTOR_SLOTS,
} from '../constants';
import Api from '../../config/Api';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import config from '../../config';
import moment from 'moment';
import {getLovedList} from '.';
// DECIDE ENDPOINT PROVIDER OR USER
const PATIENT_URL = `http://tabibbipatientsdev-env.eba-sxmhpapq.us-east-2.elasticbeanstalk.com/`;
// transections api baseURL
const TRANSACTION_URL =
  'http://tabibbitransactionsdev-env.eba-7xiiumpk.us-east-2.elasticbeanstalk.com/';
// providers api baseURL
const PROVIDER_URL =
  
  'http://tabibbiprovidersdev-env.eba-ntdnegug.us-east-2.elasticbeanstalk.com/';

// Action for GET Purpose of consultation
export const getPOC = () => {
  return async (dispatch) => {
    var response = await Api._get(PROVIDER_URL, 'poc', {}, false);
    if (response.status === 200) {
      dispatch({
        type: GET_POC,
        payload: response.data.data,
      });
    } else {
      console.log('GET_POC error', response);
    }
  };
};
// Action for GET consultation type
export const getConsultationTypes = () => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      'consultation-types',
      {},
      false,
    );
    if (response.status === 200) {
      dispatch({
        type: GET_CONSULTATION_TYPE,
        payload: response.data.data,
      });
    } else {
      console.log('getConsultationTypes error', response);
    }
  };
};
// Action for Search Doctors
export const searchDoctor = (
  params,
  navigation,
  navParams = {search: ''},
  loading = false,
  setSearchLoading = (e) => {},
) => {
  return async (dispatch) => {
    setSearchLoading(true);
    var response = await Api._post(PROVIDER_URL, 'search', params, loading);
    if (response.status === 200) {
     console.log("search response======>",response)
      setSearchLoading(false);
      dispatch({
        type: SEARCH_DOCTOR,
        payload: response.data.data,
      });
      navigation.navigate('Search', navParams);
      // console.log('searchDoctor result', response.data.data);
    } else {
      console.log('searchDoctor error', response);
    }
  };
};
// Action for Search Doctors
export const doctorSuggestions = ({search}, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `suggestions?search=${search}`,
      {},
      loading,
    );
    // console.log('suggestions', response);
    if (response.status === 200) {
      dispatch({
        type: DOCTOR_SUGGESTION,
        payload: response.data.data,
      });
    } else {
      console.log('suggestions error', response);
    }
  };
};
// Action for Get Search Doctor Profile
export const searchDoctorProfile = (params, loading = true) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `get-provider-detail/${params.id}`,
      params,
      loading,
    );
    console.log('RESP SEARCh Doc', params);
    if (response.status == 200) {
      dispatch({
        type: SEARCH_DOCTOR_PROFILE,
        payload: response.data.data,
      });
    } else {
      console.log('searchDoctor error', response);
    }
  };
};
// Action for Get Search Establishment Doctor Profile
export const searchEstDoctorProfile = (params, loading = true) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `get-est-detail/${params.id}`,
      params,
      loading,
    );
    // console.log('RESP SEARCh Doc', response);
    if (response.status == 200) {
      dispatch({
        type: SEARCH_EST_PROFILE,
        payload: response.data.data,
      });
    } else {
      console.log('searchDoctor error', response);
    }
  };
};
// Action addLovedOnes
export const addLovedOnes = (params, navigation) => {
  // console.log('AddLovedOne.js ==========>', params);
  return async (dispatch) => {
    var response = await Api._post(PATIENT_URL, 'loved-ones', params, true);
    // console.log(response.data.data);
    if (response.status === 200) {
      dispatch({
        type: ADD_LOVED_ONES,
        payload: response.data.data,
      });
      dispatch(getLovedOnes(true));
      navigation.goBack();
    } else {
      Toast.show(response.message);
      console.log('addLovedOnes error', response);
    }
  };
};
// Action getLovedOnes
export const getLovedOnes = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(PATIENT_URL, 'loved-ones', {}, loading);
    if (response.status === 200) {
      dispatch({
        type: GET_LOVED_ONES,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('getLovedOnes error', response);
    }
  };
};
// Action Get Card
export const getCard = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PATIENT_URL, 'user/get-cards', {}, loading);
    if (response.status === 200) {
      dispatch({
        type: GET_CARD,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('getLovedOnes error', response);
    }
  };
};
// Action Add Card
export const addCard = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(PATIENT_URL, 'user/add-card', params, true);
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: ADD_CARD,
        payload: response.data.data,
      });
      // navigation.goBack();
      return 200
    } else {
      Toast.show(response.message);
      console.log('addCard error', response);
      return 400
    }
  };
};
// Action Delete card
export const deleteCard = (params, loading = false) => {
  return async dispatch => {
    var response = await Api._delete(
      PATIENT_URL,
      `user/delete-card`,
      params,
      loading,
    )
    if (response.status === 200) {
      dispatch({type: DELETE_CARD})
      return 200
    } else {
      Toast.show(response.message)
      console.log('Delete card error', response)
      return 400
    }
  }
}
// Action Add appointment
export const addAnAppointment = (params, navigation) => {
  return async (dispatch) => {
    const token = await AsyncStorage.getItem('token_detail');
    const accessToken = {
      Authorization: 'Bearer' + ' ' + JSON.parse(token).accessToken,
    };
    var response = await Api._post(
      TRANSACTION_URL,
      'Appointments',
      params,
      true,
      accessToken,
    );
    // console.log(response, 'ppppp');
    if (response.status === 200) {
      return {status: 200, data: response?.data?.data};
    } else {
      Toast.show(response.message);
      console.log('addAppointments error', response);
      return {status: 400};
    }
  };
};
// // Action get appointment
export const getAnAppointment = ({status}, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `appointments?status=${status}`,
      {},
      loading,
    );
    console.log(status, 'getAnAppointment');
    if (response.status === 200) {
      const providers = {
        providerIds: response?.data?.data?.providers,
      };
      const lovedOnes = {
        lovedOneIds: response?.data?.data?.lovedOnes,
      };
      dispatch({
        type: BOOK_APPOINTMENT,
        payload: response?.data?.data?.appointments,
      });
      try {
        var responseProviders = await Api._post(
          PROVIDER_URL,
          'providers',
          providers,
          false,
        );
        if (responseProviders.status === 200) {
          dispatch({
            type: PROVIDERS_LIST,
            payload: responseProviders?.data?.data,
          });
        }
      } catch (err) {}
      try {
        var responseLovedOne = await Api._post(
          PATIENT_URL,
          'loved-ones/all',
          lovedOnes,
          false,
        );
        if (responseLovedOne.status === 200) {
          dispatch({
            type: GET_LOVED_ONES_BY_ID,
            payload: responseLovedOne?.data?.data,
          });
        }
      } catch (err) {}
    } else {
      Toast.show(response.message);
      console.log('getAppointments error', response);
    }
  };
};
//Action for Get Patients by ids
export const getProviderList = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(PROVIDER_URL, 'providers', params, loading);
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
// get Appointment by id
export const getAnAppointmentById = (id, posId, slotId, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `appointments/${id}`,
      {},
      loading,
    );
    // console.log(response)
    if (response.status === 200) {
      const appointment = response?.data?.data;
      // console.log(appointment, 'appointment');  //ALL IDS for get coonsultation Detail
      dispatch(getPOSById(appointment, posId, slotId, false));
    } else {
      Toast.show(response.message);
      console.log('getAppointments error', response);
    }
  };
};
// Action get POC
export const getPOSById = (dataAppoint, id, slotId, loading = false) => {
  return async (dispatch) => {
    try {
      const responseSlot = await Api._get(
        PROVIDER_URL,
        `schedule/slot-info/${slotId}`,
        {},
        loading,
      );
      // console.log(responseSlot);
      if (responseSlot.status === 200) {
        const data = responseSlot?.data?.data;
        let appointmentDetail = {
          ...data,
          completed_app: dataAppoint?.completed_app,
          cancel_app: dataAppoint?.cancel_app,
        };
        let value =
          moment.duration(data?.endTime) - moment.duration(data?.startTime);
        let seconds = moment.duration(value).seconds();
        let minutes = Math.trunc(moment.duration(value).minutes());
        var hours = Math.trunc(moment.duration(value).asHours());
        appointmentDetail.duration = hours ? 60 : minutes;
        dispatch({
          type: APPOINTMENT_DETAIL,
          payload: appointmentDetail,
        });
      } else {
        Toast.show(responseSlot.message);
        console.log('getAppointments error', responseSlot);
        dispatch({
          type: APPOINTMENT_DETAIL,
          payload: {},
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
};
// Action get Slot Info
export const getSlotInfo = (slotId, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `schedule/slot-info/${slotId}`,
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({
        type: SLOT_INFO,
        payload: response.data.data,
      });
    } else {
      Toast.show(response.message);
      console.log('get slot info error', response);
    }
  };
};
// Action Add appointment
export const capturedPayment = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(TRANSACTION_URL, 'payment', params, true);
    if (response.status === 200) {
      return 200;
    } else {
      Toast.show(response.message);
      console.log('addAppointments error', response);
      return 400;
    }
  };
};
//Action Est providers for patients
export const getPatientEstDoctors = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      PROVIDER_URL,
      `est-provider/${params.id}`,
      {},
      loading,
    );
    // console.log('GetPatientEstDoctors', response);
    if (response.status === 200) {
      dispatch({type: GET_PATIENT_EST_DOCTORS, payload: response.data.data});
    } else {
      Toast.show(response.message);
      console.log('GetPatientEstDoctors error', response);
    }
  };
};
export const getSlotsByDate = (params, loading = false) => {
  // consultationTypeId=${}&pocId=${}&time=${}
  return async (dispatch) => {
    
    var response = await Api._get(
      PROVIDER_URL,
      `schedule/slots/${params.id}?date=${params.date}&consultationTypeId=${params.consultationTypeId}&pocId=${params.pocId}&time=${params.time}`,
      {},
      loading,
    );
    console.log(params, 'response======= params');
    console.log(response, 'response=======');
    if (response.status === 200) {
      // dispatch({type: GET_DOCTOR_SLOTS, payload: response?.data?.data});
      dispatch({type: GET_DOCTOR_SLOTS, payload: response?.data?.data});
      return response;
    } else {
      // Toast.show(response.message);
      console.log('GET_DOCTOR_SLOTS error', response);
      dispatch({type: GET_DOCTOR_SLOTS, payload: []});

      return 400;
    }
  };
};
// get invoice by id
export const getInvoiceById = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `invoice/${params?.id}`,
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      // return response;
      dispatch({type: INVOICE_BY_ID, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('GET_DOCTOR_SLOTS error', response);
    }
  };
};
// Action for Incoming Notification ON/OFF
export const setIncomingNotification = () => {
  return async (dispatch) => {
    var response = await Api._get(
      PATIENT_URL,
      'user/manage-incoming-notifications',
      {},
      true,
    );
    // console.log(response);
    if (response.status === 200) {
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
      Toast.show(response.message);
      console.log('manage-incoming-notifications error', response);
    }
  };
};

// Action for SMS and Email Notification ON/OFF
export const setNotification = (params) => {
  return async (dispatch) => {
    var response = await Api._get(
      PATIENT_URL,
      `user/manage-incoming-notifications?type=${params.type}`,
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
// Action for Get Patient Notification
export const getNotification = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      'my-notifications',
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({type: GET_NOTIFICATION, payload: response?.data?.data});
    } else {
      Toast.show(response.message);
      console.log('GET NOTIFICATION error', response);
    }
  };
};

// Action for Get HOME DASHBOARD
export const getHome = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `appointments/by-user/${params.user_id}?status=booked&type=patient`,
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({type: HOME_DASHBOARD, payload: response?.data?.data});
    } else {
      // Toast.show(response.message);
      console.log('Home Dashboard error', response);
    }
  };
};
