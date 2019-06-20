import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import UserHeader from './UserHeader';

const UserHeaderContainer = props => {
  const { defaultAccount, ...otherProps } = props;

  return <UserHeader userName={defaultAccount?.name} {...otherProps} />;
};

const mapState = state => ({
  defaultAccount: state.account.defaultAccount
});

UserHeaderContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(UserHeaderContainer);
