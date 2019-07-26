import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, View, Text, RefreshControl } from '@src/components/core';
import CryptoItemCard from '@src/components/CryptoItemCard';
import tokenData from '@src/constants/tokenData';
import TouchableOpacity from '@src/components/core/TouchableOpacity/Component';
import { homeStyle } from './style';

class Home extends React.Component {
  render() {
    const { account, tokens, isGettingBalanceList, onSelectToken, handleAddFollowToken, reload, isReloading } = this.props;

    return (
      <ScrollView
        style={homeStyle.container}
        refreshControl={(
          <RefreshControl
            refreshing={isReloading}
            onRefresh={reload}
          />
        )}
      >
        <Container style={homeStyle.mainContainer}>
          <CryptoItemCard
            style={homeStyle.cryptoItem}
            token={{
              symbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
              amount: account?.value
            }}
            isGettingBalance={isGettingBalanceList?.includes(account?.name)}
            onPress={onSelectToken}
          />
          {
            tokens?.map(token => (
              <CryptoItemCard
                style={homeStyle.cryptoItem}
                key={token.symbol}
                token={token}
                isGettingBalance={isGettingBalanceList?.includes(token.name)}
                onPress={onSelectToken}
              />
            ))
          }
          <View style={homeStyle.addTokenContainer}>
            <Text style={homeStyle.addTokenLabel}>Don’t see your token?</Text>
            <TouchableOpacity onPress={handleAddFollowToken}>
              <Text style={homeStyle.addTokenBtn}>Add token</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScrollView>
    );
  }
}

Home.defaultProps = {
  isGettingBalanceList: null,
  account: null,
  tokens: [],
  isReloading: false
};

Home.propTypes = {
  isGettingBalanceList: PropTypes.array,
  account: PropTypes.object,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
};

export default Home;
