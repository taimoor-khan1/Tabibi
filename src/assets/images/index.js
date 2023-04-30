import config from '../../config';
export const assets = {
  checkedBox: require('./checked-box.png'),
  checkbox: require('./check-box.png'),
  whiteCheckedBox: require('./white-checked-box.png'),
  whiteCheckbox: require('./white-check-box.png'),
  forgotPwd:
    config.api.version === 'PATIENT'
      ? require('././ForgotPassword-white.png')
      : require('./ForgotPassword.png'),
  login_bg:
    config.api.version === 'PATIENT'
      ? require('./splash-bg.png')
      : require('./login-bg.png'),
  login_bg1: require('./login-bg.png'),
  login_logo1: require('./login-logo.png'),
  login_logo:
    config.api.version === 'PATIENT'
      ? require('./splash-logo.png')
      : require('./login-logo.png'),
  logo_header:
    config.api.version === 'PATIENT'
      ? require('./inner-logo-white.png')
      : require('./login-other-logo.png'),
  newpass:
    config.api.version === 'PATIENT'
      ? require('./CreateNewPassword-white.png')
      : require('./newpass.png'),
  splash_bg:
    config.api.version === 'DOCTOR'
      ? require('./login-bg.png')
      : require('./splash-bg.png'),
  splash_logo:
    config.api.version === 'DOCTOR'
      ? require('./login-logo.png')
      : require('./splash-logo.png'),
  verification:
    config.api.version === 'PATIENT'
      ? require('./VerificationCode-white.png')
      : require('./Verification.png'),
  bottom_image: require('./bottom-image.png'),
  inner_logoWhite: require('./inner-logo-white.png'),
  search_bg: require('./search-bg.png'),
  search_filter: require('./search-filter.png'),
  search: require('./search.png'),
  searchIc: require('./SearchIc.png'),
  avatar: require('./avatar.png'),
  close: require('./close.png'),
  closeW: require('./closeW.png'),
  pin: require('./pin.png'),
  add: require('./Add.png'),
  closeRed: require('./CloseRed.png'),
  addWhite: require('./Add-White.png'),
  opportunity: require('./opportunity.png'),
  bookAppointment: require('./BookAppointment.png'),
  intro_bg: require('./intro-bg.png'),
  indi: require('./indi.png'),
  hospital: require('./est.png'),
  headerBg:
    config.api.version === 'DOCTOR'
      ? require('./dr-bg.png')
      : require('./patient-bg.png'),
  menu: require('./menu.png'),
  sucessfull: require('./Successful.png'),
  videoCall: require('./VideoCall.png'),
  videoCallWhite: require('./VideoCallWhite.png'),
  walkin: require('./walkin.png'),
  walkinWhite: require('./walkinWhite.png'),
  dateIcon: require('./Date.png'),
  timeIcon: require('./Time.png'),
  creditCard: require('./credit-card.png'),
  download: require('./Download.png'),
  downloadred: require('./DownloadRed.png'),
  whiteCross: require('./whiteCross.png'),
  bell: require('./NotificationBlue.png'),
  Notification: require('./Notification.png'),
  lock: require('./Lock.png'),
  locationPin: require('./LocationPin.png'),
  editPencile: require('./Pencile.png'),
  editPencileBlue: require('./BlueEdit.png'),
  email: require('./Email.png'),
  call: require('./Call.png'),
  UplaodProfile: require('./UplaodProfile.png'),
  chat: require('./chat.png'),
  // chatClose: require('./chatclose.png'),
  dropCall: require('./DropCall.png'),
  cam: require('./cam.png'),
  video: require('./video.png'),
  videoOn: require('./videoOn.png'),
  videoOff: require('./HideCam.png'),
  mic: require('./mic.png'),
  micOn: require('./micOn.png'),
  overlayCall: require('./Overly.png'),
  prescribe: require('./Prescribe.png'),
  VideoImg: require('./Video-Image.png'),
  scheduleIcon: require('./Schedule.png'),
  timeLeft: require('./Time.png'),
  videBlue: require('./video.png'),
  chatBlue: require('./chatBlue.png'),
  watch: require('./Watch.png'),
  blueBellM: require('./BellIcon.png'),
  uploadFiles: require('./UploadFiles.png'),
  plus: require('./plus.png'),
  profile: {
    uri: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png',
  },
  masterCard: require('./master.png'),
  dummy: require('./dummy.png'),
  url: 'https://tabibbi-dev-bucket.s3.us-east-2.amazonaws.com/avatar.png',
  cross: require('./cross.png'),
  redPin: require('./RedPin.png'),
  camera: require('./camera.png'),
  gallery: require('./gallery.png'),
  markerPin: require('./markerPin.png'),
  day: require('./Day.png'),
  day3: require('./ThreeDays.png'),
  week: require('./Weekly.png'),
  month: require('./month.png'),
  bgOverlay: require('./bgOverlay.png'),
  clear: require('./clear.png'),
  delete: require('./delet.png'),
  preImg: require('./prescriptionImg.png'),
  deleteNotification: require('./DeleteNotifi.png'),
  notificatioSetup: require('./NotificationSetup.png'),
  addNewPoc: require('./AddNewPoc.png'),
  homeVisit: require('./HomeVisit.png'),
  screenShot: require('./screenshot.png'),
};
