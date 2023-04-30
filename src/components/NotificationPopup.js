import React, {useState, useEffect} from 'react';
import {View, Text, Image, Modal, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import labels from '../config/Labels';
import {ButtonWhite, ButtonSmall} from '../components';
import {assets} from '../assets/images';
import colors from '../config/Colors';

const NotificaionPopups = () => {
  const [stateModal, setstateModal] = useState(false);
  const [ModalData, setModalData] = useState(null);
  const [navigation, setNav] = useState(null);
  const [data, setData] = useState(null);

  global.rootModalHandler = (state, value, navigation, data) => {
    setstateModal(true);
    setModalData(value);
    setNav(navigation);
    setData(data);
  };

  return (
    <Modal
      animationType="fade"
      visible={stateModal}
      transparent={true}
      onRequestClose={() => {
        setModalData(null), setstateModal(false);
      }}>
      <View style={styles.centeredView}>
        <View style={[styles.notificationView, styles.shadowbb]}>
          <TouchableOpacity
            hitSlop={styles.hitSlop}
            style={styles.imageCross}
            onPress={() => setstateModal(false)}>
            <Image source={assets.cross} />
          </TouchableOpacity>
          <View style={[styles.mT(10)]}>
            <Text
              style={[
                styles.h2,
                styles.textAlign,
                {textTransform: 'capitalize'},
              ]}>
              {data?.type}
            </Text>
            <Text
              style={[
                styles.h3,
                styles.textAlign,
                styles.color(colors.heading),
              ]}>
              {ModalData?.title}
            </Text>
            <Text style={[styles.paragraph2, styles.textAlign, styles.mT(5)]}>
              {ModalData?.body}
            </Text>
            {data?.type === 'pending-payment' && data?.appointment && (
              <View
                style={[
                  styles.flexRow,
                  styles.alignSelf,
                  styles.mH(45),
                  styles.mT(5),
                ]}>
                <ButtonSmall
                  title={labels.paynow}
                  onBtnPress={() => {
                    setstateModal(false);
                    navigation.navigate('CreditCard', {
                      from: false,
                      push: true,
                      walkin: false,
                      consultationId: ModalData?.appointment?.id,
                      slotId: ModalData?.appointment?.slotId,
                    });
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotificaionPopups;
