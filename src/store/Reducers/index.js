import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import PatientReducer from './PatientReducer';
import DoctorReducer from './DoctorReducer';
import CallingReducer from './CallingReducer';
export default combineReducers({
  Auth: AuthReducer,
  Patient: PatientReducer,
  Doctor: DoctorReducer,
  Calling: CallingReducer
});
