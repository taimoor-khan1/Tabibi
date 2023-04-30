import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Platform,
  TouchableOpacity,
  Keyboard,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {
  AddBtn,
  GreadientHeader,
  PatientItem,
  NoRecordComponent,
} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {getMyPatient, searchPatient} from '../../store/actions';

const DrAllPatients = ({navigation}) => {
  //REDUX STORE
  const dispatch = useDispatch();
  const {estDoc, role} = useSelector((state) => state.Auth);
  const {allPatients, patientsSearch} = useSelector((state) => state.Doctor);

  //Declare state variable
  const [searchText, setSearchText] = useState('');
  const [searchModal, setSearchModal] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const [patientFilter, setPatientFilter] = useState([]);

  // Declare input reference field
  const searchRef = useRef();

  //Fuctions
  // GET My Patients Appointment list API
  useEffect(() => {
    if (estDoc?.provider) {
      dispatch(getMyPatient(true, estDoc?.provider?.id));
    } else {
      dispatch(getMyPatient(true));
    }
  }, []);

  // ************************* GLOBAL SEARCH *************************
  // Action for set All Search Patients
  // useEffect(() => {
  //   if (patientsSearch?.length > 0) {
  //     setPatientList(patientsSearch)
  //   } else {
  //     // clearList();
  //   }
  // }, [patientsSearch])

  // on typing new search
  // const onSearchTyping = text => {
  //   if (text.length > 0) {
  //     const params = {
  //       title: text.trim(),
  //     }
  //     dispatch(searchPatient(params))
  //   }
  // }
  // *************************               *************************

  //Set patient list and its search filter
  useEffect(() => {
    setPatientList(allPatients?.length ? allPatients : []);
    setPatientFilter(allPatients?.length ? allPatients : []);
  }, [allPatients]);

  // function for searching my patients list from filter list
  const onSearchTyping = (text) => {
    setSearchText(text);
    const newData = patientFilter.filter((item) => {
      const itemData = item?.firstName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setPatientList(newData);
  };
  //Render Search Patient Suggestions
  const rendarPatients = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchModal(false);
          navigation.navigate('DrPatientDetail', {
            id: item?.id,
            deviceToken: item?.deviceToken,
            deviceTokenType: item?.deviceTokenType,
            from: false,
          });
          setSearchText('');
          clearList();
        }}>
        <View style={styles.searchSuggestion}>
          <View style={styles.flexRow}>
            <Image
              source={item?.avatar ? {uri: item?.avatar} : assets.dummy}
              style={[styles.height(30), styles.width(30)]}
              borderRadius={50}
            />
            <Text
              style={[
                styles.fontSize(14),
                styles.padding(5),
                styles.pL(10),
                styles.PoppinsRegular,
                {textTransform: 'capitalize'},
              ]}>
              {`${item.firstName} ${item.lastName}`}
            </Text>
          </View>
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
  //Action for Clear Patient Reducer state and list
  const clearList = () => {
    setPatientList([]);
    dispatch({
      type: 'SEARCH_PATIENT',
      payload: [],
    });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={assets.searchIc}
          showCenterText={labels.patients}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
          modalBtn={() => {
            setSearchModal(!searchModal);
          }}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={[styles.mH(20)]}>
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
                <View style={[styles.mT(150), styles.mL(110)]}>
                  <NoRecordComponent />
                </View>
              )}
            </View>
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
        {/* ADD BUTTON */}
        <AddBtn
          type={false}
          onBtnPress={() => {
            navigation.navigate('DrAddPatient');
          }}
        />
        {/* SEARCH MODAL */}
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
              placeholder={'Search Patients'}
              inputStyle={[styles.inputStyle]}
              autoCapitalize="words"
              returnKeyType="search"
              value={searchText}
              onChangeText={(text) => {
                text.length > 0
                  ? onSearchTyping(text.replace(/[^a-zA-Z\s1-9\.]/g, ''))
                  : null;
                setSearchText(text.replace(/[^a-zA-Z\s1-9\.]/g, ''));
              }}
              rightIconContainerStyle={{width: 30}}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSearchText('');
                    // clearList()
                    setPatientList(allPatients?.length ? allPatients : []);
                    searchText.length === 0 && setSearchModal(false);
                  }}>
                  <Image source={assets.clear} />
                </TouchableOpacity>
              }
            />
            <ScrollView
              style={[styles.flex(1)]}
              showsVerticalScrollIndicator={false}
              onScroll={() => Keyboard.dismiss()}>
              <FlatList
                scrollEnabled={true}
                data={patientList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyRecord}
                renderItem={rendarPatients}
              />
              <View style={styles.height(50)} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
};

export default DrAllPatients;
