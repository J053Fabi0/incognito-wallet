import { CustomError, ErrorCode } from '@services/exception';

const NAME_PATTERN = /^[A-Za-z0-9]*$/;

export const validateName = (name, list) => {
  if (name.length === 0 || !NAME_PATTERN.test(name)) {
    throw new CustomError(ErrorCode.invalid_master_key_name);
  }

  const existed = list.find(item => item.name.toLowerCase() === name.toLowerCase());

  if (existed) {
    throw new CustomError(ErrorCode.master_key_name_existed);
  }
};

export const validateMnemonicWithOtherKeys = (mnemonic, list) => {
  if (mnemonic.length === 0) {
    throw new CustomError(ErrorCode.invalid_mnemonic);
  }

  const existed = list.find(item => item.mnemonic === mnemonic);

  if (existed) {
    throw new CustomError(ErrorCode.duplicate_mnemonic);
  }
};

