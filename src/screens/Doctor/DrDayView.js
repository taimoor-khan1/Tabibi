import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import styles from '../../assets/styles';
import labels from '../../config/Labels';
import {AppointmentCalendar, GreadientHeader} from '../../components';
import {getDayAppointments, getConsultationTypes} from '../../store/actions';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';

const DrDayView = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {profile, role, estDoc} = useSelector((state) => state.Auth);

  // Declare state variables'
  const [selectedDate, onSelectedDate] = useState(
    route?.params?.date
      ? moment(route?.params?.date).format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD'),
  );

  const [period, setPeriod] = useState(moment().format('YYYY-MM-DD'));
  //Other Screen States
  const [mode, setMode] = useState(
    route?.params?.setMode ? route?.params?.setMode : 'day',
  );
  const [from] = useState(route?.params?.from ? route?.params?.from : false);
  //Fuctions

  //API Calling Get Schedule
  useEffect(() => {
    dispatch(getConsultationTypes());
  }, []);

  //Get All Day Appointment API
  useEffect(() => {
    const params = {
      date: selectedDate, // curent day month
    };
    if (estDoc?.provider) {
      dispatch(getDayAppointments(params, true, estDoc?.provider?.id));
    } else {
      dispatch(getDayAppointments(params, true));
    }
  }, []);

  // console.log(selectedDate);

  return (
    <>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={`${labels.welcome} ${profile?.name}`}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />

      <View style={styles.calendarRowView}>
        <Text style={[styles.CCHeader, styles.textAlignRight]}>
          {moment(period).format('MMMM')}
        </Text>
      </View>
      {/*Appointment Calender  */}
      <AppointmentCalendar
        mode={mode}
        day={true}
        navigation={navigation}
        selectedDate={selectedDate ? selectedDate : route?.params?.date}
        onSelectDate={(date) =>
          onSelectedDate(moment(date).format('YYYY-MM-DD'))
        }
        setPeriod={(date) => {
          setPeriod(moment(date).format('YYYY-MM'));
        }}
        setConsultationDate={(date, endTime) => {
          // alert(JSON.stringify(date));
        }}
      />
      <View style={styles.height(10)} />
    </>
  );
};

export default DrDayView;
