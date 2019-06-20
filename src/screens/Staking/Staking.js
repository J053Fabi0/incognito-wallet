import {
  ActivityIndicator,
  Container,
  Form,
  FormSubmitButton,
  FormTextField,
  Picker,
  PickerField,
  ScrollView,
  Text,
  Toast
} from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
// import formValidate from './formValidate';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import { CONSTANT_COMMONS } from '@src/constants';
import Account from '@src/services/wallet/accountService';
import {
  getEstimateFee,
  getStakingAmount
} from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styleSheet from './style';

const initialValues = {
  stakingType: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
  toAddress: CONSTANT_COMMONS.STAKING_ADDRESS,
  fromAddress: '',
  amount: '',
  fee: String(CONSTANT_COMMONS.STAKING_MIN_FEE)
};

class Staking extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues: initialValues,
      minFee: 0,
      isStaking: false,
      isGettingFee: false
    };

    this.form = null;
    this.handleEstimateFee = _.debounce(::this.handleEstimateFee, 500);
  }

  componentDidMount = async () => {
    const { account } = this.props;
    await this.updateFormValues('fromAddress', account?.PaymentAddress);
    await this.handleLoadAmountStaking(Number(initialValues.stakingType));
  };

  updateFormValues = (field, value) => {
    if (this.form) {
      return this.form.setFieldValue(field, value, true);
    }
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  // update amount staking when change stakingType
  handleLoadAmountStaking = async stakingType => {
    try {
      const amount = await getStakingAmount(Number(stakingType));
      await this.updateFormValues('amount', String(convert.toConstant(amount)));
    } catch (e) {
      Toast.showError('Get amount staking failed!' + e);
    }
  };

  // call this function when user change stakingType
  handleEstimateFee = async values => {
    const { account, wallet } = this.props;
    const accountWallet = wallet.getAccountByName(account.name);

    try {
      this.setState({ isGettingFee: true });
      const fee = await getEstimateFee(
        values.fromAddress,
        values.toAddress,
        convert.toMiliConstant(Number(values.amount)),
        account.PrivateKey,
        accountWallet,
        false
      );
      // update min fee
      this.setState({ minFee: convert.toConstant(fee) });
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch (e) {
      Toast.showError(`Error on get estimation fee! ${e.message}`);
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.toAddress) {
      return;
    }

    const { amount, toAddress, stakingType } = values;

    if (amount && toAddress && stakingType !== undefined) {
      this.handleEstimateFee(values);
    }
  };

  handleStaking = async values => {
    const { account, wallet } = this.props;
    const { stakingType, amount, fee, toAddress, fromAddress } = values;

    const param = {
      type: Number(stakingType),
      burningAddress: CONSTANT_COMMONS.STAKING_ADDRESS
    };

    try {
      this.setState({ isStaking: true });

      const res = await Account.staking(param, fee, account, wallet);

      if (res.txId) {
        openReceipt({
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: convert.toMiliConstant(Number(amount)),
          amountUnit: CONSTANT_COMMONS.CONST_SYMBOL,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: convert.toMiliConstant(Number(fee))
        });
      } else {
        Toast.showError(
          `Staking failed. Please try again! Err:  ${res.err.Message ||
            res.err}`
        );
      }
    } catch (e) {
      Toast.showError(`Staking failed. Please try again! Err:  ${e.message}`);
    } finally {
      this.setState({ isStaking: false });
    }
  };

  onFormValidate = values => {
    const errors = {};

    const { fee } = values;
    const { minFee } = this.state;

    if (fee < minFee) {
      errors.fee = `Must be at least min fee ${minFee} ${CONSTANT_COMMONS.CONST_SYMBOL}`;
    }

    return errors;
  };

  render() {
    const { account } = this.props;
    const { initialFormValues, isStaking, isGettingFee } = this.state;
    const balance = `${formatUtil.amountConstant(account.value)} ${
      CONSTANT_COMMONS.CONST_SYMBOL
    }`;
    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Staking</Text>
          <Text>{`Balance: ${balance}`}</Text>
          <Form
            formRef={form => (this.form = form)}
            initialValues={initialFormValues}
            onSubmit={this.handleStaking}
            viewProps={{ style: styleSheet.form }}
            // validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField
              name="fromAddress"
              placeholder="From Address"
              editable={false}
            />
            <PickerField
              name="stakingType"
              onFieldChange={this.handleLoadAmountStaking}
            >
              <Picker.Item
                label="Shard Type"
                value={CONSTANT_COMMONS.STAKING_TYPES.SHARD}
              />
              <Picker.Item
                label="Beacon Type"
                value={CONSTANT_COMMONS.STAKING_TYPES.BEACON}
              />
            </PickerField>
            <FormTextField
              name="toAddress"
              placeholder="To Address"
              editable={false}
            />
            <FormTextField
              name="amount"
              placeholder="Amount"
              editable={false}
              onFieldChange={this.handleShouldGetFee}
            />
            <FormTextField
              name="fee"
              placeholder="Min Fee"
              prependView={isGettingFee ? <ActivityIndicator /> : undefined}
            />
            <FormSubmitButton title="STAKING" style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>
            * Only send CONSTANT to a CONSTANT address.
          </Text>
          <ReceiptModal />
        </Container>
        {isStaking && <LoadingTx />}
      </ScrollView>
    );
  }
}

Staking.propTypes = {
  balance: PropTypes.number,
  fromAddress: PropTypes.string,
  navigation: PropTypes.objectOf(PropTypes.object).isRequired,
  wallet: PropTypes.objectOf(PropTypes.object),
  account: PropTypes.objectOf(PropTypes.object)
};

Staking.defaultProps = {
  wallet: undefined,
  account: undefined,
  balance: 0,
  fromAddress: 'default_address'
};

export default Staking;
