import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
  },
  selectNetworkButtonLabel: {
    fontSize: 14,
    letterSpacing: 0,
    backgroundColor: 'pink',
  },
  selectNetworkButton: {
    paddingVertical: 4,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectNetworkValue: {
    fontSize: 16,
    letterSpacing: 0,
  },
  selectNetworkValueIcon: {},
  typesContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.colorGreyBold,
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  selectType: {
    marginTop: 15,
    marginBottom: 10,
  },
  scrollview: {
    flex: 1,
  },
});