import axios from 'axios';
import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

// Enums
export const ChapaUrls = {
  INITIALIZE: 'https://api.chapa.co/v1/transaction/initialize',
  MOBILE_INITIALIZE: 'https://api.chapa.co/v1/transaction/mobile-initialize',
  VERIFY: 'https://api.chapa.co/v1/transaction/verify',
  BANK: 'https://api.chapa.co/v1/banks',
  SUBACCOUNT: 'https://api.chapa.co/v1/subaccount',
  TRANSACTION: 'https://api.chapa.co/v1/transaction',
  TRANSACTION_LOG: 'https://api.chapa.co/v1/transaction/logs',
  TRANSFER: 'https://api.chapa.co/v1/transfer',
  BULK_TRANSFER: 'https://api.chapa.co/v1/transfer/bulk',
  VERIFY_TRANSFER: 'https://api.chapa.co/v1/transfer/verify',
  DIRECT_CHARGE: 'https://api.chapa.co/v1/transaction/direct-charge',
  AUTHORIZE_DIRECT_CHARGE: 'https://api.chapa.co/v1/transaction/authorize-direct-charge'
};

// HTTP Exception class
export class HttpException extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'HttpException';
  }
}

// Basic validation functions
const validateInitializeOptions = async (options) => {
  if (!options.amount || !options.currency || !options.email) {
    throw new Error('Missing required fields: amount, currency, email');
  }
};

const validateVerifyOptions = async (options) => {
  if (!options.tx_ref) {
    throw new Error('Missing required field: tx_ref');
  }
};

const validateCreateSubaccountOptions = async (options) => {
  if (!options.business_name || !options.account_name) {
    throw new Error('Missing required fields: business_name, account_name');
  }
};

const validateGetTransactionLogsOptions = async (options) => {
  if (!options.ref_id) {
    throw new Error('Missing required field: ref_id');
  }
};

const validateTransferOptions = async (options) => {
  if (!options.account_name || !options.account_number || !options.amount) {
    throw new Error('Missing required fields: account_name, account_number, amount');
  }
};

const validateBulkTransferOptions = async (options) => {
  if (!options.transfers || !Array.isArray(options.transfers)) {
    throw new Error('Missing required field: transfers (array)');
  }
};

const validateDirectChargeOptions = async (options) => {
  if (!options.amount || !options.currency || !options.email) {
    throw new Error('Missing required fields: amount, currency, email');
  }
};

const validateAuthorizeDirectChargeOptions = async (options) => {
  if (!options.amount || !options.currency || !options.email) {
    throw new Error('Missing required fields: amount, currency, email');
  }
};

export class Chapa {
  constructor(chapaOptions) {
    this.chapaOptions = chapaOptions;
  }

  async initialize(options) {
    try {
      await validateInitializeOptions(options);
      const response = await axios.post(
        ChapaUrls.INITIALIZE,
        options,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async mobileInitialize(options) {
    try {
      await validateInitializeOptions(options);
      const response = await axios.post(
        ChapaUrls.MOBILE_INITIALIZE,
        options,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async verify(options) {
    try {
      await validateVerifyOptions(options);
      const response = await axios.get(
        `${ChapaUrls.VERIFY}/${options.tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async genTxRef(options = {}) {
    const { removePrefix = false, prefix = 'TX', size = 15 } = options;
    const nanoid = customAlphabet(alphanumeric, size);
    const reference = nanoid();

    if (removePrefix) {
      return reference.toUpperCase();
    }
    return `${prefix}-${reference.toUpperCase()}`;
  }

  async getBanks() {
    try {
      const banks = await axios.get(ChapaUrls.BANK, {
        headers: {
          Authorization: `Bearer ${this.chapaOptions.secretKey}`,
        },
      });
      return banks.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else {
        throw error;
      }
    }
  }

  async createSubaccount(options) {
    try {
      await validateCreateSubaccountOptions(options);
      const response = await axios.post(
        ChapaUrls.SUBACCOUNT,
        options,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async getTransactions() {
    try {
      const response = await axios.get(ChapaUrls.TRANSACTION, {
        headers: {
          Authorization: `Bearer ${this.chapaOptions.secretKey}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else {
        throw error;
      }
    }
  }

  async getTransactionLogs(options) {
    try {
      await validateGetTransactionLogsOptions(options);
      const response = await axios.get(
        `${ChapaUrls.TRANSACTION_LOG}/${options.ref_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async transfer(options) {
    try {
      await validateTransferOptions(options);
      const response = await axios.post(
        ChapaUrls.TRANSFER,
        options,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async bulkTransfer(options) {
    try {
      await validateBulkTransferOptions(options);
      const response = await axios.post(
        ChapaUrls.BULK_TRANSFER,
        options,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async verifyTransfer(options) {
    try {
      await validateVerifyOptions(options);
      const response = await axios.get(
        `${ChapaUrls.VERIFY_TRANSFER}/${options.tx_ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async getTransfers() {
    try {
      const response = await axios.get(ChapaUrls.TRANSFER, {
        headers: {
          Authorization: `Bearer ${this.chapaOptions.secretKey}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else {
        throw error;
      }
    }
  }

  async directCharge(options) {
    try {
      await validateDirectChargeOptions(options);
      const response = await axios.post(
        ChapaUrls.DIRECT_CHARGE,
        options,
        {
          params: {
            type: options.type,
          },
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }

  async authorizeDirectCharge(options) {
    try {
      await validateAuthorizeDirectChargeOptions(options);
      const response = await axios.post(
        ChapaUrls.AUTHORIZE_DIRECT_CHARGE,
        options,
        {
          params: {
            type: options.type,
          },
          headers: {
            Authorization: `Bearer ${this.chapaOptions.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          error.response.data.message,
          error.response.status
        );
      } else if (error.name === 'ValidationError') {
        throw new HttpException(error.errors[0], 400);
      } else {
        throw error;
      }
    }
  }
}