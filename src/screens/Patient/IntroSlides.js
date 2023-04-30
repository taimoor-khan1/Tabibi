import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, StatusBar, View} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import colors from '../../config/Colors';
import labels from '../../config/Labels';
import {Button} from '../../components';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
const slides = [
  {
    key: 's1',
  },
  {
    key: 's2',
  },
];
const _renderItem = ({item}) => {
  const data = item;
  return (
    <View>
      <StatusBar backgroundColor={colors.themeColor} />
      {item.key == 's1' && (
        <>
          <Image
            source={assets.intro_bg}
            style={[styles.introBgWhite]}
            resizeMode={'contain'}
          />
          <Image
            source={assets.bookAppointment}
            resizeMode={'contain'}
            style={styles.introS1}
          />
          <Text style={[styles.Heading1, styles.mT(15), styles.mB(20)]}>
            {labels.intro1Head}
          </Text>
          <Text
            style={[
              styles.PoppinsLight,
              styles.fontSize(16),
              styles.textAlign,
              styles.color(colors.black),
            ]}>
            {labels.intro1SubText}
          </Text>
        </>
      )}
      {item.key == 's2' && (
        <>
          <Image
            source={assets.intro_bg}
            style={[styles.introBgWhite]}
            resizeMode={'contain'}
          />
          <Image
            source={assets.opportunity}
            resizeMode={'contain'}
            style={styles.introS1}
          />
          <Text style={[styles.Heading1, styles.mT(25), styles.mB(20)]}>
            {labels.intro2Head}
          </Text>
          <Text
            style={[
              styles.PoppinsLight,
              styles.fontSize(16),
              styles.textAlign,
              styles.color(colors.black),
            ]}>
            {labels.intro2SubText}
          </Text>
        </>
      )}
    </View>
  );
};
const IntroSlides = ({navigation}) => {
  // Declare state variables
  const [index, setIndex] = useState(0);
  // Declare input reference field
  const refSwipe = useRef();
  const handleSwipe = (index, val) => {
    refSwipe.goToSlide(index);
  };
  const nav = async () => {
    await AsyncStorage.setItem('intro', JSON.stringify('true'));
    navigation.reset({
      index: 0,
      routes: [{name: 'DrawerStack'}],
    });
  };
  return (
    <View style={[styles.container]}>
      <Image source={assets.splash_bg} style={[styles.position]} />
      <View style={styles.flex(0.3)}>
        <Image
          source={assets.splash_logo}
          style={[styles.introLogo, styles.mT(50)]}
          resizeMode={'contain'}
        />
      </View>
      <View style={styles.flex(1)}>
        <AppIntroSlider
          ref={refSwipe}
          // style={{backgroundColor: 'red'}}
          renderItem={_renderItem}
          activeDotStyle={[
            styles.top(15),
            styles.backgroundColor(colors.white),
          ]}
          dotStyle={[styles.top(15), styles.backgroundColor(colors.whiteTr)]}
          data={slides}
          showPrevButton={false}
          showSkipButton={false}
          showNextButton={false}
          showDoneButton={false}
          onSlideChange={(index) => setIndex(index)}
          // onDone={_onDone}
        />
      </View>
      <View style={styles.flex(0.15)}>
        <View style={[styles.flexRow, styles.mH(30), styles.mB(7)]}>
          <View style={[styles.flex(index === 0 ? 0.5 : 1), styles.alignSelf]}>
            <Button title={labels.skip} onBtnPress={() => nav()} />
          </View>
          {index === 0 && (
            <View style={styles.flex(0.5)}>
              <Button
                title={labels.next}
                onBtnPress={() => {
                  index === 1 ? nav() : refSwipe.current.goToSlide(index + 1);
                  setIndex(index + 1);
                }}
              />
              {/* <Button
                title={index === 1 ? labels.done : labels.next}
                onBtnPress={() => {
                  index === 1 ? nav() : refSwipe.current.goToSlide(index + 1);
                  setIndex(index + 1);
                }}
              /> */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default IntroSlides;
