import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import TableBody from './tableBody';
import './style.css';
const validationSchema = Yup.object().shape({});
function ChargesModal({ rowClickData, CB, isAirOperation }) {
  const tradeTypeId = rowClickData?.tradeTypeId || 1;
  const formikRef = React.useRef<FormikProps<any>>(null);
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [bookingData, setShipBookingRequestGetById] = useAxiosGet();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, getSaveBookedRequestBilling, bookedRequestBilling] = useAxiosPost();
  const [shipingCargoTypeDDL, getShipingCargoTypeDDL] = useAxiosGet();
  const [
    ,
    getBookedRequestBillingData,
    bookedRequestBillingDataLoading,
    setBookedRequestBillingData,
  ] = useAxiosGet();
  const [
    shippingHeadOfCharges,
    getShippingHeadOfCharges,
    shippingHeadOfChargesLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();
  const [currencyList, GetBaseCurrencyList, , setCurrencyList] = useAxiosGet();

  const commonGetShippingHeadOfCharges = (modeOfTransportId) => {
    setShippingHeadOfCharges([]);
    setBookedRequestBillingData([]);

    let masterBlId = 0;
    let masterBlCode = '';
    if ([1, 5].includes(modeOfTransportId)) {
      masterBlId = rowClickData?.airmasterBlId;
      masterBlCode = rowClickData?.airMasterBlCode;
    }
    if (modeOfTransportId === 2) {
      masterBlId = rowClickData?.seamasterBlId;
      masterBlCode = rowClickData?.seaMasterBlCode;
    }
    if (modeOfTransportId === 4) {
      masterBlId = rowClickData?.landmasterBlId;
      masterBlCode = rowClickData?.landmasterBlCode;
    }
    if (!masterBlId) return toast.warning('Master BL not found');

    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges?typeId=1`,
      (resShippingHeadOfCharges) => {
        // `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingByMasterBl?MasterBlId=${masterBlId}&modeOfTransportId=${modeOfTransportId}`,
        getBookedRequestBillingData(
          `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}&isAirOperation=${
            isAirOperation || false
          }`,
          (resSveData) => {
            if (formikRef.current) {
              // profitSharePercentage add
              formikRef.current.setFieldValue(
                'profitSharePercentage',
                resSveData?.[0]?.profitSharePercentage || ''
              );
              // converstionRateUsd add
              formikRef.current.setFieldValue(
                'converstionRateUsd',
                resSveData?.[0]?.converstionRateUsd || ''
              );
            }
            const arryList: Array<Record<string, any>> = [];
            if (resShippingHeadOfCharges?.length > 0) {
              resShippingHeadOfCharges.forEach((item) => {
                const saveHeadOfChargeList =
                  resSveData?.filter(
                    (findItem) => findItem?.headOfChargeId === item?.value
                  ) || [];

                if (saveHeadOfChargeList?.length > 0) {
                  saveHeadOfChargeList.forEach((saveItem) => {
                    const isCommonPaymentCombind =
                      saveItem?.isActulCombindToMbl ||
                      saveItem?.isDummyCombindToMbl ||
                      saveItem?.isPaymentCombindToMbl ||
                      false;
                    const obj: any = {
                      ...item,
                      ...saveItem,
                      currencyId: saveItem?.currencyId || 0,
                      currency: saveItem?.currency || '',
                      exchangeRate: saveItem?.exchangeRate || '',
                      packageQuantity: saveItem?.packageQuantity || 0,
                      packageRate: saveItem?.packageRate || 0,
                      billingId: saveItem?.billingId || 0,
                      checked: saveItem ? true : false,
                      amount: saveItem?.chargeAmount || '',
                      actualExpense: saveItem?.actualExpense || '',
                      headOfCharges: item?.label || '',
                      headOfChargeId: item?.value || 0,
                      collectionPartyType: saveItem?.collectionPartyType || '',
                      collectionActualAmount:
                        saveItem?.collectionActualAmount || '',
                      collectionDummyAmount:
                        saveItem?.collectionDummyAmount || '',
                      paymentActualAmount: saveItem?.paymentActualAmount || '',
                      paymentDummyAmount: saveItem?.paymentDummyAmount || '',
                      paymentAdvanceAmount:
                        saveItem?.paymentAdvanceAmount || '',
                      paymentPartyType: saveItem?.paymentPartyType || 0,
                      paymentPartyTypeId: saveItem?.paymentPartyTypeId || 0,
                      paymentParty: saveItem?.paymentParty || 0,
                      paymentPartyId: saveItem?.paymentPartyId || 0,
                      collectionPartyTypeId:
                        saveItem?.collectionPartyTypeId || 0,
                      collectionPartyId: saveItem?.collectionPartyId || 0,
                      collectionParty: saveItem?.collectionParty || '',
                      isActulCombindToMbl:
                        saveItem?.isActulCombindToMbl || false,
                      isDummyCombindToMbl:
                        saveItem?.isDummyCombindToMbl || false,
                      isPaymentCombindToMbl:
                        saveItem?.isPaymentCombindToMbl || false,
                      billRegisterId: saveItem?.billRegisterId || 0,
                      billRegisterCode: saveItem?.billRegisterCode || '',
                      masterBlId: masterBlId,
                      masterBlCode: masterBlCode || '',
                      modeOfTransportId: modeOfTransportId,
                      advancedBillRegisterId:
                        saveItem?.advancedBillRegisterId || 0,
                      advancedBillRegisterCode:
                        saveItem?.advancedBillRegisterCode || '',
                      profitSharePercentage:
                        saveItem?.profitSharePercentage || '',
                      converstionRateUsd: saveItem?.converstionRateUsd || '',
                      paymentAdvanceCombindAmount:
                        saveItem?.paymentAdvanceCombindAmount || '',
                      paymentActualCombindAmount:
                        saveItem?.paymentActualCombindAmount || '',
                      paymentDummyCombindAmount:
                        saveItem?.paymentDummyCombindAmount || '',
                      billingDate: item?.billingDate || new Date(),
                      isCommonPaymentCombind: isCommonPaymentCombind,
                      isCommonPaymentCombindDisabled:
                        isCommonPaymentCombind ||
                        saveItem?.paymentAdvanceAmount > 0 ||
                        saveItem?.paymentActualAmount > 0 ||
                        saveItem?.paymentDummyAmount > 0,

                      isPaymentActualAmountDisabled:
                        saveItem?.paymentActualAmount > 0,
                      isPaymentDummyAmountDisabled:
                        saveItem?.paymentDummyAmount > 0 ||
                        saveItem?.paymentActualAmount > 0,
                      isPaymentAdvanceAmountDisabled:
                        saveItem?.paymentAdvanceAmount > 0 ||
                        saveItem?.paymentActualAmount > 0 ||
                        saveItem?.paymentDummyAmount > 0,
                    };
                    arryList.push(obj);
                  });
                } else {
                  const obj = {
                    ...item,
                    headOfCharges: item?.label || '',
                    headOfChargeId: item?.value || 0,
                    masterBlId: masterBlId,
                    masterBlCode: masterBlCode || '',
                    modeOfTransportId: modeOfTransportId,
                  };
                  arryList.push(obj);
                }
              });
              setShippingHeadOfCharges([...arryList]);
            }
          }
        );
      }
    );
  };
  useEffect(() => {
    const modeOfTransportId = [1, 3].includes(rowClickData?.modeOfTransportId)
      ? 1
      : rowClickData?.modeOfTransportId;
    if (formikRef.current) {
      formikRef.current.setFieldValue('billingType', modeOfTransportId);
    }

    commonGetShippingHeadOfCharges(modeOfTransportId);
    GetBaseCurrencyList(
      `${imarineBaseUrl}/domain/Purchase/GetBaseCurrencyList`,
      (res) => {
        const modifyData = res?.map((item) => {
          return {
            ...item,
            label: item?.code,
          };
        });
        setCurrencyList(modifyData);
      }
    );
    getShipingCargoTypeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetShipingCargoTypeDDL`
    );
    setShipBookingRequestGetById(
      `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}&isAirOperation=${
        isAirOperation || false
      }`
    );
  }, []);

  const saveHandler = (values) => {
    const payloadList = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          exchangeRate: +item?.exchangeRate || 0,
          packageQuantity: item?.packageQuantity || 0,
          packageRate: item?.packageRate || 0,
          currencyId: item?.currencyId || 0,
          currency: item?.currency || '',
          billingId: item?.billingId || 0,
          bookingRequestId: rowClickData?.bookingRequestId || 0,
          headOfChargeId: item?.headOfChargeId || 0,
          headOfCharges: item?.headOfCharges || '',
          chargeAmount: item?.amount || 0,
          actualExpense: item?.actualExpense || 0,
          isActive: true,
          billingDate: new Date(),
          createdBy: profileData?.userId || 0,
          createdAt: new Date(),
          updatedBy: new Date(),
          updatedAt: profileData?.userId || 0,
          collectionActualAmount: item?.collectionActualAmount || 0,
          collectionDummyAmount: item?.collectionDummyAmount || 0,
          collectionPartyType: item?.collectionPartyType || '',
          collectionPartyTypeId: item?.collectionPartyTypeId || 0,
          collectionParty: item?.collectionParty || '',
          collectionPartyId: item?.collectionPartyId || 0,
          paymentActualAmount: item?.paymentActualAmount || 0,
          paymentDummyAmount: item?.paymentDummyAmount || 0,
          paymentAdvanceAmount: item?.paymentAdvanceAmount || 0,
          paymentPartyType: item?.paymentPartyType || '',
          paymentPartyTypeId: item?.paymentPartyTypeId || 0,
          paymentParty: item?.paymentParty || '',
          paymentPartyId: item?.paymentPartyId || 0,
          isActulCombindToMbl: item?.isActulCombindToMbl || false,
          isDummyCombindToMbl: item?.isDummyCombindToMbl || false,
          isPaymentCombindToMbl: item?.isPaymentCombindToMbl || false,
          profitSharePercentage: values?.profitSharePercentage || 0,
          converstionRateUsd: values?.converstionRateUsd || 0,
          masterBlId: item?.masterBlId || 0,
          masterBlCode: item?.masterBlCode || '',
          modeOfTransportId: item?.modeOfTransportId || 0,
          paymentActualCombindAmount: item?.isActulCombindToMbl
            ? item?.paymentActualCombindAmount || item?.paymentActualAmount || 0
            : 0,
          paymentDummyCombindAmount: item?.isDummyCombindToMbl
            ? item?.paymentDummyCombindAmount || item?.paymentDummyAmount || 0
            : 0,
          paymentAdvanceCombindAmount: item?.isPaymentCombindToMbl
            ? item?.paymentAdvanceCombindAmount ||
              item?.paymentAdvanceAmount ||
              0
            : 0,
          billRegisterId: item?.billRegisterId || 0,
          billRegisterCode: item?.billRegisterCode || '',
          advancedBillRegisterId: item?.advancedBillRegisterId || 0,
          advancedBillRegisterCode: item?.advancedBillRegisterCode || '',
          isAirOperation: isAirOperation || false,
        };
      });
    if (payloadList.length === 0) {
      return toast.warn('Please select at least one charge');
    }

    // if payloadList 'currencyId' empty then return and show warning message "headOfCharges"
    const currencyIdEmpty = payloadList?.find((item) => item?.currencyId === 0);
    if (currencyIdEmpty) {
      return toast.warn(
        `Please select currency for "${currencyIdEmpty?.headOfCharges}" Attribute`
      );
    }
    // if payloadList 'exchangeRate' empty then return and show warning message "headOfCharges"
    const exchangeRateEmpty = payloadList?.find(
      (item) => (+item?.exchangeRate || 0) === 0
    );
    if (exchangeRateEmpty) {
      return toast.warn(
        `Please enter exchange rate for "${exchangeRateEmpty?.headOfCharges}" Attribute`
      );
    }
    // Check if any two "paymentPartyId" values are the same but their "currencyId" values differ
    for (let i = 0; i < payloadList.length; i++) {
      for (let j = i + 1; j < payloadList.length; j++) {
        if (payloadList[i].paymentPartyId === payloadList[j].paymentPartyId) {
          // If paymentPartyId is the same, check if currencyId is the same
          if (payloadList[i].currencyId !== payloadList[j].currencyId) {
            return toast.warn(
              `Warning: "Payment Party" ${payloadList[j].headOfCharges} has different currency: ${payloadList[i].currency} and ${payloadList[j].currency}`
            );
          }
        }
      }
    }
    // Check if any two "collectionPartyId" values are the same but their "currencyId" values differ
    for (let i = 0; i < payloadList.length; i++) {
      for (let j = i + 1; j < payloadList.length; j++) {
        if (
          payloadList[i].collectionPartyId === payloadList[j].collectionPartyId
        ) {
          // If collectionPartyId is the same, check if currencyId is the same
          if (payloadList[i].currencyId !== payloadList[j].currencyId) {
            return toast.warn(
              `Warning: "Collection Party" ${payloadList[j].headOfCharges} has different currency: ${payloadList[i].currency} and ${payloadList[j].currency}`
            );
          }
        }
      }
    }

    getSaveBookedRequestBilling(
      `${imarineBaseUrl}/domain/ShippingService/SaveBookedRequestBilling`,
      payloadList,
      CB
    );
  };

  return (
    <div className="chargesModal">
      {(bookedRequestBilling ||
        shippingHeadOfChargesLoading ||
        bookedRequestBillingDataLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          amount: '',
          attribute: '',
          actualExpense: '',
          billingType: '',
          converstionRateUsd: '',
          profitSharePercentage: '',
          collectionActualAmount: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          saveHandler(values);
        }}
        innerRef={formikRef as any}
      >
        {({ errors, touched, setFieldValue, values, handleSubmit }) => (
          <div>
            <form className="form form-label-right" onSubmit={handleSubmit}>
              <div className="">
                {/* Save button add */}
                <>
                  <div className="d-flex justify-content-between">
                    <div>
                      {rowClickData?.modeOfTransportId === 3 && (
                        <>
                          {' '}
                          <label className="mr-3">
                            <input
                              type="radio"
                              name="billingType"
                              checked={Number(values?.billingType) === 1}
                              className="mr-1 pointer"
                              style={{ position: 'relative', top: '2px' }}
                              onChange={() => {
                                setFieldValue('billingType', 1);
                                setFieldValue('profitSharePercentage', '');
                                setFieldValue('converstionRateUsd', '');
                                commonGetShippingHeadOfCharges(1);
                              }}
                            />
                            Air
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="billingType"
                              checked={Number(values?.billingType) === 2}
                              className="mr-1 pointer"
                              style={{ position: 'relative', top: '2px' }}
                              onChange={() => {
                                setFieldValue('billingType', 2);
                                setFieldValue('profitSharePercentage', '');
                                setFieldValue('converstionRateUsd', '');
                                commonGetShippingHeadOfCharges(2);
                              }}
                            />
                            Sea
                          </label>
                        </>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.profitSharePercentage}
                    label="Profit Share Percentage"
                    name="profitSharePercentage"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('profitSharePercentage', e.target.value)
                    }
                    disabled={
                      shippingHeadOfCharges?.[0]?.profitSharePercentage &&
                      shippingHeadOfCharges?.[0]?.billingId
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.converstionRateUsd}
                    label="Converstion Rate USD"
                    name="converstionRateUsd"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('converstionRateUsd', e.target.value)
                    }
                    disabled={
                      shippingHeadOfCharges?.[0]?.converstionRateUsd &&
                      shippingHeadOfCharges?.[0]?.billingId
                    }
                  />
                </div>
              </div>{' '}
              <div className="table-responsive">
                <table className="table global-table">
                  <thead>
                    <tr>
                      <th rowSpan={2}></th>
                      <th rowSpan={2}>SL</th>
                      <th rowSpan={2}>Attribute</th>
                      <th rowSpan={2} style={{ minWidth: '110px' }}>
                        Currency
                      </th>
                      <th rowSpan={2}>Exchange Rate</th>
                      {isAirOperation && (
                        <>
                          <th rowSpan={2}>Pkg Qty</th>
                          <th rowSpan={2}>Pkg Rate</th>
                        </>
                      )}
                      <th
                        colSpan={4}
                        className="group-header collection-header"
                      >
                        Collection <span>(Amounts & Party)</span>
                      </th>
                      <th colSpan={5} className="group-header payment-header">
                        Payment <span>(Amounts & Party)</span>
                      </th>
                      <th rowSpan={2}>Action</th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          minWidth: '150px',
                        }}
                        className="collection-header"
                      >
                        Party
                      </th>
                      <th
                        style={{
                          minWidth: '150px',
                        }}
                        className="collection-header"
                      >
                        Party Name
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                        className="collection-header"
                      >
                        Actual
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                        className="collection-header"
                      >
                        Dummy
                      </th>

                      <th
                        style={{
                          minWidth: '150px',
                        }}
                        className="payment-header"
                      >
                        Party
                      </th>
                      <th
                        style={{
                          minWidth: '150px',
                        }}
                        className="payment-header"
                      >
                        Party Name
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                        className="payment-header"
                      >
                        Actual
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                        className="payment-header"
                      >
                        Dummy
                      </th>
                      {/* <th
                      style={{
                        width: '60px',
                      }}
                      className="payment-header"
                    >
                      Advance
                    </th> */}
                      <th style={{ width: '60px' }} className="payment-header">
                        Is Combind
                      </th>
                    </tr>
                  </thead>
                  <TableBody
                    shippingHeadOfCharges={shippingHeadOfCharges}
                    setShippingHeadOfCharges={setShippingHeadOfCharges}
                    errors={errors}
                    touched={touched}
                    currencyList={currencyList}
                    shipingCargoTypeDDL={shipingCargoTypeDDL}
                    isAirOperation={isAirOperation}
                    rowClickData={rowClickData}
                    tradeTypeId={tradeTypeId}
                    bookingData={bookingData}
                  />
                </table>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default ChargesModal;
