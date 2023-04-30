import React, {useEffect, useRef, useState} from 'react'
import {
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import styles from '../../assets/styles'
import {assets} from '../../assets/images'
import labels from '../../config/Labels'
import colors from '../../config/Colors'
import Modal from 'react-native-modalbox'
import DatePicker from 'react-native-date-picker'
import {
  GreadientHeader,
  EarningItem,
  NoRecordComponent,
  ButtonWhite,
  ButtonSmall,
} from '../../components'
import moment from 'moment'
import {getMyEarning} from '../../store/actions'
import {useDispatch, useSelector} from 'react-redux'

const DrMyEarnings = ({navigation}) => {
  //Redux STORE
  const dispatch = useDispatch()
  const {myEarning} = useSelector(state => state.Doctor)

  // Declare state variables'
  const [totalEarning, setTotlaEarning] = useState(0)
  const [sdate, setSDate] = useState(new Date())
  const [updateSDate, setUpdateSDate] = useState('')
  const [edate, setEDate] = useState(new Date())
  const [updateEDate, setUpdateEDate] = useState('')
  const [picker, setPicker] = useState(false)
  const [picker1, setPicker1] = useState(false)

  // Declare input reference field
  const refFilter = useRef()

  //Function for Calculate total Earnings
  const calculateEarning = () => {
    let earning = 0
    if (myEarning?.appointments?.[0]?.payment != null) {
      myEarning?.appointments?.forEach((item, index) => {
        if (item?.payment != null) {
          earning += item?.payment?.totalAmount
        }
      })
      // console.log(earning, 'earning');
      setTotlaEarning(earning)
    }
  }

  // GET My Earnings
  useEffect(() => {
    calculateEarning()
  }, [myEarning])

  useEffect(() => {
    const filter = {
      startDate: updateSDate,
      endDate: updateEDate,
    }
    dispatch(getMyEarning(true, filter))
  }, [])

  const onApply = () => {
    refFilter.current.close()
    const filter = {
      startDate: moment(updateSDate).format('YYYY-MM-DD'),
      endDate: moment(updateEDate).format('YYYY-MM-DD'),
    }
    dispatch(getMyEarning(true, filter))
  }
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={assets.search_filter}
          showCenterText={labels.myEarning}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
          modalBtn={() => refFilter.current.open()}
          // rightRoute={() => refFilter.current.open()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(40)} />
          <View style={styles.mH(20)}>
            <Text style={styles.earnings}>{`$${totalEarning.toFixed(2)}`}</Text>
            <Text style={styles.totalPatient}>
              {`${labels.totalPatient} ${myEarning?.totalPatients}`}
            </Text>
            <View style={styles.height(20)} />
            <View style={[styles.earningsCont]}>
              <FlatList
                scrollEnabled={true}
                data={
                  // myEarning?.appointments?.[0]?.payment &&
                  myEarning?.appointments?.filter(e => e.payment != null)
                }
                showsVerticalScrollIndicator={false}
                style={styles.flex(1)}
                ListEmptyComponent={<NoRecordComponent />}
                renderItem={({item, index}) => (
                  <>
                    {item?.payment ? (
                      <EarningItem
                        // onPress={() => navigation.navigate('DrInvoice')}
                        pay={item?.payment?.totalAmount}
                        description={`You have received a payment\nof ${item?.payment?.totalAmount} for booking appointment`}
                      />
                    ) : null}
                    {myEarning?.appointments.length - 1 == index ? null : (
                      <View style={[styles.spacer, styles.mV(15)]} />
                    )}
                  </>
                )}
              />
            </View>
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
      </View>
      {/* FILTER FOR EARNING */}
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
                    : setPicker1(!picker1)
                }}
              />
            </View>
            {picker == true && (
              <>
                <DatePicker
                  date={sdate}
                  mode={'date'}
                  onDateChange={e => {
                    setSDate(e)
                    setUpdateSDate(moment(e).format('DD-MMM-YYYY'))
                    setPicker(!picker)
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
                  onDateChange={e => {
                    setEDate(e)
                    setUpdateEDate(moment(e).format('DD-MMM-YYYY'))
                    setPicker1(!picker1)
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
              onApply()
            }}
          />
        </View>
      </Modal>
    </>
  )
}

export default DrMyEarnings
