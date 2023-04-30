import React, {useEffect, useState} from 'react';
import {BackHandler, Image, Text, View} from 'react-native';
import {Input} from 'react-native-elements';
import {Rating} from 'react-native-ratings';
import {useDispatch, useSelector} from 'react-redux';
import {assets} from '../../assets/images';
import styles from '../../assets/styles';
import {ButtonGradient, GreadientHeader} from '../../components';
import colors from '../../config/Colors';
import labels from '../../config/Labels';
import {add_review, getPatientDetailById} from '../../store/actions';

const DrRateAndReview = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {patientDetail} = useSelector((state) => state.Doctor);

  // Declare state variables'
  const [review, setReview] = useState('');
  const [rate, setRate] = useState(0);

  //Back Handler Function
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackComponent(),
    );
    const id = route?.params?.drId;
    dispatch(getPatientDetailById({id: id}));
    return () => backHandler.remove();
  }, []);
  const onBackComponent = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DrDashboard'}],
    });
  };

  //Function On Sumbit
  const onsubmit = () => {
    if (review === '') {
      return;
    } else {
      const data = {
        rate: rate,
        review: review,
        consultationId: route?.params?.consultationId,
        reviewTo: route?.params?.drId,
      };
      dispatch(add_review(data, navigation)).then((status) => {
        if (status === 200) {
          // navigation.reset({
          //   index: 0,
          //   routes: [{name: 'DrInvoice'}],
          // });
        }
      });
    }
  };

  //Function On Rating
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
            routes: [{name: 'DrDashboard'}],
          })
        }
      />
      <View style={styles.rateReviewImageContainer}>
        <Image
          source={
            patientDetail?.avatar ? {uri: patientDetail.avatar} : assets.avatar
          }
          style={[styles.rateReviewImage, styles.borderShadow]}
        />
        <Text
          style={[
            styles.textSemiBold,
            styles.fontSize(19),
            styles.textAlign,
            {textTransform: 'capitalize'},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {patientDetail?.firstName + ' ' + patientDetail?.lastName}
        </Text>
        <Text
          style={styles.ItemDetailUserText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {patientDetail?.detail?.specialities}
        </Text>
        <Text
          style={[styles.profileText, styles.color(colors.grey)]}
          numberOfLines={1}
          ellipsizeMode="tail">
          5 Years as specialist
        </Text>

        <Rating
          type="custom"
          ratingColor="#fec311"
          ratingBackgroundColor={colors.grey}
          tintColor={colors.white}
          onFinishRating={(e) => ratingCompleted(e)}
          style={[styles.mT(4)]}
          startingValue={rate}
          ratingCount={5}
          imageSize={20}
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
          inputStyle={[styles.inputStyle, {textTransform: 'capitalize'}]}
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
    </View>
  );
};

export default DrRateAndReview;
