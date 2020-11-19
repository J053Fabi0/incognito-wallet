import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Header, { useSearchBox } from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import { useNavigationParam } from 'react-navigation-hooks';
import { flatMap, groupBy } from 'lodash';
import includes from 'lodash/includes';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import accountService from '@services/wallet/accountService';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/AccountItem';
import { styled } from './SelectAccount.styled';

const ListAccount = ({ ignoredAccounts }) => {
  const listAccount = useSelector(listAllMasterKeyAccounts);
  const [result, keySearch] = useSearchBox({
    data: listAccount,
    handleFilter: () => [
      ...listAccount.filter(
        (account) =>
          !ignoredAccounts.includes(accountService.getAccountName(account).toLowerCase()) &&
          includes(accountService.getAccountName(account).toLowerCase(), keySearch),
      ),
    ],
  });

  const groupAccounts = useMemo(() => {
    if (result && result.length > 0) {
      const groupedMasterKeys = groupBy(result, item => item.MasterKeyName);
      return flatMap(groupedMasterKeys, (child, key) => ({
        name: key,
        child,
      }));
    }

    return [];
  }, [result, result.length]);

  return (
    <ScrollView style={styled.scrollview} showsVerticalScrollIndicator={false}>
      {groupAccounts.map(item => (
        <GroupItem
          name={item.name}
          key={item.name}
          child={item.child.map((account) => (
            <AccountItem
              key={account?.FullName}
              accountName={account.AccountName}
              PaymentAddress={account.PaymentAddress}
            />
          ))}
        />
      ))}
    </ScrollView>
  );
};

const SelectAccount = () => {
  const ignoredAccounts = useNavigationParam('ignoredAccounts') || [];
  return (
    <View style={styled.container}>
      <Header
        title="Search keychains"
        titleStyled={styled.titleStyled}
        canSearch
      />
      <ListAccount ignoredAccounts={ignoredAccounts} />
    </View>
  );
};

AccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  PaymentAddress: PropTypes.string.isRequired,
};

ListAccount.propTypes = {
  ignoredAccounts: PropTypes.array.isRequired,
};

export default withLayout_2(SelectAccount);
