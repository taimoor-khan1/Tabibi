import {
  CREATE_CALL,
  CALL_ACCEPTED,
  CALL_END,
  CALL_CLEAR,
  REVIEW_CALL,
  ADD_REVIEW,
  UPDATE_CALL_STATUS,
  REVIEW_CLEAR,
  ADD_PRESCRIPTION,
  GET_PRESCRIPTION,
  GET_PRESCRIPTION_DETAIL,
  GET_SUBSCRIPTION,
  GET_SUBSCRIPTION_LIST,
  SUBSCRIBE, //
  CANCEL_SUBSCRIBE,
} from '../constants';

const INITIAL_STATE = {
  session: null,
  nav: false,
  reviewModal: false,
  call_accepted: false,
  prescriptions: {},
  prescriptionsDetail: {},
  addPrescriptions: false,
  subscriptions: null,
  subscriptionsList: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_CALL:
      return {
        ...state,
        session: action.payload,
        nav: true,
      };
    case REVIEW_CALL:
      return {
        ...state,
        nav: false,
        reviewModal: true,
      };
    case ADD_REVIEW:
      return {
        ...state,
        reviewModal: false,
        session: null,
      };
    case REVIEW_CLEAR:
      return {
        ...state,
        reviewModal: false,
      };
    case CALL_ACCEPTED:
      return {
        ...state,
        call_accepted: true,
      };
    case CALL_END:
      return {
        ...state,
        call_accepted: false,
      };
    case CALL_CLEAR:
      return {
        ...state,
        reviewModal: false,
        call_accepted: false,
      };
    case ADD_PRESCRIPTION:
      return {
        ...state,
        prescriptions: action.payload,
      };
    case GET_PRESCRIPTION:
      return {
        ...state,
        prescriptions: action.payload,
      };
    case GET_PRESCRIPTION_DETAIL:
      return {
        ...state,
        prescriptionsDetail: action.payload,
      };
    case GET_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: action.payload,
      };
    case GET_SUBSCRIPTION_LIST:
      return {
        ...state,
        subscriptionsList: action.payload,
      };
    default:
      return state;
  }
};
