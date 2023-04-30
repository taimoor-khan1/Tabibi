import {
  LOGIN,
  LOGIN_SUCCESS,
  FAILURE,
  REGISTRATION,
  MY_PROFILE,
  SET_TOKEN,
  SET_ROLE,
  LOGOUT,
  UPLOAD_DOC_URL,
  UPLOAD_DOC_LOADING,
  FCMTOKEN,
  HELP_CONTACT,
  COMPLAIN,
  APP_VERSION,
  VOIPTOKEN,
  SET_EST_DOCTOR,
  SAVE_DOCTOR,
} from '../constants'

const INITIAL_STATE = {
  user: {},
  profile: {},
  token: {},
  estDoc: null,
  role: null,
  uploadDocURL: [],
  uploadDocLoading: false,
  fcmtoken: '',
  voiptoken: '',
  contactUs: {},
  complain: {},
  appversion: '',
  saveDoctor: null,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...INITIAL_STATE,
      }
    case FAILURE:
      return {
        ...INITIAL_STATE,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
      }
    case LOGOUT:
      return {
        ...INITIAL_STATE,
      }
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      }
    case SET_ROLE:
      return {
        ...state,
        role: action.payload,
      }
    case SET_EST_DOCTOR:
      return {
        ...state,
        estDoc: action.payload,
      }
    case REGISTRATION:
      return {
        ...state,
        user: action.payload,
      }
    case MY_PROFILE:
      return {
        ...state,
        profile: action.payload,
      }
    case UPLOAD_DOC_URL:
      return {
        ...state,
        uploadDocURL: action.payload,
      }
    case UPLOAD_DOC_LOADING:
      return {
        ...state,
        uploadDocLoading: action.payload,
      }
    case FCMTOKEN:
      return {
        ...state,
        fcmtoken: action.payload,
      }
    case VOIPTOKEN:
      return {
        ...state,
        voiptoken: action.payload,
      }
    case HELP_CONTACT:
      return {
        ...state,
        contactUs: action.payload,
      }
    case COMPLAIN:
      return {
        ...state,
        complain: action.payload,
      }
    case APP_VERSION:
      return {
        ...state,
        appversion: action.payload,
      }
    case SAVE_DOCTOR:
      return {
        ...state,
        saveDoctor: action.payload,
      }
    default:
      return state
  }
}
