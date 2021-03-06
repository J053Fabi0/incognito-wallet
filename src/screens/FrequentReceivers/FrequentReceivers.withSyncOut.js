/* eslint-disable import/named */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { pTokensSelector } from '@src/redux/selectors/token';
import { withdrawReceiversSelector } from '@src/redux/selectors/receivers';
import {
  detectNetworkNameSelector,
  actionToggleDetectNetworkName,
} from '@screens/GetStarted';
import { CONSTANT_KEYS } from '@src/constants';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { trim } from 'lodash';
import { actionUpdate } from '@src/redux/actions/receivers';
import { getExternalSymbol } from './FrequentReceivers.utils';

const enhance = (WrappedComp) => (props) => {
  const pTokens = useSelector(pTokensSelector);
  const dispatch = useDispatch();
  const { receivers } = useSelector(withdrawReceiversSelector);
  const detectNetworkName = useSelector(detectNetworkNameSelector)[
    CONSTANT_KEYS.DETECT_NETWORK_NAME
  ];
  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySeleclor.getPrivacyDataByTokenID,
  );

  const getRootNetworkNameByAddress = ({ address }) => {
    let rootNetworkName = '';
    try {
      const externalSymbol = getExternalSymbol(address);
      const token = pTokens.find((token) => {
        return token?.symbol === externalSymbol;
      });
      const tokenData = getPrivacyDataByTokenID(token?.tokenId);
      if (tokenData) {
        rootNetworkName = tokenData?.rootNetworkName;
      }
    } catch (error) {
      console.debug(error);
    }
    return rootNetworkName;
  };

  const handleDetectNetwork = async () => {
    try {
      if (detectNetworkName) {
        return;
      }
      await new Promise.all([
        receivers.map(async (receiver) => {
          const { address } = receiver;
          const rootNetworkName = getRootNetworkNameByAddress({
            address: trim(address),
          });
          const _receiver = { ...receiver, rootNetworkName };
          await dispatch(
            actionUpdate({
              keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
              receiver: _receiver,
            }),
          );
        }),
      ]);
      await dispatch(
        actionToggleDetectNetworkName({
          keySave: CONSTANT_KEYS.DETECT_NETWORK_NAME,
        }),
      );
    } catch (error) {
      console.debug(error);
    }
  };
  React.useEffect(() => {
    handleDetectNetwork();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
