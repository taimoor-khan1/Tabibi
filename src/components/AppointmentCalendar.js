import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, Dimensions} from 'react-native';
import styles from '../assets/styles';
import moment from 'moment';
import {Calendar} from 'react-native-big-calendar';
import colors from '../config/Colors';
import labels from '../config/Labels';
import fonts from '../assets/fonts';
import Animations from '../../Animation';
import Snackbar from 'react-native-snackbar';
import {useSelector, useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('window');

const AppointmentCalendar = ({
  navigation,
  mode,
  setPeriod = () => {},
  onSelectDate = () => {},
  selectedDate = false,
  day = false,
}) => {
  //Redux Store
  const {dayAppointment} = useSelector((state) => state.Doctor);
  const {getConsultationlist} = useSelector((state) => state.Patient);

  // Declare state variables'
  const [allowDrag, setDragPermission] = useState(null);
  const [scrollPostion, setScrollPostion] = useState(null);
  const [appointData, setAppointData] = useState([]);
  const [selectedDay, onSelectDay] = useState(
    moment(selectedDate).format('YYYY-MM-DD'),
  );

  //Functions
  //Action to set Booked and unbooked schedule
  useEffect(() => {
    var newArr = [];
    const getSlots = () => {
      dayAppointment?.map((slot, index) => {
        const date = {
          title: `${slot?.patient?.firstName} ${slot?.patient?.lastName}`,
          start: moment(slot?.startTime).utc().format('llll'),
          end: moment(slot?.endTime).utc().format('llll'),
          time: `${moment(slot?.startTime).utc().format('hh:mm A')} to ${moment(
            slot?.endTime,
          )
            .utc()
            .format('hh:mm A')}`,
          poc: 'sch?.purposes?.poc?.title',
          slotId: slot?.slotId,
          posId: slot?.posId,
          status: slot.status === 'completed' ? 'COMPLETED' : 'BOOKED',
          type: getConsultationlist
            ?.filter((e) => e.id === slot?.consultationTypeId)
            ?.map((a) => a.title)[0],
          consultationId: slot?.consultationTypeId,
          appointment: slot,
          schedule: {},
          bg:
            slot?.status === 'completed'
              ? colors.green1
              : slot?.status === 'booked'
              ? colors.red
              : colors.darkBlue,
        };
        newArr.push(date);
      });
      setAppointData(newArr);
    };
    getSlots();
  }, [dayAppointment]);

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
        <TouchableOpacity {...touchableOpacityProps}>
          <Text style={styles.event}>
            {`${event.title} ${event.type}  ${event.time}  ${event.status}`}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  const handleREf = useRef(null);
  //Toasts
  const showToast = (date) => {
    Snackbar.show({
      text: labels.appointmentView,
      duration: Snackbar.LENGTH_LONG,
      numberOfLines: 10,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      action: {
        text: 'Go to',
        textColor: colors.dim,
        onPress: () => {
          navigation.navigate('DrCalendarView', {
            setMode: 'day',
            date: date,
          });
        },
      },
    });
  };
  // console.log(slotsData, 'SLOTS DATA');
  // console.log(appointData, 'APPOINTMENT DATA');
  return (
    <>
      <Calendar
        bodyContainerStyle={{zIndex: -100}}
        events={appointData}
        height={height}
        mode={mode}
        scrollRef={handleREf}
        scrollOffsetMinutes={scrollPostion}
        swipeEnabled={!allowDrag}
        showTime={true}
        ampm={true}
        date={selectedDay}
        renderEvent={renderEvent}
        headerContainerStyle={{
          height: 50,
          borderColor: colors.darkBlue,
          borderBottomWidth: 0.4,
          backgroundColor: colors.bg,
          color: '#fff',
          // elevation: 1,
        }}
        drag={(props) => (
          <Animations
            onSelected={null}
            setScrollPostion={null}
            {...props}
            allowDrag={null}
            setDragPermission={null}
          />
        )}
        onPressCell={(date, dateProps) => {
          showToast(date);
        }}
        onPressEvent={(item) => {
          // console.log(item, 'Appointment Calendar to dr consultatio detail');
          navigation.navigate('DrConsulationDetail', {
            data: item?.appointment,
            status: item?.appointment?.status,
            walkIn: item?.type === 'Video Call' ? false : true,
          });
        }}
        onChangeDate={(date) => setPeriod(date[0])}
      />
    </>
  );
};
export default AppointmentCalendar;
