import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Input } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import moment from 'moment';
import { HeaderHome, ListItem } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProfile,
  doctorSuggestions,
  getConsultationTypes,
  getHome,
  getAccessToken,
} from '../../store/actions';

import IncomingCall from 'react-native-incoming-call';
import AsyncStorage from '@react-native-community/async-storage';
import { callAccepted } from '../../store/actions/CallingActions';

const Home = ({ navigation }) => {
  //Redux Store
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);
  const { suggestions, dashboard } = useSelector((state) => state.Patient);
  console.log("suggestionssuggestionssuggestionssuggestions", suggestions)
  // Declare state variables'
  const [search, setSearch] = useState('');
  const [searchModal, setSearchModal] = useState(false);
  const [estList, setEstList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [specialitiestList, setspecialitiesList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [index, setIndex] = useState(0);

  // Declare input reference field
  const indexRef = useRef(index);
  const searchRef = useRef();
  indexRef.current = index;

  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    const distance = Math.abs(roundIndex - index);
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);
  //Fuctions

  //API Calling from KILL STATE
  useEffect(() => {
    const params = {
      user_id: user?.userId,
    };
    dispatch(getProfile(params));
    dispatch(getConsultationTypes());
    const headless = async () => {
      if (Platform.OS === 'android') {
        var p = await AsyncStorage.getItem('data');
        var data = JSON.parse(p);
        const payload = await IncomingCall.getExtrasFromHeadlessMode();
        // console.log('launchParameters', payload);
        if (payload) {
          // console.log(payload, 'paylod');
          dispatch(callAccepted(payload.uuid, navigation, false, data));
        }
      }
    };
    headless();
  }, []);

  useEffect(() => {
    const params = {
      user_id: user?.userId,
    };
    dispatch(getHome(params));
  }, [user?.userId]);
  // refresh device token
  useEffect(() => {
    dispatch(getAccessToken(user?.role));
  }, []);
  // ON Typing search suggestions
  const onSearchTyping = (text) => {
    const params = {
      search: text.trim(),
    };
    // console.log(params);
    dispatch(doctorSuggestions(params, navigation, {}, false));
  };

  // set suggestions
  useEffect(() => {
    if (
      suggestions?.establishments?.length ||
      suggestions?.providers?.length ||
      suggestions?.specialities?.length ||
      suggestions?.locations?.length
    ) {
      setEstList(suggestions?.establishments);
      setProviderList(suggestions?.providers);
      setspecialitiesList(suggestions?.specialities);
      setLocationList(suggestions?.locations)
    } else {
      clearList();
    }
  }, [suggestions]);

  //Render Search Suggestions
  const SearchSuggestions = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchModal(false);
          navigation.navigate('Search', {
            search: item?.name ? item?.name : item?.firstName,
          });
          setSearch('');
        }}>
        <View style={styles.searchSuggestion}>
          <View style={styles.flexRow}>
            <Image
              source={item?.avatar ? { uri: item?.avatar } : assets.dummy}
              style={[styles.height(30), styles.width(30)]}
              borderRadius={50}
            />
            <Text
              style={[
                styles.fontSize(14),
                styles.padding(5),
                styles.pL(10),
                styles.PoppinsRegular,
                { textTransform: 'capitalize' },
              ]}>
              {item?.name
                ? `${item?.name}`
                : `Dr. ${item?.firstName} ${item?.lastName}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  //Render Search Suggestions
  const SearchSuggestions1 = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchModal(false);
          navigation.navigate('Search', {
            search: item?.specialities,
          });
          setSearch('');
        }}>
        <View style={styles.searchSuggestion}>
          <Text
            style={[
              styles.fontSize(14),
              styles.padding(5),
              styles.PoppinsRegular,
              { textTransform: 'capitalize' },
            ]}>
            {item?.specialities}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const SearchSuggestions2 = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchModal(false);
          navigation.navigate('Search', {
            search: item?.address,
          });
          setSearch('');
        }}>
        <View style={styles.searchSuggestion}>
          <Text
            style={[
              styles.fontSize(14),
              styles.padding(5),
              styles.PoppinsRegular,
              { textTransform: 'capitalize' },
            ]}>
            {item?.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //Render No Item OR RECORD
  const renderEmptyRecord = () => {
    return (
      <View
        style={[
          styles.mH(35),
          styles.mB(10),
          styles.flexRow,
          styles.justifyCntSP,
        ]}>
        <Text
          style={[styles.fontSize(19), styles.mT(20), styles.PoppinsRegular]}>
          {labels.noData}
        </Text>
      </View>
    );
  };

  const clearList = () => {
    setEstList([]);
    setProviderList([]);
    setspecialitiesList([]);
    setLocationList([]);
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <HeaderHome
          navigation={navigation}
          showLeftIcon={assets.menu}
          showRightIcon={assets.Notification}
          showCenterIcon={assets.inner_logoWhite}
          onSearchModal={(e) => {
            setSearchModal(e);
            clearList();
          }}
          leftRoute={() => {
            navigation.toggleDrawer();
            Keyboard.dismiss();
          }}
          rightRoute={() => navigation.navigate('Notification')}
          filter={assets.search_filter}
          searched={search}
          setSearched={(text) => {
            onSearchTyping(text);
            setSearch(text);
          }}
          sRef={searchRef}
          mRef={searchModal}
        />
        <View
          style={[
            styles.mH(35),
            styles.mB(5),
            styles.mT(-25),
            styles.flexRow,
            { justifyContent: 'space-between' },
          ]}>
          <Text style={[styles.textSemiBold, styles.fontSize(19)]}>
            {labels.specilised}
          </Text>
        </View>

        <FlatList
          data={dashboard && dashboard.splice(0, 5)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.flex(1)}
          onScroll={onScroll}
          ListEmptyComponent={renderEmptyRecord}
          renderItem={({ item, index }) => (
            <>
              <ListItem
                image={item?.provider?.avatar}
                title={`Dr. ${item?.provider?.firstName} ${item?.provider?.lastName}`}
                subText={moment(item?.startTime).format('DD MMM YYYY')}
                rating={item?.rating ? item?.rating : 0}
                aTime={`${moment(item?.startTime)
                  .utc()
                  .format('hh:mm A')} to ${moment(item?.endTime)
                    .utc()
                    .format('hh:mm A')}`}
                horizontal={true}
                onPress={() =>
                  navigation.navigate('PatientConsulationDetail', {
                    data: item,
                    status: false,
                  })
                }
                status={'completed'}
              />
            </>
          )}
        />

        {/* FILTER MODAL */}
        <Modal
          style={[styles.searchModal]}
          visible={searchModal}
          animationType="slide"
          onShow={() => searchRef.current.focus()}
          onRequestClose={() => setSearchModal(false)}>
          <View style={styles.mT(40)} />
          <KeyboardAvoidingView
            style={styles.flex(1)}
            behavior={Platform.OS == 'ios' && 'padding'}>
            <Input
              ref={searchRef}
              inputContainerStyle={[styles.SearchContainer, styles.shadowbb]}
              placeholder={labels.serachPlace}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="search"
              value={search}
              onChangeText={(text) => {
                setSearch(text.replace(/[^a-zA-Z1-9\s\.]/g, ''));
                // text.length === 0 && setSearchModal(false);
                text.length > 0 ? onSearchTyping(text) : null;
              }}
              onSubmitEditing={() => onSearchTyping(search)}
              rightIconContainerStyle={{ width: 30 }}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSearch('');
                    clearList();
                    search.length === 0 && setSearchModal(false);
                  }}>
                  <Image source={assets.clear} />
                </TouchableOpacity>
              }
            />
            <ScrollView
              style={[styles.flex(1)]}
              showsVerticalScrollIndicator={false}
              onScroll={() => Keyboard.dismiss()}>

              {suggestions?.providers?.length > 0 ? (
                <>
                  <Text style={[styles.suggestionSubHeading, styles.mV(5)]}>
                    {labels.doctor}
                  </Text>
                  <FlatList
                    scrollEnabled={true}
                    data={providerList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyRecord}
                    renderItem={SearchSuggestions}
                  />
                </>
              ) : null}
              {suggestions?.establishments?.length ? (
                <>
                  <Text style={[styles.suggestionSubHeading, styles.mV(5)]}>
                    {labels.est}
                  </Text>
                  <FlatList
                    scrollEnabled={true}
                    data={estList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyRecord}
                    renderItem={SearchSuggestions}
                  />
                </>
              ) : null}
              {suggestions?.specialities?.length ? (
                <>
                  <Text style={[styles.suggestionSubHeading, styles.mV(5)]}>
                    {labels.spec}
                  </Text>
                  <FlatList
                    scrollEnabled={true}
                    data={specialitiestList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyRecord}
                    renderItem={SearchSuggestions1}
                  />
                </>
              ) : null}
              {suggestions?.locations?.length ? (
                <>
                  <Text style={[styles.suggestionSubHeading, styles.mV(5)]}>
                    {labels.loc}
                  </Text>
                  <FlatList
                    scrollEnabled={true}
                    data={locationList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyRecord}
                    renderItem={SearchSuggestions2}
                  />
                </>
              ) : null}
              <View style={styles.height(50)} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
};

export default Home;
