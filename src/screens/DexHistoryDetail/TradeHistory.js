import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { View, Text } from '@components/core';
import TransactionID from './TransactionID';
import stylesheet from './style';

const TradeHistory = ({
  txId,
  inputToken,
  inputValue,
  outputToken,
  outputValue,
  status,
  time,
  networkFee,
  networkFeeUnit,
  tradingFee,
  stopPrice,
}) => (
  <View style={stylesheet.wrapper}>
    <Text numberOfLines={2} style={stylesheet.title}>
      Trade {inputToken} for {outputToken}
    </Text>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TYPE</Text>
      <Text style={stylesheet.textRight}>Trade</Text>
    </View>
    <TransactionID txId={txId} />
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TIME</Text>
      <Text style={stylesheet.textRight}>{moment(time).format('DD MMM YYYY hh:mm A')}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>STATUS</Text>
      <Text style={[stylesheet.textRight, stylesheet[status]]} numberOfLines={2}>{_.capitalize(status)}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>YOU PAID</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{inputValue} {inputToken}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>YOU GET (ESTIMATED)</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{outputValue} {outputToken}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>NETWORK FEE</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{networkFee} {networkFeeUnit}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TRADING FEE</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{tradingFee} {inputToken}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>MINIMUM AMOUNT</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{stopPrice} {outputToken}</Text>
    </View>
  </View>
);

TradeHistory.defaultProps = {
  status: ''
};

TradeHistory.propTypes = {
  inputToken: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  outputToken: PropTypes.string.isRequired,
  outputValue: PropTypes.string.isRequired,
  networkFee: PropTypes.string.isRequired,
  networkFeeUnit: PropTypes.string.isRequired,
  tradingFee: PropTypes.string.isRequired,
  stopPrice: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  status: PropTypes.string,
};

export default TradeHistory;
