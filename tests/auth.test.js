import {AuthCall} from "../src";
import {
  basicMerchantRequestParams,
  missingPaymentSolutionId,
  tokenizeCard,
  verifyMissingCardTokenCvvCustomerId,
  verifyPaymentRequestRequiredParams, veryBasicRequestParams
} from "./test_utils";

describe('testing auth request', () => {

  it('missing required parameters', async () => {
    try {
      await new AuthCall(veryBasicRequestParams).execute();
    } catch(response) {
      verifyPaymentRequestRequiredParams(response);
    }
  });

  it('missing paymentSolutionId', async () => {
    try {
      basicMerchantRequestParams.amount = 1;
      await new AuthCall(basicMerchantRequestParams).execute();
    } catch(response) {
      missingPaymentSolutionId(response);
    }
  });

  it('missing card token, cvv and customerId', async () => {
    try {
      basicMerchantRequestParams.paymentSolutionId = 500;
      await new AuthCall(basicMerchantRequestParams).execute();
    } catch(response) {
      verifyMissingCardTokenCvvCustomerId(response);
    }
  });

  it('success auth', async () => {
    const { cardToken,customerId } = await tokenizeCard();
    basicMerchantRequestParams.customerId = customerId;
    basicMerchantRequestParams.specinCreditCardToken = cardToken;
    basicMerchantRequestParams.specinCreditCardCVV = '123';
    basicMerchantRequestParams.amount = '10';
    basicMerchantRequestParams.paymentSolutionId = '500';
    const response = await new AuthCall(basicMerchantRequestParams).execute();
    expect(response.result).toEqual('success');
    expect(response.status).toEqual('NOT_SET_FOR_CAPTURE');
    expect(response.txId).not.toEqual(null);
  });

});