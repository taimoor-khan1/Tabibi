import React from 'react';
import styles from '../assets/styles';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import NoRecordComponent from './NoRecord';
import {assets} from '../assets/images';

const PrescriptionSelection = ({options, onItemPress = () => {}}) => {
  return (
    <>
      <View style={[styles.mT(15)]}>
        {options?.length > 0 ? (
          options?.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={[[styles.selectionCont]]}
                onPress={() => onItemPress(item)}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onItemPress(item)}
                  style={[styles.selectCont1, styles.borderShadow]}>
                  <View>
                    <View style={[styles.flexRow, styles.justifyCntSP]}>
                      <View>
                        <Text style={[styles.selectTitle1]}>
                          {item.subject}
                        </Text>
                        <Text style={styles.prescriptionSubText}>
                          {item.notes}
                        </Text>
                      </View>
                      <Image source={assets.download} />
                    </View>
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.mT(150)}>
            <NoRecordComponent
              title={'No prescription available'}
              loading={true}
            />
          </View>
        )}
      </View>
    </>
  );
};
export default PrescriptionSelection;
