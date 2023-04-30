// AUTH
export const REGISTRATION = 'REGISTRATION'
export const LOGIN = 'LOGIN'
export const FAILURE = 'FAILURE'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const VERIFY_CODE = 'VERIFY_CODE'
export const RESEND_CODE = 'RESEND_CODE'
export const LOGOUT = 'LOGOUT'
export const SET_TOKEN = 'SET_TOKEN'
export const MY_PROFILE = 'MY_PROFILE'
export const SET_ROLE = 'SET_ROLE'
export const CHECK_EMAIL = 'CHECK_EMAIL'
export const UPLOAD_DOC_LOADING = 'UPLOAD_DOC_LOADING'
export const UPLOAD_DOC_URL = 'UPLOAD_DOC_URL'
export const UPDATE_DEVICE_TOKEN = 'UPDATE_DEVICE_TOKEN'
export const FCMTOKEN = 'FCMTOKEN'
export const VOIPTOKEN = 'VOIPTOKEN'
export const LOADING = 'LOADING'
export const HELP_CONTACT = 'HELP_CONTACT'
export const BLOCK_USER = 'BLOCK_USER'
export const COMPLAIN = 'COMPLAIN'
export const APP_VERSION = 'APP_VERSION'
export const SAVE_DOCTOR = 'SAVE_DOCTOR'

// DOCTOR
export const ADD_DETAIL = 'ADD_DETAIL'
export const GET_DETAIL = 'GET_DETAIL'
export const CLEAR_DETAIL = 'CLEAR_DETAIL'
export const ADD_LOCATION = 'ADD_LOCATION'
export const GET_LOCATION = 'GET_LOCATION'
export const DELETE_LOCATION = 'DELETE_LOCATION'
export const CREATE_POC = 'CREATE_POC'
export const CLEAR_POC = 'CLEAR_POC'
export const DELETE_POC = 'DELETE_POC'
export const GET_POS = 'GET_POS' //get purpose of schedule
export const ADD_POS = 'ADD_POS' // add purpose of schedule
export const DELETE_POS = 'DELETE_POS' // delete purpose of schedule
export const SEARCH_POC = 'SEARCH_POC' // GET POC AND SEARCH POC
export const CREATE_SCHEDULE = 'CREATE_SCHEDULE' //Create new schedule and its slots
export const CLEAR_SCHEDULE = 'CLEAR_SCHEDULE'
export const GET_SCHEDULE = 'GET_SCHEDULE' // get all schedule for calendar view
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE' // delete per day schedule
export const MY_AVAILABLE_SCHEDULE = 'MY_AVAILABLE_SCHEDULE' // available schedule for Reschedule
export const GET_DR_DASHBOARD = 'GET_DASHBOARD' //Dashboard POC TAB
export const GET_DR_APPOINTMENT = 'GET_DR_APPOINTMENT' //Dashboard APPOINTMENT TAB
export const GET_DAY_APPOITMENT = 'GET_DAY_APPOITMENT' //per day appointment
export const GET_APPOINTMENTS = 'GET_APPOINTMENTS' // for patient
export const GET_CONSULTATIONS = 'GET_CONSULATION' //Doctor Side Consulations list
export const GET_PATIENTS = 'GET_PATIENTS' // Get all patient by ID's
export const GET_PATIENT_DETAIL = 'GET_PATIENT_DETAIL' //Get Patient detail by ID's
export const GET_DOCTOR_AVAILABILITY = 'GET_DOCTOR_AVAILABILITY'
export const MY_AVAILABLE_SLOTS = 'MY_AVAILABLE_SLOTS' // available slots for appointment current dr
export const DELETE_SLOT = 'DELETE_SLOT' // delete per slot
export const EDIT_SLOT = 'EDIT_SLOT' // edit per slot
export const SEARCH_PATIENT = 'SEARCH_PATIENT' // search patients for appointment
export const ADD_PATIENT_APPOINTMENT = 'ADD_PATIENT_APPOINTMENT' // Add new walkin patients for appointment
export const WALKIN_APPOINTMENT = 'WALKIN_APPOINTMENT' // book walk-in appointments
export const GET_PROVIDER_PATIENTS = 'GET_PROVIDER_PATIENTS' // get provider patients by id
export const DR_ADD_CARD = 'DR_ADD_CARD'
export const DR_GET_CARD = 'DR_GET_CARD'
export const DR_DELETE_CARD = 'DR_DELETE_CARD'
export const GET_PATIENT_PAYMENT_DETAIL = 'GET_PATIENT_PAYMENT_DETAIL'
export const MY_PATIENTS = 'MY_PATIENTS' //GET ALL MY PATIENTS LIST
export const GET_PAYOUTS = 'GET_PAYOUTS' //GET_PAYOUTS
export const GET_SCHEDULE_STATS = ' GET_SCHEDULE_STATS'
export const GET_APPOINTMENT_STATS = ' GET_APPOINTMENT_STATS'
export const GET_MY_EARNINGS = 'GET_MY_EARNINGS'

