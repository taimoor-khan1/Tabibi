import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Input } from 'react-native-elements';
// import { Rating } from 'react-native-ratings';
import StarRating from 'react-native-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { assets } from '../../assets/images';
import styles from '../../assets/styles';
import { ButtonGradient, GreadientHeader } from '../../components';
import colors from '../../config/Colors';
import labels from '../../config/Labels';
import Snackbar from 'react-native-snackbar';
import fonts from '../../assets/fonts';
import {
  addReview,
  getEstDoctors,
  searchDoctorProfile,
} from '../../store/actions';

const RateAndReview = ({ navigation, route }) => {
  //Redux Store
  const dispatch = useDispatch();
  const { searchDoctorProfile: doctorProfile } = useSelector(
    (state) => state.Patient,
  );
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState('');

  //Back Handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackComponent(),
    );
    const id = route?.params?.drId;
    dispatch(searchDoctorProfile({ id }));
    return () => backHandler.remove();
  }, []);
  const onBackComponent = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    // return true
  };

  //Action on sumbit review
  const onsubmit = () => {
    if (rate === 0) {
      Snackbar.show({
        text: 'Please rate before submitting',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
      return;
    } else {
      const payload = {
        rate: rate,
        review: review,
        appointmentId: route?.params?.consultationId,
        reviewTo: route?.params?.drId,
      };
      dispatch(addReview(payload, navigation));
    }
  };
  const ratingCompleted = (e) => {
    setRate(e);
  };
  return (
    <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
      <GreadientHeader
        showLeftIcon={true}
        showCenterText={labels.rateAndReview}
        showLeftText={labels.back}
        back={true}
        leftRoute={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        }
      />
      <KeyboardAvoidingView
        style={styles.flex(1)}
        behavior={Platform.OS == 'ios' && 'padding'}>
        <ScrollView>
          <View style={styles.rateReviewImageContainer}>
            <Image
              source={
                doctorProfile?.avatar
                  ? { uri: doctorProfile.avatar }
                  : assets.avatar
              }
              style={[styles.rateReviewImage, styles.borderShadow]}
            />
            <Text
              // style={styles.ItemDetailUserText}
              style={[
                styles.textSemiBold,
                styles.fontSize(19),
                styles.textAlign,
                { textTransform: 'capitalize' },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              Dr. {doctorProfile?.firstName + ' ' + doctorProfile?.lastName}
            </Text>
            <Text
              style={styles.ItemDetailUserText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {doctorProfile?.detail?.specialities}
            </Text>
            <Text
              style={[styles.profileText, styles.color(colors.grey)]}
              numberOfLines={1}
              ellipsizeMode="tail">
              5 Years as specialist
            </Text>
            {/* <Rating
              type="custom"
              ratingColor="#fec311"
              ratingBackgroundColor={colors.grey}
              tintColor={colors.themeWhite}
              showRating={(rating) => console.log(rating)}
              // onFinishRating={(e) =>
              //   console.log("starts================================================================>", e)

              //   // setRate(e)
              // }
              style={[styles.mT(4)]}
              startingValue={rate}
              ratingCount={5}
              imageSize={20}
            /> */}
            <StarRating
              type="custom"
              // ratingColor="#fec311"
              fullStarColor='#fec311'
              starSize={20}
              halfStarEnabled={true}
              halfStarColor='#fec311'
              ratingBackgroundColor={colors.grey}
              emptyStarColor='#fec311'
              tintColor={colors.themeWhite}
              showRating={(rating) => console.log(rating)}
              selectedStar={(e) => setRate(e)}
              style={[styles.mT(4)]}
              rating={rate}
              maxStars={5}
            />
          </View>
          <View style={[styles.flex(0.5), styles.pH(30), styles.mT(20)]}>
            <Input
              inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
              containerStyle={[styles.pH(10), styles.height(65)]}
              placeholder={labels.writeYourReviewHere}
              placeholderTextColor={colors.text}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              inputStyle={[
                styles.inputStyle,
                //  {textTransform: 'capitalize'}
              ]}
              selectionColor={colors.green}
              importantForAutofill="no"
              selectTextOnFocus={false}
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={(text) => setReview(text)}
              value={review}
            />
            <ButtonGradient
              gradient={true}
              bottom={true}
              title={labels.submit}
              onBtnPress={() => onsubmit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RateAndReview;
