import { newMnemonic } from 'incognito-chain-web-js/build/wallet';

export const generateNewMnemonic = () => {
  return newMnemonic();
};
