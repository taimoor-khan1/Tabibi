import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {
  HeaderHome,
  PatientItem,
  BookedItem,
  NoRecordComponent,
} from '../../components';
import moment from 'moment';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {
  getMyPatient,
  getAllScheduleStats,
  getAllAppointmentStats,
} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';

const DrStats = ({navigation}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {profile} = useSelector((state) => state.Auth);
  const {allPatients, allSchStats, allAppointStats} = useSelector(
    (state) => state.Doctor,
  );

  // Declare state variables'
  const lineChartConfig = {
    backgroundColor: '#60CCFF',
    backgroundGradientFromOpacity: 1,
    backgroundGradientFrom: colors.themeWhite1,
    backgroundGradientTo: colors.themeWhite1,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => colors.themeColor,
    labelColor: (opacity = 1) => colors.darkBlue,
    strokeWidth: 2,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.themeColor,
    },
  };
  const BarChartConfig = {
    backgroundColor: colors.themeColor,
    backgroundGradientFromOpacity: 0,
    backgroundGradientFrom: colors.themeWhite1,
    backgroundGradientTo: colors.themeWhite1,
    fillShadowGradient: colors.themeColor,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => colors.themeColor,
    labelColor: (opacity = 1) => colors.darkBlue,
    strokeWidth: 2,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.darkBlue,
    },
  };
  const [date, setDate] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [time, setTime] = useState('');
  const [updateTime, setUpdateTime] = useState('');
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);
  const [index, setIndex] = useState(0);
  const [availableSlots, setAvailableSlots] = useState({});
  const [neverBooked, setNeverBooked] = useState({});
  const [bookedAppointments, setBookedAppointments] = useState({});
  const [cancelledAppointments, setCancelledAppointments] = useState({});
  const [dummy] = useState({
    labels: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    datasets: [{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}],
  });

  // Declare input reference field
  const refFilter = useRef();
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);
  //Fuctions

  const clearFeilds = () => {
    setDate('');
    setUpdateDate('');
    setTime('');
    setUpdateTime('');
    // setServieId('');
  };

  // GET My Patients Appointment list
  useEffect(() => {
    dispatch(getMyPatient(false));
    dispatch(getAllScheduleStats(false));
    dispatch(getAllAppointmentStats(true));
  }, []);

  // Set Available Slots Data
  useEffect(() => {
    if (allSchStats?.availableSlots?.length) {
      var data = {};
      var lab = allSchStats?.availableSlots?.map((item) =>
        moment(item.consultationdate).format('MMM-DD'),
      );
      data = {
        labels: lab?.sort((a, b) => Date.parse(a) - Date.parse(b)),
        datasets: [
          {data: allSchStats?.availableSlots?.map((item) => item?.count)},
        ],
      };
      setAvailableSlots(data);
    }
    if (allSchStats?.neverBooked?.length) {
      var data = {};
      var lab = allSchStats?.neverBooked?.map((item) =>
        moment(item.consultationdate).format('MMM-DD'),
      );
      data = {
        labels: lab?.sort((a, b) => Date.parse(a) - Date.parse(b)),
        datasets: [
          {data: allSchStats?.neverBooked?.map((item) => item?.count)},
        ],
      };
      setNeverBooked(data);
    }
    if (allAppointStats?.bookedAppointments?.length) {
      var data = {};
      var lab = allAppointStats?.bookedAppointments?.map((item) =>
        moment(item.consultationdate).format('MMM-DD'),
      );
      data = {
        labels: lab?.sort((a, b) => Date.parse(a) - Date.parse(b)),
        datasets: [
          {
            data: allAppointStats?.bookedAppointments?.map(
              (item) => item?.count,
            ),
          },
        ],
      };
      setBookedAppointments(data);
    }
    if (allAppointStats?.cancelledAppointments?.length) {
      var data = {};
      var lab = allAppointStats?.cancelledAppointments?.map((item) =>
        moment(item.consultationdate).format('MMM-DD'),
      );
      data = {
        labels: lab?.sort((a, b) => Date.parse(a) - Date.parse(b)),
        datasets: [
          {
            data: allAppointStats?.cancelledAppointments?.map(
              (item) => item?.count,
            ),
          },
        ],
      };
      setCancelledAppointments(data);
    }
  }, [allSchStats, allAppointStats]);
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <HeaderHome
          back={true}
          showLeftText={labels.back}
          showRightIcon={false}
          showCenterIcon={assets.inner_logoWhite}
          leftRoute={() => navigation.goBack()}
          // rightRoute={() => navigation.navigate('DrNotification')}
          // onModal={() => refFilter.current.open()}
          showSearch={false}
          doctor={true}
          // filter={true}
          ExtraStyle={[styles.height(200)]}
          title={labels.welcome}
          meanHeading={
            profile?.firstName && `${profile?.firstName} ${profile?.lastName}`
          }
          subHeading={false}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {/* BOOKED SLOTS */}
          <View style={[styles.viewall, styles.margin(20)]}>
            <Text style={[styles.homeHeading]}>{labels.booked}</Text>
          </View>
          <LineChart
            data={
              Object.keys(bookedAppointments).length
                ? bookedAppointments
                : dummy
            }
            width={Dimensions.get('window').width - 25} // from react-native
            height={250}
            yAxisLabel=""
            yAxisSuffix=""
            withShadow={false}
            verticalLabelRotation={320}
            xLabelsOffset={12}
            segments={6}
            fromZero={true}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={lineChartConfig}
            style={styles.NlineChat}
          />
          {/* <FlatList
            scrollEnabled={true}
            data={[]}
            horizontal={true}
            style={[styles.flex(1), styles.mT(15)]}
            onScroll={onScroll}
            ListEmptyComponent={
              <View style={styles.mL(120)}>
                <NoRecordComponent />
              </View>
            }
            renderItem={({item, index}) => (
              <>
                {index == 0 && <View style={styles.width(8)} />}
                <BookedItem
                  title="Felicia Rower"
                  time="12:33 Pm"
                  onPress={() => navigation.navigate('')}
                />
                {index == date.length - 1 && <View style={styles.width(20)} />}
              </>
            )}
          /> */}

          {/* NON BOOKED SLOTS */}
          <View style={[styles.viewall, styles.margin(20)]}>
            <Text style={[styles.homeHeading]}>{labels.nonBooked}</Text>
          </View>
          <LineChart
            data={Object.keys(availableSlots).length ? availableSlots : dummy}
            width={Dimensions.get('window').width - 25} // from react-native
            height={250}
            yAxisLabel=""
            yAxisSuffix=""
            withShadow={false}
            verticalLabelRotation={320}
            xLabelsOffset={12}
            segments={6}
            fromZero={true}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={lineChartConfig}
            style={styles.NlineChat}
          />
          <View style={[styles.viewall, styles.margin(20)]}>
            <Text style={[styles.homeHeading]}>{labels.canceled}</Text>
          </View>
          <BarChart
            style={styles.NlineChat}
            data={
              Object.keys(cancelledAppointments).length
                ? cancelledAppointments
                : dummy
            }
            width={Dimensions.get('window').width - 25}
            height={250}
            yAxisLabel=" "
            fromZero={true}
            withInnerLines={true}
            showBarTops={true}
            flatColor={true}
            showValuesOnTopOfBars={true}
            verticalLabelRotation={320}
            chartConfig={BarChartConfig}
          />
          <View style={[styles.viewall, styles.margin(20)]}>
            <Text style={[styles.homeHeading]}>{labels.neverBooked}</Text>
          </View>
          <BarChart
            style={styles.NlineChat}
            data={Object.keys(neverBooked).length ? neverBooked : dummy}
            width={Dimensions.get('window').width - 25}
            height={250}
            yAxisLabel=" "
            fromZero={true}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            verticalLabelRotation={320}
            chartConfig={BarChartConfig}
          />

          {/* List of all patients  */}
          <View style={[styles.viewall, styles.mH(20), styles.mT(30)]}>
            <Text style={[styles.homeHeading]}>{labels.listofPatient}</Text>
          </View>
          <View style={[styles.mH(5), styles.mT(15)]}>
            <View style={[styles.flexWrapContainer, styles.justifyCntFS]}>
              {allPatients?.length > 0 ? (
                allPatients?.map((item, index) => {
                  return (
                    <PatientItem
                      show={true}
                      status={false}
                      key={index}
                      navigation={navigation}
                      image={item?.avatar}
                      title={`${item?.firstName} ${item?.lastName}`}
                      onBtnPress={() =>
                        navigation.navigate('DrPatientDetail', {
                          id: item?.id,
                          deviceToken: item?.deviceToken,
                          deviceTokenType: item?.deviceTokenType,
                          from: false,
                        })
                      }
                    />
                  );
                })
              ) : (
                <View style={[styles.mT(10), styles.mL(120)]}>
                  <NoRecordComponent />
                </View>
              )}
            </View>
          </View>
          <View style={styles.height(60)} />
        </ScrollView>
      </View>
    </>
  );
};

export default DrStats;
