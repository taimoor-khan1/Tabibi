import React, {useEffect, useRef, useState} from 'react';
import {View, Image, ScrollView} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader, DrScheduleItem} from '../../components';

const DrSchedules = ({navigation}) => {
  // Declare state variables'
  const [listItem, setListItem] = useState([0, 1, 2, 3]);

  // Declare input reference field

  //Fuctions

  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.schedules}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(20)} />
          <View style={styles.mH(20)}>
            {listItem?.map((item, index) => {
              return (
                <DrScheduleItem
                  name={'Alexandra Paul'}
                  time={'03:00 PM to 05:00 PM'}
                  date={'9 Jan 2021'}
                  beforeTime={'20 minutes before'}
                />
              );
            })}
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
      </View>
    </>
  );
};

export default DrSchedules;
