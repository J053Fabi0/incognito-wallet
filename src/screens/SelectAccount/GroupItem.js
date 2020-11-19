import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, THEME } from '@src/styles';

const styled = StyleSheet.create({
  title: {
    ...THEME.text.boldTextStyleSuperMedium,
  },
  group: {
    marginBottom: 30
  },
});

const GroupItem = ({ name, child }) => {
  const [expand, setExpand] = useState(true);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <View>
      <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter, styled.group]} onPress={toggleExpand}>
        <Text style={styled.title}>{name}</Text>
        <Ionicons
          name={expand ? 'ios-arrow-up' : 'ios-arrow-down'}
          color={COLORS.newGrey}
          size={20}
          style={styled.arrow}
        />
      </TouchableOpacity>
      {expand && (
        <View>
          {child}
        </View>
      )}
    </View>
  );
};

GroupItem.propTypes = {
  name: PropTypes.string.isRequired,
  child: PropTypes.any.isRequired,
};

export default GroupItem;
