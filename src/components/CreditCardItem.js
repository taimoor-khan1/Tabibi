import React, {useEffect, useState} from 'react';
import styles from '../assets/styles';
import colors from '../config/Colors';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {assets} from '../assets/images';
import labels from '../config/Labels';
import fonts from '../assets/fonts';

const CreditCardItem = ({
  options,
  isSelected = false,
  lovedOne = false,
  prescriptions = false,
  from = false,
  onItemPress = () => {},
}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(options);
  }, [options]);
  return (
    <>
      <View style={[styles.mT(15)]}>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              key={index}
              style={[[styles.selectionCont]]}
              onPress={() =>
                from == false && prescriptions
                  ? onItemPress(item)
                  : onItemPress(item.servieId)
              }>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  from == false && prescriptions
                    ? onItemPress(item)
                    : onItemPress(item.servieId)
                }
                style={
                  prescriptions
                    ? [styles.selectCont1, styles.borderShadow]
                    : [styles.selectCont, styles.borderShadow]
                }>
                {lovedOne ? (
                  <>
                    <View style={[styles.flexRow]}>
                      {from === false ? (
                        <Image
                          source={
                            isSelected === item.servieId
                              ? assets.checkedBox
                              : assets.checkbox
                          }
                          style={styles.mR(5)}
                        />
                      ) : (
                        <View style={styles.mR(20)} />
                      )}
                      <Text style={[styles.selectTitle]}>{item.title}</Text>
                    </View>
                    {!item.complete && (
                      <Text style={[styles.selectSubtext]}>
                        {labels.notComplete}
                      </Text>
                    )}
                  </>
                ) : (
                  <View>
                    <View style={[styles.flexRow, styles.justifyCntSP]}>
                      <View>
                        <Text
                          style={[
                            prescriptions
                              ? styles.selectTitle1
                              : styles.selectTitle,
                          ]}>
                          {item.title}
                        </Text>
                        {prescriptions && (
                          <Text
                            style={{
                              marginLeft: 12,
                              marginBottom: 4,
                              color: colors.subText,
                              fontFamily: fonts.PoppinsRegular,
                              fontSize: 11,
                            }}>
                            {item.subtext}
                          </Text>
                        )}
                      </View>

                      {prescriptions ? (
                        <Image source={assets.download} />
                      ) : (
                        <>
                          {from == false && (
                            <Image
                              source={
                                isSelected === item.servieId
                                  ? assets.checkedBox
                                  : assets.checkbox
                              }
                            />
                          )}
                        </>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
export default CreditCardItem;
