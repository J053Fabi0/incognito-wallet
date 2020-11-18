import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, ScrollView, FlexView, LoadingContainer } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import styles from './style';

const MainLayout = ({
  header,
  children,
  scrollable,
  loading,
  hideBackButton,
  noPadding,
  rightHeader,
  customHeaderTitle,
  onGoBack,
  contentStyle,
  noHeader,
}) => {
  return (
    <FlexView style={[noPadding && styles.noPaddingStyle]}>
      {!noHeader && <Header
        title={header}
        hideBackButton={hideBackButton}
        style={noPadding && styles.paddingHeader}
        rightHeader={rightHeader}
        customHeaderTitle={customHeaderTitle}
        onGoBack={onGoBack}
      />}
      {loading ? <LoadingContainer /> :
        scrollable ? (
          <ScrollView
            paddingBottom
            contentContainerStyle={[
              styles.content,
              contentStyle,
            ]}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[
            styles.content,
            contentStyle
          ]}
          >
            {children}
          </View>
        )
      }
    </FlexView>
  );
};

MainLayout.propTypes = {
  header: PropTypes.string,
  children: PropTypes.any,
  scrollable: PropTypes.bool,
  loading: PropTypes.bool,
  hideBackButton: PropTypes.bool,
  noPadding: PropTypes.bool,
  rightHeader: PropTypes.any,
  customHeaderTitle: PropTypes.any,
  onGoBack: PropTypes.func,
  contentStyle: PropTypes.any,
  noHeader: PropTypes.bool,
};

MainLayout.defaultProps = {
  header: '',
  children: null,
  scrollable: false,
  loading: false,
  hideBackButton: false,
  noPadding: false,
  rightHeader: undefined,
  customHeaderTitle: undefined,
  onGoBack: undefined,
  contentStyle: null,
  noHeader: false,
};

export default compose(
  withLayout_2,
)(MainLayout);
