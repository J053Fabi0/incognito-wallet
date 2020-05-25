import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, RoundCornerButton } from '@components/core';
import Balance from '@screens/DexV2/components/Balance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import format from '@utils/format';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import withWarning from '@screens/DexV2/components/Trade/warning.enhance';
import Loading from '@screens/DexV2/components/Loading';
import withAccount from '@screens/DexV2/components/account.enhance';
import Help from '@components/Help/index';
import withSuccess from './success.enhance';
import withTrade from './trade.enhance';
import withData from './data.enhance';
import styles from './style';

const Trade = ({
  inputToken,
  inputValue,
  inputText,
  outputToken,
  minimumAmount,
  fee,
  feeToken,
  onTrade,

  trading,

  error,
  warning,
}) => {
  return (
    <View>
      <Header title="Order preview" />
      <View style={styles.mainInfo}>
        <Text style={styles.bigText}>Buy at least</Text>
        <Text style={styles.bigText} numberOfLines={3}>{format.amountFull(minimumAmount, outputToken.pDecimals)} {outputToken.symbol}</Text>
      </View>
      <ExtraInfo
        left="Pay with"
        right={`${inputText} ${inputToken.symbol}`}
        style={{ ...styles.extra, ...styles.bold }}
      />
      <Balance
        token={inputToken}
        balance={inputValue}
        title="Purchase"
        style={styles.extra}
      />
      <ExtraInfo
        token={feeToken}
        left={(
          <View style={styles.row}>
            <Text style={styles.extra}>Fee</Text>
            <Help title="Fee" content="Network fees go to validators. There is no trading fee." />
          </View>
        )}
        right={`${format.amount(fee, feeToken.pDecimals)} ${feeToken.symbol}`}
        style={styles.extra}
      />
      {!!warning && <ExtraInfo left={warning} right="" style={styles.warning} />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <RoundCornerButton
        style={styles.button}
        title="Confirm"
        onPress={onTrade}
      />
      <Loading open={trading} />
    </View>
  );
};

Trade.propTypes = {
  inputToken: PropTypes.object,
  inputValue: PropTypes.number,
  inputText: PropTypes.string,
  onTrade: PropTypes.func.isRequired,
  outputToken: PropTypes.object,
  minimumAmount: PropTypes.number,

  fee: PropTypes.number.isRequired,
  feeToken: PropTypes.object.isRequired,

  trading: PropTypes.bool.isRequired,

  error: PropTypes.string,
  warning: PropTypes.string,
};

Trade.defaultProps = {
  inputToken: null,
  inputValue: null,
  inputText: '',
  outputToken: null,
  minimumAmount: null,
  error: '',
  warning: '',
};

export default compose(
  withLayout_2,
  withData,
  withSuccess,
  withAccount,
  withTrade,
  withWarning,
)(Trade);
