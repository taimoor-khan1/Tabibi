import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { ButtonWhite, ButtonSmall } from '../components';
import styles from '../assets/styles';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import { Calendar } from 'react-native-big-calendar';

import { assets } from '../assets/images';
import labels from '../config/Labels';
import colors from '../config/Colors';
import fonts from '../assets/fonts';
import Animations from '../../Animation';
import { useSelector, useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

const NewCalendar_CC = ({
  navigation,
  mode,
  setIsPanelActive = () => { },
  setConsultationDate = () => { },
  setModeChange = () => { },
  setPeriod = () => { },
  onSelectDate = () => { },
  isPanelActive = false,
  selectedDate = false,
}) => {
  //Redux Store
  const dispatch = useDispatch();
  const { user, role, profile } = useSelector((state) => state.Auth);
  const { AllSchedule, getProfileDetail } = useSelector((state) => state.Doctor);
  const [Popups, setPopups] = useState(false);
  const today = new Date();

  // Declare state variables'
  const [defualtData, setDefaultDate] = useState(null);
  const [allowDrag, setDragPermission] = useState(null);
  const [scrollPostion, setScrollPostion] = useState(null);
  const [slotsData, setSlotsData] = useState([]);
  const [selectedDay, onSelectDay] = useState(
    moment(selectedDate).format('YYYY-MM-DD'),
  );

  //Functions
  //Action to set Booked and unbooked schedule
  useEffect(() => {
    var newArr = [];
    const getSlots = () => {
      AllSchedule?.map((sch, index) => {
        sch?.slots?.map((slot, ind) => {
          const date = {
            title: sch?.consultationType?.title,
            start: slot?.consultationDate + ' ' + slot?.startTime,
            end: slot?.consultationDate + ' ' + slot?.endTime,
            time: `${moment(slot?.startTime, ['hh:mm A']).format(
              'hh:mm A',
            )} to ${moment(slot?.endTime, ['hh:mm A']).format('hh:mm A')}`,
            poc: sch?.purposes?.poc?.title,
            slotId: slot?.id,
            posId: sch?.purposes?.id,
            status: slot.status
              ? 'Available'
              : slot?.appointment?.status === 'completed'
                ? 'COMPLETED'
                : 'BOOKED',
            type: sch?.consultationType?.title,
            consultationId: sch?.consultationType?.id,
            appointment: slot?.appointment ? slot?.appointment : null,
            schedule: sch,
            bg: slot.status
              ? sch?.purposes?.color
              : slot?.appointment?.status === 'completed'
                ? colors.green1
                : colors.red,
          };
          newArr.push(date);
        });
      });
      console.log("slots=======>", newArr)
      setSlotsData(newArr);
    };
    getSlots();
  }, [AllSchedule]);

  const onSelected = (date) => {
    setIsPanelActive(!isPanelActive);
    setConsultationDate(
      defualtData,
      moment(`${date.endTime.hours}:${date.endTime.min}`, ['hh:mm A']).format(
        'hh:mm A',
      ),
    ),
      onSelectDay(defualtData);
  };
  // Custom Render for schedule component
  const renderEvent = (event, touchableOpacityProps) => {
    if (touchableOpacityProps.style && !touchableOpacityProps.title) {
      touchableOpacityProps.style.map((item, index) => {
        if (item?.backgroundColor) {
          touchableOpacityProps.style[index].backgroundColor = event.bg;


          if (mode === 'month') {
            touchableOpacityProps.style[index].height = 15;
            touchableOpacityProps.style[index].paddingHorizontal = 2;
            touchableOpacityProps.style[index].paddingVertical = 2;
          }
          if (mode === 'day' || mode === '3days') {
            touchableOpacityProps.style[index].flexDirection = 'row';
            touchableOpacityProps.style[index].paddingHorizontal = 5;
            touchableOpacityProps.style[index].paddingVertical = 4;
          }
        }
      });
      return (
        <TouchableOpacity
          {...touchableOpacityProps}
        >
          <Text style={styles.event}>
            {`${event.title} ${event.poc}  ${event.time}  ${event.status}`}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  const handleREf = useRef(null);
  //Validations before creating schedules
  const checkValidation = (data, show) => {
    if (getProfileDetail?.purposes?.length && show === true) {
      // purpose of consultation is added
      setDragPermission(data);
    } else if (show === true) {
      // need purpose of consultation against every schedule
      showToast('POC');
    }
  };
  //Toasts
  const showToast = (type) => {
    if (type === 'verify') {
      Snackbar.show({
        text: labels.notVerified,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Ok',
          textColor: colors.dim,
          onPress: () => {
            dispatch(drGetProfile({ user_id: user?.userId, from: role }, true));
            dispatch(getDetail({ from: role }));
          },
        },
      });
    } else if (type === 'POC') {
      Snackbar.show({
        text: labels.pocCheck,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Ok',
          textColor: colors.dim,
          onPress: () => {
            navigation.navigate('DrMyProfile');
          },
        },
      });
    } else if (type === 'date') {
      Snackbar.show({
        text: labels.cannot,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'ok',
          textColor: colors.dim,
          onPress: () => {
            Snackbar.dismiss();
          },
        },
      });
    }
  };
  // console.log(selectedDay);
  return (
    <>

      <Calendar
        bodyContainerStyle={{ zIndex: -100 }}
        events={slotsData}
        height={height}
        mode={mode}
        scrollRef={handleREf}
        scrollOffsetMinutes={scrollPostion}
        swipeEnabled={!allowDrag}

        ampm={true}
        date={selectedDay}
        overlapOffset={90}
        eventMinHeightForMonthView={true}
        renderEvent={renderEvent}
        headerContainerStyle={{
          height: 60,
          borderColor: colors.darkBlue,
          borderBottomWidth: 0.4,
          backgroundColor: colors.bg,
          color: '#fff',

          // elevation: 1,
        }}
        drag={(props) => (
          <Animations
            onSelected={onSelected}
            setScrollPostion={setScrollPostion}
            {...props}
            allowDrag={allowDrag}
            setDragPermission={setDragPermission}
          />
        )}
        onPressCell={(date, dateProps) => {
          setDefaultDate(date),
            mode === 'month'
              ? (setModeChange('day'), onSelectDay(date), onSelectDate(date))
              : date <= new Date()
                ? showToast('date')
                : checkValidation(dateProps, true);
        }}
        onPressEvent={(e) => {
          // console.log(e,'New Calendar ');
          navigation.navigate('DrSlotsDetail', { data: e });
        }}
        onChangeDate={(date) => setPeriod(date[1])}
      />
      {/* POPUPS MODAL */}
      <Modal
        animationType="fade"
        visible={Popups}
        transparent={true}
        onRequestClose={() => setPopups(false)}>
        <View style={styles.centeredView}>
          <View style={styles.permissionView}>
            <TouchableOpacity
              style={styles.imageCross}
              onPress={() => setPopups(false)}>
              <Image source={assets.cross} />
            </TouchableOpacity>
            <View style={[styles.mT(30)]}>
              <Text style={[styles.h2, styles.textAlign]}>
                {labels.stripeAccountPermission}
              </Text>
              <Text
                style={[styles.paragraph2, styles.textAlign, styles.mT(20)]}>
                {labels.stripeAccountValidation}
              </Text>
              <View
                style={[
                  styles.flexRow,
                  styles.alignSelf,
                  styles.mH(45),
                  styles.mT(5),
                ]}>
                <ButtonWhite
                  title={labels.can}
                  exstyle={styles.shadowbb}
                  onBtnPress={() => {
                    setPopups(false);
                  }}
                />
                <ButtonSmall
                  title={labels.ok}
                  onBtnPress={() => {
                    setPopups(false);
                    navigation.navigate('StripeConnect');
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
export default NewCalendar_CC;
