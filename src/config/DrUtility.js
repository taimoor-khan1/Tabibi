import Toast from 'react-native-simple-toast';
import validationLabels from '../config/Labels';
import {
  drRegistration,
  drUploadDocument,
  UploadDocument,
  addWalkInPateints,
  addEstDoctors,
  getEditSlot,
  getSchedule,
} from '../store/actions';
import Snackbar from 'react-native-snackbar';
import fonts from '../assets/fonts';
import colors from '../config/Colors';
import moment from 'moment';

const DrUtility = {
  // validate email regex
  validateEmail: function (email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },
  // validate password regex
  validatePassword: function (password) {
    var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(password);
  },
  validateName: function (name) {
    var re = /^[A-Z]+$/i;
    return re.test(name);
  },
  drRegister: function (params, navigation, from, dispatch, endPoint) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !this.validateName(params.firstName)
        ? validationLabels.invalidFirstNameError
        : !params.lastName
        ? validationLabels.validationLastName
        : !this.validateName(params.lastName)
        ? validationLabels.invalidLastNameError
        : !params.email
        ? validationLabels.validationEmail
        : !this.validateEmail(params.email)
        ? validationLabels.validEmail
        : !params.mobileNumber
        ? validationLabels.validPhone
        : params.mobileNumber.length < 7
        ? validationLabels.invalidMobileNumber
        : !params.dob
        ? validationLabels.validationDate
        : !params.password
        ? validationLabels.validationPassword
        : !this.validatePassword(params.password)
        ? validationLabels.validPassword
        : !params.confirmPassword
        ? validationLabels.validationConfirmPassword
        : params.confirmPassword !== params.password
        ? validationLabels.validSamePassword
        : true
    }`;
    if (validation === 'true') {
      const data = {
        firstName: params.firstName,
        lastName: params.lastName,
        mobileNumber: params.mobileNumber,
        countryCode: params.countryCode,
        email: params.email,
        password: params.password,
        dob: params.dob,
        from,
      };
      dispatch(endPoint(data, navigation, from));
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 4,
        action: {
          text: 'ok',
          textColor: colors.dim,
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
    }
  },
  esRegister: function (params, navigation, from, dispatch, endPoint) {
    var validation = `${
      !params.name
        ? validationLabels.validationEstablishment
        : !this.validateName(params.establishmentTitle)
        ? 'Title can only be A-Z characters'
        : !params.email
        ? validationLabels.validationEmail
        : !this.validateEmail(params.email)
        ? validationLabels.validEmail
        : !params.mobileNumber
        ? validationLabels.validPhone
        : params.mobileNumber.length < 7
        ? validationLabels.invalidMobileNumber
        : !params.password
        ? validationLabels.validationPassword
        : !this.validatePassword(params.password)
        ? validationLabels.validPassword
        : true
    }`;
    if (validation === 'true') {
      const data = {
        name: params.name,
        mobileNumber: params.mobileNumber,
        countryCode: params.countryCode,
        email: params.email,
        password: params.password,
        from,
      };
      console.log("data established========>",data)
      dispatch(endPoint(data, navigation, from));
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 4,
        action: {
          text: 'ok',
          textColor: colors.dim,
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
    }
  },
  drInformation: function (data, navigation, dispatch, endPoint) {
    var validation = `${
      !data.country
        ? validationLabels.vallidationCountry
        : !data.city
        ? validationLabels.validationCity
        : !data.address
        ? validationLabels.validationAddress
        : !data.license
        ? validationLabels.uploadMedicalLicense
        : true
    }`;
    if (validation !== 'true') {
      return Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
    // WITH MULTIPLE DOC
    if (data?.document?.length) {
      // console.log(data?.document?.length);
      return dispatch(drUploadDocument(data, navigation, drRegistration));
    }
    // WITHOUT MULTIPLE DOC
    // console.log('AD', data);
    dispatch(drRegistration(data, navigation));
  },
  drlogin: function (params, navigation, endPoint, dispatch) {
    var validation = `${
      !params.email
        ? validationLabels.validationEmail
        : !this.validateEmail(params.email)
        ? validationLabels.validEmail
        : !params.password
        ? validationLabels.validationPassword
        : true
    }`;
    if (validation === 'true') {
      // console.log(JSON.stringify(params));
      dispatch(endPoint(params, navigation));
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  },
  drAvability: function (params, navigation, endPoint, dispatch) {
    var validation = `${
      !params.consultationTypeId
        ? validationLabels.validConsultation
        : !params.posId
        ? validationLabels.validPOC
        : !params.consultationDate
        ? validationLabels.validAvailDate
        : moment(params.consultationDate).format('YYYY-MM-DD') <
          moment(new Date()).format('YYYY-MM-DD')
        ? validationLabels.cannot
        : !params.startTime
        ? validationLabels.validAvailST
        : !params.endTime
        ? validationLabels.validAvailET
        : !params.perSlotTime
        ? validationLabels.validAvailSlot
        : !params.perSlotAmount
        ? validationLabels.valodAvailAmount
        : // : !params.preNotificationId
          // ? validationLabels.validPreNotification
          // : !params.postNotificationId
          // ? validationLabels.postNotification
          true
    }`;
    if (validation === 'true') {
      // console.log('CREATE_SCHEDULE===========>', params)
      dispatch(endPoint(params, navigation, true));
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  },
  walkInPatient: function (navigation, params, dispatch) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !params.lastName
        ? validationLabels.validationLastName
        : // : !params.height
        // ? validationLabels.validHeight
        // : !params.weight
        // ? validationLabels.validWeight
        // : !params.dob
        // ? validationLabels.validationDate
        // : !params.relationship
        // ? validationLabels.validRelation
        // : !params.bloodGroup
        // ? validationLabels.validationBlood
        // : !params.country
        // ? validationLabels.vallidationCountry
        // : !params.city
        // ? validationLabels.validationCity
        // : !params.address
        // ? validationLabels.validationAddress
        // : !params.insuranceDetail
        // ? validationLabels.validationInsurance
        !params.email
        ? validationLabels.validationEmail
        : !this.validateEmail(params.email)
        ? validationLabels.validEmail
        : !params.phoneNumber
        ? validationLabels.validPhone
        : params.phoneNumber.length < 7
        ? validationLabels.invalidMobileNumber
        : // : !params.cardNumber
          // ? validationLabels.validationCard
          // : !params.groupNumber
          // ? validationLabels.groupNumber
          // : !params.insuranceCardFront
          // ? validationLabels.validInsuranceCardFront
          // : !params.insuranceCardBack
          // ? validationLabels.validInsuranceCardBack
          // : !params.medicalDocument
          // ? validationLabels.uploadDocs
          true
    }`;
    // console.log(params);
    if (validation !== 'true')
      return Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    // // WITH MULTIPLE DOC
    if (params?.medicalDocument?.length) {
      // console.log(params?.medicalDocument?.length);
      return dispatch(UploadDocument(params, navigation, addWalkInPateints));
    }

    // WITHOUT MULTIPLE DOC
    dispatch(addWalkInPateints(params, navigation));
  },
  estDoctors: function (navigation, params, dispatch) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !params.lastName
        ? validationLabels.validationLastName
        : !params.email
        ? validationLabels.validationEmail
        : !this.validateEmail(params.email)
        ? validationLabels.validEmail
        : !params.mobileNumber
        ? validationLabels.validPhone
        : params.mobileNumber.length < 7
        ? validationLabels.invalidMobileNumber
        : !params.license
        ? validationLabels.uploadMedicalLicense
        : true
    }`;
    // console.log(params);
    if (validation !== 'true')
      return Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    // // WITH MULTIPLE DOC
    if (params?.document?.length) {
      // console.log(params?.document?.length);
      return dispatch(drUploadDocument(params, navigation, addEstDoctors));
    }

    // WITHOUT MULTIPLE DOC
    dispatch(addEstDoctors(params, navigation));
  },
  drAvabilityEst: function (params, navigation, endPoint, dispatch) {
    var validation = `${
      !params.providerId
        ? validationLabels.validaddDoctor
        : !params.consultationTypeId
        ? validationLabels.validConsultation
        : !params.posId
        ? validationLabels.validPOC
        : !params.consultationDate
        ? validationLabels.validAvailDate
        : !params.startTime
        ? validationLabels.validAvailST
        : !params.endTime
        ? validationLabels.validAvailET
        : !params.perSlotTime
        ? validationLabels.validAvailSlot
        : !params.perSlotAmount
        ? validationLabels.valodAvailAmount
        : true
    }`;
    if (validation === 'true') {
      // console.log('CREATE_SCHEDULE', params);
      dispatch(endPoint(params, navigation, true, true));
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  },
  drEditSlot: function (params, navigation, dispatch) {
    var validation = `${
      !params.consultationTypeId
        ? validationLabels.validConsultation
        : !params.posId
        ? validationLabels.validPOC
        : !params.consultationDate
        ? validationLabels.validAvailDate
        : !params.startTime
        ? validationLabels.validAvailST
        : !params.endTime
        ? validationLabels.validAvailET
        : !params.perSlotTime
        ? validationLabels.validAvailSlot
        : !params.perSlotAmount
        ? validationLabels.valodAvailAmount
        : true
    }`;
    if (validation === 'true') {
      // console.log('Edit Slot', params);
      dispatch(getEditSlot(params, true)).then((text) => {
        if (text === 200) {
          const payload = {
            period: moment(params.consultationDate).format('YYYY-MM'), // curent day month
          };
          // console.log(payload)
          dispatch(getSchedule(payload, true));
          navigation.goBack();
        }
      });
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  },
};
export default DrUtility;