// PATIENT
export const GET_LOVED_ONES = 'GET_LOVED_ONES'
export const GET_LOVED_ONES_BY_ID = 'GET_LOVED_ONES_BY_ID'
export const ADD_LOVED_ONES = 'ADD_LOVED_ONES'
export const DELETE_LOVED_ONES = 'DELETE_LOVED_ONES'
export const SEARCH_DOCTOR = 'SEARCH_DOCTOR'
export const DOCTOR_SUGGESTION = 'DOCTOR_SUGGESTION'
export const SEARCH_DOCTOR_PROFILE = 'SEARCH_DOCTOR_PROFILE'
export const SEARCH_EST_PROFILE = 'SEARCH_EST_PROFILE'
export const GET_POC = 'GET_POC'
export const GET_CONSULTATION_TYPE = 'GET_CONSULTATION_TYPE'
export const ADD_CARD = 'ADD_CARD'
export const GET_CARD = 'GET_CARD'
export const DELETE_CARD = 'DELETE_CARD'
export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT'
export const PROVIDERS_LIST = 'PROVIDERS_LIST'
export const APPOINTMENT_DETAIL = 'APPOINTMENT_DETAIL'
export const SLOT_INFO = 'SLOT_INFO'
export const GET_DOCTOR_SLOTS = 'GET_DOCTOR_SLOTS'
export const INVOICE_BY_ID = 'INVOICE_BY_ID'
export const HOME_DASHBOARD = 'HOME_DASHBOARD'

//CALLING
export const CREATE_CALL = 'CREATE_CALL'
export const CALL_ACCEPTED = 'CALL_ACCEPTED'
export const CALL_END = 'CALL_END'
export const CALL_CLEAR = 'CALL_CLEAR'
export const UPDATE_CALL_STATUS = 'UPDATE_CALL_STATUS'
export const REVIEW_CALL = 'REVIEW_CALL'
export const ADD_REVIEW = 'ADD_REVIEW'
export const GET_REVIEWS = 'GET_REVIEWS'
export const REVIEW_CLEAR = 'REVIEW_CLEAR'
export const IS_DOCTOR = 'IS_DOCTOR'
export const ADD_PRESCRIPTION = 'ADD_PRESCRIPTION'
export const GET_PRESCRIPTION = 'GET_PRESCRIPTION'
export const GET_PRESCRIPTION_DETAIL = 'GET_PRESCRIPTION_DETAIL'
export const CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT'
export const COMPLETE_WALKIN_APPOINTMENT = 'COMPLETE_WALKIN_APPOINTMENT'

//ESTABLISHMENTS
export const SET_EST_DOCTOR = 'SET_EST_DOCTOR'
export const GET_EST_DOCTORS = 'GET_EST_DOCTORS'
export const ADD_EST_DOCTORS = 'ADD_EST_DOCTORS'
export const CREATE_SCHEDULE_EST = 'CREATE_SCHEDULE_EST'
export const GET_SCHEDULE_EST = 'GET_SCHEDULE_EST'
export const GET_PATIENT_EST_DOCTORS = 'GET_PATIENT_EST_DOCTORS'

//SUBSCRIPTION
export const GET_SUBSCRIPTION = 'GET_SUBSCRIPTION'
export const GET_SUBSCRIPTION_LIST = 'GET_SUBSCRIPTION_LIST'
export const SUBSCRIBE = 'SUBSCRIBE'
export const CANCEL_SUBSCRIBE = 'CANCEL_SUBSCRIBE'

//NOTIFICATION
export const GET_NOTIFICATION = 'GET_NOTIFICATION'
export const NOTIFICATION_SETTING = 'NOTIFICATION_SETTING'
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION'
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION'
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION'
export const ACKNOLEDGEMENT_NOTIFICATION = 'ACKNOLEDGEMENT_NOTIFICATION'
export const REJECT = 'REJECT'
