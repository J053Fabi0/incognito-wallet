import axios from 'axios';
import { CONSTANT_CONFIGS } from '@src/constants';

export const apiGetHomeConfigs = () =>
  axios.get(CONSTANT_CONFIGS.HOME_CONFIG_DATA);

export const apiGetAppVersion = () => axios.get(CONSTANT_CONFIGS.APP_VERSION);
