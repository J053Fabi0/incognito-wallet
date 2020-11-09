import { ActivityIndicator, Text, View, TouchableScale } from '@src/components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button as ButtonElements } from 'react-native-elements';
import styleSheet from './style';

export const ButtonExtension = React.memo((props)=>{
  const titleProps = {allowFontScaling:false,...(props?.titleProps??{})};
  return ( <ButtonElements titleProps={titleProps} {...props}  />);
});
const Button = ({ title, children, textContainerStyle, buttonStyle, style, titleStyle, type, onPress, loadingColor, disabled, isLoading: isLoadingProps, prepend, isAsync, disabledStyle, disabledTitleStyle, ...props }) => {
  const [ isLoading, setLoading ] = useState(false);
  useEffect(() => {
    setLoading(isLoadingProps);
  }, [isLoadingProps]);

  const handlePress = () => {
    if (isLoading || disabled) return null;

    if (typeof onPress === 'function') {
      requestAnimationFrame(() => {
        const pressed = onPress();
        if (pressed instanceof Promise) {
          setLoading(true);
          pressed.finally(() => setLoading(false));
        }
      });
    }
  };

  const renderChild = child => {
    if (typeof child === 'function') {
      return children(isLoading);
    }
    return child;
  };

  return (
    <TouchableScale
      {...props}
      onPress={handlePress}
      style={[
        styleSheet.button,
        type && styleSheet[`${type}Style`],
        disabled && styleSheet.disabled,
        disabled && disabledStyle,
        buttonStyle,
        style,
      ]}
    >
      {
        children ? renderChild(children) : (
          <>
            { prepend }
            <View style={
              [
                styleSheet.textContainer,
                textContainerStyle
              ]}
            >
              <Text
                style={[
                  styleSheet.text,
                  disabled ? disabledTitleStyle : {},
                  titleStyle,
                ]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {title}
              </Text>
            </View>
            { isAsync && isLoading && <ActivityIndicator style={[styleSheet.loadingIcon]} color={loadingColor} size='small' /> }
          </>
        )
      }
    </TouchableScale>
  );
};

Button.defaultProps = {
  loadingColor: COLORS.white,
  isLoading: false,
  isAsync: false,
  prepend: null,
  onPress: null,
  style: null,
  titleStyle: null,
  title: null,
  children: null,
  type: null,
  disabled: false,
  disabledStyle: null,
  disabledTitleStyle: null,
  buttonStyle: null,
  textContainerStyle: null,
};

Button.propTypes = {
  disabled: PropTypes.bool,
  isAsync: PropTypes.bool,
  prepend: PropTypes.node,
  isLoading: PropTypes.bool,
  loadingColor: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  buttonStyle: PropTypes.object,
  textContainerStyle: PropTypes.object,
  titleStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  type: PropTypes.oneOf(['primary', 'danger', 'secondary']),
  disabledStyle: PropTypes.shape({}),
  disabledTitleStyle: PropTypes.shape({}),
};

export default Button;
