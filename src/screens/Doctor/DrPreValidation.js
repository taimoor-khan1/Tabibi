import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {flags} from '../../assets/flags';
import {CountryCodes} from '../../assets/flags/CountryCodes';
import {ButtonGradient, HeaderBack, Button} from '../../components';

const {width, height} = Dimensions.get('window');

const DrPreValidation = ({navigation}) => {
  // Declare state variables
  const [mobileNo, setMobileNo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
  const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
  // Declare input reference field
  function renderFlagItem({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          setCountryCode(item.phoneCode);
          setSelectedCountry(item);
          setModalVisible(false);
        }}>
        <View style={styles.countryFlagView}>
          <Text style={[styles.fontSize(12)]}>
            <Image source={flags[item.code]} resizeMode="contain" />
            {'  '}
            {item.name}
          </Text>
          <Text style={styles.fontSize(12)}>{item.phoneCode}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container]}>
      <Image source={assets.login_bg} style={[styles.position]} />
      <StatusBar backgroundColor={colors.themeColor} />
      <HeaderBack
        showLeftIcon={true}
        showCenterIcon={assets.inner_logoWhite}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />
      <View style={[styles.mH(30)]}>
        <Text style={[styles.Heading, styles.mT(10), styles.mB(50)]}>
          {labels.preValidation}
        </Text>
        <View style={[styles.mobileFeildCont1]}>
          <View style={[styles.flex(0.3), styles.mR(10)]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.dropDown]}
              onPress={() => {
                setModalVisible(true);
              }}>
              <View style={styles.flexRow}>
                <Text style={styles.dropDownText}>{selectedCountry.emoji}</Text>
                <Text style={[styles.fontSize(14), styles.mL(4)]}>
                  {selectedCountry.phoneCode}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.flex(0.7), styles.height(65)]}>
            <Input
              inputContainerStyle={[
                [styles.inputContainer, styles.borderShadow],
              ]}
              containerStyle={[styles.pH(0)]}
              placeholder={labels.Mobile}
              placeholderTextColor={colors.text}
              underlineColorAndroid="transparent"
              autoCorrect={false}
              inputStyle={[styles.inputStyle]}
              selectionColor={colors.green}
              maxLength={10}
              keyboardType="phone-pad"
              importantForAutofill="no"
              selectTextOnFocus={false}
              returnKeyType="next"
              autoCapitalize="none"
              onChangeText={(text) => setMobileNo(text)}
              value={mobileNo}
              // onSubmitEditing={() => {
              // }}
            />
          </View>
        </View>
        <ButtonGradient
          title={labels.send}
          type={false}
          onBtnPress={() =>
            navigation.navigate('DrVerifcation', {from: 'DrEstablishment'})
          }
        />
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <View style={styles.mT(22)}>
            <FlatList
              data={CountryCodes}
              renderItem={renderFlagItem}
              keyExtractor={(item) => item.code}
            />
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default DrPreValidation;
