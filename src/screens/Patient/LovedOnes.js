import React, {useEffect, useState} from 'react';
import {View, Image, Text} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {
  AddBtn,
  GreadientHeader,
  ButtonGradient,
  LovedOnesItem,
  ButtonSmall,
} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import ReactNativeModal from 'react-native-modal';
import {
  addAnAppointment,
  getLovedOnes,
  acknowledgeNotifcation,
} from '../../store/actions';

const LovedOnes = ({navigation, route}) => {
  const {from} = route.params;
  console.log(route.params);
  //Redux STORE
  const dispatch = useDispatch();
  const {profile} = useSelector((state) => state.Auth);
  const {getLovedOnes: getLovedOnesState} = useSelector(
    (state) => state.Patient,
  );
  // NAV ROUTES PARAMS
  const [lovedOneId, setLovedOneId] = useState(null);
  const [lovedOnes, setLovedOnes] = useState([]);
  const [preAppointData, setPreAppointData] = useState(
    route?.params?.preAppointmentNotify,
  );
  const [postAppointData, setPostAppointData] = useState(
    route?.params?.postAppointmentNotify,
  );
  const [appointPopup, setAppointPopup] = useState(false);

  // API CALLING
  useEffect(() => {
    dispatch(getLovedOnes(true));
    if (route?.params?.preAppointmentNotify != null) {
      setAppointPopup(true);
    }
  }, []);

  // set loved one data
  useEffect(() => {
    setLovedOnes(getLovedOnesState);
    var check = lovedOnes.map((item) => item.id).includes(profile?.userId);
    const setLocal = async () => {
      const me = {
        ...profile,
        id: profile?.userId,
      };
      setLovedOnes((prev) => [me, ...prev]);
      setLovedOneId(me.id);
    };
    setLocal();
    return () => setLovedOnes([]);
  }, [getLovedOnesState]);

  const onSubmitFunc = () => {
    const appointment = {
      slotId: route?.params?.serviceId,
      posId: route?.params?.purposeId,
      providerId: route?.params?.providerId,
      consultationTypeId: route?.params?.consultationTypeId,
      lovedOneId: lovedOneId,
    };
    // console.log(appointment)
    dispatch(addAnAppointment(appointment, true)).then((text) => {
      if (text.status === 200) {
        navigation.navigate('CreditCard', {
          from: false,
          push: false,
          lovedOne: lovedOneId,
          serviceId: route?.params?.serviceId,
          purposeId: route?.params?.purposeId,
          providerId: route?.params?.providerId,
          consultationId: text?.data?.id,
          perSlotAmount: route?.params?.perSlotAmount,
          walkin: route?.params?.walkin,
          preAppointData: preAppointData,
          postAppointData: postAppointData,
        });
      }
    });
  };
  const onAcknowlegde = () => {
    dispatch(acknowledgeNotifcation({id: preAppointData?.id})).then((res) => {
      if (res === 200) {
        setAppointPopup(false);
      } else {
        setAppointPopup(false);
      }
    });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.lovedOnes}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <AddBtn
          type={false}
          onBtnPress={() =>
            navigation.navigate('addlovedOnes', {data: 'SignUp'})
          }
        />
        <View style={styles.height(40)} />
        <View style={styles.mH(20)}>
          <LovedOnesItem
            data={lovedOnes.length ? lovedOnes : []}
            from={false}
            isSelected={lovedOneId}
            onItemPress={(e) => setLovedOneId(e)}
          />
          {from && (
            <View style={[styles.mH(8), styles.mT(15)]}>
              <ButtonGradient
                title={labels.confirmAppointment}
                type={false}
                disabled={lovedOneId === null}
                onBtnPress={() => onSubmitFunc()}
              />
            </View>
          )}
        </View>
        <View style={styles.height(40)} />
      </View>
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={appointPopup}
        onBackButtonPress={() => {
          setAppointPopup(false);
          navigation.goBack();
        }}>
        <View style={[styles.aboutMePopUpContainer]}>
          <Text style={[styles.textSemiBold, styles.textAlign, styles.mT(25)]}>
            {labels.PreAppointment}
          </Text>
          <Text style={[styles.h2, styles.textAlign, styles.mT(10)]}>
            Title: {preAppointData?.title && preAppointData?.title}
          </Text>
          <Text style={[styles.paragraph2, styles.textAlign, styles.mT(5)]}>
            Description:{' '}
            {preAppointData?.description && preAppointData?.description}
          </Text>
          <View
            style={[
              styles.flexRow,
              styles.alignSelf,
              styles.mH(45),
              styles.mT(5),
            ]}>
            <ButtonSmall
              title={labels.acknowledge}
              onBtnPress={() => onAcknowlegde()}
            />
          </View>
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default LovedOnes;
