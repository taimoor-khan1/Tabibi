import {
  LOGOUT,
  GET_LOVED_ONES,
  GET_LOVED_ONES_BY_ID,
  ADD_LOVED_ONES,
  SEARCH_DOCTOR,
  SEARCH_DOCTOR_PROFILE,
  GET_CONSULTATION_TYPE,
  GET_POC,
  ADD_CARD,
  GET_CARD,
  BOOK_APPOINTMENT,
  APPOINTMENT_DETAIL,
  PROVIDERS_LIST,
  SEARCH_EST_PROFILE,
  GET_PATIENT_EST_DOCTORS,
  GET_REVIEWS,
  GET_DOCTOR_SLOTS,
  DOCTOR_SUGGESTION,
  INVOICE_BY_ID,
  GET_NOTIFICATION,
  HOME_DASHBOARD,
  REJECT,
  SLOT_INFO,
} from '../constants';

const INITIAL_STATE = {
  dashboard: [],
  reject:null,
  getLovedOnes: [],
  lovedOneById: [],
  addLovedOne: false,
  doctorList: [],
  searchDoctorProfile: {},
  getConsultationlist: [],
  POClist: [],
  creditsCards: [],
  addCreditCard: false,
  providersList: [],
  appointmentList: [],
  appointmentDetail: {},
  patientEstDoctors: [],
  reviews: [],
  getAppointmentSlots: [],
  suggestions: {},
  getInvoice: {},
  allNotification: [],
  slotInfo: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REJECT:
      return {
        ...state,
        reject:action.payload
      };
    case LOGOUT:
      return {
        ...INITIAL_STATE,
      };
    case GET_LOVED_ONES: {
      return {
        ...state,
        getLovedOnes: action.payload,
      };
    }
    case GET_LOVED_ONES_BY_ID: {
      return {
        ...state,
        lovedOneById: action.payload,
      };
    }
    case INVOICE_BY_ID: {
      return {
        ...state,
        getInvoice: action.payload,
      };
    }
    case GET_DOCTOR_SLOTS: {
      return {
        ...state,
        getAppointmentSlots: action.payload,
      };
    }
    case ADD_LOVED_ONES:
      return {
        ...state,
        addLovedOne: action.payload,
      };
    case SEARCH_DOCTOR:
      return {
        ...state,
        doctorList: action.payload,
      };
    case SEARCH_DOCTOR_PROFILE:
      return {
        ...state,
        searchDoctorProfile: action.payload,
      };
    case SEARCH_EST_PROFILE:
      return {
        ...state,
        searchDoctorProfile: action.payload,
      };
    case GET_CONSULTATION_TYPE:
      return {
        ...state,
        getConsultationlist: action.payload,
      };
    case GET_POC:
      return {
        ...state,
        POClist: action.payload,
      };
    case ADD_CARD:
      return {
        ...state,
        addCreditCard: action.payload,
      };
    case GET_CARD:
      return {
        ...state,
        creditsCards: action.payload,
      };
    case BOOK_APPOINTMENT:
      return {
        ...state,
        appointmentList: action.payload,
      };
    case PROVIDERS_LIST:
      return {
        ...state,
        providersList: action.payload,
      };
    case APPOINTMENT_DETAIL:
      return {
        ...state,
        appointmentDetail: action.payload,
      };
    case GET_PATIENT_EST_DOCTORS:
      return {
        ...state,
        patientEstDoctors: action.payload,
      };
    case GET_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
      };
    case DOCTOR_SUGGESTION:
      return {
        ...state,
        suggestions: action.payload,
      };
    case GET_NOTIFICATION:
      return {
        ...state,
        allNotification: action.payload,
      };
    case HOME_DASHBOARD:
      return {
        ...state,
        dashboard: action.payload,
      };
    case SLOT_INFO:
      return {
        ...state,
        slotInfo: action.payload,
      };
    default:
      return state;
  }
};
