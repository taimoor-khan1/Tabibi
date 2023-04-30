import {
  CREATE_CALL,
  CALL_ACCEPTED,
  CALL_CLEAR,
  UPDATE_CALL_STATUS,
  REVIEW_CALL,
  REVIEW_CLEAR,
  CALL_END,
  ADD_PRESCRIPTION,
  GET_PRESCRIPTION,
  GET_PRESCRIPTION_DETAIL,
  GET_REVIEWS,
  GET_SUBSCRIPTION,
  GET_SUBSCRIPTION_LIST,
  SUBSCRIBE, //
  CANCEL_SUBSCRIBE,
  UPLOAD_DOC_LOADING,
} from '../constants';
import Api from '../../config/Api';
import Toast from 'react-native-simple-toast';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';
import colors from '../../config/Colors';
import { navigate } from '../../config/NavigationService';

// URLs OF MICRO SERVICES
const TRANSACTION_URL =
  'http://tabibbitransactionsdev-env.eba-7xiiumpk.us-east-2.elasticbeanstalk.com/';

//Action for Create View Session for opentok  (DOCTOR SIDE)
export const createVideoCall = (
  appointmentId,
  navigation,
  loading = false,
  patientDetail,
) => {
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      `video-consultations/${appointmentId}`,
      {},
      loading,
    );
    //   console.log(response);
    if (response.status === 200) {
      dispatch({ type: CREATE_CALL, payload: response.data.data });
      navigation.navigate('DrCall', {
        session: response.data.data,
        patientDetail,
      });
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Start Video Call and push after session created (DOCTOR SIDE)
export const startCall = (params) => {
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      'video-consultations',
      params,
      false,
    );
    if (response.status === 200) {
      Snackbar.show({
        text: 'Connecting to user please wait . . .',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.darkTheme,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      // Toast.show(response.data.message);
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Accept Call from Doctor on receiving push (PATIENT SIDE)
export const callAccepted = (id, navigation, isBackground, userId) => {
  return async (dispatch) => {
    var response = await Api._patch(
      TRANSACTION_URL,
      `video-consultations/${id}/accept`,
      {},
      true,
    );
    // console.log(response, 'SESSION CREATE');
    if (response.status === 200) {
      Toast.show(response.data.message);
      dispatch({ type: CALL_ACCEPTED, payload: response.data.data });
      isBackground
        ? navigate('Call', {
          session: response.data.data,
          userId: userId,
        })
        : navigation.navigate('Call', {
          session: response.data.data,
          userId: userId,
        });
    } else {
      // Toast.show(response.message);
    }
  };
};
//Action for End Call from Doctor on receiving push (PATIENT SIDE)
export const callEnd = (id, params, navigation) => {
  // console.log(params, 'time');
  return async (dispatch) => {
    const response = await Api._patch(
      TRANSACTION_URL,
      `video-consultations/${id}/end`,
      { duration: params },
      false,
    );
    // console.log(response, 'END CALL');
    if (response.status === 200) {
      dispatch({ type: CALL_END });
      return { status: 200, data: response.data.data };
    } else {
      return { status: response.status, msg: response.message };
      console.log(response.message);
      // Toast.show(response.message);
    }
  };
};
//Action for Update Call Status for Both Side (PATIENT AND DOCTOR) status rejected and not available
export const updateCallStatus = (params, navigation, loading = false) => {
  return async (dispatch) => {
    console.log('params from call end', params);
    var response = await Api._patch(
      TRANSACTION_URL,
      `video-consultations/${params.id}?status=${params.status}`,
      {},
      loading,
    );
    console.log(`video-consultations/${params.id}?status=${params.status}`, 'UPDATE CALL STATUS');
    if (response.status === 200) {
      console.log('respone when call end=========>', response);
      dispatch({ type: UPDATE_CALL_STATUS });
    } else {
      console.log('response call=====>', response.message);
      // Toast.show(response.message);
    }
  };
};
//Action for Add Prescriptions
export const addPrescriptionUser = (params, navigation, loading = false) => {
  return async (dispatch) => {
    console.log(params);
    var response = await Api._post(
      TRANSACTION_URL,
      `prescriptions/user/${params.id}`,
      params,
      loading,
      {
        'Content-Type': 'multipart/form-data',
      },
    );
    // console.log(response,"Add Prescription");
    if (response.status === 200) {
      dispatch({ type: ADD_PRESCRIPTION, payload: response.data.data });
      Snackbar.show({
        text: 'Prescription added successfully.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.green1,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      navigation.goBack();
    } else {
      console.log(response.message);
      // Toast.show(response.message);
    }
  };
};
//Action for Upload Prescriptions with document
export const uploadPrescriptionUser = (params, navigation) => {
  return async (dispatch) => {
    const doc_location = [],
      doc_uri = [];
    params?.document?.map((item) => {
      if (item.hasOwnProperty('uri')) doc_uri.push(item);
      else doc_location.push(item);
    });
    if (doc_uri?.length) {
      dispatch({ type: UPLOAD_DOC_LOADING, payload: true });
      const UPLOAD = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/`;
      const formdata = new FormData();
      doc_uri?.map((item) => {
        formdata.append('files', item);
      });
      // console.log(formdata,'formdata');
      const response = await Api._post(
        UPLOAD,
        'user/file-upload',
        formdata,
        false,
        {
          'Content-Type': 'multipart/form-data',
        },
      );
      // console.log(response);
      if (response.status === 200) {
        dispatch({ type: UPLOAD_DOC_LOADING, payload: false });
        const document = {
          name: doc_uri[0].name,
          ext: doc_uri[0].type,
          location: response?.data?.data[0]?.Location
            ? response?.data?.data[0]?.Location
            : '',
        };
        // console.log('DOCS =============>', document);
        const payload = {
          ...params,
          document: document,
        };
        dispatch(addPrescriptionUser(payload, navigation, true)); // Prescription Call after upload
      } else {
        dispatch({ type: UPLOAD_DOC_LOADING, payload: false });
        Toast.show(
          response.message
            ? response.message
            : 'Could not upload document, try again',
        );
      }
    } else {
      // dispatch(addPrescriptionUser(params, onClose, true)); // Prescription Call no upload
    }
  };
};

//Action for Add Prescriptions for modal
export const addPrescriptionM = (params, onClose, loading = false) => {
  return async (dispatch) => {
    console.log(params);
    var response = await Api._post(
      TRANSACTION_URL,
      'prescriptions',
      params,
      loading,
      {
        'Content-Type': 'multipart/form-data',
      },
    );
    // console.log(response,"Add Prescription");
    if (response.status === 200) {
      dispatch({ type: ADD_PRESCRIPTION, payload: response.data.data });
      Snackbar.show({
        text: 'Prescription added successfully.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.green1,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      onClose();
    } else {
      console.log(response.message);
      // Toast.show(response.message);
    }
  };
};
//Action for Upload Prescriptions with document for modal
export const uploadPrescriptionM = (
  params,
  onClose,
  loading = false,
  callback = () => { },
) => {
  return async (dispatch) => {
    const doc_location = [],
      doc_uri = [];
    params?.document?.map((item) => {
      if (item.hasOwnProperty('uri')) doc_uri.push(item);
      else doc_location.push(item);
    });
    if (doc_uri?.length) {
      dispatch({ type: UPLOAD_DOC_LOADING, payload: true });
      const UPLOAD = `http://tabibbidev-env.eba-pqqdd5xc.us-east-2.elasticbeanstalk.com/`;
      const formdata = new FormData();
      doc_uri?.map((item) => {
        formdata.append('files', item);
      });
      // console.log(formdata,'formdata');
      const response = await Api._post(
        UPLOAD,
        'user/file-upload',
        formdata,
        false,
        {
          'Content-Type': 'multipart/form-data',
        },
      );
      // console.log(response);
      if (response.status === 200) {
        dispatch({ type: UPLOAD_DOC_LOADING, payload: false });
        const document = {
          name: doc_uri[0].name,
          ext: doc_uri[0].type,
          location: response?.data?.data[0]?.Location
            ? response?.data?.data[0]?.Location
            : '',
        };
        // console.log('DOCS =============>', document);
        const payload = {
          ...params,
          document: document,
        };
        dispatch(addPrescriptionM(payload, onClose, true)); // Prescription Call after upload
      } else {
        dispatch({ type: UPLOAD_DOC_LOADING, payload: false });
        Toast.show(
          response.message
            ? response.message
            : 'Could not upload document, try again',
        );
      }
    } else {
      // dispatch(addPrescriptionM(params, onClose, true)); // Prescription Call no upload
    }
  };
};
//Action for Get My Prescriptions
export const getPrescription = (loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `prescriptions`,
      {},
      loading,
    );
    // console.log(response, 'Get My Prescription');
    if (response.status === 200) {
      dispatch({ type: GET_PRESCRIPTION, payload: response.data.data });
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Get My Prescriptions
export const getPrescriptionUser = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `prescriptions/user/${params.id}`,
      {},
      loading,
    );
    // console.log(response, 'Get User Prescription');
    if (response.status === 200) {
      dispatch({ type: GET_PRESCRIPTION, payload: response.data.data });
    } else {
      Toast.show(response.message);
    }
  };
};
//Action for Get Prescriptions by id
export const getPrescriptionDetails = (params, navigation, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `prescriptions/${params.id}`,
      {},
      loading,
    );
    // console.log(response,"Get Prescription Detail");
    if (response.status === 200) {
      dispatch({ type: GET_PRESCRIPTION_DETAIL, payload: response.data.data });
    } else {
      Toast.show(response.message);
    }
  };
};

// Action for Add Reviews
export const addReview = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(TRANSACTION_URL, 'reviews', params, true);
    // console.log(response, 'Add Reviews');
    if (response.status === 200) {
      Toast.show(response.data.message);
      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerStack' }],
      });
      // dispatch({type: ADD_REVIEW});
    } else {
      Toast.show(response.message);
      console.log(response);
    }
  };
};
// Action for Get Reviews
export const getReviews = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      `reviews/${params.id}`,
      {},
      loading,
    );
    // console.log(response, 'Get Reviews');
    if (response.status === 200) {
      dispatch({ type: GET_REVIEWS, payload: response.data.data });
    } else {
      // Toast.show(response.message);
    }
  };
};
// Action for Add Review
export const ConfirmInvoice = (params, navigation) => {
  return async (dispatch) => {
    var response = await Api._post(TRANSACTION_URL, 'invoice', params, true);
    // console.log(response, 'sss');
    if (response.status === 200) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'DrDashboard',
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'DrDashboard',
          },
        ],
      });
      // Toast.show(response.message);
    }
  };
};
//Action for Get Subcriptions
export const getSubscription = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(TRANSACTION_URL, 'subscriptions', {}, false);
    console.log(response);
    if (response.status === 200) {
      dispatch({ type: GET_SUBSCRIPTION_LIST, payload: response.data.data });
    } else {
      Toast.show(response.message);
      console.log('Get Subscription error', response);
    }
  };
};
//Action for Subscribe
export const subscribe = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      'subscriptions',
      params,
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      // Toast.show(response.message);
      dispatch({ type: SUBSCRIBE, payload: response.data.data });
      return 200;
    } else {
      Toast.show(response.message);
      console.log('Subscribe error', response);
      return 400;
    }
  };
};
//Action for my subscription
export const getSubscriptionUser = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._get(
      TRANSACTION_URL,
      'subscriptions/byUser',
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      if (response?.data?.data) {
        dispatch({ type: GET_SUBSCRIPTION, payload: response?.data?.data });
      } else {
        dispatch({ type: GET_SUBSCRIPTION, payload: null });
      }
    } else {
      Toast.show(response.message);
      console.log('Get Subscription error', response);
    }
  };
};
//Action for Cancel Subscription
export const cancelSubscription = (params, loading = false) => {
  return async (dispatch) => {
    var response = await Api._post(
      TRANSACTION_URL,
      `subscriptions/cancel/${params.id}`,
      {},
      loading,
    );
    // console.log(response);
    if (response.status === 200) {
      dispatch({ type: CANCEL_SUBSCRIBE, payload: response.data.data });

      return 200;
    } else {
      Toast.show(response.message);
      console.log('Cancel Subscription error', response);
      return 400;
    }
  };
};
export const review_call = () => {
  return async (dispatch) => {
    dispatch({ type: REVIEW_CALL });
  };
};
export const review_clear = () => {
  return async (dispatch) => {
    dispatch({ type: REVIEW_CLEAR });
  };
};
export const call_clear = () => {
  return async (dispatch) => {
    dispatch({ type: CALL_CLEAR });
  };
};
