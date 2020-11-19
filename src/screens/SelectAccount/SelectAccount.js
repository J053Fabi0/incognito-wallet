import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSearchBox } from '@src/components/Header';
import { useNavigationParam } from 'react-navigation-hooks';
import { flatMap, groupBy } from 'lodash';
import includes from 'lodash/includes';
import { listAllMasterKeyAccounts } from '@src/redux/selectors/masterKey';
import accountService from '@services/wallet/accountService';
import GroupItem from '@screens/SelectAccount/GroupItem';
import AccountItem from '@screens/SelectAccount/AccountItem';
import MainLayout from '@components/MainLayout/index';

const SelectAccount = () => {
  const ignoredAccounts = useNavigationParam('ignoredAccounts') || [];
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
    <MainLayout header="Search keychain" canSearch scrollable>
      {groupAccounts.map(item => (
        <GroupItem
          name={item.name}
          key={item.name}
          child={item.child.map((account) => (
            <AccountItem
              key={account?.FullName}
              accountName={account.AccountName}
              PaymentAddress={account.PaymentAddress}
              PrivateKey={account.PrivateKey}
              MasterKeyName={account.MasterKeyName}
            />
          ))}
        />
      ))}
    </MainLayout>
  );
};

export default SelectAccount;
