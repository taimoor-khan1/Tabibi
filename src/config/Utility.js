import Toast from 'react-native-simple-toast';
import validationLabels from '../config/Labels';
import {addLovedOnes, updateProfile, UploadDocument} from '../store/actions';
import Snackbar from 'react-native-snackbar';
import fonts from '../assets/fonts';
import colors from '../config/Colors';

const Utility = {
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

  // signup screen check validation and call register API
  register: function (navigation, params, endPoint, dispatch) {
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
        : !params.phoneNumber
        ? validationLabels.validPhone
        : params.phoneNumber.length < 7
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
        : !params.agreed
        ? validationLabels.validationTerms
        : true
    }`;
    if (validation === 'true') {
      dispatch(endPoint(navigation, params));
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
  // verify code screen check validation and call verify code API
  verifyCode: function (navigation, params, endPoint, dispatch) {
    console.log(params, 'verification-params');
    if (params.code === '' || params.code.length < 4) {
      Toast.show(validationLabels.validationOtp);
      Snackbar.show({
        text: validationLabels.validationOtp,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    } else {
      dispatch(endPoint(navigation, params));
    }
  },
  // Resend code screen check validation and call verify code API
  resendCode: function (params, endPoint, dispatch) {
    dispatch(endPoint(params));
  },
  // login screen check validation and call login API
  login: function (params, navigation, endPoint, dispatch, saveDoctor) {
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
      dispatch(endPoint(params, navigation, saveDoctor));
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
  // verify code screen check validation and call verify code API
  changePassword: function (params, navigation, endPoint, dispatch) {
    var validation = `${
      !params.currentPassword
        ? 'Please enter current password'
        : !params.password
        ? validationLabels.validationNPassword
        : !params.confirmPassword
        ? validationLabels.validationConfirmPassword
        : params.confirmPassword !== params.password
        ? validationLabels.validSamePassword
        : !this.validatePassword(params.password)
        ? validationLabels.validPassword
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
  updateProfile: function (params, navigation, dispatch) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !params.lastName
        ? validationLabels.validationLastName
        : // : !params.bloodGroup
        // ? validationLabels.validationBlood
        !params.dob
        ? validationLabels.validationDate
        : // : !params.country
          // ? validationLabels.vallidationCountry
          // : !params.city
          // ? validationLabels.validationCity
          // : !params.address
          // ? validationLabels.validationAddress
          // : !params.insuranceDetail
          // ? validationLabels.validationInsurance
          // : !params.cardNumber
          // ? validationLabels.validationCard
          // : !params.groupNumber
          // ? validationLabels.groupNumber
          // : !params.phoneNumber
          // ? validationLabels.validPhone
          // : params.phoneNumber.length < 7
          // ? validationLabels.invalidMobileNumber
          true
    }`;

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
      return dispatch(UploadDocument(params, navigation, updateProfile));
    }

    // WITHOUT MULTIPLE DOC
    dispatch(updateProfile(params, navigation));
  },
  updateProfileDr: function (params, navigation, endPoint, dispatch) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !params.lastName
        ? validationLabels.validationLastName
        : !params.address
        ? validationLabels.validationAddress
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
  forgotPassword: function (params, endPoint, dispatch, navigation) {
    if (params.email === '') {
      Snackbar.show({
        text: validationLabels.validationEmail,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    } else {
      dispatch(endPoint(params, navigation));
    }
  },
  verifyForgotPassCode: function (navigation, params, endPoint, dispatch) {
    if (params.verification === '' || params.verification.length < 4) {
      Snackbar.show({
        text: validationLabels.validationOtp,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    } else {
      dispatch(endPoint(navigation, params));
    }
  },
  resetPassword: function (navigation, params, endPoint, dispatch) {
    if (params.password === '') {
      Snackbar.show({
        text: validationLabels.validationPassword,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    } else if (!this.validatePassword(params.password)) {
      Snackbar.show({
        text: validationLabels.validPassword,
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
    } else if (params.confirmPassword == '') {
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
    } else if (params.password !== params.confirmPassword) {
      Snackbar.show({
        text: validationLabels.validSamePassword,
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
    } else {
      dispatch(endPoint(navigation, params));
    }
  },
  addLovedOne: function (params, navigation, dispatch) {
    var validation = `${
      !params.firstName
        ? validationLabels.validationName
        : !params.lastName
        ? validationLabels.validationLastName
        : // : !params.email
        // ? validationLabels.validationEmail
        // : !this.validateEmail(params.email)
        // ? validationLabels.validEmail
        // : !params.weight
        // ? validationLabels.validWeight
        !params.relationship
        ? validationLabels.validRelation
        : !params.gender
        ? validationLabels.validGender
        : // : !params.bloodGroup
        // ? validationLabels.validationBlood
        !params.dob
        ? validationLabels.validationDate
        : // : !params.country
          // ? validationLabels.vallidationCountry
          // : !params.city
          // ? validationLabels.validationCity
          // : !params.address
          // ? validationLabels.validationAddress
          // : !params.insuranceDetail
          // ? validationLabels.validationInsurance
          // : !params.cardNumber
          // ? validationLabels.validationCard
          // : !params.groupNumber
          // ? validationLabels.groupNumber
          // : !params.insuranceCardFront
          // ? validationLabels.validInsuranceCardFront
          // : !params.insuranceCardBack
          // ? validationLabels.validInsuranceCardBack
          // : !params.medicalDocument.length
          // ? validationLabels.validMedicalDocument
          true
    }`;
    if (validation === 'true') {
      // console.log(params)
      dispatch(UploadDocument(params, navigation, addLovedOnes));
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
  uploadDocURL: function (params, endPoint, dispatch) {
    var validation = `${
      !params.doc.length ? validationLabels.selectImagetoUpload : true
    }`;
    if (validation === 'true') {
      // console.log(JSON.stringify(params));
      dispatch(endPoint(params, navigation, false));
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

export default Utility;
