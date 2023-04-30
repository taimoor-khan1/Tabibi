import {
  GET_DR_DASHBOARD,
  GET_DR_APPOINTMENT,
  GET_DAY_APPOITMENT,
  ADD_DETAIL,
  CLEAR_DETAIL,
  GET_DETAIL,
  ADD_LOCATION,
  GET_LOCATION,
  LOGOUT,
  CREATE_POC,
  SEARCH_POC,
  GET_POS,
  ADD_POS,
  DELETE_POS,
  CREATE_SCHEDULE,
  GET_SCHEDULE,
  CLEAR_SCHEDULE,
  GET_APPOINTMENTS,
  GET_DOCTOR_AVAILABILITY,
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
  CREATE_SCHEDULE_EST,
  GET_SCHEDULE_EST,
  CLEAR_POC,
  CANCEL_APPOINTMENT,
  COMPLETE_WALKIN_APPOINTMENT,
  GET_PROVIDER_PATIENTS,
  LOADING,
  DR_ADD_CARD,
  DR_GET_CARD,
  GET_PRESCRIPTION,
  MY_PATIENTS,
  GET_SCHEDULE_STATS,
  GET_APPOINTMENT_STATS,
  GET_MY_EARNINGS,
  GET_PATIENT_PAYMENT_DETAIL,
  GET_NOTIFICATION,
  NOTIFICATION_SETTING,
  GET_PAYOUTS,
} from '../constants'

const INITIAL_STATE = {
  drDashboard: [],
  drAppointment: [],
  dayAppointment: [],
  loading: false,
  getProfileDetail: {},
  addLocation: false,
  getlocation: [],
  patientDetail: {},
  addProfileDetail: false,
  POC: [],
  POS: [],
  addedPOC: {},
  addedPOS: {},
  AllSchedule: [],
  availableSchedule: [],
  allNotification: [],
  notificationSetting: [],
  allSchStats: [],
  allAppointStats: [],
  myEarning: {},
  patientPaymentDetail: {},
  addSchedule: false,
  AppointmentList: [],
  doctorAvailabilty: [],
  consultaionList: [],
  consultaionData: [],
  availableSlots: [],
  patientsSearch: [],
  addNewPatient: {},
  walkInAppointment: false,
  addEstDoctor: {},
  establishmentDoctor: [],
  providerPatients: [],
  creditsCards: [],
  addCreditCard: false,
  getProfileDetail: {},
  allPatients: [],
  completeWalkIn: {},
  payouts: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...INITIAL_STATE,
      }
    case GET_DR_DASHBOARD:
      return {
        ...state,
        drDashboard: action.payload,
      }
    case GET_DR_APPOINTMENT:
      return {
        ...state,
        drAppointment: action.payload,
      }
    case GET_DAY_APPOITMENT:
      return {
        ...state,
        dayAppointment: action.payload,
      }
    case GET_DETAIL:
      return {
        ...state,
        getProfileDetail: action.payload,
      }
    case ADD_LOCATION:
      return {
        ...state,
        addLocation: action.payload,
      }
    case GET_LOCATION:
      return {
        ...state,
        getlocation: action.payload,
      }
    case GET_PRESCRIPTION:
      return {
        ...state,
        prescriptions: action.payload,
      }
    case ADD_DETAIL:
      return {
        ...state,
        addProfileDetail: action.payload,
      }
    case CLEAR_DETAIL:
      return {
        ...state,
        addProfileDetail: false,
      }
    case SEARCH_POC:
      return {
        ...state,
        POC: action.payload,
      }
    case CREATE_POC:
      return {
        ...state,
        addedPOC: action.payload,
      }
    case CLEAR_POC:
      return {
        ...state,
        addedPOC: action.payload,
      }
    case GET_POS:
      return {
        ...state,
        POS: action.payload,
      }
    case ADD_POS:
      return {
        ...state,
        addedPOS: action.payload,
      }
    case GET_SCHEDULE:
      return {
        ...state,
        AllSchedule: action.payload,
      }
    case GET_SCHEDULE_EST:
      return {
        ...state,
        AllSchedule: action.payload,
      }
    case CREATE_SCHEDULE:
      return {
        ...state,
        addSchedule: action.payload,
      }
    case CREATE_SCHEDULE_EST:
      return {
        ...state,
        addSchedule: action.payload,
      }
    case CLEAR_SCHEDULE:
      return {
        ...state,
        addSchedule: action.payload,
      }
    case GET_APPOINTMENTS:
      return {
        ...state,
        AppointmentList: action.payload,
      }
    case GET_DOCTOR_AVAILABILITY:
      return {
        ...state,
        doctorAvailabilty: action.payload,
      }
    case GET_PATIENTS:
      return {
        ...state,
        consultaionList: action.payload,
        loading: false,
      }
    case GET_CONSULTATIONS:
      return {
        ...state,
        consultaionData: action.payload,
      }
    case GET_PATIENT_DETAIL:
      return {
        ...state,
        patientDetail: action.payload,
      }
    case MY_AVAILABLE_SLOTS:
      return {
        ...state,
        availableSlots: action.payload,
      }
    case MY_AVAILABLE_SCHEDULE:
      return {
        ...state,
        availableSchedule: action.payload,
      }
    case SEARCH_PATIENT:
      return {
        ...state,
        patientsSearch: action.payload,
      }
    case ADD_PATIENT_APPOINTMENT:
      return {
        ...state,
        addNewPatient: action.payload,
      }
    case WALKIN_APPOINTMENT:
      return {
        ...state,
        walkInAppointment: action.payload,
      }
    case GET_PROVIDER_PATIENTS:
      return {
        ...state,
        providerPatients: action.payload,
      }
    case ADD_EST_DOCTORS:
      return {
        ...state,
        addEstDoctor: action.payload,
      }
    case GET_EST_DOCTORS:
      return {
        ...state,
        establishmentDoctor: action.payload,
      }
    case CANCEL_APPOINTMENT:
      return {
        ...state,
        cancelAppointment: action.payload,
      }
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case DR_ADD_CARD:
      return {
        ...state,
        addCreditCard: action.payload,
      }
    case DR_GET_CARD:
      return {
        ...state,
        creditsCards: action.payload,
      }
    case MY_PATIENTS:
      return {
        ...state,
        allPatients: action.payload,
      }
    case COMPLETE_WALKIN_APPOINTMENT:
      return {
        ...state,
        wailkInComplete: action.payload,
      }
    case GET_NOTIFICATION:
      return {
        ...state,
        allNotification: action.payload,
      }
    case NOTIFICATION_SETTING:
      return {
        ...state,
        notificationSetting: action.payload,
      }
    case GET_SCHEDULE_STATS:
      return {
        ...state,
        allSchStats: action.payload,
      }
    case GET_APPOINTMENT_STATS:
      return {
        ...state,
        allAppointStats: action.payload,
      }
    case GET_MY_EARNINGS:
      return {
        ...state,
        myEarning: action.payload,
      }
    case GET_PATIENT_PAYMENT_DETAIL:
      return {
        ...state,
        patientPaymentDetail: action.payload,
      }
    case GET_PAYOUTS:
      return {
        ...state,
        payouts: action.payload,
      }
    default:
      return state
  }
}
