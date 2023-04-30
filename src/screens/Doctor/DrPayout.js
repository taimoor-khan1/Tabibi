import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import Toast from 'react-native-simple-toast';
import {
  GreadientHeader,
  PayoutItem,
  NoRecordComponent,
  ButtonWhite,
  ButtonSmall,
} from '../../components';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modalbox';
import {useDispatch, useSelector} from 'react-redux';
import {getPayouts} from '../../store/actions';

const DrPayout = ({navigation}) => {
  //REDUX STORE
  const dispatch = useDispatch();
  const {estDoc, role} = useSelector((state) => state.Auth);
  const {payouts} = useSelector((state) => state.Doctor);

  // Declare input reference field
  const refFilter = useRef();

  //Declare state variable
  const [sdate, setSDate] = useState(new Date());
  const [updateSDate, setUpdateSDate] = useState('');
  const [edate, setEDate] = useState(new Date());
  const [updateEDate, setUpdateEDate] = useState('');
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);
  const [payoutList, setPayoutList] = useState([]);

  //Fuctions
  //   GET Payots list API
  useEffect(() => {
    const filter = {
      startDate: updateSDate,
      endDate: updateEDate,
    };
    dispatch(getPayouts(true, filter));
  }, []);

  //Set patient list and its search filter
  useEffect(() => {
    setPayoutList(payouts?.length ? payouts : []);
  }, [payouts]);

  const onApply = () => {
    refFilter.current.close();
    if(updateSDate==="" || updateEDate===""){
  Toast.show("start date and end date both are required");
    }
    else{



      const filter = {
        startDate: moment(updateSDate).format('YYYY-MM-DD'),
        endDate: moment(updateEDate).format('YYYY-MM-DD'),
      };
      dispatch(getPayouts(true, filter));
    }
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={assets.search_filter}
          showCenterText={labels.payout}
          showLeftText={labels.back}
          back={true}
          modalBtn={() => refFilter.current.open()}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={[styles.pH(10)]}>
            <FlatList
              scrollEnabled={true}
              data={payoutList && payoutList}
              showsVerticalScrollIndicator={false}
              style={styles.flex(1)}
              ListEmptyComponent={
                <View style={[styles.mT(150)]}>
                  <NoRecordComponent />
                </View>
              }
              renderItem={({item, index}) => (
                <PayoutItem
                  key={index}
                  navigation={navigation}
                  image={item?.image}
                  est={item?.establishmentId === null ? false : true}
                  doctor={item?.doctor}
                  ammount={item?.amount}
                  description={item?.description}
                  date={item?.createdAt}
                  from={'admin'}
                />
              )}
            />
          </View>
          <View style={styles.height(30)} />
          {/* FILTER FOR EARNING */}
        </ScrollView>
        <Modal
          style={[styles.filterModalInvoice]}
          position={'center'}
          ref={refFilter}
          backdropPressToClose={false}
          backdropOpacity={0.8}
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
            <>
              <Text style={[styles.availablity, styles.mT(20)]}>
                {labels.selectEarning}
              </Text>
              <View style={[styles.flexRow, styles.alignSelf, styles.mH(30)]}>
                <ButtonWhite
                  bluetxt={true}
                  exstyle={styles.shadowbb}
                  Icon={assets.dateIcon}
                  title={
                    updateSDate != ''
                      ? moment(sdate).format('DD-MMM-YY')
                      : labels.sDate
                  }
                  onBtnPress={() =>
                    picker1 == true
                      ? [setPicker1(!picker1), setPicker(!picker)]
                      : setPicker(!picker)
                  }
                />
                <ButtonWhite
                  Icon={assets.dateIcon}
                  exstyle={styles.shadowbb}
                  bluetxt={true}
                  title={
                    updateEDate != ''
                      ? moment(edate).format('DD-MMM-YY')
                      : labels.eDate
                  }
                  onBtnPress={() => {
                    picker == true
                      ? [setPicker1(!picker1), setPicker(!picker)]
                      : setPicker1(!picker1);
                  }}
                />
              </View>
              {picker == true && (
                <>
                  <DatePicker
                    date={sdate}
                    mode={'date'}
                    onDateChange={(e) => {
                      setSDate(e);
                      setUpdateSDate(moment(e).format('DD-MMM-YYYY'));
                      setPicker(!picker);
                    }}
                    style={styles.pickerCont}
                  />
                </>
              )}
              {picker1 == true && (
                <>
                  <DatePicker
                    date={edate}
                    mode={'date'}
                    onDateChange={(e) => {
                      setEDate(e);
                      setUpdateEDate(moment(e).format('DD-MMM-YYYY'));
                      setPicker1(!picker1);
                    }}
                    style={styles.pickerCont}
                  />
                </>
              )}
            </>
            <View style={styles.mT(20)} />
            <ButtonSmall
              title={labels.apply}
              onBtnPress={() => {
                onApply();
              }}
            />
          </View>
        </Modal>
      </View>
    </>
  );
};

export default DrPayout;
