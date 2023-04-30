import { I18nManager } from 'react-native';

const labels = {

  selectImagetoUpload: I18nManager.isRTL
    ? 'الرجاء تحديد الوثيقة للتحميل'
    : 'Please select document to upload',
  validationEmail: I18nManager.isRTL
    ? 'رجاءا أدخل بريدك الإلكتروني'
    : 'Please enter your email',
  validEmail: I18nManager.isRTL
    ? 'البريد الإلكتروني غير صالح'
    : 'Email is not valid',
  validationPassword: I18nManager.isRTL
    ? 'الرجاء إدخال كلمة المرور'
    : 'Please enter password',
  invalidFirstNameError: I18nManager.isRTL
    ? 'الاسم الأول غير صالح'
    : 'Invalid first name',
  invalidLastNameError: I18nManager.isRTL
    ? 'اسم العائلة غير صالح'
    : 'Invalid last name',
  invalidMobileNumber: I18nManager.isRTL
    ? 'رقم الجوال غير صالح'
    : 'Invalid mobile number',
  validationMessage: I18nManager.isRTL
    ? 'الرجاء إدخال الرسالة'
    : 'Please enter message',
  validationConfirmPassword: I18nManager.isRTL
    ? 'الرجاء إدخال تأكيد كلمة المرور'
    : 'Please enter confirm password',
  validPhone: I18nManager.isRTL
    ? 'الرجاء إدخال رقم الهاتف'
    : 'Please enter mobile no',
  validationPhone: I18nManager.isRTL
    ? 'دخل رقم هاتف خلوي ساري المفعول'
    : 'Enter valid mobile number',
  validPhoneN: I18nManager.isRTL
    ? 'الرجاء إدخال رقم الهاتف'
    : 'Please enter Phone no',
  validationPhoneN: I18nManager.isRTL
    ? 'دخل رقم هاتف خلوي ساري المفعول'
    : 'Enter valid Phone number',
  validPostalcode: I18nManager.isRTL
    ? 'الرجاء إدخال الرمز البريدي'
    : 'Please enter postal code',
  validPassword: I18nManager.isRTL
    ? 'يجب أن يكون الحد الأدنى لطول كلمة المرور ثمانية أحرف ، وحرف واحد كبير على الأقل وحرف صغير واحد ورقم واحد وحرف خاص واحد'
    : 'Minimum length of password must be eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  uploadMedicalLicense: I18nManager.isRTL
    ? 'الرجاء تحميل الرخصة الطبية'
    : 'Please upload medical license',
  uploadDocs: I18nManager.isRTL
    ? 'الرجاء تحميل الرخصة الطبية'
    : 'Please upload Document',
  validSamePassword: I18nManager.isRTL
    ? 'يجب أن يكون تأكيد كلمة المرور هو نفس كلمة المرور'
    : 'Confirm Password must be same as password',
  validNotPassword: I18nManager.isRTL
    ? 'بيانات الاعتماد غير صالحة'
    : 'Invalid Credentials',
  validationNPassword: I18nManager.isRTL
    ? 'الرجاء إدخال كلمة المرور الجديدة'
    : 'Please enter new password',
  validationCPassword1: I18nManager.isRTL
    ? 'الرجاء إعادة إدخال كلمة المرور'
    : 'Please re-enter password',
  validConfirm: I18nManager.isRTL
    ? 'كلمات المرور غير متطابقة'
    : "Passwords don't match",
  interval: I18nManager.isRTL ? 'فاصل / ساعة' : 'interval / hour',
  confirmYourPassword: I18nManager.isRTL
    ? 'يرجى التأكد من صحة كلمة المرور الخاصة بك'
    : 'Please confirm your password',
  validationEstablishment: I18nManager.isRTL
    ? 'الرجاء إدخال الاسم الكامل'
    : 'Please enter Establishment name',
  validationName: I18nManager.isRTL
    ? 'الرجاء إدخال الاسم الكامل'
    : 'Please enter first name',
  validationLastName: I18nManager.isRTL
    ? 'الرجاء إدخال الاسم الأخير'
    : 'Please enter last name',
  validationTerms: I18nManager.isRTL
    ? 'الرجاء قبول الشروط والأحكام'
    : 'Please accept terms and condition',
  validationNotificationTitle: I18nManager.isRTL
    ? 'الرجاء إدخال عنوان الإخطار'
    : 'Please enter Notification title',
  validationNotificationDes: I18nManager.isRTL
    ? 'الرجاء إدخال وصف الإخطار'
    : 'Please enter Notification Description',
  validOtp: I18nManager.isRTL ? 'رمز غير صحيح' : 'Code Invalid',
  vcode: I18nManager.isRTL
    ? 'الرجاء إدخال رمز التحقق الخاص بك'
    : 'Please enter your verfication code',
  validationMobile: I18nManager.isRTL
    ? 'الرجاء إدخال رقم الجوال'
    : 'Please enter mobile no',
  validationDate: I18nManager.isRTL ? 'حدد تاريخ' : 'Select date of birth',
  validationPhoto: I18nManager.isRTL ? 'إضافة الصور' : 'Add photos',
  validationAddress: I18nManager.isRTL
    ? 'الرجاء إدخال العنوان'
    : 'Please enter address',
  validationState: I18nManager.isRTL
    ? 'الرجاء إدخال الولاية'
    : 'Please enter state',
  validationCity: I18nManager.isRTL
    ? 'الرجاء إدخال المدينة'
    : 'Please enter city',
  validationOtp: I18nManager.isRTL
    ? 'الرجاء إدخال رمز التحقق'
    : 'Please enter Verification Code',
  check: I18nManager.isRTL
    ? 'يرجى الموافقة على الشروط والأحكام'
    : 'Please acknowledge the terms & conditions',
  validationBlood: I18nManager.isRTL
    ? 'الرجاء تحديد فصيلة الدم'
    : 'Please Select blood group',
  vallidationCountry: I18nManager.isRTL
    ? 'يرجى تحديد الدولة'
    : 'Please Select Country',
  validationInsurance: I18nManager.isRTL
    ? 'الرجاء إدخال تفاصيل التأمين'
    : 'Please enter insurance detail',
  validationCard: I18nManager.isRTL
    ? 'الرجاء إدخال رقم البطاقة'
    : 'Please enter card number',
  groupNumber: I18nManager.isRTL
    ? 'الرجاء إدخال رقم المجموعة'
    : 'Please enter group number',
  validRelation: I18nManager.isRTL
    ? 'الرجاء إدخال العلاقة'
    : 'Please enter relationship',
  validHeight: I18nManager.isRTL
    ? 'الرجاء إدخال الارتفاع'
    : 'Please enter height',
  validWeight: I18nManager.isRTL ? 'الرجاء إدخال الوزن' : 'Please enter weight',
  validGender: I18nManager.isRTL ? 'الرجاء إدخال الجنس' : 'Please enter gender',
  filter: I18nManager.isRTL ? 'الرجاء إدخال الجنس' : 'Filter : ',
  validRelation: I18nManager.isRTL
    ? 'الرجاء إدخال العلاقة'
    : 'Please enter relationship',
  validInsuranceCardFront: I18nManager.isRTL
    ? 'يرجى تحميل الصورة الأمامية لبطاقة التأمين'
    : 'Please upload insurance card front image',
  validInsuranceCardBack: I18nManager.isRTL
    ? 'يرجى تحميل صورة بطاقة التأمين مرة أخرى'
    : 'Please upload insurance card back image',
  validMedicalDocument: I18nManager.isRTL
    ? 'الرجاء تحميل المستند الطبي'
    : 'Please upload medical document',
  validStreet: I18nManager.isRTL
    ? 'الرجاء إدخال عنوانك مع الشارع'
    : 'Please enter your address with street',
  validConsultation: I18nManager.isRTL
    ? 'الرجاء تحديد نوع الاستشارة'
    : 'Please select type of consultation',
  selectColor: I18nManager.isRTL
    ? 'يرجى الاختيار اللون'
    : 'Please Select Color',
  selectLocation: I18nManager.isRTL
    ? 'يرجى تحديد الموقع'
    : 'Please Select Location',
  validPOC: I18nManager.isRTL
    ? 'الرجاء إضافة الغرض من الاستشارة'
    : 'Please add purpose of consultation',
  validRDoctor: I18nManager.isRTL
    ? 'الرجاء كتابة طبيب بديل'
    : 'Please type replacement doctor',
  validAvailDate: I18nManager.isRTL
    ? 'يرجى تحديد تواريخ التوفر'
    : 'Please select availability dates',
  validAvailST: I18nManager.isRTL
    ? 'الرجاء تحديد وقت بدء التوفر'
    : 'Please select availability start time',
  validAvailET: I18nManager.isRTL
    ? 'الرجاء تحديد وقت انتهاء التوفر'
    : 'Please select availability end time',
  validAvailSlot: I18nManager.isRTL
    ? 'الرجاء تحديد خانة الوقت'
    : 'Please select time slot',
  valodAvailAmount: I18nManager.isRTL
    ? 'الرجاء كتابة الفتحة في كل مرة'
    : 'Please type slot per time',
  validReapeatSlot: I18nManager.isRTL
    ? 'الرجاء تحديد التكرار'
    : 'Please select repeatation',
  validTimeSlot: I18nManager.isRTL
    ? 'الرجاء إضافة خانة الوقت'
    : 'Please add time slot',
  validPatient: I18nManager.isRTL
    ? 'الرجاء إضافة المريض'
    : 'Please add patient',
  validPreNotification: I18nManager.isRTL
    ? 'الرجاء تحديد الإعلام المسبق'
    : 'Please select Pre Notification',
  validPostNotification: I18nManager.isRTL
    ? 'يرجى تحديد إرسال الإخطار'
    : 'Please select Post Notification',
  validSubject: I18nManager.isRTL ? 'يرجى ملء الموضوع' : 'Please fill Subject',
  validNote: I18nManager.isRTL ? 'يرجى ملء ملاحظة' : 'Please fill a note',
  validSignature: I18nManager.isRTL
    ? 'الرجاء إضافة التوقيع'
    : 'Please add signature',
  cardSelect: I18nManager.isRTL
    ? 'الرجاء تحديد بطاقة الائتمان'
    : 'Please select credit card',
  validPosId: I18nManager.isRTL ? 'لا معرف نقاط البيع' : 'no pos id',
  pinpoint: I18nManager.isRTL
    ? 'يرجى وضع علامة في الخريطة'
    : 'Please pin point a marker in map',
  locationSucess: I18nManager.isRTL
    ? 'تمت إضافة الموقع بنجاح'
    : 'Location added in list Now Save',
  language: I18nManager.isRTL ? 'لغة' : 'Language',
  settings: I18nManager.isRTL ? 'إعدادات  ' : 'Settings',
  next: I18nManager.isRTL ? 'التالى' : 'Next',
  confirm: I18nManager.isRTL ? 'تؤكد' : 'Confirm',
  back: I18nManager.isRTL ? 'عودة' : 'Back',
  gotoEst: I18nManager.isRTL ? 'ارجع إلى التأسيس' : 'Go back to establishment',
  update: I18nManager.isRTL ? 'تحديث' : 'Update',
  done: I18nManager.isRTL ? 'منجز' : 'Done',
  apply: I18nManager.isRTL ? 'تطبيق' : 'Apply',
  delete: I18nManager.isRTL ? 'حذف' : 'Delete',
  email: I18nManager.isRTL ? 'عنوان البريد الالكترونى' : 'Email Address',
  fname: I18nManager.isRTL ? 'الاسم الكامل' : 'Full name',
  name: I18nManager.isRTL ? 'الاسم الاول' : 'First Name',
  lname: I18nManager.isRTL ? 'الكنية' : 'Last Name',
  address: I18nManager.isRTL ? 'عنوان' : 'Address',
  state: I18nManager.isRTL ? 'حالة' : 'State',
  City: I18nManager.isRTL ? 'مدينة' : 'City',
  Mobile: I18nManager.isRTL ? 'رقم الهاتف' : 'Mobile Number',
  phoneNumber: I18nManager.isRTL ? 'رقم الهاتف' : 'Phone Number',
  street: I18nManager.isRTL ? 'عنوان الشارع' : 'Street Address',
  street2: I18nManager.isRTL
    ? 'سطر العنوان 2 (اختياري)'
    : 'Adress line 2 (optional)',
  zipcode: I18nManager.isRTL
    ? 'الرمز البريدي / الرمز البريدي'
    : 'Zip / Postal Code ',
  password: I18nManager.isRTL ? 'كلمه السر' : 'Password',
  oldpassword: I18nManager.isRTL ? 'كلمة المرور القديمة' : 'Old Password',
  newpassword: I18nManager.isRTL ? 'كلمة مرور جديدة' : 'New Password',
  confirmPassword: I18nManager.isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password',
  confirmPasswordN: I18nManager.isRTL
    ? 'تأكيد كلمة المرور'
    : 'Confirm New Password',
  dob: I18nManager.isRTL ? 'تاريخ الولادة' : 'Date of birth',
  date: I18nManager.isRTL ? 'تاريخ' : 'Date',
  sDate: I18nManager.isRTL ? 'تاريخ البدء' : 'Start Date',
  eDate: I18nManager.isRTL ? 'تاريخ الانتهاء' : 'End Date',
  time: I18nManager.isRTL ? 'زمن' : 'Time',
  slotAmount: I18nManager.isRTL ? 'مبلغ الفتحة' : 'Slot amount',
  timeSlot: I18nManager.isRTL ? 'فسحة زمنية' : 'Time Slot',
  bookingDate: I18nManager.isRTL ? 'تاريخ الحجز' : 'Booking Date',
  relationship: I18nManager.isRTL ? 'صلة' : 'Relationship',
  establish: I18nManager.isRTL
    ? 'إنشاء / اسم الطبيب'
    : 'Establish / Doctor Name',
  establish1: I18nManager.isRTL ? 'إنشاء' : 'Establishment Name',
  insuranceDetail: I18nManager.isRTL ? 'تفاصيل التأمين' : 'Insurance Detail',
  cardNo: I18nManager.isRTL ? 'رقم البطاقة' : 'Card Number',
  expiry: I18nManager.isRTL ? 'انقضاء' : 'Expiry',
  cvv: I18nManager.isRTL ? 'CVC/CVV' : 'CVC/CVV',
  cardName: I18nManager.isRTL
    ? 'الاسم على بطاقة الائتمان'
    : 'Name on credit card',
  groupNo: I18nManager.isRTL ? 'رقم المجموعة' : 'Group Number',
  add: I18nManager.isRTL ? 'أضف' : 'Add',
  edit: I18nManager.isRTL ? 'أضف' : 'Edit',
  login: I18nManager.isRTL ? 'تسجيل الدخول' : 'Login',
  logout: I18nManager.isRTL ? 'تسجيل خروج' : 'Logout',
  PreferredLanguage: I18nManager.isRTL ? 'اللغة المفضلة' : 'Preferred Language',
  account: I18nManager.isRTL ? 'ليس لديك حساب؟' : "Don't have an account?",
  forgot: I18nManager.isRTL ? 'هل نسيت كلمة المرور؟' : 'Forgot Password?',
  dont: I18nManager.isRTL ? 'ليس لديك حساب؟' : 'Dont have an account? ',
  already: I18nManager.isRTL ? 'هل لديك حساب؟ ' : 'Already have an account? ',
  lets: I18nManager.isRTL ? 'لنقم بالتسجيل' : "Let's Sign up",
  letsLogin: I18nManager.isRTL ? 'دعونا تسجيل الدخول' : "Let's Login",
  forgotSubText: I18nManager.isRTL
    ? 'أدخل رقم هاتفك المسجل  \n لإعادة تعيين كلمة المرور'
    : 'Enter your registered email address\n to reset password',
  send: I18nManager.isRTL ? 'إرسال' : 'Send',
  reset: I18nManager.isRTL ? 'إنشاء كلمة مرور جديدة' : 'Create New Password',
  resettext: I18nManager.isRTL ? 'أدخل كلمة مرور جديدة' : 'Enter New Password',
  subject: I18nManager.isRTL ? 'موضوعات' : 'Subject',
  addNotes: I18nManager.isRTL ? 'أضف ملاحظات' : 'Add Notes',
  verfication: I18nManager.isRTL
    ? 'أدخل رمز التحقق'
    : 'Enter Verification Code',
  verficationText: I18nManager.isRTL
    ? 'تم إرسال الرمز إلى  \n رقم هاتفك ، الرجاء إدخال الرمز'
    : 'The code was sent to your\nphone number, please enter the code.',
  verficationTextEmail: I18nManager.isRTL
    ? 'تم إرسال الرمز إلى  \n رقم هاتفك ، الرجاء إدخال الرمز'
    : 'The code was sent to your\nEmail, please enter the code.',
  resetBtn: I18nManager.isRTL ? 'حفظ ومتابعة' : 'Save & continue',
  changePwd: I18nManager.isRTL ? 'غير كلمة السر' : 'Change Password',
  bottomText: I18nManager.isRTL
    ? 'بتسجيل الدخول ، أنت توافق على'
    : 'By Logging in, you agree to the',
  terms: I18nManager.isRTL ? 'الأحكام والشروط' : 'Terms and Conditions',
  signIn: I18nManager.isRTL ? 'تسجيل الدخول' : 'Sign in',
  signUp: I18nManager.isRTL ? 'سجل' : 'Sign Up',
  signout: I18nManager.isRTL ? 'تسجيل الدخول' : 'Sign Out',
  english: I18nManager.isRTL ? 'English' : 'English',
  arabic: I18nManager.isRTL ? 'عربى' : 'عربى',
  signoutMsg: I18nManager.isRTL
    ? 'هل أنت متأكد أنك تريد الخروج ؟'
    : 'Are you sure you want to sign out ?',
  typeLogin: I18nManager.isRTL
    ? 'اكتب البريد الإلكتروني وكلمة المرور للمتابعة'
    : 'Type email & password to continue',
  sendVerification: I18nManager.isRTL ? 'إرسال التحقق' : 'Send Verification',
  repassword: I18nManager.isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password',
  registeration: I18nManager.isRTL ? 'التسجيل' : 'Registration',
  register: I18nManager.isRTL ? 'تسجيل' : 'Register',
  acknolwgement: I18nManager.isRTL
    ? 'أوافق على الأحكام والشروط'
    : 'I agree to the Terms & Conditions',
  verify: I18nManager.isRTL ? 'تحقق من الهاتف' : 'Verify Phone',
  verifyTitle: I18nManager.isRTL
    ? 'لقد أرسلنا لك رمزًا للتحقق من رقم هاتفك'
    : 'We sent you a code to verify your phone number',
  sentTo: I18nManager.isRTL ? 'أرسل إلى' : 'Sent to',
  dontReceive: I18nManager.isRTL ? 'لم تتلق رمز؟ ' : "Didn't receive code? ",
  resend: I18nManager.isRTL ? ' إعادة إرسال ' : 'Resend',
  Information: I18nManager.isRTL ? 'معلومات' : 'Information',
  IndividualSelection: I18nManager.isRTL
    ? 'حدد واحدة للمتابعة'
    : 'Select one to continue',
  dummytext: I18nManager.isRTL
    ? 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accntium doloremque laudantium, totam rem aperiam, ea ipsa quae ab illo'
    : 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accntium doloremque laudantium, totam rem aperiam, ea ipsa quae ab illo.',
  serach: I18nManager.isRTL ? 'بحث' : 'Search',
  serachPlace: I18nManager.isRTL ? 'بحث' : 'Doctor, establishment, speciality',
  home: I18nManager.isRTL ? 'الصفحة الرئيسية' : 'HOME',
  homes: I18nManager.isRTL ? 'الصفحة الرئيسية' : 'Home',
  appointments: I18nManager.isRTL ? 'تعيينات' : 'Appointments',
  prescriptions: I18nManager.isRTL ? 'الوصفات الطبية' : 'Prescriptions',
  profile: I18nManager.isRTL ? 'الملف الشخصي' : 'Profile',
  availablity: I18nManager.isRTL ? 'التوفر' : 'Availablity',
  chat: I18nManager.isRTL ? 'محادثة' : 'Chat',
  purpose: I18nManager.isRTL ? 'الغرض من الاستشارة' : 'Purpose of Consultation',
  replacementDoctor: I18nManager.isRTL ? 'طبيب بديل' : 'Replacement Doctor',
  selectSlot: I18nManager.isRTL ? 'حدد الفتحة' : 'Select Slot Interval',
  selectCard: I18nManager.isRTL ? 'حدد الفتحة' : 'Select Card',
  selectRepeat: I18nManager.isRTL ? 'حدد الفتحة' : 'Select Repeatation',
  clearall: I18nManager.isRTL ? 'امسح الكل' : 'Clear All',
  aboutme: I18nManager.isRTL ? 'عني' : 'About Me',
  speciallitees: I18nManager.isRTL ? 'التخصصات' : 'Specialities',
  add: I18nManager.isRTL ? 'يضيف' : 'Add',
  languageSpoken: I18nManager.isRTL ? 'اللغة المنطوقة' : 'Language Spoken',
  speciallizes: I18nManager.isRTL ? 'متخصص في ' : 'Specializes in',
  specilised: I18nManager.isRTL ? 'آخر موعد' : 'Last Appointment',
  pickDoctor: I18nManager.isRTL ? 'أطبائي' : 'My Doctors',
  consulation: I18nManager.isRTL ? 'رسوم القنصلية' : 'Consultation Fees',
  consultaionType: I18nManager.isRTL ? 'القنصلية يكتب' : 'Consultation Type',
  consulationDate: I18nManager.isRTL ? 'تاريخ الاستشارة' : 'Consultation Date',
  consul: I18nManager.isRTL ? 'القنصلية' : 'Consultations',
  qualification: I18nManager.isRTL
    ? 'تفاصيل المؤهلات'
    : 'Qualification Details',
  bookAppointment: I18nManager.isRTL ? 'موعد الكتاب' : 'Book Appointment',
  location: I18nManager.isRTL ? 'موقعك' : 'Location',
  addLocation: I18nManager.isRTL ? 'أضف الموقع' : 'Add Location',
  availablityTime: I18nManager.isRTL ? 'الوقت المتاح' : 'Available Time',
  slots: I18nManager.isRTL ? 'فتحات المتاحة' : 'slots Available',
  intro1Head: I18nManager.isRTL
    ? 'موعد الكتاب  \n مع الطبيب'
    : 'book appointment\nwith doctor',
  intro1SubText: I18nManager.isRTL
    ? 'ابحث عن طبيب \n وحجز موعدًا معهم'
    : 'Search a doctor &\nbook appointment with them.',
  intro2Head: I18nManager.isRTL
    ? 'لا تفوت \n فرصة'
    : 'Never miss\nan opportunity',
  intro2SubText: I18nManager.isRTL
    ? 'تعاون مع الطبيب من خلال الدردشة \n واستشارة الفيديو'
    : 'Collaborate doctor with chat &\nvideo consultation.',
  skip: I18nManager.isRTL ? 'تخطى' : 'Skip',
  languageMessage: I18nManager.isRTL
    ? 'Just a moment while we set up English'
    : 'مجرد لحظة بينما قمنا بإعداد اللغة العربية',
  about: I18nManager.isRTL ? 'حول' : 'About',
  rateAndReview: I18nManager.isRTL ? 'مراجعة معدل' : 'Rate & Review',
  availabilty: I18nManager.isRTL ? 'التوفر' : 'Availabilty',
  estDoctor: I18nManager.isRTL ? 'طبيبة' : 'Doctor',
  list: I18nManager.isRTL ? 'قائمة' : 'List',
  map: I18nManager.isRTL ? 'خريطة' : 'Map',
  searching: I18nManager.isRTL ? 'يبحث' : 'Searching ',
  type: I18nManager.isRTL ? 'الكتابة' : 'Type',
  seemore: I18nManager.isRTL ? 'شاهد المزيد' : 'See More',
  individual: I18nManager.isRTL ? 'الفرد' : 'Individual',
  establishment: I18nManager.isRTL ? 'تأسيس' : 'Establishment',
  preValidation: I18nManager.isRTL
    ? 'ما قبل التحقق من الصحة'
    : 'Pre-Validation',
  make: I18nManager.isRTL ? 'إحجز' : 'Make an',
  take: I18nManager.isRTL ? 'خذ' : 'Take an',
  appointment: I18nManager.isRTL ? 'موعد' : 'Appointment',
  headerSubtext: I18nManager.isRTL
    ? 'حدد موعدًا لاستشارة جسدية أو استشارة فيديو'
    : 'Make an appointment for a physical\nconsultation or video consultation',
  newpatient: I18nManager.isRTL ? 'مريض جديد' : 'New Paitent',
  patientName: I18nManager.isRTL ? 'اسم المريض' : 'Paitent Name',
  followUp: I18nManager.isRTL ? 'متابعة' : 'Follow up',
  videoCall: I18nManager.isRTL ? 'مكالمة فيديو' : 'Video Call',
  walkIn: I18nManager.isRTL ? 'ادخل' : 'Walk in',
  urgentCare: I18nManager.isRTL ? 'الرعاية العاجلة' : 'Urgent Care',
  homeVist: I18nManager.isRTL ? 'زيارة منزلية' : 'Home Visit',
  newClient: I18nManager.isRTL ? 'عميل جديد' : 'New Client',
  topClinic: I18nManager.isRTL ? 'توب كلينيك' : 'Top Clinic',
  welcome: I18nManager.isRTL ? 'أهلا بك' : 'Welcome',
  yourAvalibality: I18nManager.isRTL ? 'التوافر الخاص بك' : 'Your Availability',
  availabilityDetails: I18nManager.isRTL
    ? 'تفاصيل التوفر'
    : 'Availability Details',
  slotEdit: I18nManager.isRTL ? 'تحرير الفتحة' : 'Edit Slot',
  select: I18nManager.isRTL ? 'يختار' : 'Select',
  repeated: I18nManager.isRTL ? 'معاد' : 'Repeated',
  preNotification: I18nManager.isRTL ? 'الإخطار المسبق' : 'Pre-Notification',
  postNotification: I18nManager.isRTL ? 'بعد الإخطار' : 'Post-Notification',
  Privacy: I18nManager.isRTL ? 'بعد الإخطار' : 'Privacy policy',
  videoConsultation: I18nManager.isRTL
    ? 'استشارة عبر الفيديو'
    : 'Video Consultation',
  walkInConsultaion: I18nManager.isRTL
    ? 'استشارة مباشرة'
    : 'Walk-In Consultation',
  homeConsultation: I18nManager.isRTL
    ? 'الاستشارة الشخصية'
    : 'Home Visit Consultation',
  typeOfConsultation: I18nManager.isRTL
    ? 'نوع الاستشارة'
    : 'Type of Consultation',
  consulations: I18nManager.isRTL ? 'Consultation' : 'Consultation',
  selectTimeSlots: I18nManager.isRTL ? 'حدد فترات زمنية' : 'Select Time Slots',
  lovedOnes: I18nManager.isRTL ? 'أحبائهم' : 'Loved Ones',
  addlovedOnes: I18nManager.isRTL ? 'أحبائهم' : 'Add Loved Ones',
  confirmAppointment: I18nManager.isRTL
    ? 'تأكيد التعيين'
    : 'Confirm Appointment',
  notComplete: I18nManager.isRTL
    ? 'أكمل المعلومات لهذا المريض'
    : 'Complete the Information for this patient',
  payment: I18nManager.isRTL ? 'دفعة' : 'Payment',
  paymentTitle: I18nManager.isRTL
    ? 'أدخل تفاصيل بطاقة الائتمان الخاصة بك'
    : 'Enter your credit card details',
  sucess: I18nManager.isRTL
    ? 'موعدك  n مجدول بنجاح.'
    : 'Your Appointment has\nbeen Scheduled Successfully.',
  updateSchedule: I18nManager.isRTL
    ? 'موعدك  n مجدول بنجاح.'
    : 'Your Appointment has\nbeen Rescheduled Successfully.',
  yourAppointment: I18nManager.isRTL ? 'مواعيدك' : 'Your Appointments',
  upcommings: I18nManager.isRTL ? 'تيار' : 'Current',
  current: I18nManager.isRTL ? 'مكتمل' : 'Completed',
  past: I18nManager.isRTL ? 'ألغيت' : 'Cancelled',
  history: I18nManager.isRTL ? 'سجل' : 'History',
  helpCenter: I18nManager.isRTL ? 'المساعدة والاتصال بنا' : 'Help & Contact Us',
  historyDetial: I18nManager.isRTL ? 'تفاصيل التاريخ' : 'History Detail',
  notification: I18nManager.isRTL ? 'تنبيه' : 'Notification',
  notificationAPP: I18nManager.isRTL ? 'تنبيهات التطبيق' : 'App Notification',
  notificationSMS: I18nManager.isRTL
    ? 'إخطار الرسائل القصيرة'
    : 'SMS Notification',
  notificationEmail: I18nManager.isRTL
    ? 'إعلام البريد الإلكتروني'
    : 'Email Notification',
  save: I18nManager.isRTL ? 'يحفظ' : 'Save',
  create: I18nManager.isRTL ? 'خلق' : 'Create',
  message: I18nManager.isRTL ? 'رسالة' : 'Message',
  signature: I18nManager.isRTL ? 'أضف التوقيع' : 'Add Signature',
  signature1: I18nManager.isRTL ? 'إمضاء' : 'Signature',
  edit: I18nManager.isRTL ? 'يحرر' : 'Edit',
  medical: I18nManager.isRTL
    ? 'التاريخ الطبي والجراحي'
    : 'Medical & Surgical History',
  blood: I18nManager.isRTL ? 'فصيلة الدم' : 'Blood Group',
  uploadInsurance: I18nManager.isRTL ? 'تحميل التأمين' : 'Upload Insurance',
  weight: I18nManager.isRTL ? ' وزن' : ' Weight: ',
  dateOB: I18nManager.isRTL ? ' تاريخ الولادة' : 'Date of birth: ',
  gender: I18nManager.isRTL ? ' جنس تذكير أو تأنيث' : 'Gender: ',
  gender1: I18nManager.isRTL ? ' جنس تذكير أو تأنيث' : 'Gender',
  InsuranceCompany: I18nManager.isRTL ? ' شركة تأمين' : 'Insurance company: ',
  MedicalDocument: I18nManager.isRTL ? ' وثيقة طبية' : 'Medical Document: ',
  backFront: I18nManager.isRTL ? 'الجبهة إلى الخلف' : 'Front & Back',
  emptyInbox: I18nManager.isRTL ? 'صندوق الوارد فارغ' : 'Inbox Empty',
  or: I18nManager.isRTL ? 'أو' : 'Or',
  front: I18nManager.isRTL ? 'أمامي' : 'Front',
  license: I18nManager.isRTL ? 'رخصة الرفع' : 'Upload License',
  uploadMedia: I18nManager.isRTL
    ? '+ تحميل رخصة وسائط'
    : '+ Upload Media License',
  uploadDocument: I18nManager.isRTL ? '+ تحميل المستند' : '+ Upload Document',
  bottomInfo: I18nManager.isRTL
    ? 'يرجى التأكد من تحميل \n مستندات الشهادة الطبية الخاصة بك  n بما في ذلك أي دليل محلي \n للتسجيل لضمان سلاسة \n التحقق ومن ثم إكمال \n التسجيل في منصة طبيبي'
    : 'Please ensure to upload your\n medical certificate documents\n including any local proof of\n registration to ensure a smooth\n verification and hence completion\n of sign up in Tabibbi Platform',
  addDoctor: I18nManager.isRTL ? 'اضف دكتور' : 'Add Doctor',
  selectDoctor: I18nManager.isRTL ? 'اضف دكتور' : 'Select Doctor',
  patients: I18nManager.isRTL ? 'مرضى' : 'Patients',
  payout: I18nManager.isRTL ? 'سيصرف' : 'Payouts',
  sentBy: I18nManager.isRTL ? 'أرسلت بواسطة' : 'Sent By',
  screenShot: I18nManager.isRTL ? 'لقطة الشاشة المرفقة' : 'Screenshot Attached',
  attachement: I18nManager.isRTL ? 'مرفق' : 'Attachement',
  toDoc: I18nManager.isRTL ? 'لذا دكتور' : 'To Doctor',
  subscription: I18nManager.isRTL ? 'خطط الاشتراك' : 'Subscription Plans',
  helpCenter1: I18nManager.isRTL ? 'مركز المساعدة' : 'Help Center',
  patientDetail: I18nManager.isRTL ? 'تفاصيل المريض' : 'Patient Detail',
  prescribeDrug: I18nManager.isRTL ? 'وصف الأدوية' : 'Prescribe Drugs',
  previusDetail: I18nManager.isRTL ? 'التفاصيل السابقة' : 'Previous Detail',
  chatHistory: I18nManager.isRTL ? 'تاريخ الدردشة' : 'Chat History',
  prescriptionDetail: I18nManager.isRTL
    ? 'تفاصيل الوصفة'
    : 'Prescription Details',
  paymentDetail: I18nManager.isRTL ? 'تفاصيل الدفع' : 'Payment Detail',
  addPrescription: I18nManager.isRTL ? 'إضافة وصفة طبية' : 'Add Prescription',
  booked: I18nManager.isRTL ? 'حجز' : 'Booked',
  nonBooked: I18nManager.isRTL ? 'غير محجوزة' : 'Non-Booked',
  completed: I18nManager.isRTL ? 'حجز' : 'Completed',
  viewAll: I18nManager.isRTL ? 'مشاهدة الكل' : 'View All',
  view: I18nManager.isRTL ? 'مشاهدة الكل' : 'View',
  viewDetail: I18nManager.isRTL ? 'عرض التفاصيل' : 'View Details',
  canceled: I18nManager.isRTL
    ? 'تم الإلغاء ولم يتم الحجز أبدًا'
    : 'Cancelled & Never Booked',
  canceled: I18nManager.isRTL ? 'ألغيت' : 'Canceled',
  cancelAppointment: I18nManager.isRTL ? 'إلغاء التعيين' : 'Cancel Appointment',
  complain: I18nManager.isRTL ? 'تذمر' : 'Complain',
  can: I18nManager.isRTL ? 'يلغي' : 'Cancel',
  ok: I18nManager.isRTL ? 'موافق' : 'Ok',
  paynow: I18nManager.isRTL ? 'ادفع الآن' : 'Pay Now',
  gotTo: I18nManager.isRTL ? 'اذهب إلى' : 'Go to',
  neverBooked: I18nManager.isRTL ? 'لم يتم الحجز' : 'Never Booked',
  blockUser: I18nManager.isRTL ? 'مستخدم محضور' : 'Block User',
  unblockUser: I18nManager.isRTL ? 'إلغاء حظر عن مستخدم' : 'UnBlock User',
  listofPatient: I18nManager.isRTL
    ? 'قائمة بجميع المرضى'
    : 'List of All Patients',
  video: I18nManager.isRTL ? 'فيديو' : 'Video Call',
  guest: I18nManager.isRTL ? 'ضيف' : 'Guest',
  inPerson: I18nManager.isRTL ? 'شخصيا' : 'In-Person',
  reschedule: I18nManager.isRTL ? 'إعادة الجدولة' : 'Reschedule',
  noData: I18nManager.isRTL ? 'لا يوجد سجلات' : 'No record found',
  noSlots: I18nManager.isRTL
    ? 'لم يتم العثور على أية خانات زمنية متاحة'
    : 'No Available Slots found',
  searching: I18nManager.isRTL ? 'يبحث' : 'Searching',
  detalis: I18nManager.isRTL ? 'تفاصيل' : 'Details',
  previousBooking: I18nManager.isRTL ? 'الحجز السابق' : 'Previous Booking',
  completed: I18nManager.isRTL ? 'مكتمل' : 'Completed',
  startVideo: I18nManager.isRTL ? 'ابدأ مكالمة فيديو' : 'Start Video Call',
  customeNotes: I18nManager.isRTL ? 'ملاحظات الزبون' : 'Customer Notes',
  schedules: I18nManager.isRTL ? 'جداول' : 'Schedules',
  subscribe: I18nManager.isRTL ? 'الإشتراك' : 'Subscribe',
  subscriptions: I18nManager.isRTL ? 'الاشتراكات' : 'Subcriptions',
  myEarning: I18nManager.isRTL ? 'أجوري' : 'My Earnings',
  earnings: I18nManager.isRTL ? 'أرباح' : 'Earnings',
  totalPatient: I18nManager.isRTL ? 'إجمالي المريض: ' : 'Total Patient: ',
  selectEarning: I18nManager.isRTL
    ? 'حدد كسب بواسطة'
    : 'Select Earning by Date',
  daily: I18nManager.isRTL ? 'يوميا' : 'Daily',
  monthly: I18nManager.isRTL ? 'شهريا' : 'Monthly',
  weekly: I18nManager.isRTL ? 'أسبوعي' : 'Month',
  yearly: I18nManager.isRTL ? 'سنوي' : 'Yearly',
  pocs: I18nManager.isRTL ? 'الغرض من الاستشارة' : 'Purpose of consultation',
  user: I18nManager.isRTL ? 'مستخدم' : 'User',
  uploadFile: I18nManager.isRTL ? 'تحميل الملفات' : 'Upload Files',
  dosage: I18nManager.isRTL ? 'الجرعة' : 'Dosage: ',
  duration: I18nManager.isRTL ? 'مدة' : 'Duration',
  Invoice: I18nManager.isRTL ? 'فاتورة' : 'Invoice',
  totalAmmount: I18nManager.isRTL ? 'المبلغ الإجمالي: ' : 'Total Amount: ',
  editAmount: I18nManager.isRTL ? 'تحرير المبلغ' : 'Edit Amount',
  paymentVia: I18nManager.isRTL ? 'الدفع عن طريق' : 'Payment Via',
  slelectType: I18nManager.isRTL ? 'حدد استشارة' : 'Select Consultation',
  timestart: I18nManager.isRTL ? 'وقت البدء' : 'Time Start',
  timeend: I18nManager.isRTL ? 'انتهى الوقت' : 'Time End',
  doUwant: I18nManager.isRTL
    ? 'هل تريد إضافة غرض جديد  n للاستشارة؟'
    : 'Do you want to add a new \n purpose of consultation?',
  addNewPOC: I18nManager.isRTL
    ? 'إضافة غرض جديد للاستشارة'
    : 'Add a new purpose of consultation',
  editPOC: I18nManager.isRTL
    ? 'إضافة غرض جديد للاستشارة'
    : 'Edit purpose of consultation',
  title: I18nManager.isRTL ? 'لقب' : 'Title',
  typeHere: I18nManager.isRTL ? 'أكتب هنا' : 'Type Here',
  color: I18nManager.isRTL ? 'اللون' : 'Choose Color',
  addCustom: I18nManager.isRTL ? 'إضافة مخصص' : 'Add Custom',
  hide: I18nManager.isRTL ? 'مغلق' : 'Hide',
  calendarView: I18nManager.isRTL ? 'عرض التقويم' : 'Calendar View',
  stats: I18nManager.isRTL ? 'احصائيات' : 'Stats',
  poc: I18nManager.isRTL ? 'POC' : 'POC',
  appointment: I18nManager.isRTL ? 'موعد' : 'Appointment',
  cancelled: I18nManager.isRTL ? 'ألغيت' : 'Cancelled',
  available: I18nManager.isRTL ? 'متوفرة' : 'Available',
  slots: I18nManager.isRTL ? 'فتحات' : 'slots',
  selectPatient: I18nManager.isRTL ? 'حدد المريض' : 'Select Patient',
  addCard: I18nManager.isRTL ? 'إضافة بطاقة' : 'Add Card',
  selectPurpose: I18nManager.isRTL
    ? 'حدد الغرض من الاستشارة'
    : 'Select Purpose of Consultation',
  selectAvailSlots: I18nManager.isRTL
    ? 'حدد الفترات الزمنية المتاحة'
    : 'Select Available Time Slots',
  searchHere: I18nManager.isRTL ? 'ابحث هنا' : 'Search Here',
  bookAnAppointment: I18nManager.isRTL ? 'حجز موعد' : 'Book an Appointment',
  reshudleAppointment: I18nManager.isRTL ? 'اعادة جدولة الموعد' : 'Reschedule',
  drName: I18nManager.isRTL ? 'اسم الطبيب' : 'Dr Name:',
  slotTime: I18nManager.isRTL ? 'وقت الفتحة' : 'Slot time:',
  selectedTime: I18nManager.isRTL ? 'الوقت المحدد' : 'Selected Time',
  date1: I18nManager.isRTL ? 'تاريخ' : 'Date:',
  addNewPatient: I18nManager.isRTL ? 'إضافة مريض جديد' : 'Add New Patient',
  selectLocation: I18nManager.isRTL ? 'اختر موقعا' : 'Select Location',
  addExtraTime: I18nManager.isRTL ? 'أضف وقتًا إضافيًا' : 'Add Extra Time',
  extraTime: I18nManager.isRTL ? 'وقت إضافي' : 'Extra Time',
  extraAmount: I18nManager.isRTL ? 'مبلغ إضافي' : 'Extra Amount',
  Medical: I18nManager.isRTL ? 'طبي' : 'Medical',
  Surgical: I18nManager.isRTL ? 'جراحي' : ' Surgical',
  height: I18nManager.isRTL ? 'ارتفاع' : 'Height',
  heightFT: I18nManager.isRTL ? 'ارتفاع' : 'Height (ft)',
  weightKG: I18nManager.isRTL ? 'وزن' : 'Weight (kg)',
  weight: I18nManager.isRTL ? 'وزن' : 'Weight',
  today: I18nManager.isRTL ? 'اليوم' : 'Today',
  tomorrow: I18nManager.isRTL ? 'الغد' : 'Tomorrow',
  availableSlots: I18nManager.isRTL ? 'فتحات متاحة' : 'Available Slots',
  wait: I18nManager.isRTL
    ? ' الرجاء الانتظار 1 دقيقة لإعادة إرسال الرم'
    : 'Please wait 1 min to resend code ',
  notFound: I18nManager.isRTL ? 'لايوجد بيانات' : 'No data',
  clickToAdd: 'click to add',
  camera: I18nManager.isRTL ? 'الة تصوير' : 'Camera',
  gallery: I18nManager.isRTL ? 'صالة عرض' : 'Gallery',
  uploadBy: I18nManager.isRTL ? 'تحميل بواسطة' : 'Upload By',
  noSchedule: I18nManager.isRTL
    ? 'لا يوجد جدول متاح في هذا التاريخ'
    : 'No schedule available on this date',
  noSlot: I18nManager.isRTL
    ? 'لا يوجد فتحة متاحة في هذا التاريخ'
    : 'No slot available on this date',
  notVerified: I18nManager.isRTL
    ? 'تم تقديم طلب التسجيل الخاص بك للتحقق بنجاح. بمجرد التحقق من حسابك ، سيتم إخطارك عبر. في غضون ذلك ، قد تستمتع بتصفح منصتنا مع وصول محدود إلى الخدمات العامة'
    : 'Your Registration request has been successfully submitted for verification. As soon as our your account is verified you will be notified via. In the meanwhile, you may enjoy surfing our platform with limited access to the general services.',
  buySubscription: I18nManager.isRTL
    ? 'لم يتم العثور على اشتراك نشط'
    : 'No Active Subscription found',
  stripeAccountSetup: I18nManager.isRTL
    ? 'إعداد ربط الشريط'
    : 'Stripe accound setup',
  stripeAccountSetupFail: I18nManager.isRTL
    ? 'إعداد ربط الشريطفشل الرجاء المحاولة مرة أخرى'
    : 'Failed please try again',
  appointmentView: I18nManager.isRTL
    ? 'يمكن عرض الموعد فقط هنا ارجع إلى علامة التبويب POC لإنشاء الجداول الزمنية'
    : 'Only appointment can be viewed here go to POC tab to create schedules',
  reviews: I18nManager.isRTL ? 'المراجعات' : 'Reviews',
  optional: I18nManager.isRTL ? '(اختياري)' : 'Optional',
  submit: I18nManager.isRTL ? 'إرسال' : 'Submit',
  wentWrong: I18nManager.isRTL
    ? 'حدث خطأ ما. أعد المحاولة من فضلك'
    : 'Something went wrong, please try again.',
  docUploadingLoader: I18nManager.isRTL
    ? 'تحميل المستندات' + '\n' + 'ارجوك انتظر'
    : 'Please wait\nUploading documents',
  day: I18nManager.isRTL ? 'يوم' : 'Day',
  day3: I18nManager.isRTL ? 'أيام' : 'Days',
  week: I18nManager.isRTL ? 'أسبوعي' : 'Weekly',
  month: I18nManager.isRTL ? 'شهريا' : 'Monthly',
  newPassCantSame: I18nManager.isRTL
    ? 'لا يمكن أن تكون كلمة المرور الجديدة مماثلة لكلمة المرور القديمة.'
    : 'New password cannot be the same as old password.',
  cannot: I18nManager.isRTL
    ? 'لا يمكنك إنشاء جدول زمني في هذه التواريخ الماضية'
    : 'You can not create schedule on this past date or time',
  cannot2: I18nManager.isRTL
    ? 'لا يمكنك حجز موعد في هذا التاريخ أو الوقت الماضي'
    : 'You can not book appointment on this past date or time',
  noCreditCard: I18nManager.isRTL ? 'لا توجد بطاقة متاحة' : 'No Card Available',
  prenotificationToast: I18nManager.isRTL
    ? 'لم يتم العثور على إعلام الرجاء إضافة إشعار من شاشة الإعلام للمتابعة'
    : 'No Pre Notification found Please add pre notification from notification screen to continue',
  postnotificationToast: I18nManager.isRTL
    ? 'لم يتم العثور على إعلام الرجاء إضافة إشعار من شاشة الإعلام للمتابعة'
    : 'No Post Notification found Please add post notification from notification screen to continue',
  verifyEstDoc: I18nManager.isRTL
    ? 'لم يتم العثور على طبيب مؤكد ، يرجى انتظار عمليات التحقق'
    : 'No verfied doctor found please wait for the verifications Or add doctors',
  noDoctorFound: I18nManager.isRTL
    ? 'لم يتم العثور على طبيب الرجاء إضافة طبيب جدي'
    : 'No doctor found please add doctor new doctor',
  cannot3: I18nManager.isRTL
    ? 'لا يمكنك تحرير هذا التاريخ أو الوقت الماضي'
    : 'You can not edit on this past date or time',
  cannot4: I18nManager.isRTL
    ? 'لا يمكنك إعادة الجدولة في هذا التاريخ أو الوقت الماضي'
    : 'You can not reschedule on this past date or time',
  empLoc: I18nManager.isRTL
    ? 'مطلوب على الأقل 1 الموقع قبل إنشاء الغرض من الاستشارة'
    : 'Atleast 1 is Location is needed before creating purpose of consultation',
  podadded: I18nManager.isRTL
    ? 'تمت إضافة الغرض من الاستشارة بنجاح'
    : 'Purpose of consultation added Sucessfully ',
  adjustTime: I18nManager.isRTL
    ? 'لضبط وقت الانتهاء ، قم بتغيير مدة وقت البدء أو مدة الفتحة'
    : 'To adjust the End time, change the duration of start time or slot duration',
  pocCheck: I18nManager.isRTL
    ? 'لإنشاء جدول يرجى إضافة نقطة الدخول من ملف التعريف أو الإعدادات'
    : 'To create a schedule please add the POC from profile or settings',
  stripeAccountPermission: I18nManager.isRTL
    ? 'لم يتم إعداد حساب Stripe'
    : 'Stripe Account is not setup',
  stripeAccountValidation: I18nManager.isRTL
    ? 'لم يتم إعداد حساب Stripe'
    : 'Stripe Account is needed before creating schedule',
  subscriptionPermission: I18nManager.isRTL ? 'الاشتراك' : 'Subscription',
  subscriptionExpired: I18nManager.isRTL
    ? 'الاشتراك'
    : 'Subscription is Expired',
  URLnotFount: I18nManager.isRTL ? 'غير موجود URl' : 'ERORR URl not found',
  writeYourReviewHere: I18nManager.isRTL
    ? 'اكتب رأيك هنا ...'
    : 'Write Your Review Here...',
  validaddDoctor: I18nManager.isRTL ? 'الرجاء إضافة طبيب' : 'Please add doctor',
  unavailable: I18nManager.isRTL
    ? 'المستخدم غير متاح للاتصال'
    : 'User is unavailable for calling',
  stripeConnect: I18nManager.isRTL ? 'ربط الشريط' : 'Stripe Connect',
  doctor: I18nManager.isRTL ? 'طبيبة' : 'Doctor ',
  est: I18nManager.isRTL ? 'عيادة' : 'Clinic ',
  spec: I18nManager.isRTL ? 'التخصصات' : 'specialities ',
  loc: I18nManager.isRTL ? 'التخصصات' : 'Location ',
  delete: I18nManager.isRTL ? 'حذف' : 'Delete',
  deleteText: I18nManager.isRTL
    ? 'هل أنت متأكد من حذف هذه الفتحة'
    : 'Are you sure to delete this slot',
  deleteCard: I18nManager.isRTL
    ? 'هل أنت متأكد من حذف هذه البطاقة'
    : 'Are you sure you want to delete this card',
  canText: I18nManager.isRTL
    ? 'هل أنت متأكد من إلغاء هذا الموعد'
    : 'Are you sure to cancel this appointment',
  deletePOCText: I18nManager.isRTL
    ? 'هل أنت متأكد من حذف POC'
    : 'Are you sure to delete this POC',
  postAppText: I18nManager.isRTL ? '' : '',
  preAppText: I18nManager.isRTL ? '' : '',
  deleteNoti: I18nManager.isRTL
    ? 'هل أنت متأكد من حذف هذا الإخطار'
    : 'Are you sure to delete this notification',
  slotDetail: I18nManager.isRTL ? 'تفاصيل الفتحة' : 'Slot Detail',
  status: I18nManager.isRTL ? 'وضع' : 'Status',
  yes: I18nManager.isRTL ? 'نعم' : 'Yes',
  no: I18nManager.isRTL ? 'لا' : 'No',
  Card: I18nManager.isRTL ? 'بطاقة ائتمان' : 'Credit Card',
  Cash: I18nManager.isRTL ? 'السيولة النقدية' : 'Cash',
  alreadyHave: I18nManager.isRTL
    ? 'تمت إضافة POC بالفعل'
    : 'POC is already added',
  locationPermission: I18nManager.isRTL ? 'موقع GPS مغلق' : 'GPS Location OFF',
  locationPText: I18nManager.isRTL
    ? 'تم إيقاف تشغيل موقع GPS الحالي الخاص بك ، يرجى تشغيل الموقع'
    : 'Your current GPS location is turn off please turn on the location',
  deleteSchedule: I18nManager.isRTL ? 'حذف الجدول' : 'Delete Schedule',
  selectDeleteSch: I18nManager.isRTL
    ? 'حدد الجدول الزمني للحذف'
    : 'Select Schedule to delete',
  NotificationSettings: I18nManager.isRTL
    ? 'إعدادات الإشعار'
    : 'Notification Setup',
  NotificationSetup: I18nManager.isRTL ? 'إعداد الإعلام' : 'Notification Setup',
  addPOC: I18nManager.isRTL ? 'أضف الغرض من الاستشارة' : 'Add New POC',
  PreAppointment: I18nManager.isRTL ? 'موعد مسبق' : 'Pre Appointment',
  Post: I18nManager.isRTL ? 'بريد' : 'Post Appointment',
  FollowUp: I18nManager.isRTL ? 'متابعة' : 'Follow Up',
  AddPreAppointmentNotification: I18nManager.isRTL
    ? 'إضافة إشعار مسبق بالموعد'
    : 'Add Pre Appointment Notification',
  AddPostNotification: I18nManager.isRTL
    ? 'إضافة إشعار آخر'
    : 'Add Post Appointment Notification',
  AddFollowUpNotification: I18nManager.isRTL
    ? 'إضافة إشعار آخر'
    : 'Add Follow Up Notification',
  Description: I18nManager.isRTL ? 'وصف' : 'Description',
  Interval: I18nManager.isRTL ? 'فترة' : 'Interval',
  acknowledge: I18nManager.isRTL ? 'الإقرار' : 'Acknowledge',
  tax: I18nManager.isRTL ? 'Tax' : 'Tax',
};

//I18nManager.isRTL ?'':''
export default labels;
