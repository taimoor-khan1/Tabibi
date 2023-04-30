import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {Input} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-date-picker';
import {
  ButtonSmall,
  Tabber,
  GreadientHeader,
  ListItem,
  Map,
  ButtonWhite,
  SearchItem,
} from '../../components';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {
  getConsultationTypes,
  getPOC,
  getSlotsByDate,
  getAppointmentSlots,
  searchDoctor,
} from '../../store/actions';

const Search = ({navigation, route}) => {
  const searched = route?.params?.search ? route?.params?.search : '';
  // STORE
  const dispatch = useDispatch();
  const {
    getAppointmentSlots,
    doctorList,
    getConsultationlist: getConsultationTypesState,
    POClist,
  } = useSelector((state) => state.Patient);
  // Declare state variables'
  const [search, setSearch] = useState(searched);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [consultationTypeId, setConsultationTypeId] = useState('');
  const [consultationPurposeId, setConsultationPurposeId] = useState('');
  const [date, setDate] = useState(new Date());
 
  const [updateDate, setUpdateDate] = useState('');
  const [time, setTime] = useState(new Date());
  const [updateTime, setUpdateTime] = useState('');
  const [picker, setPicker] = useState(false);
  const [picker1, setPicker1] = useState(false);

  const [countSlots, setCountSlots] = useState(0);

  const [selectedSlots, setSelectedSlots] = useState([]);

  // Declare input reference field
  const refFilter = useRef();

  //Fuctions

  // Get Data Calls
  useEffect(() => {
    console.log('doctor data list=======>', doctorList);
    dispatch(getConsultationTypes());
    dispatch(getPOC());
    if (search) {
      const params = {
        isFilter: isFilter,
        search: search.trim(),
      };
      dispatch(searchDoctor(params, navigation, {}, false, setSearchLoading));
      
      const param = {
        id: doctorList?.[0]?.id,
        date: updateDate
        ? moment(updateDate).format('YYYY-MM-DD')
        : doctorList?.[0]?.schedule?.length > 0 && doctorList?.[0]?.schedule?.[0]?.consultationDate,
        consultationTypeId:"",
        pocId:  "",
        time:"",
      };
   
      dispatch(getSlotsByDate(param, false))
    }
  }, []);
  

  // on typing new search
  const onSearchTyping = (text) => {
    if (text.length > 1) {
      const params = {
        isFilter: isFilter,
        search: text.trim(),
      };
      dispatch(searchDoctor(params, navigation, {}, false, setSearchLoading));
      // const param = {
      //   id: doctorList?.[0]?.id,
      //   date: updateDate
      //   ? moment(updateDate).format('YYYY-MM-DD')
      //   : doctorList?.[0]?.schedule?.length > 0 && doctorList?.[0]?.schedule?.[0]?.consultationDate,
      //   consultationTypeId:consultationTypeId,
      //   pocId:consultationPurposeId,
      //   time:updateTime ? updateTime : '',
      // };
      // dispatch(getSlotsByDate(param, false))
    }
  };

  // on Serach button
  const onSearchSubmit = () => {
    if (!search) {
      return Toast.show('Enter search text');
    }
    Keyboard.dismiss();
    if (
      !updateDate &&
      !updateTime &&
      !consultationTypeId &&
      !consultationPurposeId
    ) {
      const params = {
        isFilter: false,
        search: search.trim(),
      };
      // console.log(params)
      refFilter.current.close();
      Toast.show(`${labels.searching} ${search}`);
      
    } else {
      const payload = {
        isFilter: true,
        search: search.trim(),
        date: updateDate
          ? moment(updateDate).format('YYYY-MM-DD')
          : '',
        time: updateTime ? updateTime : '',
        consultationTypeId: consultationTypeId,
        pocId: consultationPurposeId,
      };
      console.log('paylod=======', payload);
      refFilter.current.close();
      Toast.show(`${labels.searching} ${search}`);
      dispatch(searchDoctor(payload, navigation));
      const param = {
        id: doctorList?.[0]?.id,
        date: updateDate
        ? moment(updateDate).format('YYYY-MM-DD')
        : doctorList?.[0]?.schedule?.length > 0 && doctorList?.[0]?.schedule?.[0]?.consultationDate,
        consultationTypeId:consultationTypeId,
        pocId:consultationPurposeId,
        time:updateTime ? updateTime : '',
      };
      console.log("response and data=====>",param)
      dispatch(getSlotsByDate(param, false))
    }
  };
  //Tabber change
  const handleTabChange = (index) => {
    setSelectedIndex(index);
  };


  //Clear Filter feilds
  const clearFeilds = () => {
    setDate('');
    setUpdateDate('');
    setTime('');
    setUpdateTime('');
    setConsultationTypeId('');
    setConsultationPurposeId('');
    setIsFilter(false);
  };
  // console.log(doctorList, 'DOCTOR');

  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={assets.search_filter}
          showCenterText={labels.serach}
          showLeftText={labels.back}
          back={true}
          modalBtn={() => {
            refFilter.current.open();
            Keyboard.dismiss();
          }}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <View style={styles.mH(20)}>
          <Input
            inputContainerStyle={[styles.inputContainer]}
            placeholder={labels.search}
            inputStyle={[styles.inputStyle]}
            autoCapitalize="words"
            returnKeyType="search"
            value={search}
            onChangeText={(text) => {
              onSearchTyping(text.replace(/[^a-zA-Z\s1-9\.]/g, ''));
              setSearch(text.replace(/[^a-zA-Z\s1-9\.]/g, ''));
              // onSearchTyping(text);
            }}
            onSubmitEditing={() => onSearchSubmit()}
            rightIconContainerStyle={{width: 30}}
            rightIcon={
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onSearchSubmit()}>
                <Image source={assets.search} />
              </TouchableOpacity>
            }
          />
          <Text
            style={
              search == ''
                ? [styles.searchedText, styles.color(colors.text)]
                : styles.searchedText
            }
            numberOfLines={1}>
            {/* {labels.filter} */}
            {/* {search == '' ? labels.type : search} */}
          </Text>
          <Tabber
            tab1={labels.list}
            tab2={labels.map}
            onTabPress={(e) => handleTabChange(e)}
            selectedIndex={selectedIndex}
          />
        </View>
        {searchLoading && (
          <ActivityIndicator size="large" color={colors.btngr1} />
        )}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mH(10)}>
          {selectedIndex === 0 && search !== '' ? (
            <FlatList
              ListEmptyComponent={
                <View style={[styles.pT(40), styles.alignItemCenter]}>
                  <Text style={styles.paragraph}>
                    {searchLoading ? labels.searching : labels.noSlots}
                  </Text>
                </View>
              }
              scrollEnabled={true}
              data={doctorList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <>
                  <SearchItem
                    key={index}
                    navigation={navigation}
                    consultationTypeId={consultationTypeId}
                    consultationPurposeId={consultationPurposeId}
                    availiablityTime={updateTime ? updateTime : ""}
                    availiablityDate={
                      updateDate
                        ? moment(updateDate).format('YYYY-MM-DD')
                        : ""
                    }
                    activeOpacity={1}
                    title={
                      item?.name
                        ? `${item?.name}`
                        : `${item?.firstName} ${item?.lastName}`
                    }
                    category={item?.detail?.specialities}
                    subText={item?.city}
                    doctorDetail={item}
                    slots={item?.slots}
                    schedule={item?.schedule}
                    rating={item?.rating ? item?.rating : 0}
                    providerId={item?.id}
                    enableCategory={
                      item?.enableCategory
                        ? item?.enableCategory
                        : item?.enableCategory
                    }
                    image={item?.avatar}
                    est={item?.name ? true : false}
                    doctor={item}
                    onPress={() =>
                      navigation.navigate('Profile', {
                        id: item?.name ? item?.id : item?.id,
                        est: item?.name ? true : false,
                      })
                    }
                  />
                </>
              )}
            />
          ) : null}
        </ScrollView>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.mH(10)}>
          {selectedIndex === 1 && <Map list={doctorList} />}
        </ScrollView>
      </View>
      <Modal
        style={[styles.filterModal, styles.maxHeightPct('70%')]}
        position={'center'}
        ref={refFilter}
        backdropPressToClose={false}
        backdropOpacity={0.8}
        keyboardTopOffset={50}
        backButtonClose={true}
        swipeToClose={false}
        backdropColor={colors.black}>
        <ScrollView contentContainerStyle={[styles.flex(1), styles.mH(5)]}>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            onPress={() => {
              refFilter.current.close();
            }}>
            <Image source={assets.close} style={styles.close} />
          </TouchableOpacity>
          <Text style={styles.availablity}>{labels.availablity}</Text>
          <View style={[styles.flexRow, styles.alignSelf, styles.mH(30)]}>
            <ButtonWhite
              bluetxt={true}
              exstyle={styles.shadowbb}
              Icon={assets.dateIcon}
              title={
                updateDate != ''
                  ? moment(date).format('DD-MMM-YY')
                  : labels.date
              }
              onBtnPress={() => {setPicker(!picker)
              setPicker1(false)}}
            />
            <ButtonWhite
              Icon={assets.timeIcon}
              exstyle={styles.shadowbb}
              bluetxt={true}
              title={
                updateTime != '' ? moment(time).format('hh:mm A') : labels.time
              }
              onBtnPress={() => {setPicker1(!picker1)
              setPicker(false)}}
            />
          </View>
          {picker == true && (
            <>
              <DatePicker
                date={date}
                mode={'date'}
                onDateChange={(e) => {
                  setDate(e);
                  setUpdateDate(moment(e).format('DD-MMM-YYYY'));
                  // setPicker(!picker);
                  

                }}
                style={styles.pickerCont}
              />
            </>
          )}
          {picker1 == true && (
            <>
              <DatePicker
                date={time}
                mode={'time'}
                onDateChange={(e) => {
                  setTime(e);
                  setUpdateTime(moment(e).format('HH:MM'));
                  // setPicker(!picker);

                  // setPicker1(!picker1);
                }}
                style={styles.pickerCont}
              />
            </>
          )}
          {/* {picker == false && picker1 == false && (
            <> */}
              <Text style={[styles.availablity]}>
                {labels.typeOfConsultation}
              </Text>
              <Category
                options={getConsultationTypesState}
                selected={consultationTypeId}
                onItemPress={setConsultationTypeId}
              />
              <Text style={[styles.availablity, styles.mT(30)]}>
                {labels.purpose}
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Category
                  options={POClist}
                  selected={consultationPurposeId}
                  onItemPress={setConsultationPurposeId}
                />
              </ScrollView>
            {/* </>
          )} */}
          <View
            style={[
              styles.flexRow,
              styles.alignSelf,
              styles.mH(35),
              styles.mT(5),
            ]}>
            <ButtonWhite
              title={labels.clearall}
              exstyle={styles.shadowbb}
              onBtnPress={() => clearFeilds()}
            />
            <ButtonSmall
              title={labels.apply}
              onBtnPress={() => {
                setPicker(false);
                setPicker1(false);
                setIsFilter(true);
                onSearchSubmit();
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};

const Category = ({options, selected, onItemPress = () => {}}) => {
  return (
    <>
      <View style={[styles.mT(10), styles.flexWrap]}>
        {options.map((item) => {
          return (
            <TouchableOpacity
              disabled={true}
              activeOpacity={1}
              style={[styles.categoryCont, styles.width(120)]}
              onPress={() => onItemPress(item.id)}>
              <LinearGradient
                colors={
                  selected === item.id
                    ? [colors.btngr1, colors.btngr2, colors.btngr3]
                    : [colors.lightWhite, colors.lightWhite, colors.lightWhite]
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.catCont, styles.borderShadow]}>
                <TouchableOpacity onPress={() => onItemPress(item.id)}>
                  <View
                    style={[styles.flexRow, {justifyContent: 'space-evenly'}]}>
                    <Text
                      style={
                        selected === item.id
                          ? [styles.textCategory, {color: colors.white}]
                          : [styles.textCategory]
                      }>
                      {item.title.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

export default Search;
