import React, {useEffect, useState} from 'react';
import {View, Text, Image, Modal, TouchableOpacity} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import fonts from '../../assets/fonts';
import colors from '../../config/Colors';
import {
  HeaderHome,
  AddBtn,
  Tabber,
  ButtonWhite,
  ButtonSmall,
} from '../../components';
import DrHome from './DrHome';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {
  drGetProfile,
  getDetail,
  getSchedule,
  getConsultationTypes,
  getDrDashboard,
  getDrDashboardAppointment,
  getSubscriptionUser,
} from '../../store/actions';
import {useSelector, useDispatch} from 'react-redux';

const DrDashboard = ({navigation}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {user, role, profile, estDoc} = useSelector((state) => state.Auth);
  const {addSchedule, getProfileDetail} = useSelector((state) => state.Doctor);
  const {subscriptions} = useSelector((state) => state.Calling);
  // Declare state variables'
  const [consultationDate, setConsultationDate] = useState(
    moment().format('YYYY-MM'),
  );
  const [index, setIndex] = useState(0);
  const [Popups, setPopups] = useState(false);
  const handleTabChange = (index) => {
    setIndex(index);
  };

  //Fuctions and API's

  //API Calling Get Schedule
  useEffect(() => {
    const params = {
      period: consultationDate,
    };
    if (index === 0) {
      if (estDoc?.provider) {
        dispatch(getDrDashboard(params, false, estDoc?.provider?.id));
      } else {
        dispatch(getDrDashboard(params, false));
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
    dispatch(getConsultationTypes());
    dispatch(getSubscriptionUser({}, false));
  }, []);

  //Clear schedule when new schedule added
  useEffect(() => {
    if (addSchedule) {
      if (estDoc?.provider) {
        dispatch(getSchedule(consultationDate, false, estDoc?.provider?.id));
        dispatch({
          type: 'CLEAR_SCHEDULE',
          payload: false,
        });
        const params = {
          period: consultationDate,
        };
        dispatch(getDrDashboard(params, false, estDoc?.provider?.id));
      } else {
        dispatch(getSchedule(consultationDate, false));
        dispatch({
          type: 'CLEAR_SCHEDULE',
          payload: false,
        });
        const params = {
          period: consultationDate,
        };
        dispatch(getDrDashboard(params, false));
      }
    }
  }, [addSchedule]);

  // GET PROFILE
  useEffect(() => {
    if (role !== null) {
      const params = {
        user_id: user?.userId,
        from: role,
      };
      dispatch(drGetProfile(params, true));
      dispatch(getDetail({from: role}));
    }
  }, [role]);

  //Validations before creating schedules
  const checkValidation = (index, show) => {
    if (role === 'establishment') {
      if (index === 0) {
        navigation.navigate('Availability');
      } else {
        navigation.navigate('DrWalkinAppoinment', {
          from: 'DrDashboard',
          data: null,
          date: null,
          posId: null,
          slotId: null,
          start: null,
          end: null,
          title: null,
        });
      }
    } else {
      if (index === 0) {
        if (getProfileDetail?.purposes?.length && show === true) {
          // purpose of consultation is added
          navigation.navigate('Availability');
        } else if (show === true) {
          // need purpose of consultation against every schedule
          showToast('POC');
        }
      } else {
        if (show === true) {
          navigation.navigate('DrWalkinAppoinment', {
            from: 'DrDashboard',
            data: null,
            date: null,
            posId: null,
            slotId: null,
            start: null,
            end: null,
            title: null,
          });
        }
      }
    }
  };
  //Toasts
  const showToast = (type) => {
    if (type === 'verify') {
      Snackbar.show({
        text: labels.notVerified,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Ok',
          textColor: colors.dim,
          onPress: () => {
            dispatch(drGetProfile({user_id: user?.userId, from: role}, true));
            dispatch(getDetail({from: role}));
          },
        },
      });
    } else if (type === 'POC') {
      Snackbar.show({
        text: labels.pocCheck,
        duration: Snackbar.LENGTH_LONG,
        numberOfLines: 10,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        action: {
          text: 'Ok',
          textColor: colors.dim,
          onPress: () => {
            navigation.navigate('DrMyProfile');
          },
        },
      });
    }
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <HeaderHome
          showLeftIcon={assets.menu}
          showRightIcon={estDoc != null ? null : assets.Notification}
          showCenterIcon={assets.inner_logoWhite}
          leftRoute={() => {
            navigation.toggleDrawer();
            profile?.status === false &&
              dispatch(
                drGetProfile({user_id: user?.userId, from: role}, false),
              );
          }}
          rightRoute={() =>
            estDoc != null ? null : navigation.navigate('DrNotification')
          }
          showSearch={false}
          doctor={true}
          ExtraStyle={[
            estDoc != null ? styles.height(230) : styles.height(200),
          ]}
          title={labels.welcome}
          meanHeading={
            profile?.firstName
              ? `Dr. ${profile?.firstName} ${profile?.lastName}`
              : `${profile?.name}`
          }
          subHeading={
            estDoc != null ? `Dr. ${estDoc?.provider?.fullName}` : false
          }
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <Tabber
          tab1={labels.poc}
          tab2={labels.appointment}
          onTabPress={(e) => handleTabChange(e)}
          selectedIndex={index}
        />
        {index === 0 && (
          <DrHome
            navigation={navigation}
            index={index}
            setCdate={(e) => {
              // setConsultationDate(e);
            }}
          />
        )}
        {index === 1 && (
          <DrHome
            navigation={navigation}
            index={index}
            setCdate={(e) => {
              // setConsultationDate(e);
            }}
          />
        )}

        {/* ADD BUTTON */}
        <AddBtn
          type={false}
          onBtnPress={() => {
            profile?.status
              ? checkValidation(index, true)
              : showToast('verify');
          }}
        />

        {/* POPUPS MODAL */}
        <Modal
          animationType="fade"
          visible={Popups}
          transparent={true}
          onRequestClose={() => setPopups(false)}>
          <View style={styles.centeredView}>
            <View style={[styles.permissionView, styles.shadowbb]}>
              <TouchableOpacity
                style={styles.imageCross}
                onPress={() => setPopups(false)}>
                <Image source={assets.cross} />
              </TouchableOpacity>
              <View style={[styles.mT(30)]}>
                <Text style={[styles.h2, styles.textAlign]}>
                  {labels.stripeAccountPermission}
                </Text>
                <Text
                  style={[styles.paragraph2, styles.textAlign, styles.mT(20)]}>
                  {labels.stripeAccountValidation}
                </Text>
                <View
                  style={[
                    styles.flexRow,
                    styles.alignSelf,
                    styles.mH(45),
                    styles.mT(5),
                  ]}>
                  <ButtonWhite
                    title={labels.can}
                    exstyle={styles.shadowbb}
                    onBtnPress={() => {
                      setPopups(false);
                    }}
                  />
                  <ButtonSmall
                    title={labels.ok}
                    onBtnPress={() => {
                      setPopups(false);
                      navigation.navigate('StripeConnect');
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default DrDashboard;
