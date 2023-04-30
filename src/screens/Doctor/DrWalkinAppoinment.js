import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {ButtonSmall, GreadientHeader, ButtonWhite} from '../../components';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import Modal from 'react-native-modalbox';
import ReactNativeModal from 'react-native-modal';
import ReactNativePickerModule from 'react-native-picker-module';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-date-picker';
import {
  getConsultationTypes,
  getAvailableSlots,
  // searchPatient,
  getMyPatient,
  searchPOC,
  bookWalkInPateints,
  getSchedule,
} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';

const DrWalkinAppoinment = ({navigation, route}) => {
  //Redux STORE
  const dispatch = useDispatch();
  const {role, profile, estDoc} = useSelector((state) => state.Auth);
  const {availableSlots, patientsSearch, addNewPatient, allPatients} =
    useSelector((state) => state.Doctor);

  // Declare state variables'
  const [consultationId, setConsultationId] = useState(
    route?.params?.start ? route?.params?.consultationId : '',
  );
  const [slots, setSlots] = useState(
    route?.params?.start
      ? `${moment(route?.params?.start, ['hh:mm A']).format(
          'hh:mm A',
        )} - ${moment(route?.params?.end, ['hh:mm A']).format('hh:mm A')}`
      : 'No Timeslot Slected',
  );
  const [slotId, setSlotId] = useState(
    route?.params?.slotId ? route?.params?.slotId : '',
  );
  const [date, setDate] = useState(
    route?.params?.start ? route?.params?.date : moment().format('YYYY-MM-DD'),
  );
  const [patient, setPatient] = useState('');
  const [posId, setPosId] = useState(
    route?.params?.posId ? route?.params?.posId : '',
  );
  const [showPatient, setShowPatient] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [patientData, setPatientData] = useState(
    route?.params?.data ? route?.params?.data : {},
  );
  const [monthPop, setMonthPop] = useState(false);
  const [current, setCurrent] = useState(new Date());
  const [patientFilter, setPatientFilter] = useState([]);
  const [patientList, setPatientList] = useState([]);

  // Declare input reference field
  const refConsulation = useRef();
  const refSlot = useRef();
  const refPopUp = useRef();

  //Fuctions and API's

  //GET Data
  useEffect(() => {
  
    dispatch(getConsultationTypes());
    dispatch(searchPOC({title: ''}));
    dispatch(getAvailableSlots({date}, false));
    if (estDoc?.provider) {
      dispatch(getMyPatient(false, estDoc?.provider?.id));
    } else {
      dispatch(getMyPatient(false));
    }
  }, []);

  //Set patient list and its search filter
  useEffect(() => {
    setPatientList(allPatients?.length ? allPatients : []);
    setPatientFilter(allPatients?.length ? allPatients : []);
  }, [allPatients]);

  //set new patient data
  useEffect(() => {
    if (addNewPatient?.id) {
      setPatientData(addNewPatient);
    }
  }, [addNewPatient]);

  //Function for date and timeslot set
  const textSplit = (text) => {
    var e = text;
    var feilds = e.split(',');
    setDate(feilds[0]);
    setSlots(feilds[1]);
  };
  const onApplytime = () => {
    setMonthPop(false);
    setSlots('');
    dispatch(getAvailableSlots({date}, false));
  };
  const clearFeilds = () => {
    setMonthPop(false);
    // setCurrent(new Date());
  };
  // ************************* GLOBAL SEARCH *************************
  // Search Available Patients
  // const onSearchTyping = (text) => {
  //   setPatient(text);
  //   if (text.length > 0) {
  //     const params = {
  //       title: text.trim(),
  //     };
  //     dispatch(searchPatient(params));
  //   } else {
  //   }
  // };
  // *************************               *************************

  // function for searching my patients list from filter list
  const onSearchTyping = (text) => {
    setPatient(text);
    const newData = patientFilter.filter((item) => {
      const itemData = item?.firstName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setPatientList(newData);
  };

  // Render of Patients
  function rendarPatients({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setPatient('');
          setShowPatient(!showPatient);
          setPatientData(item);
        }}>
        <View
          style={[
            styles.PatientArr,
            styles.bottomLine,
            styles.alignItemCenter,
          ]}>
          <Image
            source={item?.avatar ? {uri: item.avatar} : assets.dummy}
            style={[styles.height(40), styles.width(40)]}
            borderRadius={50}
          />
          <Text
            style={[
              styles.fontSize(12),
              styles.mL(10),
            ]}>{`${item.firstName} ${item.lastName}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  //Clear Patient Data
  const clearPatient = () => {
    dispatch({type: 'ADD_PATIENT_APPOINTMENT', payload: {}});
    setPatientData({});
  };
  //Booking Appointment
  const onBookAppointment = () => {
    var validation = `${
      !slots
        ? labels.validTimeSlot
        : !posId
        ? labels.validTimeSlot
        : !patientData?.id
        ? labels.validPatient
        : true
    }`;
    if (validation === 'true') {
      const appointment = {
        slotId: slotId,
        posId: posId,
        patientId: patientData?.id,
        consultationTypeId: consultationId,
      };
      // console.log(appointment);
      dispatch(bookWalkInPateints(appointment, true)).then((res) => {
        if (res.status === 200) {
          // refPopUp.current.open();
          if (res?.data?.data?.type === 'Video Call') {
            Snackbar.show({
              text: 'Appointment is booked,It will show after payment is completed from patient',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: colors.themeColor,
              fontFamily: fonts.PoppinsMedium,
              textColor: colors.dim,
            });
          } else {
            refPopUp.current.open();
          }
          setTimeout(() => {
            refPopUp.current.close();
            const params = {
              period: moment(route?.params?.data?.start).format('YYYY-MM'), // curent day month
            };
            if (estDoc?.provider) {
              dispatch(getSchedule(params, false, estDoc?.provider?.id));
            } else {
              dispatch(getSchedule(params, false));
            }
            navigation.goBack();
          }, 2000);
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
  };
  //Toasts
  const showToast = () => {
    Snackbar.show({
      text: labels.noSlot,
      duration: Snackbar.LENGTH_SHORT,
      numberOfLines: 10,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
    });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.bookAnAppointment}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <View style={styles.height(10)} />
        <KeyboardAvoidingView
          style={styles.flex(1)}
          behavior={Platform.OS == 'ios' && 'padding'}>
          <ScrollView
            bounces={false}
            style={styles.backgroundColor(colors.themeWhite)}
            // onScroll={() => patient?.length > 0 && Keyboard.dismiss()}
            showsVerticalScrollIndicator={false}>
            <View style={styles.mH(20)}>
              <View
                style={[styles.shadowbb, styles.drWalkinDoctorDetailWrapper]}>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.drName}
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {profile?.name}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.slotTime}
                  </Text>
                  <Text style={[styles.fontPoppinsRegularBlack14]}>
                    {slots}
                  </Text>
                </View>
                <View style={styles.drWalkinDoctorDetailSubWrappper}>
                  <Text
                    style={[styles.fontPoppinsSemiBoldBlack14, styles.mR(5)]}>
                    {labels.date1}
                  </Text>
                  <Text
                    onPress={() =>
                      route?.params?.start ? null : setMonthPop(true)
                    }
                    style={[
                      styles.fontPoppinsRegularBlack14,
                      route?.params?.start ? null : styles.textBlueC,
                    ]}>
                    {date}
                  </Text>
                </View>
              </View>

              {/* Available Slots */}
              <Text style={[styles.availablityHeading, styles.mB(7)]}>
                {labels.selectTimeSlots}
              </Text>
              <View
                style={[
                  styles.countryFeildCont,
                  styles.width_Percent('95%'),
                  styles.alignSelf,
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.dropDown, styles.flex(1)]}
                  disabled={route?.params?.start ? true : false}
                  onPress={() =>
                    availableSlots?.length > 0
                      ? refSlot.current.show()
                      : showToast()
                  }>
                  <View style={[styles.flexRow]}>
                    <View style={[styles.leftFeild, styles.flex(0.8)]}>
                      <Text
                        style={[
                          styles.dropDownText,
                          styles.textNoti,
                          styles.mL(15),
                          styles.color(
                            slots == '' ? colors.subText : colors.heading,
                          ),
                        ]}>
                        {slots == '' ? labels.selectAvailSlots : slots}
                      </Text>
                    </View>
                    <View style={[styles.rightArrowDown, styles.flex(0.2)]}>
                      <Icon
                        name="chevron-down"
                        color={colors.heading}
                        type="evilicon"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <ReactNativePickerModule
                titleStyle={styles.profileText}
                itemStyle={styles.pickerItem}
                pickerRef={refSlot}
                value={slots}
                titleStyle={[styles.PoppinsMedium]}
                itemStyle={[styles.PoppinsMedium]}
                title={labels.selectAvailSlots}
                items={
                  availableSlots?.length > 0
                    ? availableSlots?.map(
                        (item) =>
                          `${item?.consultationDate}, ${moment(
                            item?.startTime,
                            ['hh:mm A'],
                          ).format('hh:mm A')} - ${moment(item?.endTime, [
                            'hh:mm A',
                          ]).format('hh:mm A')}, (${
                            item?.schedule?.consultationType?.title
                          })`,
                      )
                    : ['No Timeslot avaibable on this date']
                }
                selectedColor={colors.themeColor}
                onCancel={() => {}}
                onValueChange={(timeSlot, i) => {
                  textSplit(timeSlot);
                  availableSlots
                    ?.filter(
                      (e) =>
                        `${e?.consultationDate}, ${moment(e?.startTime, [
                          'hh:mm A',
                        ]).format('hh:mm A')} - ${moment(e?.endTime, [
                          'hh:mm A',
                        ]).format('hh:mm A')}, (${
                          e?.schedule?.consultationType?.title
                        })` === timeSlot,
                    )
                    ?.map((item, i) => {
                      return (
                        setSlotId(item?.id),
                        setPosId(item?.schedule?.purposes?.id),
                        setConsultationId(item?.schedule?.consultationType?.id)
                      );
                    });
                }}
              />
              {/* Select Patient */}
              <Text style={[styles.availablityHeading, styles.mB(7)]}>
                {labels.selectPatient}
              </Text>
              <Input
                inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
                placeholder={labels.searchHere}
                inputStyle={[styles.inputStyle]}
                // disabled={!posId}
                autoCapitalize="words"
                returnKeyType="done"
                value={patient}
                onChangeText={(text) => {
                  onSearchTyping(text);
                  setShowPatient(text.length > 0 ? true : false);
                  setAddPatient(
                    text.trim().length > 0 || patient ? true : false,
                  );
                }}
                onSubmitEditing={(e) => refConsulation.current.open()}
                rightIconContainerStyle={styles.width(30)}
                rightIcon={
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={!posId}

                    style={{zIndex: 100}}
                    onPress={() => navigation.navigate('DrAddPatient')}>
                    <Image source={assets.plus} />
                  </TouchableOpacity>
                }
              />
              {showPatient ? (
                <View style={styles.POCView}>
                  <FlatList
                    nestedScrollEnabled={true}
                    data={patientList}
                    onScroll={() => Keyboard.dismiss()}
                    renderItem={rendarPatients}
                    ListEmptyComponent={
                      <Text style={styles.POCError}>{labels.noData}</Text>
                    }
                  />
                </View>
              ) : null}
              {patientData?.firstName && (
                <View
                  style={[
                    styles.PatientArr,
                    styles.backgroundColor(colors.white),
                    styles.mB(10),
                  ]}>
                  <View style={styles.newPatientView}>
                    <Image
                      source={
                        patientData?.avatar
                          ? {uri: patientData.avatar}
                          : assets.dummy
                      }
                      style={[styles.height(40), styles.width(40)]}
                      borderRadius={50}
                    />
                    <Text
                      style={[
                        styles.fontSize(12),
                        styles.mL(10),
                      ]}>{`${patientData.firstName} ${patientData.lastName}`}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.justifyContent}
                    onPress={() => clearPatient()}>
                    <Image source={assets.cross} />
                  </TouchableOpacity>
                </View>
              )}
              <ButtonSmall
                title={labels.save}
                // disabled={paymentCard === null}
                onBtnPress={() => onBookAppointment()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* BOOK APPOINTMENT MODAL */}
        <Modal
          style={[styles.modal]}
          position={'center'}
          ref={refPopUp}
          backdropPressToClose={false}
          backdropOpacity={0.8}
          keyboardTopOffset={50}
          backButtonClose={true}
          swipeToClose={true}
          backdropColor={colors.black}>
          <Image
            source={assets.sucessfull}
            style={styles.doneBox}
            resizeMode="contain"
          />
          <Text style={[styles.sucessTitle, styles.mT(20)]}>
            {labels.sucess}
          </Text>
        </Modal>
        {/* DATE SELECTION MODAL */}
        <ReactNativeModal
          style={[styles.height(300)]}
          backdropOpacity={0.5}
          isVisible={monthPop}
          onBackdropPress={() => setMonthPop(false)}>
          <View
            style={[
              styles.mH(20),
              styles.bR(20),
              styles.pV(20),
              styles.pH(20),
              styles.backgroundColor(colors.white),
            ]}>
            <TouchableOpacity
              // hitSlop={[styles.hitSlop]}
              onPress={() => setMonthPop(false)}>
              <Image source={assets.close} style={[styles.close]} />
            </TouchableOpacity>
            <>
              <DatePicker
                date={current}
                mode={'date'}
                minimumDate={new Date()}
                onDateChange={(date) => {
                  setCurrent(date);
                  setDate(moment(date).format('YYYY-MM-DD'));
                }}
                style={styles.pickerCont2}
              />
            </>
            <View style={[styles.ModalFilterCont]}>
              <ButtonWhite
                exstyle={styles.shadowbb}
                title={labels.can}
                onBtnPress={() => clearFeilds()}
              />
              <ButtonSmall
                title={labels.apply}
                onBtnPress={() => {
                  onApplytime();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
      </View>
    </>
  );
};

export default DrWalkinAppoinment;
