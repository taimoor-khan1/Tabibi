import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Text, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {
  GreadientHeader,
  ButtonGradient,
  PrescriptionItem,
} from '../../components';

const DrPrescriptionDetail = ({navigation}) => {
  // Declare state variables'
  const [listItem, setListItem] = useState([0, 1, 2]);
  // Declare state variables'
  const [index, setIndex] = useState(0);

  // Declare input reference field
  const refFilter = useRef();
  const indexRef = useRef(index);
  indexRef.current = index;
  //Fuctions

  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.white)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.prescriptionDetail}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => [navigation.goBack()]}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.height(30)} />
          <View style={styles.mH(20)}>
            <View style={[styles.ConsuDetailItmCont, styles.borderShadow]}>
              <View style={[styles.rowCont]}>
                <View style={(styles.flex(1), styles.alignItemsFlexStart)}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={
                      () => {}
                      // navigation.navigate('DrPatientDetail', {id: ''})
                    }>
                    <Image
                      source={assets.avatar}
                      style={[styles.ConsuDetailImg]}
                      borderRadius={50}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex(1)]}>
                  <Text
                    style={[styles.consulDetailTitle]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Alexandra Paul
                  </Text>
                  <Text style={[styles.consulDetailVideo]}>
                    John Watson's Skin Specialist
                  </Text>
                  <Text style={[styles.consulDetailVideo]}>
                    Visits in Fri, 12 Jun
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.earningsCont}>
              {listItem.map((item, index) => {
                return (
                  <>
                    <PrescriptionItem
                      title={'Paracetamol 500 Mg'}
                      duration={'1 week'}
                      description={'3 Tablets a day'}
                    />
                    {listItem.length - 1 == index ? null : (
                      <View style={[styles.spacer, styles.mV(15)]} />
                    )}
                  </>
                );
              })}
            </View>
            <View style={styles.earningsCont}>
              <Text style={[styles.consulDetailTitle]}>
                {labels.signature1}
              </Text>
              {/* <Image style={} source={}/> */}
            </View>
            <View style={styles.margin(20)}>
              <ButtonGradient
                title={labels.send}
                type={false}
                gradient={true}
                onBtnPress={() => navigation.navigate('')}
              />
            </View>
          </View>
          <View style={styles.height(30)} />
        </ScrollView>
      </View>
    </>
  );
};

export default DrPrescriptionDetail;
