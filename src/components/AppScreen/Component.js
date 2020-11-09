import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { THEME } from '@src/styles';
import {useDispatch} from 'react-redux';
import {getSettings} from '@src/redux/actions/settings';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
  }
});

const AppScreen = ({ children }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getSettings());
  }, []);

  if (!children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'never', bottom: 'never' }}>
      {children}
    </SafeAreaView>
  );
};

AppScreen.propTypes = {
  children: PropTypes.any.isRequired
};

export default AppScreen;
