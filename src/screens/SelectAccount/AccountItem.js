import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actionSwitchAccount,
  actionSwitchAccountFetched,
  actionSwitchAccountFetching,
} from '@src/redux/actions/account';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { defaultAccountNameSelector, switchAccountSelector, } from '@src/redux/selectors/account';
import { Toast, TouchableOpacity } from '@src/components/core';
import { ExHandler } from '@src/services/exception';
import debounce from 'lodash/debounce';
import Util from '@src/utils/Util';
import { COLORS, FONT } from '@src/styles';

const itemStyled = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginBottom: 30,
  },
  name: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
    maxWidth: '50%',
    marginBottom: 10,
  },
  address: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 5,
    color: COLORS.colorGreyBold,
  },
});

const AccountItem = ({ accountName, PaymentAddress }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onSelect = useNavigationParam('onSelect');
  const defaultAccountName = useSelector(defaultAccountNameSelector);
  const switchingAccount = useSelector(switchAccountSelector);
  if (!accountName) {
    return null;
  }
  const onSelectAccount = async () => {
    try {
      if (switchingAccount) {
        return;
      }
      if (!onSelect) {
        navigation.goBack();
      } else {
        onSelect();
      }
      await Util.delay(0);
      dispatch(actionSwitchAccountFetching());
      if (accountName === defaultAccountName) {
        Toast.showInfo(`Your current account is "${accountName}"`);
        return;
      }
      dispatch(actionSwitchAccount(accountName));
    } catch (e) {
      new ExHandler(
        e,
        `Can not switch to account "${accountName}", please try again.`,
      ).showErrorToast();
    } finally {
      dispatch(actionSwitchAccountFetched());
    }
  };
  const Component = () => (
    <View style={itemStyled.container}>
      <Text style={itemStyled.name} numberOfLines={1}>
        {accountName}
      </Text>
      <Text style={itemStyled.address} numberOfLines={1} ellipsizeMode="middle">
        {PaymentAddress}
      </Text>
    </View>
  );
  if (!switchingAccount) {
    return (
      <TouchableOpacity onPress={debounce(onSelectAccount, 100)}>
        <Component />
      </TouchableOpacity>
    );
  }
  return <Component />;
};

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  PaymentAddress: PropTypes.string.isRequired,
};

export default AccountItem;
