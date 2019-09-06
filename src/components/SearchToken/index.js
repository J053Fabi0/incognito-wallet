import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { differenceBy } from 'lodash';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getPTokenList } from '@src/redux/actions/token';
import { setWallet } from '@src/redux/actions/wallet';
import { pTokens } from '@src/redux/selectors/token';
import PToken from '@src/models/pToken';
import internalTokenModel from '@src/models/token';
import SearchToken from './SearchToken';
import { Toast, ActivityIndicator, } from '../core';

const normalizeToken = ({ data, isPToken, isInternalToken }) => {
  if (isPToken) {
    return ({
      tokenId: data?.tokenId,
      name: data?.name,
      symbol: data?.symbol,
    });
  }

  if (isInternalToken) {
    return ({
      tokenId: data?.id,
      name: data?.name,
      symbol: data?.symbol,
    });
  }
};

export class SearchTokenContainer extends PureComponent {
  state = {
    tokens: [],
    internalTokens: [],
  };

  componentDidMount() {
    this.getPTokens();
    this.getInternalTokens();
  }
  
  componentDidUpdate(prevProps, prevState) {
    const { pTokens: oldPTokens, followedTokens: oldFollowedTokens } = prevProps;
    const { pTokens, followedTokens } = this.props;
    const { internalTokens: oldInternalTokens } = prevState;
    const { internalTokens } = this.state;

    if (oldPTokens !== pTokens || oldFollowedTokens !== followedTokens || oldInternalTokens !== internalTokens) {
      this.getAvaiableTokens();
    }
  }

  getAvaiableTokens = async () => {
    try {
      const { internalTokens } = this.state;
      const { pTokens, followedTokens } = this.props;
      const followedTokenIds: Array = followedTokens.map(t => t?.id) || [];
      const normalizedTokens = [
        ...internalTokens
          ?.filter(t => !pTokens?.find(pToken => pToken.tokenId === t.id))
          ?.map(t => normalizeToken({ data: t, isInternalToken: true })),
        ...pTokens?.map(t => normalizeToken({ data: t, isPToken: true }))
      ];

      const tokens =  normalizedTokens?.filter(token => {
        return token?.name && token?.symbol && token.tokenId && !followedTokenIds.includes(token.tokenId);
      });

      this.setState({ tokens });

      return tokens || [];
    } catch {
      Toast.showError('Something went wrong. Please refresh the screen.');
    }
  };

  goBack = () => {
    const { navigation } = this.props;

    navigation?.pop();
  }

  handleAddFollowToken = async (tokenIds: Array) => {
    try {
      const { pTokens, account, wallet, setWallet } = this.props;
      const { internalTokens } = this.state;
      const pTokenSelected = tokenIds.map(id => {
        const foundPToken : PToken = pTokens.find((pToken: PToken) => pToken.tokenId === id);
        const foundInternalToken = internalTokens.find(token => token.id === id);
        if (foundPToken) {
          return foundPToken.convertToToken();
        }

        if (foundInternalToken) {
          return internalTokenModel.toJson(foundInternalToken);
        }
      });

      await accountService.addFollowingTokens(pTokenSelected, account, wallet);

      Toast.showSuccess('Token added');

      // update new wallet to store
      setWallet(wallet);

      this.goBack();
    } catch {
      Toast.showError(
        'Something went wrong. Please tap the Add button again.'
      );
    }
  };

  getPTokens = async () => {
    try {
      const { getPTokenList } = this.props;
      await getPTokenList();
    } catch {
      Toast.showError('Something went wrong. Please refresh the screen.');
    }
  }

  getInternalTokens = async () => {
    try {
      const tokens = await tokenService.getPrivacyTokens();
      const { followedTokens } = this.props;

      const internalTokens = differenceBy(tokens, followedTokens, 'id');

      this.setState({ internalTokens });

      return internalTokens;
    } catch {
      Toast.showError('Something went wrong. Please refresh the screen.');
    }
  }

  render() {
    const { tokens } = this.state;
    const { account, wallet } = this.props;

    if (!tokens || !account || !wallet) return <ActivityIndicator />;

    return (
      <SearchToken
        tokens={tokens}
        handleAddFollowToken={this.handleAddFollowToken}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  followedTokens: tokenSeleclor.followed(state),
  pTokens: pTokens(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

const mapDispatchToProps = {
  getPTokenList,
  setWallet
};

SearchTokenContainer.defaultProps = {
  pTokens: [],
  followedTokens: []
};

SearchTokenContainer.propTypes = {
  getPTokenList: PropTypes.func.isRequired,
  pTokens: PropTypes.arrayOf(PropTypes.object),
  followedTokens: PropTypes.arrayOf(PropTypes.object),
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation
)(SearchTokenContainer);
