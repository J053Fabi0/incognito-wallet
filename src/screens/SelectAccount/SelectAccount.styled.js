import { StyleSheet } from 'react-native';
import { FONT, COLORS, THEME } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    marginTop: 15,
  },
  titleStyled: {},
  subDesc: {
    ...THEME.text.boldTextStyleSuperMedium,
  },
  group: {
    marginBottom: 30
  },
});
