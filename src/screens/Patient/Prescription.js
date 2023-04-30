import React, {useEffect, useRef, useState} from 'react';
import {View, Image, ScrollView} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {GreadientHeader, PrescriptionSelection} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {getPrescription} from '../../store/actions';

const Prescription = ({navigation}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {role} = useSelector((state) => state.Auth);
  const {prescriptions} = useSelector((state) => state.Doctor);

  // Declare state variables'
  const [servieId, setServieId] = useState(
    prescriptions?.prescription?.[0]?.id,
  );

  //Functions and API calling
  useEffect(() => {
    dispatch(getPrescription(true));
  }, []);
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.prescriptions}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <ScrollView>
          <View style={styles.height(20)} />
          <View style={styles.mH(20)}>
            <PrescriptionSelection
              options={prescriptions?.prescription}
              isSelected={servieId}
              onItemPress={(value, ind) => {
                navigation.navigate('HistoryDetail', {
                  data: {
                    title: value.subject,
                    cat: value.notes,
                    date: value.createdAt,
                    doc: value.document,
                    providerId: value.providerId,
                    signature: value?.signature,
                  },
                });
              }}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Prescription;
