import {Platform} from 'react-native';

const fonts = {
  PoppinsBold: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  PoppinsLight: Platform.OS === 'ios' ? 'Poppins-Light' : 'Poppins-Light',
  PoppinsMedium: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  PoppinsRegular: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  PoppinsSemiBold: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
};
export default fonts;
