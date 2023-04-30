import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import { useDispatch, useSelector } from 'react-redux';
import ReactNativeModal from 'react-native-modal';
import Modal from 'react-native-modalbox';
import { Input, Icon } from 'react-native-elements';
import { Languages } from '../../assets/languages';
import LinearGradient from 'react-native-linear-gradient';

import {
  ProfileHeader,
  ProgressBar,
  ButtonGradient,
  ButtonWhite,
  ButtonSmall,
  ReactChipsInput,
} from '../../components';
import Snackbar from 'react-native-snackbar';
import {
  getDetail,
  drGetProfile,
  drAddDetail,
  getPOS,
  deletePOS,
} from '../../store/actions';

const DrMyProfile = ({ navigation, route }) => {
  // REDUX STORE
  const dispatch = useDispatch();
  const { user, profile, role } = useSelector((state) => state.Auth);
  const { getProfileDetail, addProfileDetail, POC } = useSelector(
    (state) => state.Doctor,
  );
  console.log('profileDetails', getProfileDetail.tax);
  // PROFILE DATA STATES
  const [avatar, setAvatar] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [editPoc, setEditPoc] = useState(false);
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lan, setLan] = useState(Languages);
  const [lanList] = useState(Languages);
  const [specialities, setSpecialities] = useState('');

  // POPUP MODALS STATES
  const [aboutMePopup, setAboutMePopup] = useState(false);
  const [languagePopup, setLanguagePopup] = useState(false);
  const [specializesPopup, setSpecializesPopup] = useState(false);
  const [consultationPopup, setConsultationPopup] = useState(false);
  const [qualificationPopup, setQualificationPopup] = useState(false);
  const [taxPopUp, setTaxPopup] = useState(false);

  // DOCTOR INFO DATA STATES
  const [aboutMeText, setAboutMeText] = useState('');
  const [taxText, setTaxText] = useState('0');
  const [spokenLanguages, setSpokenLanguages] = useState([]);
  const [consultationFees, setConsultationFees] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [specaillizesIn, setSpecaillizesIn] = useState([]);
  const [locations, setLocations] = useState([]);

  //POC Modal States
  const [chips, setChips] = useState([]);
  const [deletePos, setDeletePOS] = useState(false);
  const [posId, setPosId] = useState('');

  // OTHER STATES
  const [showLan, setShowLan] = useState(false);
  const [language, setLanguage] = useState('');
  const [languageCounter, setLanguageCounter] = useState(-1);
  const [specialize, setSpecialize] = useState('');
  const [specializeCounter, setSpecializeCounter] = useState(-1);
  const [consultationType, setConsultationType] = useState('');
  const [consultfee, setConsultFee] = useState('');
  const [qualification, setQualification] = useState('');
  const [consultationCounter, setConsultationCounter] = useState(-1);
  const [qualificationCounter, setQualificationCounter] = useState(-1);
  const [barWidth, setBarWidth] = useState(0);

  // GET USER PROFILE DATA
  useEffect(() => {
    const params = {
      user_id: user?.userId,
      from: role,
    };
    dispatch(drGetProfile(params));
    dispatch(getDetail({ from: role }));
    dispatch(getPOS());
  }, []);

  //clear add detail state
  useEffect(() => {
    if (addProfileDetail) {
      dispatch({ type: 'CLEAR_DETAIL' });
    }
  }, [addProfileDetail]);

  // SET USER PROFILE DATA
  useEffect(() => {
    setDoctorName(profile?.name);
    setAvatar(profile?.avatar);
    setPhoneNumber(profile?.mobileNumber);
    setEmail(profile?.email);
    setGender(profile?.gender);
    setAddress(profile?.address);
    setCity(profile?.city);
    setCountry(profile?.country);
  }, [profile]);

  //SET PROFILE DETAILS DATA
  useEffect(() => {
    console.log("doctor Profile:====>", getProfileDetail)
    setAvatar(profile?.avatar);
    setAboutMeText(getProfileDetail?.aboutUS ? getProfileDetail?.aboutUS : '');
    setSpokenLanguages(
      getProfileDetail?.spokenLanguages
        ? getProfileDetail?.spokenLanguages
        : [],
    );
    setSpecaillizesIn(
      getProfileDetail?.specaillizesIn ? getProfileDetail?.specaillizesIn : [],
    );
    setSpecialities(getProfileDetail?.specialities);
    setConsultationFees(
      getProfileDetail?.consultationFees
        ? getProfileDetail?.consultationFees
        : [],
    );
    setQualifications(
      getProfileDetail?.qualifications ? getProfileDetail?.qualifications : [],
    );
    setLocations(
      getProfileDetail?.location?.length ? getProfileDetail?.location : [],
    );
    setTaxText(getProfileDetail?.tax != undefined && getProfileDetail?.tax !== '' ? getProfileDetail?.tax : '');
    var chips = [];
    getProfileDetail?.purposes?.map((item, ind) => {
      chips.push({
        value: item?.poc?.title,
        color: item?.color,
        pocId: item?.poc?.id,
        posId: item?.id,
        perSlotTime: item?.perSlotTime,
        perSlotAmount: item?.perSlotAmount,
        preAppointmentNotify: item?.preAppointmentNotify,
        postAppointmentNotify: item?.postAppointmentNotify
      });
    });

    setChips(chips);
    setCompletedBar();
  }, [getProfileDetail]);

  // PROGRESS BAR COMPLETEION FUNCTION
  const setCompletedBar = async () => {
    var fields = [
      avatar,
      aboutMeText,
      spokenLanguages,
      specaillizesIn,
      consultationFees,
      qualifications,
      locations,
    ];
    var count = 0;
    var i = 0;
    for (i = 0; i < fields.length; i++) {
      if (fields[i] !== null && fields[i] !== '' && fields[i].length) {
        count++;
      }
    }
    var totalWidth = (count / Object.keys(fields).length) * 100;
    setBarWidth(Math.round(totalWidth));
  };
  // FLATLIST RENDER FUNCTION
  const render = (item, points, numberOfLines) => {
    return (
      <>
        <View style={[styles.flexRow, styles.mT(5)]}>
          {points && <View style={styles.points} />}
          <Text
            numberOfLines={numberOfLines}
            ellipsizeMode={'tail'}
            style={
              points === false
                ? [
                  styles.paragraph,
                  styles.PoppinsRegular,
                  styles.color(colors.black),
                ]
                : [styles.paragraph, styles.PoppinsRegular]
            }>
            {item}
          </Text>
        </View>
      </>
    );
  };
  // FLATLIST CONSULTATION RENDER FUNCTION
  const render1 = (item) => {
    return (
      <>
        <View
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.flexRow, styles.mT(5), styles.justifyCntSP]}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[
              styles.paragraph,
              styles.PoppinsRegular,
              { color: colors.black },
            ]}>
            {item.title}
          </Text>
          {item.fee && (
            <Text
              style={[
                styles.paragraph,
                styles.PoppinsMedium,
                styles.textAlignRight,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.color(colors.themeColor)}>
                $
              </Text>
              {item.fee}
            </Text>
          )}
        </View>
      </>
    );
  };
  // FLATLIST LOCATION RENDER FUNCTION
  const render2 = (item) => {
    return (
      <>
        <View
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.flexRow, styles.mT(5)]}>
          <View style={styles.points} />
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[
              styles.paragraph,
              styles.PoppinsRegular,
              { color: colors.black },
            ]}>
            {item.address}
          </Text>
        </View>
      </>
    );
  };
  //NO RECORD RENDER
  function noRecord() {
    return (
      <Text style={[styles.disabletext, styles.mT(10)]}>{labels.notFound}</Text>
    );
  }
  // Language Render
  const searchLangFilter = (text) => {
    const newData = lanList.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setLan(newData);
  };
  function rendarLanguage({ item }) {
    return (
      <TouchableOpacity
        onPress={() => {
          setSpokenLanguages([...spokenLanguages, item.name]);
          setLanguageCounter(languageCounter + 1);
          setShowLan(!showLan);
          setLanguage('');
        }}>
        <View style={styles.languageArr}>
          <Text style={styles.fontSize(12)}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  // Remove chips
  const removeChips = (id) => {
    const payload = {
      id: id,
    };
    // console.log(payload);
    dispatch(deletePOS(payload)).then((res) => {
      if (res === 200) {
        setDeletePOS(false);
        dispatch(getDetail({ from: role }));
        dispatch(getPOS());
      } else {
        setDeletePOS(false);
      }
    });
  };
  //Toast for notification
  const showToast = (type) => {
    Snackbar.show({
      text: labels.empLoc,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.themeColor,
      fontFamily: fonts.PoppinsMedium,
      numberOfLines: 4,
      textColor: colors.dim,
      action: {
        text: 'ok',
        textColor: colors.dim,
        onPress: () => {
          Snackbar.dismiss;
        },
      },
    });
  };
  // MAIN COMPONENT
  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <ProfileHeader
          showLeftIcon={true}
          showRightIcon={assets.editPencile}
          showCenterText={labels.profile}
          showLeftText={labels.back}
          showRightText={labels.edit}
          avatar={avatar && avatar}
          leftRoute={() => navigation.goBack()}
          rightRoute={() =>
            navigation.navigate('DrEditProfile', {
              user: profile,
            })
          }
        />
        <View style={[styles.height(70)]} />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <Text
          style={[styles.textSemiBold, styles.fontSize(19), styles.textAlign]}
          numberOfLines={1}
          ellipsizeMode="tail">
          Dr.{doctorName ? doctorName : ''}
        </Text>
        <View style={styles.mH(25)}>
          <View style={[styles.imageRow]}>
            <Image source={assets.call} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {phoneNumber}
            </Text>
          </View>
          <View style={[styles.imageRow]}>
            <Image source={assets.email} style={styles.mR(4)} />
            <Text
              style={[styles.textR]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {email}
            </Text>
          </View>
          {address != null && (
            <View style={[styles.imageRow]}>
              <Image source={assets.locationPin} style={styles.mR(4)} />
              <Text
                style={[styles.textR]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {address}
              </Text>
            </View>
          )}
          {city && country ? (
            <View style={[styles.imageRow]}>
              <Text
                style={[styles.textR]}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {`${city}, ${country}`}
              </Text>
            </View>
          ) : null}
          {role === 'provider' ? (
            <ProgressBar percent={`${barWidth.toFixed(2)}%`} />
          ) : null}
          <View style={styles.mT(10)} />
          <View style={[styles.mB(10)]}>
            <View style={[styles.flexRow, styles.justifyCntSP]}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.h2,
                  //  styles.mT(10)
                ]}>
                {labels.aboutme}
              </Text>
              <TouchableOpacity
                style={[styles.flexRow, styles.containerCenter]}
                onPress={() => {
                  setAboutMePopup(true);
                }}>
                <Image source={assets.add} />
                {/* <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h3]}>
                  {labels.add}
                </Text> */}
              </TouchableOpacity>
            </View>
            <Text
              ellipsizeMode={'tail'}
              style={
                aboutMeText === ''
                  ? [styles.disabletext, styles.mT(10)]
                  : [styles.paragraph, styles.mT(10)]
              }>
              {aboutMeText === '' ? 'No Data' : aboutMeText}
            </Text>
          </View>
          <View style={[styles.spacer]} />
          {role === 'provider' && ( //LANGUAGE
            <View style={[styles.mB(10)]}>
              <View style={[styles.flexRow, styles.justifyCntSP]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h2,
                    //  styles.mT(18)
                  ]}>
                  {labels.languageSpoken}
                </Text>
                <TouchableOpacity
                  style={[styles.flexRow, styles.containerCenter]}
                  onPress={() => {
                    setLanguage(''), setLanguagePopup(true);
                  }}>
                  <Image source={assets.add} />
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[styles.h3]}>
                    {labels.add}
                  </Text> */}
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.mT(10)}
                data={spokenLanguages && spokenLanguages}
                ListEmptyComponent={noRecord}
                renderItem={({ item, index }) => render(item, true, 2)}
              />
              <View style={[styles.spacer]} />
            </View>
          )}
          <View style={[styles.mB(10)]}>
            <View style={[styles.flexRow, styles.justifyCntSP]}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.h2,
                  //  styles.mT(18)
                ]}>
                {labels.speciallizes}
              </Text>
              <TouchableOpacity
                style={[styles.flexRow, styles.containerCenter]}
                onPress={() => {
                  setSpecialize(''), setSpecializesPopup(true);
                }}>
                <Image source={assets.add} />
                {/* <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h3]}>
                  {labels.add}
                </Text> */}
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles.mT(10)}
              data={specaillizesIn && specaillizesIn}
              renderItem={({ item, index }) => render(item, true, 2)}
              ListEmptyComponent={noRecord}
            />
            <View style={[styles.spacer]} />
          </View>
          {role === 'provider' && ( //CONSULTATIONS
            <View style={[styles.mB(10)]}>
              <View style={[styles.flexRow, styles.justifyCntSP]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h2,
                    // styles.mT(18)
                  ]}>
                  {labels.consulation}
                </Text>
                <TouchableOpacity
                  style={[styles.flexRow, styles.containerCenter]}
                  onPress={() => {
                    setConsultationType(''), setConsultationPopup(true);
                  }}>
                  <Image source={assets.add} />
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[styles.h3]}>
                    {labels.add}
                  </Text> */}
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.mT(10)}
                data={consultationFees && consultationFees}
                renderItem={({ item, index }) => render1(item)}
                ListEmptyComponent={noRecord}
              />
              <View style={[styles.spacer]} />
            </View>
          )}
          {role === 'provider' && ( //QUALIFICATIONS
            <View style={[styles.mB(10)]}>
              <View style={[styles.flexRow, styles.justifyCntSP]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h2,
                    //  styles.mT(18)
                  ]}>
                  {labels.qualification}
                </Text>
                <TouchableOpacity
                  style={[styles.flexRow, styles.containerCenter]}
                  onPress={() => {
                    setQualification(''), setQualificationPopup(true);
                  }}>
                  <Image source={assets.add} />
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[styles.h3]}>
                    {labels.add}
                  </Text> */}
                </TouchableOpacity>
              </View>
              <FlatList
                style={styles.mT(10)}
                data={qualifications && qualifications}
                renderItem={({ item, index }) => render(item, true, 2)}
                ListEmptyComponent={noRecord}
              />
              <View style={[styles.spacer]} />
            </View>
          )}
          {/* LOCATIONS */}
          <View style={[styles.mB(10)]}>
            <View style={[styles.flexRow, styles.justifyCntSP]}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.h2,
                  // styles.mT(18)
                ]}>
                {labels.location}
              </Text>
              <TouchableOpacity
                style={[styles.flexRow, styles.containerCenter]}
                onPress={() => {
                  role === 'provider'
                    ? navigation.navigate('DrAddLocation')
                    : navigation.navigate('EstLocation');
                }}>
                <Image source={assets.add} />
                {/* <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h3]}>
                  {labels.add}
                </Text> */}
              </TouchableOpacity>
            </View>

            <FlatList
              style={styles.mT(10)}
              data={locations}
              renderItem={({ item, index }) => render2(item, true, 2)}
              ListEmptyComponent={noRecord}
            />
            <View style={[styles.spacer]} />
            <View style={[styles.mB(10)]}>
              <View style={[styles.flexRow, styles.justifyCntSP]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h2,
                    // styles.mT(18)
                  ]}>
                  {labels.tax}
                </Text>
                <TouchableOpacity
                  style={[styles.flexRow, styles.containerCenter]}
                  onPress={() => {
                    setTaxPopup(true);
                  }}>
                  <Image source={assets.add} />
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[styles.h3]}>
                    {labels.add}
                  </Text> */}
                </TouchableOpacity>
              </View>
              <Text
                ellipsizeMode={'tail'}
                style={
                  taxText === ''
                    ? [styles.disabletext, styles.mT(10)]
                    : [styles.paragraph, styles.mT(10)]
                }>
                {console.log()}
                {taxText === '' ? 'No Data' : `${taxText}%`}
              </Text>
            </View>
            <View style={[styles.spacer]} />
          </View>

          {/* Purpose of consultation */}

          <View style={[styles.flexRow, styles.justifyCntSP, styles.mB(18)]}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={[styles.h2,

              ]}
            >
              {labels.purpose}
            </Text>
            <TouchableOpacity
              style={[styles.flexRow, styles.containerCenter, { alignItems: "center" }]}
              onPress={() => {
                locations.length > 0
                  ? editPoc
                    ? setEditPoc(false)
                    : setEditPoc(true)
                  : showToast();
              }}>
              <Image source={assets.editPencileBlue}
              // style={{ marginRight: -15 }}
              />
              {/* <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.h3]}>
                {labels.edit}
              </Text> */}
            </TouchableOpacity>
            {!editPoc && (
              <TouchableOpacity
                style={[styles.flexRow, styles.containerCenter]}
                onPress={() => {
                  locations.length > 0
                    ? navigation.navigate('DrAddPOC', { data: null, from: null })
                    : showToast();
                }}>
                <Image source={assets.add} style={{ marginLeft: -30 }} />
                {/* <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[styles.h3]}>
                  {labels.add}
                </Text> */}
              </TouchableOpacity>
            )}
          </View>

          {/* CHIPS */}
          <ReactChipsInput
            label={''}
            initialChips={chips}
            edit={editPoc}
            removedItem={(e) => {
              console.log('data hy chips ka========>', e);

              {
                editPoc === true
                  ? navigation.navigate('DrAddPOC', { data: e, from: "edit" })
                  : setDeletePOS(true),
                  setPosId(e.posId);
              }
            }}
            alertRequired={false}
            chipStyle={[styles.chipStyle]}
            chipTextStyle={[styles.chipTextStyle]}
          />
          <View style={[styles.spacer]} />
        </View>

        <View style={styles.height(60)} />

        {/* ABOUT ME MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={aboutMePopup}
          onBackdropPress={() => setAboutMePopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setAboutMePopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.aboutme}
            </Text>
            <TextInput
              placeholder={labels.aboutme}
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              clearTextOnFocus={false}
              underlineColorAndroid="transparent"
              multiline={true}
              numberOfLines={6}
              style={[[styles.aboutMeInputContainer, styles.shadowbb]]}
              returnKeyType={'done'}
              onChangeText={(text) => setAboutMeText(text)}
              value={aboutMeText}
            // onSubmitEditing={() => {
            // }}
            />
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        aboutUS: aboutMeText.trim(),
                      },
                      from: role,
                    }),
                  );
                  setAboutMePopup(false);
                  // setCompletedBar();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
        {/* TAX  MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={taxPopUp}
          onBackdropPress={() => setTaxPopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setTaxPopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.tax}
            </Text>
            <TextInput
              placeholder={'%'}
              placeholderTextColor={colors.text}
              clearTextOnFocus={false}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              multiline={false}
              style={[[styles.addtax, styles.shadowbb]]}
              returnKeyType={'done'}
              onChangeText={(text) =>
                text >= 0 && text <= 100 ? setTaxText(text) : ''
              }
              value={taxText}
            />
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        tax: taxText.trim(),
                      },
                      from: role,
                    }),
                  );
                  setTaxPopup(false);
                  // setCompletedBar();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>

        {/* LANGUAGE MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={languagePopup}
          onBackdropPress={() => setLanguagePopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => {
                setLanguagePopup(false);
                setShowLan(!showLan);
                setLanguage('');
              }}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.languageSpoken}
            </Text>
            <View
              style={[
                styles.popupTopContainer,
                styles.flexRow,
                styles.shadowbb,
              ]}>
              <Input
                inputContainerStyle={[styles.popupAddTextfieldContainer]}
                placeholder={labels.languageSpoken}
                containerStyle={[styles.pH(0), styles.pH(0)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => {
                  setLanguage(text);
                  setShowLan(text.length > 0 ? true : false);
                  searchLangFilter(text);
                }}
                value={language}
                onSubmitEditing={() => {
                  if (language.trim()) {
                    setShowLan(!showLan);
                    setLanguage('');
                  } else {
                    setLanguage('');
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => setShowLan(!showLan)}
                style={styles.textfieldRightBtn}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.containerCenter, styles.gradientAddIcon]}
                  colors={[colors.btngr3, colors.btngr2, colors.btngr1]}>
                  <Icon
                    name={showLan ? 'chevron-up' : 'chevron-down'}
                    color={colors.white}
                    size={30}
                    type="evilicon"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {showLan && (
              <View style={styles.languageView}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FlatList
                    data={lan}
                    renderItem={rendarLanguage}
                    keyExtractor={(item) => item.name}
                    ListEmptyComponent={
                      <Text style={styles.POCError}>{labels.noData}</Text>
                    }
                  />
                </ScrollView>
              </View>
            )}
            {spokenLanguages?.map((item, index) => {
              return (
                <View style={[styles.languageContainer, styles.flexRow]}>
                  <Text
                    style={[
                      styles.h3,
                      styles.color(colors.white),
                      styles.textAlignLeft,
                      styles.mL(20),
                    ]}>
                    {item}
                  </Text>
                  <TouchableOpacity
                    style={[styles.mR(20), styles.pH(5), styles.pV(10)]}
                    onPress={() => {
                      var filtered = spokenLanguages.filter((data, index) => {
                        return data !== item;
                      });
                      setSpokenLanguages(filtered);
                    }}>
                    <Image source={assets.closeW} />
                  </TouchableOpacity>
                </View>
              );
            })}
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        spokenLanguages: spokenLanguages,
                      },
                      from: role,
                    }),
                  );
                  setLanguagePopup(false);
                  // setCompletedBar();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
        {/* SPECILIES IN MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={specializesPopup}
          onBackdropPress={() => setSpecializesPopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setSpecializesPopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.speciallizes}
            </Text>
            <View
              style={[
                styles.popupTopContainer,
                styles.flexRow,
                styles.shadowbb,
              ]}>
              <Input
                inputContainerStyle={[styles.popupAddTextfieldContainer]}
                placeholder={labels.speciallizes}
                containerStyle={[styles.pH(0), styles.pH(0)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => setSpecialize(text)}
                value={specialize}
                onSubmitEditing={() => {
                  if (specialize.trim()) {
                    setSpecaillizesIn([...specaillizesIn, specialize.trim()]);
                    setSpecialize('');
                    setSpecializeCounter(specializeCounter + 1);
                  } else {
                    setSpecialize('');
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (specialize.trim()) {
                    setSpecaillizesIn([...specaillizesIn, specialize.trim()]);
                    setSpecialize('');
                    setSpecializeCounter(specializeCounter + 1);
                  } else {
                    setSpecialize('');
                  }
                }}
                style={styles.textfieldRightBtn}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.containerCenter, styles.gradientAddIcon]}
                  colors={[colors.btngr3, colors.btngr2, colors.btngr1]}>
                  <Image source={assets.addWhite} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {specaillizesIn?.map((data) => {
              return (
                <View style={[styles.languageContainer, styles.flexRow]}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={[
                      styles.h3,
                      styles.color(colors.white),
                      styles.textAlignLeft,
                      styles.mL(20),
                    ]}>
                    {data}
                  </Text>
                  <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    style={[styles.mR(20)]}
                    onPress={() => {
                      var filtered = specaillizesIn.filter((lang, index) => {
                        return lang !== data;
                      });
                      setSpecaillizesIn(filtered);
                    }}>
                    <Image source={assets.closeW} />
                  </TouchableOpacity>
                </View>
              );
            })}
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        specaillizesIn: specaillizesIn,
                      },
                      from: role,
                    }),
                  );
                  setSpecializesPopup(false);
                  // setCompletedBar();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
        {/* CONSULTATION MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={consultationPopup}
          onBackdropPress={() => setConsultationPopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setConsultationPopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.consulation}
            </Text>
            <View style={[styles.flexRow, styles.shadowbb]}>
              <View style={[styles.flex(0.59), styles.mL(10)]}>
                <Input
                  inputContainerStyle={[styles.inputContainer]}
                  placeholder={labels.consultaionType}
                  containerStyle={[styles.pH(0), styles.pH(0)]}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  inputStyle={styles.inputStyle}
                  selectionColor={colors.green}
                  keyboardType="default"
                  importantForAutofill="no"
                  selectTextOnFocus={false}
                  returnKeyType="done"
                  autoCapitalize="none"
                  onChangeText={(text) => setConsultationType(text)}
                  value={consultationType}
                />
              </View>
              <View style={[styles.flex(0.19), styles.mL(5)]}>
                <Input
                  inputContainerStyle={[styles.inputContainer, styles.pH(0)]}
                  placeholder={'$'}
                  containerStyle={[styles.pH(0)]}
                  placeholderTextColor={colors.text}
                  underlineColorAndroid="transparent"
                  autoCorrect={false}
                  maxLength={4}
                  inputStyle={styles.inputStyle}
                  selectionColor={colors.green}
                  keyboardType="number-pad"
                  importantForAutofill="no"
                  selectTextOnFocus={false}
                  returnKeyType="done"
                  autoCapitalize="none"
                  onChangeText={(text) =>
                    setConsultFee(text.replace(/[^0-9]/g, ''))
                  }
                  value={consultfee}
                  onSubmitEditing={() => {
                    if (
                      consultationType.trim().length > 0 &&
                      consultfee.length > 0
                    ) {
                      setConsultationFees([
                        ...consultationFees,
                        {
                          title: consultationType.trim(),
                          fee: consultfee,
                        },
                      ]);
                      setConsultationType('');
                      setConsultFee(0);
                      setConsultationCounter(consultationCounter + 1);
                    } else {
                      setConsultationType('');
                    }
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (
                    consultationType.trim().length > 0 &&
                    consultfee.length > 0
                  ) {
                    setConsultationFees([
                      ...consultationFees,
                      {
                        title: consultationType.trim(),
                        fee: consultfee,
                      },
                    ]);
                    setConsultationType('');
                    setConsultFee('');
                    setConsultationCounter(consultationCounter + 1);
                  } else {
                    setConsultationType('');
                  }
                }}
                style={[styles.textfieldRightBtn, styles.right(7)]}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.containerCenter, styles.gradientAddIcon]}
                  colors={[colors.btngr3, colors.btngr2, colors.btngr1]}>
                  <Image source={assets.addWhite} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {consultationFees?.map((item) => {
              return (
                <View style={[styles.languageContainer, styles.flexRow]}>
                  <View style={styles.flex(0.75)}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={[
                        styles.h3,
                        styles.color(colors.white),
                        styles.textAlignLeft,
                        styles.mL(20),
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.flex(0.3)}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={[
                        styles.h3,
                        styles.color(colors.white),
                        styles.mR(10),
                      ]}>
                      {'$' + item.fee}
                    </Text>
                  </View>
                  <View style={[styles.flex(0.1)]}>
                    <TouchableOpacity
                      hitSlop={styles.hitSlop}
                      style={[styles.mR(20)]}
                      onPress={() => {
                        var filtered = consultationFees.filter(
                          (data, index) => {
                            return data.title !== item.title;
                          },
                        );
                        setConsultationFees(filtered);
                      }}>
                      <Image source={assets.closeW} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        consultationFees: consultationFees,
                      },
                      from: role,
                    }),
                  );
                  setConsultationPopup(false);
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
        {/* QUALIFICATION MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={qualificationPopup}
          onBackdropPress={() => setQualificationPopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <TouchableOpacity
              hitSlop={styles.hitSlop}
              style={[styles.modalCrossIcon]}
              onPress={() => setQualificationPopup(false)}>
              <Image source={assets.close} />
            </TouchableOpacity>
            <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
              {labels.qualification}
            </Text>
            <View
              style={[
                styles.popupTopContainer,
                styles.flexRow,
                styles.shadowbb,
              ]}>
              <Input
                inputContainerStyle={[styles.popupAddTextfieldContainer]}
                placeholder={labels.qualification}
                containerStyle={[styles.pH(0), styles.pH(0)]}
                placeholderTextColor={colors.text}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                inputStyle={styles.inputStyle}
                selectionColor={colors.green}
                keyboardType="default"
                importantForAutofill="no"
                selectTextOnFocus={false}
                returnKeyType="done"
                autoCapitalize="none"
                onChangeText={(text) => setQualification(text)}
                value={qualification}
                onSubmitEditing={() => {
                  if (qualification.trim()) {
                    setQualifications([
                      ...qualifications,
                      qualification.trim(),
                    ]);
                    setQualification('');
                    setQualificationCounter(qualificationCounter + 1);
                  } else {
                    setQualification('');
                  }
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  if (qualification.trim()) {
                    setQualifications([
                      ...qualifications,
                      qualification.trim(),
                    ]);
                    setQualification('');
                    setQualificationCounter(qualificationCounter + 1);
                  } else {
                    setQualification('');
                  }
                }}
                style={styles.textfieldRightBtn}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.containerCenter, styles.gradientAddIcon]}
                  colors={[colors.btngr3, colors.btngr2, colors.btngr1]}>
                  <Image source={assets.addWhite} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {qualifications?.map((data) => {
              return (
                <>
                  <View
                    style={[
                      styles.languageContainer,
                      styles.flexRow,
                      styles.backgroundColor(colors.white),
                      styles.mB(0),
                    ]}>
                    <View style={[styles.flex(0.1)]}>
                      <Text
                        style={[
                          styles.h2,
                          styles.color(colors.themeColor),
                          styles.mL(5),
                        ]}>
                        {'•'}
                      </Text>
                    </View>
                    <View style={styles.flex(0.8)}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={[
                          styles.h3,
                          styles.color(colors.black),
                          styles.textAlignLeft,
                          styles.mL(0),
                        ]}>
                        {data}
                      </Text>
                    </View>
                    <View style={[styles.flex(0.1), styles.mL(5)]}>
                      <TouchableOpacity
                        hitSlop={styles.hitSlop}
                        style={[styles.mR(0)]}
                        onPress={() => {
                          var filtered = qualifications.filter(
                            (item, index) => {
                              return item !== data;
                            },
                          );
                          setQualifications(filtered);
                        }}>
                        <Image source={assets.closeRed} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.spacer, styles.mV(0)]} />
                </>
              );
            })}
            <View
              style={[
                styles.width90,
                styles.alignSelf,
                // styles.mtm20,
                styles.mB(10),
              ]}>
              <ButtonGradient
                title={labels.save}
                type={false}
                gradient={true}
                onBtnPress={() => {
                  dispatch(
                    drAddDetail({
                      addDetail: {
                        qualifications: qualifications,
                      },
                      from: role,
                    }),
                  );
                  setQualificationPopup(false);
                  // setCompletedBar();
                }}
              />
            </View>
          </View>
        </ReactNativeModal>
        {/* DELETE POS MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={deletePos}
          onBackButtonPress={() => setDeletePOS(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <Text
              style={[styles.textSemiBold, styles.textAlign, styles.mT(25)]}>
              {labels.deletePOCText}
            </Text>
            <View
              style={[
                styles.flexRow,
                styles.alignSelf,
                styles.mH(45),
                styles.mT(5),
              ]}>
              <ButtonWhite
                title={labels.no}
                exstyle={styles.shadowbb}
                onBtnPress={() => setDeletePOS(false)}
              />
              <ButtonSmall
                title={labels.yes}
                onBtnPress={() => removeChips(posId)}
              />
            </View>
            <View style={styles.height(10)} />
          </View>
        </ReactNativeModal>
      </ScrollView>
    </>
  );
};

export default DrMyProfile;
