import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import _ from 'lodash';
import convert from '@src/utils/convert';

export const MAX_DIGITS_BALANCE_PSTAKE = 9;
export const TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE = 70;
export const DEFAULT_REWARD_RATE = 57;
export const ERROR_MESSAGE = {
  txId: 'Opps! Something went wrong. Can not create a tx!',
  signPublicKeyEncode:
    'Opps! Something went wrong. Can not get sign public key encode!',
  signEncode: 'Opps! Something went wrong. Can not get sign encode!',
  createUnStake: 'Something went wrong. Try again later',
  createStake:
    'Something went wrong. Try again from your history in the top right menu.',
};
export const STAKE = {
  MAIN_ACCOUNT: 'pStake',
};

export const isStakeAccount = account => {
  if (!account) {
    return false;
  }
  return (
    account?.AccountName === STAKE.MAIN_ACCOUNT ||
    account?.name === STAKE.MAIN_ACCOUNT
  );
};

export const isNotFoundStakeAccount = pStakeAccount =>
  _.isEmpty(pStakeAccount) || _.isEmpty(pStakeAccount?.PrivateKey);

export const mappingData = (dataMasterAddress, dataStakerInfo) => {
  const { pDecimals, symbol } = CONSTANT_COMMONS.PRV;
  const balance = dataStakerInfo?.Balance || 0;
  const minToStake = dataMasterAddress?.MinToStake || 0;
  const balanceToHumanAmount = _.floor(convert.toHumanAmount(balance, 9));
  const minToStakeToHunmanAmount = _.floor(
    convert.toHumanAmount(minToStake, 9),
  );
  const rewardBalance = dataStakerInfo?.RewardBalance || 0;
  const totalBalance = balance;
  const staked = balance !== 0;
  const defaultRewardRate = DEFAULT_REWARD_RATE;
  const currentRewardRate = staked
    ? dataStakerInfo?.RewardRate
    : dataMasterAddress?.CurrentRewardRate || defaultRewardRate;
  const currentCompoundRate = dataMasterAddress?.CurrentCompoundRate || 57;
  const shouldCalInterestRate = staked;
  // balanceToHumanAmount >= minToStakeToHunmanAmount;
  const pendingBalance = dataStakerInfo?.PendingBalance || 0;
  const unstakePendingBalance = dataStakerInfo?.UnstakePendingBalance || 0;
  const showAllPending = pendingBalance !== 0 && unstakePendingBalance !== 0;
  return {
    minToStake: minToStake,
    minToWithdraw: 1,
    currentRewardRate,
    currentCompoundRate,
    stakingMasterAddress: dataMasterAddress?.StakingMasterAddress || '',
    balance,
    rewardDate: dataStakerInfo?.RewardDate || '',
    pDecimals,
    symbol,
    maxToStake: 0,
    rewardDateToMilSec: new Date(dataStakerInfo?.RewardDate).getTime(),
    balanceToHumanAmount,
    minToStakeToHunmanAmount,
    shouldCalInterestRate,
    rewardBalance,
    totalBalance,
    staked,
    balancePStake: totalBalance,
    defaultRewardRate,
    pendingBalance,
    unstakePendingBalance,
    showAllPending,
    pendingBalanceToHumanAmount: _.floor(
      convert.toHumanAmount(pendingBalance, 9),
    ),
    unstakePendingBalanceToHumanAmount: _.floor(
      convert.toHumanAmount(unstakePendingBalance, 9),
    ),
  };
};

export const calTotalBalance = ({
  nowToMilSec,
  balance = 0,
  rate = 50,
  rewardDateToMilSec,
}) => {
  try {
    const duration = nowToMilSec - rewardDateToMilSec;
    if (duration < 0) {
      return balance;
    }
    const totalBalance =
      balance * Math.pow(1 + rate / 100 / 365 / 24 / 3600 / 1000, duration);
    if (!isNaN(Number(totalBalance))) {
      return totalBalance;
    }
    return balance;
  } catch (error) {
    new ExHandler(error).showErrorToast();
    return balance;
  }
};

export const delay = timeout => new Promise(res => setTimeout(res, timeout));
