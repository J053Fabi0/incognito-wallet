import {
  RoundCornerButton,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { StyleSheet } from 'react-native';
import React from 'react';
import { COLORS, THEME, UTILS } from '@src/styles';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import MainLayout from '@components/MainLayout';
import { verticalScale } from 'react-native-size-matters';

const scale = UTILS.deviceHeight() < 550 ? 0.7 : 1;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  title: {
    marginTop: verticalScale(90 * scale),
    ...THEME.text.boldTextStyleSuperMedium,
    fontSize: 30,
    textAlign: 'center',
  },
  button: {
    marginTop: verticalScale(115 * scale),
    backgroundColor: COLORS.black2,
  },
  buttonText: {
    color: COLORS.white,
  },
  subContent: {
    marginTop: verticalScale(140 * scale),
  },
  subTitle: {
    ...THEME.text.boldTextStyleSuperMedium,
    height: 36,
  },
  subDesc: {
    ...THEME.text.mediumTextMotto,
  },
  bottomText: {
    position: 'absolute',
    bottom: 50,
    lineHeight: 24,
    ...THEME.text.regularSizeMediumFontBlack,
  },
});

const Welcome = () => {
  const navigation = useNavigation();

  const handleImport = () => {
    navigation.navigate(routeNames.InitImportMasterKey, { init: true });
  };

  const handleCreate = () => {
    navigation.navigate(routeNames.InitMasterKey , { init: true });
  };

  return (
    <MainLayout noHeader contentStyle={styles.flex}>
      <Text style={styles.title}>Welcome.</Text>
      <RoundCornerButton
        style={styles.button}
        titleStyle={styles.buttonText}
        onPress={handleCreate}
        title="Create a master key"
      />
      <View style={styles.subContent}>
        <Text style={styles.subTitle}>Been here before?</Text>
        <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={handleImport}>
          <Text style={styles.subDesc}>Import a master key phrase</Text>
          <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow} />
        </TouchableOpacity>
      </View>
      <Text style={styles.bottomText}>
        If you want to import an existing private key, please create or import a master key first.
      </Text>
    </MainLayout>
  );
};

export default Welcome;
