import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, FlatList} from 'react-native';
import styles from '../../assets/styles';
import Labels from '../../config/Labels';
import colors from '../../config/Colors';
import {Calendar_CC, ProgressRingBars} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {
  getDrDashboard,
  getDrDashboardAppointment,
  getSchedule,
  getAccessToken
} from '../../store/actions';
import moment from 'moment';

const DrHome = ({navigation, setCdate = () => {}, index}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {role, estDoc} = useSelector((state) => state.Auth);
  const {drDashboard} = useSelector((state) => state.Doctor);

  // Declare state variables'
  const [slots, setSlots] = useState('');
  const [progress, setProgress] = useState([]);

  //Fuctions
  //Calculate progress bar
  const calculateBar = () => {
    const total = drDashboard?.totalSlots;
    const available = drDashboard?.availableSlots;
    const canceled = drDashboard?.bookedSlots;
    const blue = (available / total) * 100;
    const red = (canceled / total) * 100;
    setSlots(total);
    setProgress([
      {
        color: colors.blue,
        value: blue / 100,
      },
      {
        color: colors.red,
        value: red / 100,
      },
    ]);
  };

  useEffect(() => {
    calculateBar();
  }, [drDashboard]);
  // refresh access token
  useEffect(()=>{
    dispatch(getAccessToken(role))
  },[])

  const getDashboardData = (date) => {
    // alert(date)
    const params = {
      period: date, // curent day month
    };
    if (index === 0) {
      if (estDoc?.provider) {
        dispatch(getDrDashboard(params, false, estDoc?.provider?.id));
        dispatch(getSchedule(params, false, estDoc?.provider?.id));
      } else {
        dispatch(getDrDashboard(params, false));
        dispatch(getSchedule(params, false));
      }
    } else {
      if (estDoc?.provider) {
        dispatch(
          getDrDashboardAppointment(params, false, estDoc?.provider?.id),
        );
      } else {
        dispatch(getDrDashboardAppointment(params, false));
      }
    }
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.height(20)} />
      <Calendar_CC
        avability={false}
        setDate={(date) => {
          // alert(date)
          setCdate(moment(date).format('YYYY-MM'));
          getDashboardData(moment(date).format('YYYY-MM'));
        }}
        index={index}
        navigation={navigation}
        onRouteToMainCalender={index === 0 ? true : false}
        pagingEnabled={true}
        scrollEnabled={true}
      />
      <View style={styles.height(20)} />
      <View
        style={[
          styles.mH(20),
          styles.mB(20),
          styles.flexRow,
          styles.justifyCntSP,
        ]}>
        <Text
          style={[
            styles.textMedium,
            styles.fontSize(16),
            styles.color(colors.black),
          ]}>
          {Labels.repeated}
        </Text>
        <Text
          style={[
            styles.textMedium,
            styles.fontSize(12),
            styles.color(colors.greyText),
          ]}>
          {slots + ' ' + Labels.slots}
        </Text>
      </View>
      <ProgressRingBars
        availableCount={drDashboard?.availableSlots}
        cancelledCount={drDashboard?.bookedSlots}
        progress={progress}
        Container={[
          styles.progressRingBarsNewsImage,
          styles.pH(0),
          styles.elevation(0),
        ]}
      />
      <View style={styles.height(50)} />
    </ScrollView>
  );
};

export default DrHome;
