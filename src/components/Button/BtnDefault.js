import React from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {FONT, COLORS} from '@src/styles';

const styled = StyleSheet.create({
  title: {
    color: '#fff',
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular + 2,
  },
  btnStyle: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#25CDD6',
    borderRadius: 4,
  },
  disabled: {
    backgroundColor: COLORS.lightGrey5,
  },
  indicator: {
    marginLeft: 15,
  },
});

const BtnLinear = props => {
  const {title, titleStyle, btnStyle, disabled, loading, ...rest} = props;
  return (
    <TouchableOpacity
      style={[styled.btnStyle, disabled ? styled.disabled : null, btnStyle]}
      {...{...rest, disabled}}
      activeOpacity={0.9}
    >
      <Text
        style={[styled.title, titleStyle]}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {title}
      </Text>
      {loading && (
        <ActivityIndicator
          size="small"
          color={COLORS.white}
          style={styled.indicator}
        />
      )}
    </TouchableOpacity>
  );
};

BtnLinear.defaultProps = {
  title: '',
  titleStyle: {},
  btnStyle: {},
  disabled: false,
  loading: false,
};

BtnLinear.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  btnStyle: PropTypes.any,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default BtnLinear;
