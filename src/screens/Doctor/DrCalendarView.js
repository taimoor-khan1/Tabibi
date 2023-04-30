import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
  BackHandler,
  Modal as RNModal,
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import styles from '../../assets/styles';
import colors from '../../config/Colors';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import {
  NewCalendar_CC,
  ButtonSmall,
  GreadientHeader,
  ButtonWhite,
  ReactChipsInput,
  ButtonGradient,
  AddBtn,
} from '../../components';
import Menu, {
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import ReactNativePickerModule from 'react-native-picker-module';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modalbox';
import Snackbar from 'react-native-snackbar';
import { SwipeablePanel } from 'rn-swipeable-panel';
import {
  getSchedule,
  getNotificationSettings,
  getDetail,
  createSchedule2,
  createScheduleEst,
  deleteSchedule,
  getPOS,
} from '../../store/actions';
import moment from 'moment';
import DrUtility from '../../config/DrUtility';
import { useSelector, useDispatch } from 'react-redux';
import fonts from '../../assets/fonts';
const { height } = Dimensions.get('screen');

const DrCalendarView = ({ navigation, route }) => {
  //Redux Store
  const dispatch = useDispatch();
  const { profile, role, estDoc } = useSelector((state) => state.Auth);
  const { getConsultationlist } = useSelector((state) => state.Patient);

  const {
    getProfileDetail,
    addSchedule,
    establishmentDoctor,
    AllSchedule,
    notificationSetting,
    POS,
  } = useSelector((state) => state.Doctor);
  // console.log(AllSchedule, 'allSchedule');

  // Declare state variables'
  const [selectedDate, onSelectedDate] = useState(
    route?.params?.date
      ? moment(route?.params?.date).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
  );
  console.log(selectedDate, 'selectedDate', route?.params?.date);
  const [addDoctor, setAddDoctor] = useState('');
  const [doctorData, setDoctorData] = useState({});
  const [providerId, setProviderId] = useState('');

  const minTime = new Date();
  minTime.setHours(8);
  minTime.setMinutes(0);
  minTime.setMilliseconds(0);

  const maxTime = new Date();
  maxTime.setHours(17);
  maxTime.setMinutes(0);
  maxTime.setMilliseconds(0);
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
  const [period, setPeriod] = useState(moment().format('YYYY-MM'));
  const [consultation, setConsultation] = useState('');
  const [consultationId, setConsultationId] = useState('');
  const [purposeOfConsulttext, setpurposeOfConsulttext] = useState('');
  const [replacementDoctor, setReplacementDoctor] = useState('');
  const [consultationDate, setConsultationDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [reapeatedData] = useState([
    { value: 0, name: I18nManager.isRTL ? 'لا يتكرر' : 'Does not repeat' },
    { value: 1, name: I18nManager.isRTL ? 'كل يوم' : 'Every Day' },
    { value: 7, name: I18nManager.isRTL ? 'كل اسبوع' : 'Every Week' },
    { value: 30, name: I18nManager.isRTL ? 'كل شهر' : 'Every Month' },
  ]);
  const [reapeatValue, setRepeatValue] = useState(0);
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());
  const [updateTS, setUpdateTS] = useState('');
  const [updateTE, setUpdateTE] = useState('5:00 pm');
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);
  const [slot, setSlot] = useState(0);
  const [timeData] = useState([
    { time: '30 min', value: 30 },
    { time: '40 min', value: 40 },
    { time: '50 min', value: 50 },
    { time: '1 hour', value: 60 },
    { time: '1.5 hour', value: 90 },
    { time: '2 hour', value: 120 },
  ]);
  const [perSlotTime, setPerSlotTime] = useState(0);
  const [pay, setPay] = useState(0);
  const [reapeat, setRepeat] = useState('Does not repeat');

  //Notification
  const [preNotification, setPreNotification] = useState('');
  const [preNotificationId, setPreNotificationId] = useState('');
  const [postNotification, setPostNotification] = useState('');
  const [postNotificationId, setPostNotificationId] = useState('');

  //POC Modal States
  const [showPOC, setShowPOC] = useState(false);
  const [addPOC, setAddPOC] = useState(false);
  const [chips, setChips] = useState([]);
  const [posData, setPosData] = useState([]);
  const [posFilter, setPosFilter] = useState([]);
  const [posId, setPosId] = useState('');
  const today = new Date();

  //Other Screen States
  const [mode, setMode] = useState(
    route?.params?.setMode ? route?.params?.setMode : 'month',
  );
  const [from] = useState(route?.params?.from ? route?.params?.from : false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [ST, setST] = useState('8:00 am');
  const [ET, setET] = useState('5:00 pm');
  const [deleteSchId, setDeleteSchId] = useState('');
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    // openLarge: true,
    showCloseButton: true,
    noBackgroundOpacity: true,
    onClose: () => {
      closePanel();
      clearStates();
    },
    onPressCloseButton: () => {
      closePanel();
    },
    // ...or any prop you want
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  // Declare input reference field
  const refFilter = useRef();
  const refPicker = useRef();
  const refPicker2 = useRef();
  const refPicker3 = useRef();
  const refPicker5 = useRef();
  const refPicker6 = useRef();
  const refPicker7 = useRef();
  //Fuctions
  const closePanel = () => {
    setIsPanelActive(false);
  };
  //BACK HANDLER
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackComponent(navigation),
    );
    return () => backHandler.remove();
  }, []);
  //Hardware Back funtion
  const onBackComponent = (navigation) => {
    if (mode === 'month') {
      setMode('month');
    } else {
      setMode('month');
    }
    return true;
  };
  //API Calling Get Schedule
  useEffect(() => {
    if (role == 'establishment') {
      dispatch(getDetail({ from: role }));
      dispatch(getNotificationSettings());
      dispatch(getPOS(false, estDoc?.provider?.id));
    } else {
      dispatch(getNotificationSettings());
      dispatch(getDetail({ from: role }));
      dispatch(getPOS(false));
    }
  }, []);
  //Get All Schedule API
  useEffect(() => {
    const params = {
      period: selectedDate, // curent day month
    };
    console.log(params, 'params2');
    if (estDoc?.provider) {
      dispatch(getSchedule(params, false, estDoc?.provider?.id));
    } else {
      console.log(params, 'params');
      dispatch(getSchedule(params, true));
    }
  }, [selectedDate]);
  //Set new schedule data
  useEffect(() => {
    if (addSchedule) {
      closePanel();
      clearStates();
      const params = {
        period: period, // curent day month
      };
      if (estDoc?.provider) {
        console.log(params, 'params3');
        dispatch(getSchedule(params, true, estDoc?.provider?.id));
      } else {
        console.log(params, params);
        dispatch(getSchedule(params, true));
      }
      dispatch({
        type: 'CREATE_SCHEDULE',
        payload: false,
      });
    }
  }, [addSchedule]);

  // Set POS Ddata
  useEffect(() => {
    setPosData(POS?.length ? POS : []);
    setPosFilter(POS?.length ? POS : []);
  }, [POS]);
  //MENU STYLES
  const { Popover } = renderers;
  const triggerStyles = {
    triggerText: {
      color: 'red',
    },
    triggerOuterWrapper: {
      top: -50,
      right: -130,
      padding: 10,
      flex: 1,
    },
    triggerTouchable: {
      underlayColor: 'darkblue',
      activeOpacity: 70,
      style: {
        flex: 1,
      },
    },
  };
  const optionsStyles = {
    optionsContainer: {
      backgroundColor: 'white',
      padding: 10,
      width: 160,
      borderRadius: 20,
    },
    optionsWrapper: {
      backgroundColor: 'white',
    },
    optionWrapper: {
      margin: 5,
    },
    optionTouchable: {
      activeOpacity: 70,
    },
    optionText: {
      fontFamily: fonts.PoppinsMedium,
    },
  };
  const optionStylesSelected = {
    optionTouchable: {
      activeOpacity: 40,
    },
    optionWrapper: {
      backgroundColor: '#ADD8F6',
    },
    optionText: {
      fontFamily: fonts.PoppinsMedium,
    },
  };
  const optionStyles = {
    optionTouchable: {
      activeOpacity: 40,
    },
    optionWrapper: {
      backgroundColor: 'transparent',
    },
  };
  // Render of POC
  function rendarPOC({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setpurposeOfConsulttext(item?.poc?.title);
          setPosId(item.id);
          setShowPOC(!showPOC);
          createChip(item);
          setSlot(item?.perSlotTime);
          setPerSlotTime(item?.perSlotTime);
          setPay(item?.perSlotAmount);
          setPostNotificationId(
            item?.postAppointmentNotify != null
              ? item?.postAppointmentNotify?.id
              : '',
          );
          setPreNotificationId(
            item?.preAppointmentNotify != null
              ? item?.preAppointmentNotify?.id
              : '',
          );
          setPostNotification(
            item?.postAppointmentNotify != null
              ? item?.postAppointmentNotify?.title
              : '',
          );
          setPreNotification(
            item?.preAppointmentNotify != null
              ? item?.preAppointmentNotify?.title
              : '',
          );
        }}>
        <View style={styles.POCArr}>
          <Text style={styles.fontSize(12)}>{item?.poc?.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Purpose of consultation search
  const onSearchTyping = (text) => {
    setpurposeOfConsulttext(text);
    const newData = posData.filter((item) => {
      const itemData = item?.poc?.title.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setPosFilter(newData);
  };
  //Get Create Chip
  const createChip = (data) => {
    var chips = [];
    chips.push({
      value: data?.poc?.title,
      color: data?.color,
      pocId: data?.poc?.id,
      posId: data?.id,
    });
    // console.log(chips, 'chips');
    setChips(chips);
  };
  // Remove chips
  const removeChips = (obj) => {
    let stateChips = [...chips];
    var filteredPOC = stateChips.filter((item, index) => {
      return item.pocId !== obj.pocId;
    });
    // console.log(filteredPOC, 'wwww');
    setChips(filteredPOC);
    setPosId('');
    setpurposeOfConsulttext('');
  };
  //Creating Time Slot for doctor schedule (Schedule API)
  const onCreateSchedule = () => {
    const payload = {
      consultationTypeId: consultationId,
      replacementProvider: replacementDoctor,
      consultationDate: consultationDate, // 2019-09-16
      startTime: moment(updateTS).format('ddd, LL ') + ' ' + ST,
      //  updateTS,
      // ? moment(consultationDate).format('ddd, LL') + ' ' + updateTS
      // : '', // September 15, 2021 00:00 Am format
      endTime: updateTE
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTE
        : '', // September 15, 2021 00:00 Am format
      posId: posId,
      preNotificationId: preNotificationId,
      postNotificationId: postNotificationId,
      perSlotTime: perSlotTime,
      perSlotAmount: pay,
      repeat: reapeatValue,
    };
    console.log("on click ==========", payload);

    DrUtility.drAvability(payload, navigation, createSchedule2, dispatch);
  };
  //Creating Time Slot for Establisment doctor schedule (Schedule API)
  const onCreateScheduleEst = () => {
    const payload = {
      providerId: estDoc?.provider?.id,
      consultationTypeId: consultationId,
      replacementProvider: replacementDoctor,
      consultationDate: consultationDate, // 2019-09-16
      startTime: moment(updateTS).format('ddd, LL hh:mm A'),
      endTime: updateTE
        ? moment(consultationDate).format('ddd, LL') + ' ' + updateTE
        : '', // September 15, 2021 00:00 Am format
      posId: posId,
      preNotificationId: preNotificationId,
      postNotificationId: postNotificationId,
      perSlotTime: perSlotTime,
      perSlotAmount: pay,
      repeat: reapeatValue,
    };
    console.log('start time======================>', payload.startTime);
    DrUtility.drAvabilityEst(payload, navigation, createScheduleEst, dispatch);
  };
  //Clear States
  const clearStates = () => {
    setConsultation('');
    setConsultationId('');
    setPosId('');
    setpurposeOfConsulttext('');
    setChips([]);
    setAddPOC(false);
    setReplacementDoctor('');
    setUpdateTS('');
    setUpdateTE('');
    setSlot(0);
    setPerSlotTime(0);
    setPay('0');
    setRepeat('Does not repeat');
    setPreNotification('');
    setPreNotificationId('');
    setPostNotification('');
    setPostNotificationId('');
  };
  // Clear time modal feilds
  const clearFeilds = () => {
    setTimeEnd(new Date());
    setTimeStart(new Date());
    setUpdateTS('');
    setUpdateTE('');
  };
  // Function for Delete Schedules
  const onDeleteSchedule = () => {
    const payload = {
      data: {
        scheduleIds: [deleteSchId],
      },
    };
    // console.log(payload);
    dispatch(deleteSchedule(payload, true)).then((res) => {
      if (res.status === 200) {
        setModalVisible(false);
        // console.log(selectedDate);
        const params = {
          period: moment(selectedDate).format('YYYY-MM'), // curent day month
        };

        if (estDoc?.provider) {
          console.log(params, 'params5');
          dispatch(getSchedule(params, true, estDoc?.provider?.id));
        } else {
          console.log(params);
          dispatch(getSchedule(params, true));
        }
      } else {
        setModalVisible(false);
        const params = {
          period: moment(selectedDate).format('YYYY-MM'), // curent day month
        };
        if (estDoc?.provider) {
          console.log(params, 'params6');
          dispatch(getSchedule(params, true, estDoc?.provider?.id));
        } else {
          console.log(params);
          dispatch(getSchedule(params, true));
        }
      }
    });
  };
  //UI RENDER COMPONENT
  const renderUI = () => (
    <>
      <View style={styles.calendarRowView}>
        <View style={styles.flex(0.7)}>
          <Text style={[styles.CCHeader, styles.textAlignRight]}>
            {moment(currentMonth).format('MMMM')}
          </Text>
        </View>
        <View style={[styles.flex(0.25), styles.mL(15)]}>
          {mode === 'day' && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}>
              <Image source={assets.delete} style={{ left: 12 }} />
              <Text style={[styles.textSearchSub]}>Schedule</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Calender  */}
      <NewCalendar_CC
        mode={mode}
        navigation={navigation}
        selectedDate={selectedDate ? selectedDate : route?.params?.date}
        onSelectDate={(date) => {
          onSelectedDate(moment(date).format('YYYY-MM-DD'));
          setPeriod(moment(date).format('YYYY-MM'));
        }}
        setConsultationDate={(date, endTime) => {
          setConsultationDate(moment(date).format('YYYY-MM-DD'));
          // setUpdateTS(date);
          setUpdateTS(moment(date).format('llll'));
          setTimeStart(date);
          setUpdateTE(endTime);
        }}
        setIsPanelActive={(e) => setIsPanelActive(e)}
        isPanelActive={isPanelActive}
        setModeChange={(mode) => setMode(mode)}
        setPeriod={(date) => {

          if (mode === "day") {
            setConsultationDate(moment(date).format('YYYY-MM-DD'));
          }
          else {
            setConsultationDate(moment().format('YYYY-MM-DD'));
          }
          setPeriod(moment(date).format('YYYY-MM')); //fix for week issue for 2 month
          setCurrentMonth(moment(date).format('YYYY-MM'));

          setUpdateTS(moment(date).format('llll'));
          // // setUpdateTS(date);

          // setUpdateTS(moment(date).format('hh:mm A'));
        }}
      />
      <View style={styles.height(10)} />
    </>
  );
  //Toasts
  const showToast = () => {
    Snackbar.show({
      text: labels.noSchedule,
      duration: Snackbar.LENGTH_SHORT,
      numberOfLines: 10,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
    });
  };
  // console.log(mode, '===========date');
  //MAIN RENDER
  return (
    <>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={assets.scheduleIcon}
        // showCenterText={`${labels.welcome} ${profile?.name}`}
        showCenterText={
          profile?.firstName
            ? `${labels.welcome} ${profile?.firstName} ${profile?.lastName}`
            : `${labels.welcome} ${profile?.name}`
        }
        showLeftText={labels.back}
        back={true}
        modalBtn={() => setIsOpened(!isOpened)}
        // leftRoute={() => navigation.goBack()}
        leftRoute={() =>
          mode === 'month'
            ? role === 'establishment'
              ? navigation.navigate('DrDashboard')
              : navigation.reset({
                index: 0,
                routes: [{ name: 'DrawerStack' }],
              })
            : from
              ? role === 'establishment'
                ? setMode('month')
                : navigation.reset({
                  index: 0,
                  routes: [{ name: 'DrawerStack' }],
                })
              : setMode('month')
        }
      />
      <Menu
        renderer={Popover}
        rendererProps={{ preferredPlacement: 'bottom' }}
        opened={isOpened}
        onBackdropPress={() => setIsOpened(!isOpened)}>
        <MenuTrigger customStyles={triggerStyles} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption
            onSelect={() => {
              setMode('day');
              setIsOpened(false);
            }}
            customStyles={mode === 'day' ? optionStylesSelected : optionStyles}>
            <View style={styles.flexRow}>
              <Image source={assets.day} style={styles.margin(2)} />
              <Text style={styles.menuDate}>{labels.day}</Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setMode('3days');
              setIsOpened(false);
            }}
            customStyles={
              mode === '3days' ? optionStylesSelected : optionStyles
            }>
            <View style={styles.flexRow}>
              <Image source={assets.day3} style={styles.margin(2)} />
              <Text style={styles.menuDate}>3 {labels.day3}</Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setMode('week');
              setIsOpened(false);
            }}
            customStyles={
              mode === 'week' ? optionStylesSelected : optionStyles
            }>
            <View style={styles.flexRow}>
              <Image source={assets.week} style={styles.margin(2)} />
              <Text style={styles.menuDate}>{labels.week}</Text>
            </View>
          </MenuOption>
          <MenuOption
            onSelect={() => {
              setMode('month');
              setIsOpened(false);
            }}
            customStyles={
              mode === 'month' ? optionStylesSelected : optionStyles
            }>
            <View style={styles.flexRow}>
              <Image source={assets.month} style={styles.margin(2)} />
              <Text style={styles.menuDate}>{labels.month}</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
      {mode === 'month' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderUI()}
        </ScrollView>
      ) : (
        renderUI()
      )}
      {/* Bottom Sheet */}
      <SwipeablePanel {...panelProps} isActive={isPanelActive}>
        <KeyboardAvoidingView
          style={[styles.flex(1), { zIndex: 1000000 }]}
        // behavior={Platform.OS == 'ios' && 'padding'}
        >
          <View style={[styles.pH(15)]}>
            <Text style={[styles.availablityHeading, styles.margin(0)]}>
              {labels.yourAvalibality}
            </Text>
            <Text style={[styles.availablitytext, styles.mL(15), styles.mT(5)]}>
              Date{' '}
              <Text style={styles.color(colors.black)}>
                {/* {` ${updateTS} - ${updateTE}`} */}
                {` ${moment(consultationDate).format(
                  'ddd, MMM Do YYYY',
                )} ${ST} - ${ET}`}
              </Text>
            </Text>
            {/* Schedule Time*/}
            <View
              style={[
                styles.flexRow,
                styles.alignSelf,
                styles.mH(45),
                styles.mT(10),
              ]}>
              <ButtonWhite
                exstyle={styles.shadowbb}
                title={ST != '' ? ST : labels.timestart}
                // title={"8:00 AM"}
                // title={updateTS != '' ? updateTS : labels.timestart}
                onBtnPress={() => {
                  refFilter.current.open();
                  setPicker(true);
                  setPicker1(false);
                }}
              />
              <ButtonWhite
                disable={!updateTS ? true : false}
                exstyle={[styles.shadowbb]}
                title={ET != '' ? ET : labels.timeend}
                onBtnPress={() => {
                  refFilter.current.open();
                  setPicker(false);
                  setPicker1(true);
                }}
              />
            </View>
            {/* Consultation Type */}
            <Text style={[styles.bottomSheetH1]}>
              {labels.typeOfConsultation}
            </Text>
            <View style={[styles.availCont1, styles.mL(10)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild, styles.flex(0.8)]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.textNoti,
                        styles.mL(15),
                        styles.color(
                          consultation == '' ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {consultation == '' ? labels.slelectType : consultation}
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
              pickerRef={refPicker}
              value={consultation}
              title={labels.typeOfConsultation}
              items={getConsultationlist?.map((a) => (a.id, a.title))}
              selectedColor={colors.themeColor}
              onValueChange={(value, i) => {
                setConsultation(value);
                getConsultationlist
                  ?.filter((e) => e.title === value)
                  ?.map((item, i) => {
                    return setConsultationId(item.id);
                  });
              }}
            />
            {/* Purpose of consultation */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.purpose}
            </Text>
            <Input
              inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
              placeholder={labels.typeHere}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="done"
              value={purposeOfConsulttext}
              onChangeText={(text) => {
                onSearchTyping(text);
                setShowPOC(text.length > 0 ? true : false);
                setAddPOC(
                  text.trim().length > 0 || purposeOfConsulttext ? true : false,
                );
              }}
              rightIconContainerStyle={{ width: 30 }}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ zIndex: 100 }}
                  onPress={() => {
                    setShowPOC(!showPOC);
                  }}>
                  <Icon
                    name={showPOC ? 'chevron-up' : 'chevron-down'}
                    color={colors.heading}
                    type="evilicon"
                  />
                </TouchableOpacity>
              }
            />
            {showPOC ? (
              <View style={styles.POCView}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={posFilter}
                  renderItem={rendarPOC}
                  keyExtractor={(item) => item?.poc?.title}
                  ListEmptyComponent={
                    <Text style={styles.POCError}>{labels.noData}</Text>
                  }
                />
              </View>
            ) : null}
            <ReactChipsInput
              label={''}
              initialChips={chips}
              removedItem={(e) => removeChips(e)}
              alertRequired={false}
              chipStyle={[styles.chipStyle]}
              chipTextStyle={[styles.chipTextStyle]}
            />

            {/* Replacement Doctor */}
            <Text style={[styles.bottomSheetH1]}>
              {labels.replacementDoctor}
            </Text>
            <Input
              inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
              placeholder={labels.typeHere}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="done"
              value={replacementDoctor}
              onChangeText={(text) => {
                setReplacementDoctor(text);
              }}
              onSubmitEditing={(e) => { }}
            />

            {/* TIME SLOT */}
            <Text style={[styles.bottomSheetH1]}>{labels.selectSlot}</Text>
            <View style={[styles.availCont1, styles.mL(10), styles.alignSelf]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(0.6)]}
                onPress={() => refPicker2.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild, styles.flex(0.8)]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.textNoti,
                        styles.mL(15),
                        styles.color(
                          slot === 0 ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {slot === 0 ? labels.selectSlot : slot}
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
              <View style={[styles.flex(0.4), styles.alignItemsFlexend]}>
                <Input
                  inputContainerStyle={[styles.inputContainer, styles.shadowbb]}
                  inputStyle={[styles.inputStyle]}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  value={'$ ' + pay}
                  onChangeText={(text) => {
                    setPay(Number(text.replace(/[^0-9]/g, '')));
                  }}
                  onSubmitEditing={(e) => { }}
                />
              </View>
            </View>
            <ReactNativePickerModule
              pickerRef={refPicker2}
              value={slot}
              title={labels.selectSlot}
              items={timeData.map((a) => a.time)}
              selectedColor={colors.themeColor}
              onValueChange={(slot) => {
                setSlot(slot);
                timeData
                  ?.filter((e) => e.time === slot)
                  ?.map((item, i) => {
                    return setPerSlotTime(item.value);
                  });
              }}
            />
            {/* Repeated cycle */}
            <Text style={[styles.bottomSheetH1]}>{labels.repeated}</Text>
            <View style={[styles.availCont1, styles.mL(10), styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker3.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),
                        styles.color(
                          reapeat === '' ? colors.subText : colors.heading,
                        ),
                      ]}>
                      {reapeat === '' ? labels.select : reapeat}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                pickerRef={refPicker3}
                value={reapeat}
                title={labels.selectRepeat}
                items={reapeatedData.map((a) => a.name)}
                selectedColor={colors.themeColor}
                onValueChange={(repeat) => {
                  setRepeat(repeat);
                  reapeatedData
                    ?.filter((e) => e.name === repeat)
                    ?.map((item, i) => {
                      return setRepeatValue(item.value);
                    });
                }}
              />
            </View>
            {/* Pre Notification */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.preNotification}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker6.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),
                        styles.color(
                          preNotification == ''
                            ? colors.subText
                            : colors.heading,
                        ),
                      ]}>
                      {preNotification == '' ? labels.select : preNotification}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                pickerRef={refPicker6}
                value={preNotification}
                title={labels.preNotification}
                items={notificationSetting
                  ?.filter((filter) => filter.type === 'pre-appointment')
                  ?.map((item) => item.title)}
                selectedColor={colors.themeColor}
                onValueChange={(notification) => {
                  setPreNotification(notification);
                  notificationSetting
                    ?.filter((filter) => filter.title === notification)
                    ?.map((item, i) => {
                      return setPreNotificationId(item.id);
                    });
                }}
              />
            </View>
            {/* Post Notification */}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.postNotification}
            </Text>
            <View style={[styles.availCont1, styles.flex(0)]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.dropDown, styles.flex(1)]}
                onPress={() => refPicker7.current.show()}>
                <View style={[styles.flexRow]}>
                  <View style={[styles.leftFeild]}>
                    <Text
                      style={[
                        styles.dropDownText,
                        styles.mL(20),
                        styles.color(
                          postNotification == ''
                            ? colors.subText
                            : colors.heading,
                        ),
                      ]}>
                      {postNotification == ''
                        ? labels.select
                        : postNotification}
                    </Text>
                  </View>
                  <View style={[styles.rightArrowDown]}>
                    <Icon
                      name="chevron-down"
                      color={colors.heading}
                      type="evilicon"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <ReactNativePickerModule
                pickerRef={refPicker7}
                value={postNotification}
                title={labels.postNotification}
                items={notificationSetting
                  ?.filter((filter) => filter.type === 'post-appointment')
                  ?.map((item) => item.title)}
                selectedColor={colors.themeColor}
                onValueChange={(notification) => {
                  setPostNotification(notification);
                  notificationSetting
                    ?.filter((filter) => filter.title === notification)
                    ?.map((item, i) => {
                      return setPostNotificationId(item.id);
                    });
                }}
              />
            </View>
            <ButtonSmall
              title={labels.save}
              onBtnPress={() => {
                role === 'establishment'
                  ? onCreateScheduleEst()
                  : onCreateSchedule();
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </SwipeablePanel>
      {/* ADD BUTTON */}
      {mode !== 'month' && isPanelActive === false && (
        <AddBtn
          type={false}
          extraStyle={{ zIndex: 99 }}
          onBtnPress={() => {
            setIsPanelActive(true);
            setUpdateTS(moment(selectedDate).format('hh:mm A'));
          }}
        />
      )}
      {/* time start and end modal */}
      <Modal
        style={[styles.filterModalSmall]}
        position={'center'}
        ref={refFilter}
        backdropPressToClose={false}
        backdropOpacity={0.25}
        keyboardTopOffset={50}
        backButtonClose={true}
        swipeToClose={false}
        backdropColor={colors.black}>
        <View style={[styles.flex(1), styles.mH(5)]}>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            onPress={() => refFilter.current.close()}>
            <Image source={assets.close} style={styles.close} />
          </TouchableOpacity>
          <Text style={styles.availablity}>{labels.availablity}</Text>
          {picker === true && (
            <>
              <DatePicker
                date={timeStart}
                mode={'time'}
                minimumDate={minTime}
                maximumDate={maxTime}
                minuteInterval={15}
                onDateChange={(e) => {
                  setTimeStart(e);
                  setST(moment(e).format('hh:mm a'));
                  // setUpdateTS(moment(e).format('hh:mm a'));
                  setUpdateTS(e);
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          {picker1 === true && (
            <>
              <DatePicker
                date={timeEnd}
                minimumDate={minTime}
                maximumDate={maxTime}
                mode={'time'}
                minuteInterval={15}
                onDateChange={(e) => {
                  // setPicker1(false);
                  setTimeEnd(e);
                  setET(moment(e).format('hh:mm a'))
                  setUpdateTE(moment(e).format('hh:mm a'));
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          <View style={[styles.ModalFilterCont]}>
            <ButtonWhite
              title={labels.clearall}
              onBtnPress={() => clearFeilds()}
            />
            <ButtonSmall
              title={labels.apply}
              onBtnPress={() => {
                refFilter.current.close();
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Schedule Delete Modal */}
      <RNModal
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false), setScheduleDate(''), setDeleteSchId('');
        }}
        visible={modalVisible}>
        <View style={[styles.centeredView, { backgroundColor: '#00000080' }]}>
          <View
            style={[
              styles.permissionView,
              styles.height(240),
              styles.width_Percent('95%'),
            ]}>
            <TouchableOpacity
              style={styles.imageCross}
              onPress={() => {
                setModalVisible(false), setScheduleDate(''), setDeleteSchId('');
              }}>
              <Image source={assets.cross} />
            </TouchableOpacity>
            <View style={[styles.mT(30)]}>
              <Text
                style={[
                  styles.h2,
                  styles.textAlign,
                  styles.color(colors.darkTheme),
                ]}>
                {labels.deleteSchedule}
              </Text>
              <View style={[styles.deleteDropDown]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.dropDown, styles.flex(1)]}
                  onPress={() =>
                    AllSchedule?.filter(
                      (a) => a.consultationDate === selectedDate,
                    ).length > 0
                      ? refPicker5.current.show()
                      : showToast()
                  }>
                  <View style={[styles.flexRow]}>
                    <View style={[styles.leftFeild, styles.flex(0.8)]}>
                      <Text
                        ellipsizeMode={'tail'}
                        numberOfLines={1}
                        style={[
                          styles.dropDownText,
                          styles.textNoti,
                          styles.mL(15),
                          { width: '100%' },
                          styles.color(
                            scheduleDate == ''
                              ? colors.subText
                              : colors.heading,
                          ),
                        ]}>
                        {scheduleDate == ''
                          ? labels.selectDeleteSch
                          : scheduleDate}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.rightArrowDown,
                        styles.flex(0.2),
                        styles.justifyContent,
                      ]}>
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
                pickerRef={refPicker5}
                value={addDoctor}
                backdropOpacity={0.2}
                title={labels.selectDeleteSch}
                items={AllSchedule?.filter(
                  (a) => a.consultationDate === selectedDate,
                ).map(
                  (item) =>
                    `${moment(item?.consultationDate).format('ll')}, ${moment(
                      item?.startTime,
                    ).format('hh:mm A')} - ${moment(item?.endTime).format(
                      'hh:mm A',
                    )}`,
                )}
                selectedColor={colors.themeColor}
                onValueChange={(value, i) => {
                  setScheduleDate(value);
                  AllSchedule?.filter(
                    (e) =>
                      `${moment(e?.consultationDate).format('ll')}, ${moment(
                        e?.startTime,
                      ).format('hh:mm A')} - ${moment(e?.endTime).format(
                        'hh:mm A',
                      )}` === value,
                  )?.map((item, i) => {
                    return setDeleteSchId(item?.id);
                  });
                }}
              />
              <View style={styles.mH(40)}>
                <ButtonGradient
                  title={labels.delete}
                  type={false}
                  gradient={true}
                  onBtnPress={() => {
                    !deleteSchId
                      ? Snackbar.show({
                        text: 'Please Select Schedule',
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: colors.themeColor,
                        fontFamily: fonts.PoppinsMedium,
                        textColor: colors.dim,
                        numberOfLines: 1,
                      })
                      : onDeleteSchedule();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </RNModal>
    </>
  );
};

export default DrCalendarView;
