import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from '../assets/styles';
import {Rating} from 'react-native-elements';
import moment from 'moment';
import {assets} from '../assets/images';
import colors from '../config/Colors';

const ReviewItem = ({image, title, rating = 0, date, description}) => {
  return (
    <View style={[styles.reviewItemWrapper, {marginTop: 14}]}>
      <View style={styles.reviewItemTop}>
        <Image
          source={image ? {uri: image} : assets.dummy}
          style={styles.ItemDetailUserImage}
        />
        <View style={styles.ItemDetailWrapper}>
          <Text style={styles.ItemDetailUserText}>{title}</Text>
          <View style={styles.ItemDetailBottom}>
            <Text style={styles.ItemDetailRatingText}>{rating}</Text>
            <Rating
              type="star"
              startingValue={rating}
              readonly
              tintColor={colors.themeWhite}
              ratingCount={5}
              imageSize={12}
            />
            <Text style={styles.ItemDetailDateText}>
              {moment(date).format('DD-MM-YYYY')}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.aboutText]}>{description}</Text>
    </View>
  );
};
export default ReviewItem;
