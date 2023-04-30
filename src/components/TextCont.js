import React from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import styles from '../assets/styles';
import {assets} from '../assets/images';
import colors from '../config/Colors';
import labels from '../config/Labels';
import config from '../config';

const render = (item, points, numberOfLines) => {
  return (
    <>
      {points == true ? (
        <View style={[styles.flexRow, styles.mT(5)]}>
          {points && <View style={styles.points} />}
          <Text
            // numberOfLines={numberOfLines}
            ellipsizeMode={'tail'}
            style={
              points == false
                ? [
                    styles.paragraph,
                    styles.PoppinsRegular,
                    styles.color(colors.black),
                  ]
                : [styles.paragraph, styles.PoppinsRegular]
            }>
            {item}
          </Text>
          {item.fees && (
            <Text
              // numberOfLines={2}
              ellipsizeMode={'tail'}
              style={[
                styles.paragraph,
                styles.PoppinsRegular,
                {textAlign: 'right'},
              ]}>
              ${item.fees}
            </Text>
          )}
        </View>
      ) : (
        <View
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.flexRow,
            styles.mT(5),
            {justifyContent: 'space-between'},
          ]}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[
              styles.paragraph,
              styles.PoppinsRegular,
              {color: colors.black},
            ]}>
            {item}
          </Text>
          {item.fees && (
            <Text
              style={[
                styles.paragraph,
                styles.PoppinsMedium,
                styles.textAlignRight,
              ]}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.color(colors.themeColor)}>
                $
              </Text>
              {item.fees}
            </Text>
          )}
        </View>
      )}
    </>
  );
};
const address = (item) => {
  return (
    <View style={styles.mB(10)}>
      <View style={[styles.flexRow, styles.mT(10)]}>
        <Image source={assets.pin} style={[styles.top(5), styles.mR(5)]} />
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.locationHead, {textTransform: 'capitalize'}]}>
          {item?.address ? item?.address : labels.notFound}
        </Text>
      </View>
      {/* {item?.addressTwo && (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.paragraph, styles.fontSize(14), styles.mL(25)]}>
          {item?.addressTwo}
        </Text>
      )} */}
      {item?.city && (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.paragraph,
            styles.fontSize(14),
            styles.mL(25),
            {textTransform: 'capitalize'},
          ]}>
          {`${labels.City}: ${item?.city}`}
        </Text>
      )}
      {item?.zipCode && (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.paragraph,
            styles.fontSize(14),
            styles.mL(25),
            {textTransform: 'capitalize'},
          ]}>
          {`${labels.zipcode}: ${item?.zipCode}`}
        </Text>
      )}
      {item?.phoneNumber && (
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[styles.paragraph, styles.fontSize(14), styles.mL(25)]}>
          {`${labels.Mobile}: ${item?.phoneNumber}`}
        </Text>
      )}
    </View>
  );
};

// FLATLIST CONSULTATION RENDER FUNCTION
const consulationFees = (item) => {
  return (
    <>
      <View
        numberOfLines={1}
        ellipsizeMode={'tail'}
        style={[styles.flexRow, styles.mT(5), styles.justifyCntSP]}>
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={[
            styles.paragraph,
            styles.PoppinsRegular,
            {color: colors.black},
          ]}>
          {item?.title}
        </Text>
        {item?.fee != '' && (
          <Text
            style={[
              styles.paragraph,
              styles.PoppinsMedium,
              styles.textAlignRight,
            ]}>
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.color(colors.themeColor)}>
              $
            </Text>
            {item.fee}
          </Text>
        )}
      </View>
    </>
  );
};

const TextCont = ({
  navigation,
  heading,
  paragraph = '',
  data = [],
  points = false,
  list = false,
  location = false,
  numberOfLines = 1,
  key,
  isParaghaph = false,
  setKey = () => {},
  setRef,
  consultation = false,
}) => {
  // Declare state variables'
  //   const [selectedIndex, setSelectedIndex] = useState(0);
  // Declare input reference field
    // const refSwiper = useRef();

  //Fuctions
  return (
    <>
      <View style={[styles.mB(10)]}>
        <View style={[styles.flexRow, styles.justifyCntSP]}>
          {heading && (
            <Text
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={[styles.h2, styles.mT(18)]}>
              {heading}
            </Text>
          )}
          {config.api.version === 'DOCTOR' && (
            <TouchableOpacity
              style={[styles.flexRow, styles.containerCenter]}
              onPress={setKey}>
              <Image source={assets.add} />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.h3]}>
                {labels.add}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isParaghaph && (
          <Text
            // numberOfLines={5}
            ellipsizeMode={'tail'}
            style={[styles.paragraph, styles.mV(16)]}>
            {paragraph}
          </Text>
        )}
        {list == true && (
          <FlatList
            ListEmptyComponent={
              <Text style={[styles.paragraph]}>{labels.notFound}</Text>
            }
            style={styles.mT(10)}
            data={data && data}
            renderItem={({item, index}) => render(item, points, numberOfLines)}
          />
        )}
        {location && (
          <FlatList
            ListEmptyComponent={
              <Text style={[styles.paragraph]}>{labels.notFound}</Text>
            }
            style={styles.mT(10)}
            data={data && data}
            renderItem={({item, index}) => address(item)}
          />
        )}
        {consultation && (
          <FlatList
            ListEmptyComponent={
              <Text style={[styles.paragraph]}>{labels.notFound}</Text>
            }
            style={styles.mT(10)}
            data={data && data}
            renderItem={({item, index}) => consulationFees(item)}
          />
        )}
      </View>
    </>
  );
};

export default TextCont;
