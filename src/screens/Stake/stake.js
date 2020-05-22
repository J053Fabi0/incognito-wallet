import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import sourceBackground from '@assets/images/icons/stake_background.png';
import PropTypes from 'prop-types';
import Tooltip from '@components/Tooltip/Tooltip';
import {BtnDefault} from '@src/components/Button';
import {QuestionIcon} from '@src/components/Icons';
import srcQuestionIcon from '@src/assets/images/icons/question_black_2.png';
import TooltipDefault from '@components/Tooltip';
import {styled, styledActions, styledInterestRate} from './stake.styled';
import withStake from './stake.enhance';
import {
  stakeDataSelector,
  stakeSelector,
  storageStakeSelector,
} from './stake.selector';
import Header from './stake.header';
import StakePoolCommunity from './features/StakePoolCommunity';
import StakeBalance from './stake.balance';
import StakeGuide from './stake.guide';
import StakePending from './stake.pending';

const StakeActions = props => {
  const {handleStartStake} = props;
  const {staked} = useSelector(stakeDataSelector);
  const {guide} = useSelector(storageStakeSelector);
  if (!guide) {
    return (
      <View style={styledActions.container}>
        <View style={styledActions.wrapper}>
          <Tooltip content={<StakeGuide />} />
          <BtnDefault
            title={staked ? 'Stake more' : 'Stake now'}
            onPress={handleStartStake}
            btnStyle={styledActions.btnStake}
          />
        </View>
      </View>
    );
  }
  return (
    <BtnDefault
      title={staked ? 'Stake more' : 'Stake now'}
      onPress={handleStartStake}
      btnStyle={styled.btnStake}
    />
  );
};

const StakeInterestRate = props => {
  const {rate, desc} = props;
  const [visible, setVisible] = React.useState(false);
  const toggleTooltip = async () => await setVisible(!visible);
  React.useEffect(() => {
    let timeout = null;
    if (visible) {
      timeout = setTimeout(toggleTooltip, 5000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [visible]);
  return (
    <View style={styledInterestRate.container}>
      <Text style={[styledInterestRate.desc, {color: '#FF8D01'}]}>
        {`${rate}%`}
      </Text>
      <Text style={styledInterestRate.desc}>{desc}</Text>
      <TouchableOpacity onPress={toggleTooltip}>
        <QuestionIcon style={styledInterestRate.icon} icon={srcQuestionIcon} />
      </TouchableOpacity>
      {visible && (
        <TooltipDefault
          desc="APY is your annual rate of return. Rewards are compounded every second."
          containerStyled={styledInterestRate.tooltip}
        />
      )}
    </View>
  );
};

const Stake = props => {
  const {fetchData} = props;
  const {isFetching} = useSelector(stakeSelector);
  const {currentCompoundRate} = useSelector(stakeDataSelector);
  return (
    <View style={styled.container}>
      <Header />
      <ImageBackground source={sourceBackground} style={styled.background} />
      <View style={styled.scrolview}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={fetchData} />
          }
        >
          <View style={styled.wrapper}>
            <View style={styled.hook}>
              <Text style={styled.title}>Staking balance</Text>
              <StakeBalance />
            </View>
          </View>
        </ScrollView>
      </View>
      <StakePending />
      <StakeInterestRate rate={currentCompoundRate} desc="APY" />
      <StakeActions {...props} />
      <StakePoolCommunity />
    </View>
  );
};

StakeInterestRate.propTypes = {
  rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  desc: PropTypes.string.isRequired,
};

StakeActions.propTypes = {
  handleStartStake: PropTypes.func.isRequired,
};

Stake.propTypes = {
  fetchData: PropTypes.func.isRequired,
  handleStartStake: PropTypes.func.isRequired,
};

export default withStake(Stake);
