import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.grey,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: COLORS.black,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
});

const BtnGrey = props => {
  const { btnStyle, titleStyle, title, ...rest } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.btn, btnStyle]}>
        <Text style={[styled.title, titleStyle]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

BtnGrey.defaultProps = {
  btnStyle: null,
  titleStyle: null,
};
BtnGrey.propTypes = {
  btnStyle: PropTypes.object,
  titleStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  title: PropTypes.string.isRequired,
};

export default BtnGrey;
