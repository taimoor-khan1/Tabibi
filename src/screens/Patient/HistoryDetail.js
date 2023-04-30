import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader} from '../../components';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {searchDoctorProfile} from '../../store/actions';

const HistoryDetail = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {searchDoctorProfile: profile} = useSelector((state) => state.Patient);

  // Declare state variables'
  const [document, setDocument] = useState(route?.params?.data?.doc);
  const [signature, setSignature] = useState(route?.params?.data?.signature);

  //Action for Get Doctor Profile
  useEffect(() => {
    const id = route.params.data.providerId;
    dispatch(searchDoctorProfile({id}));
  }, []);

  const showToast = () => {
    Snackbar.show({
      text: labels.URLnotFount,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: colors.red,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
    });
  };
  return (
    <>
      <View
        showsVerticalScrollIndicator={false}
        style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <GreadientHeader
            showLeftIcon={true}
            showCenterText={labels.historyDetial}
            showLeftText={labels.back}
            leftRoute={() => {
              route?.params?.toHome
                ? navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'DrawerStack',
                      },
                    ],
                  })
                : navigation.goBack();
            }}
            back={true}
            profile={true}
            profileImage={profile?.avatar}
            prescription={true}
            title={profile?.firstName + ' ' + profile?.lastName}
            category={profile?.detail?.specialities}
            subText={moment(route.params.data.date).format('ll')}
          />
          <View style={[styles.mH(30), styles.mT(150)]}>
            {document?.location ? (
              <TouchableOpacity
                onPress={() =>
                  document?.location
                    ? Linking.openURL(document?.location)
                    : showToast()
                }
                activeOpacity={0.7}
                style={[styles.historyCont, styles.borderShadow]}>
                <View style={[styles.flexRow, styles.alignItemCenter]}>
                  <Image
                    source={
                      document?.ext === 'image/jpeg'
                        ? assets.preImg
                        : assets.downloadred
                    }
                    style={document?.ext === 'image/jpeg' ? {margin: 10} : {}}
                  />
                  <View>
                    <Text
                      style={[styles.historySubtext, styles.width(200)]}
                      ellipsizeMode={'tail'}
                      numberOfLines={1}>
                      {document?.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}
            <Text style={[styles.availablityHeading, styles.mB(7)]}>
              {labels.signature1}:
            </Text>
            <View style={[styles.signatureView]}>
              <Image
                source={{uri: signature}}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>
        <Image source={assets.bottom_image} style={styles.bottomImg} />
      </View>
    </>
  );
};

export default HistoryDetail;
