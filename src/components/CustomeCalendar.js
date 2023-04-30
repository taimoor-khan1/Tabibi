import React, {useState, useRef} from 'react';
import styles from '../assets/styles';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import labels from '../config/Labels';
import moment from 'moment';

const CustomCalendar = ({datesGet, onDateSelected = () => {}}) => {
  const [current, setCurrent] = useState(datesGet?.[0]?.consultationDate);
  const scrollRef = useRef();
  console.log('datesGet', datesGet);
  const onDateSelectedLocal = (date) => {
    setCurrent(date);
    onDateSelected(date);
  };
  return (
    <>
      <FlatList
        ref={scrollRef}
        data={datesGet && datesGet}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={(item) => (
          <TouchableOpacity
            style={[
              styles.calenderDatesStyle,
              styles.selectedDate(
                current === item?.item?.consultationDate ? true : false,
              ),
            ]}
            onPress={() => {
              onDateSelectedLocal(item?.item?.consultationDate);
              scrollRef?.current?.scrollToIndex({
                animated: true,
                index: item?.index,
              });
            }}>
            <View style={styles.calenderDatesDot} />
            <Text style={styles.CustomeDateTxt}>
              {moment(item?.item?.consultationDate).format('ll')}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.disabletext, styles.mT(10)]}>
            {labels.notFound}
          </Text>
        }
      />
    </>
  );
};
export default CustomCalendar;
