import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import './style.css';
const validationSchema = Yup.object().shape({});
function ChargesModal({ rowClickData, CB }) {
  const formikRef = React.useRef(null);
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  // const bookingRequestId = rowClickData?.bookingRequestId;
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
    if (modeOfTransportId === 1) {
      masterBlId = rowClickData?.airmasterBlId;
      masterBlCode = rowClickData?.airMasterBlCode;
    }
    if (modeOfTransportId === 2) {
      masterBlId = rowClickData?.seamasterBlId;
      masterBlCode = rowClickData?.seaMasterBlCode;
    }
    if (!masterBlId) return;

    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges`,
      (resShippingHeadOfCharges) => {
        getBookedRequestBillingData(
          `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingByMasterBl?MasterBlId=${masterBlId}`,
          (resSveData) => {
            if (formikRef.current) {
              // profitSharePercentage add
              formikRef.current.setFieldValue(
                'profitSharePercentage',
                resSveData?.[0]?.profitSharePercentage || '',
              );
            }
            const arryList = [];
            if (resShippingHeadOfCharges?.length > 0) {
              resShippingHeadOfCharges.forEach((item) => {
                const saveHeadOfChargeList =
                  resSveData?.filter(
                    (findItem) => findItem?.headOfChargeId === item?.value,
                  ) || [];

                if (saveHeadOfChargeList?.length > 0) {
                  saveHeadOfChargeList.forEach((saveItem) => {
                    const isCommonPaymentCombind =
                      saveItem?.isActulCombindToMbl ||
                      saveItem?.isDummyCombindToMbl ||
                      saveItem?.isPaymentCombindToMbl ||
                      false;
                    const obj = {
                      ...item,
                      ...saveItem,
                      currencyId: saveItem?.currencyId || 0,
                      currency: saveItem?.currency || '',
                      exchangeRate: saveItem?.exchangeRate || '',
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
                      masterBlCode: masterBlCode,
                      modeOfTransportId: modeOfTransportId,
                      advancedBillRegisterId:
                        saveItem?.advancedBillRegisterId || 0,
                      advancedBillRegisterCode:
                        saveItem?.advancedBillRegisterCode || '',
                      profitSharePercentage:
                        saveItem?.profitSharePercentage || '',
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
                    masterBlCode: masterBlCode,
                    modeOfTransportId: modeOfTransportId,
                  };
                  arryList.push(obj);
                }
              });
              setShippingHeadOfCharges([...arryList]);
            }
          },
        );
      },
    );
  };
  useEffect(() => {
    const modeOfTransportId = [1, 3].includes(rowClickData?.modeOfTransportId)
      ? 1
      : 2;
    formikRef.current.setFieldValue('billingType', modeOfTransportId);

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
      },
    );
    getShipingCargoTypeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetShipingCargoTypeDDL`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payloadList = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          exchangeRate: +item?.exchangeRate || 0,
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
        };
      });
    if (payloadList.length === 0) {
      return toast.warn('Please select at least one charge');
    }

    // if payloadList 'currencyId' empty then return and show warning message "headOfCharges"
    const currencyIdEmpty = payloadList?.find((item) => item?.currencyId === 0);
    if (currencyIdEmpty) {
      return toast.warn(
        `Please select currency for "${currencyIdEmpty?.headOfCharges}" Attribute`,
      );
    }
    // if payloadList 'exchangeRate' empty then return and show warning message "headOfCharges"
    const exchangeRateEmpty = payloadList?.find(
      (item) => (+item?.exchangeRate || 0) === 0,
    );
    if (exchangeRateEmpty) {
      return toast.warn(
        `Please enter exchange rate for "${exchangeRateEmpty?.headOfCharges}" Attribute`,
      );
    }
    getSaveBookedRequestBilling(
      `${imarineBaseUrl}/domain/ShippingService/SaveBookedRequestBilling`,
      payloadList,
      CB,
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
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <Form className="form form-label-right">
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
                            checked={values?.billingType === 1}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setFieldValue('billingType', 1);
                              setFieldValue('profitSharePercentage', '');
                              commonGetShippingHeadOfCharges(1);
                            }}
                          />
                          Air
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="billingType"
                            checked={values?.billingType === 2}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setFieldValue('billingType', 2);
                              setFieldValue('profitSharePercentage', '');
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
            </div>{' '}
            <div className="table-responsive">
              <table className="table global-table">
                <thead>
                  <tr>
                    <th rowspan="2"></th>
                    <th rowspan="2">SL</th>
                    <th rowspan="2">Attribute</th>
                    <th rowspan="2">Currency</th>
                    <th rowspan="2">Exchange Rate</th>
                    <th colspan="4" class="group-header">
                      Collection <span>(Amounts & Party)</span>
                    </th>
                    <th colspan="6" class="group-header">
                      Payment <span>(Amounts & Party)</span>
                    </th>
                    <th rowspan="2">Action</th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                    >
                      Party Name
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Actual
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Dummy
                    </th>

                    <th
                      style={{
                        minWidth: '150px',
                      }}
                    >
                      Party
                    </th>
                    <th
                      style={{
                        minWidth: '150px',
                      }}
                    >
                      Party Name
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Actual
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Dummy
                    </th>
                    <th
                      style={{
                        width: '60px',
                      }}
                    >
                      Advance
                    </th>
                    <th style={{ width: '60px' }}>Is Combind</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingHeadOfCharges?.map((item, index) => {
                    const isDisabled =
                      !item?.checked || item?.billGenerateCode ? true : false;

                    return (
                      <tr>
                        <td>
                          <input
                            disabled={item?.billingId}
                            type="checkbox"
                            checked={item?.checked}
                            onChange={(e) => {
                              setShippingHeadOfCharges(
                                shippingHeadOfCharges?.map((data) => {
                                  if (data?.value === item?.value) {
                                    return {
                                      ...data,
                                      checked: e?.target?.checked,
                                      currencyId: e?.target?.checked
                                        ? item?.currencyId
                                        : 0,
                                      currency: e?.target?.checked
                                        ? item?.currency
                                        : '',
                                      exchangeRate: e?.target?.checked
                                        ? item?.exchangeRate
                                        : '',
                                      collectionActualAmount: e?.target?.checked
                                        ? item?.collectionActualAmount
                                        : '',
                                      collectionDummyAmount: e?.target?.checked
                                        ? item?.collectionDummyAmount
                                        : '',
                                      collectionPartyType: e?.target?.checked
                                        ? item?.collectionPartyType
                                        : '',
                                      collectionPartyTypeId: e?.target?.checked
                                        ? item?.collectionPartyTypeId
                                        : 0,
                                      collectionParty: e?.target?.checked
                                        ? item?.collectionParty
                                        : '',
                                      collectionPartyId: e?.target?.checked
                                        ? item?.collectionPartyId
                                        : 0,
                                      paymentActualAmount: e?.target?.checked
                                        ? item?.paymentActualAmount
                                        : '',
                                      paymentDummyAmount: e?.target?.checked
                                        ? item?.paymentDummyAmount
                                        : '',
                                      paymentAdvanceAmount: e?.target?.checked
                                        ? item?.paymentAdvanceAmount
                                        : '',
                                      paymentPartyType: e?.target?.checked
                                        ? item?.paymentPartyType
                                        : '',
                                      paymentPartyTypeId: e?.target?.checked
                                        ? item?.paymentPartyTypeId
                                        : 0,
                                      paymentParty: e?.target?.checked
                                        ? item?.paymentParty
                                        : '',
                                      paymentPartyId: e?.target?.checked
                                        ? item?.paymentPartyId
                                        : 0,

                                      isActulCombindToMbl: e?.target?.checked
                                        ? item?.isActulCombindToMbl
                                        : false,
                                      isDummyCombindToMbl: e?.target?.checked
                                        ? item?.isDummyCombindToMbl
                                        : false,
                                      isPaymentCombindToMbl: e?.target?.checked
                                        ? item?.isPaymentCombindToMbl
                                        : false,
                                      profitSharePercentage: e?.target?.checked
                                        ? item?.profitSharePercentage
                                        : '',
                                      paymentActualCombindAmount: e?.target
                                        ?.checked
                                        ? item?.paymentActualCombindAmount
                                        : '',
                                      paymentDummyCombindAmount: e?.target
                                        ?.checked
                                        ? item?.paymentDummyCombindAmount
                                        : '',
                                      paymentAdvanceCombindAmount: e?.target
                                        ?.checked
                                        ? item?.paymentAdvanceCombindAmount
                                        : '',
                                      isCommonPaymentCombind: e?.target?.checked
                                        ? item?.isCommonPaymentCombind
                                        : false,
                                    };
                                  }
                                  return data;
                                }),
                              );
                            }}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item?.headOfCharges}</td>
                        <td>
                          <NewSelect
                            label={''}
                            options={currencyList}
                            value={
                              item?.currencyId
                                ? {
                                    label: item?.currency,
                                    value: item?.currencyId,
                                  }
                                : ''
                            }
                            name="currency"
                            onChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].currency = valueOption?.label;
                              copyPrv[index].currencyId = valueOption?.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={isDisabled || item?.billingId}
                          />
                        </td>
                        <td>
                          <InputField
                            disabled={isDisabled || item?.billingId}
                            value={item?.exchangeRate}
                            label=""
                            name="exchangeRate"
                            type="number"
                            onChange={(e) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].exchangeRate = e.target.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            errors={errors}
                            touched={touched}
                            min={0}
                            step="any"
                          />
                        </td>

                        {/* "Collection Type" =  NewSelect component */}
                        <td>
                          <NewSelect
                            isDisabled={isDisabled || item?.invoiceId}
                            options={
                              [
                                ...shipingCargoTypeDDL,
                                {
                                  label: `Others`,
                                  value: 0,
                                },
                              ] || []
                            }
                            value={
                              item?.collectionPartyType
                                ? {
                                    label: item?.collectionPartyType,
                                    value: item?.collectionPartyTypeId,
                                  }
                                : ''
                            }
                            name="collectionPartyType"
                            onChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionPartyType =
                                valueOption?.label;
                              copyPrv[index].collectionPartyTypeId =
                                valueOption?.value;
                              copyPrv[index].collectionParty = '';
                              copyPrv[index].collectionPartyId = 0;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                          />
                        </td>
                        <td>
                          <SearchAsyncSelect
                            isDisabled={
                              isDisabled ||
                              !item?.collectionPartyType ||
                              item?.invoiceId
                            }
                            selectedValue={
                              item?.collectionParty
                                ? {
                                    label: item?.collectionParty,
                                    value: item?.collectionPartyId,
                                  }
                                : ''
                            }
                            handleChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionParty =
                                valueOption?.label;
                              copyPrv[index].collectionPartyId =
                                valueOption?.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            loadOptions={(v) => {
                              let url = '';
                              if (item?.collectionPartyTypeId === 0) {
                                url = `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?search=${v}&businessPartnerType=2&cargoType=0`;
                              } else {
                                url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeDDL?search=${v}&businessPartnerType=2&shipperId=${rowClickData?.shipperId}&participntTypeId=${item?.collectionPartyTypeId}`;
                              }
                              if (v?.length < 2) return [];
                              return axios.get(url).then((res) => res?.data);
                            }}
                          />
                        </td>
                        {/*  "Collection  actual Amount" =  InputField component */}
                        <td>
                          <InputField
                            disabled={
                              isDisabled ||
                              item?.invoiceId ||
                              !item?.collectionParty
                            }
                            value={item?.collectionActualAmount}
                            name="collectionActualAmount"
                            type="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionActualAmount = value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* "Collection Dummy  Dummy Amount" =  InputField component */}
                        <td>
                          <InputField
                            disabled={
                              isDisabled ||
                              item?.invoiceId ||
                              !item?.collectionParty
                            }
                            value={item?.collectionDummyAmount}
                            name="collectionDummyAmount"
                            type="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionDummyAmount = value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>

                        {/* "Payment Type" =  NewSelect component */}
                        <td>
                          <NewSelect
                            isDisabled={
                              isDisabled ||
                              item?.billRegisterId ||
                              item?.advancedBillRegisterId
                            }
                            options={shipingCargoTypeDDL || []}
                            value={
                              item?.paymentPartyType
                                ? {
                                    label: item?.paymentPartyType,
                                    value: item?.paymentPartyTypeId,
                                  }
                                : ''
                            }
                            name="paymentPartyType"
                            onChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].paymentPartyType =
                                valueOption?.label;
                              copyPrv[index].paymentPartyTypeId =
                                valueOption?.value;
                              copyPrv[index].paymentParty = '';
                              copyPrv[index].paymentPartyId = 0;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                          />
                        </td>
                        <td>
                          <SearchAsyncSelect
                            isDisabled={
                              isDisabled ||
                              !item?.paymentPartyType ||
                              item?.billRegisterId ||
                              item?.advancedBillRegisterId
                            }
                            selectedValue={
                              item?.paymentParty
                                ? {
                                    label: item?.paymentParty,
                                    value: item?.paymentPartyId,
                                  }
                                : ''
                            }
                            handleChange={(valueOption) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].paymentParty = valueOption?.label;
                              copyPrv[index].paymentPartyId =
                                valueOption?.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            loadOptions={(v) => {
                              let url = '';
                              if (item?.paymentPartyTypeId === 0) {
                                url = `${imarineBaseUrl}/domain/ShippingService/CommonPartnerTypeDDL?search=${v}&businessPartnerType=1&cargoType=0`;
                              } else {
                                url = `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeDDL?search=${v}&businessPartnerType=1&shipperId=${rowClickData?.shipperId}&participntTypeId=${item?.paymentPartyTypeId}`;
                              }

                              if (v?.length < 2) return [];
                              return axios.get(url).then((res) => res?.data);
                            }}
                          />
                        </td>
                        {/* "Payment Actual Amount" =  InputField component */}
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <InputField
                              // disabled={isDisabled}
                              value={item?.paymentActualAmount}
                              name="paymentActualAmount"
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value;
                                const copyPrv = [...shippingHeadOfCharges];
                                copyPrv[index].paymentActualAmount = value;
                                const num = +e.target.value || 0;

                                const isDisabled = num > 0;
                                copyPrv[
                                  index
                                ].isPaymentAdvanceAmountDisabled = isDisabled;

                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                item?.billRegisterId ||
                                item?.isPaymentActualAmountDisabled ||
                                !item?.paymentParty ||
                                isDisabled
                                  ? true
                                  : false
                              }
                              min={0}
                              step="any"
                            />
                          </div>
                        </td>
                        {/* "Payment Dummy Amount" =  InputField component */}
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <InputField
                              // disabled={isDisabled}
                              value={item?.paymentDummyAmount}
                              name="paymentDummyAmount"
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value;
                                const copyPrv = [...shippingHeadOfCharges];
                                copyPrv[index].paymentDummyAmount = value;

                                const num = +e.target.value || 0;
                                const isDisabled = num > 0;
                                copyPrv[
                                  index
                                ].isPaymentAdvanceAmountDisabled = isDisabled;

                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                item?.billRegisterId ||
                                item?.isPaymentDummyAmountDisabled ||
                                !item?.paymentParty ||
                                isDisabled
                                  ? true
                                  : false
                              }
                              min={0}
                              step="any"
                            />
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <InputField
                              // disabled={isDisabled}
                              value={item?.paymentAdvanceAmount}
                              name="paymentAdvanceAmount"
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value;
                                const copyPrv = [...shippingHeadOfCharges];
                                copyPrv[index].paymentAdvanceAmount = value;

                                const num = +e.target.value || 0;
                                const isDisabled = num > 0;
                                copyPrv[
                                  index
                                ].isPaymentActualAmountDisabled = isDisabled;
                                copyPrv[
                                  index
                                ].isPaymentDummyAmountDisabled = isDisabled;

                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                item?.billRegisterId ||
                                item?.advancedBillRegisterId ||
                                item?.isPaymentAdvanceAmountDisabled ||
                                !item?.paymentParty ||
                                isDisabled
                                  ? true
                                  : false
                              }
                              min={0}
                              step="any"
                            />
                          </div>
                        </td>
                        {/* Is Combind Checkbox */}
                        <td>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="products-delete-tooltip">
                                Is Combind
                                {item?.isCommonPaymentCombind &&
                                  item?.isCommonPaymentCombind}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              checked={item?.isCommonPaymentCombind}
                              onChange={(e) => {
                                const copyPrv = [...shippingHeadOfCharges];
                                copyPrv[index].isCommonPaymentCombind =
                                  e?.target?.checked;
                                copyPrv[index].isActulCombindToMbl =
                                  e?.target?.checked;
                                copyPrv[index].isDummyCombindToMbl =
                                  e?.target?.checked;
                                copyPrv[index].isPaymentCombindToMbl =
                                  e?.target?.checked;
                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                item?.billRegisterId ||
                                item?.advancedBillRegisterId ||
                                item?.isCommonPaymentCombindDisabled ||
                                !item?.paymentParty ||
                                isDisabled
                                  ? true
                                  : false
                              }
                            />
                          </OverlayTrigger>
                        </td>

                        {/* above  row copy button*/}
                        <td>
                          <div
                            className="d-flex justify-content-center"
                            style={{
                              gap: '5px',
                            }}
                          >
                            <button
                              disabled={
                                isDisabled ||
                                item?.billRegisterId ||
                                item?.advancedBillRegisterId
                              }
                              type="button"
                              className="btn btn-primary"
                              onClick={() => {
                                // copy above row item copy and add new row
                                const aboveRow = shippingHeadOfCharges?.[index];
                                if (!aboveRow) {
                                  return toast.warn('Please select above row');
                                }
                                // insert new row below the above row
                                setShippingHeadOfCharges([
                                  ...shippingHeadOfCharges?.slice(0, index + 1),
                                  {
                                    ...aboveRow,
                                    billingId: aboveRow?.billingId || 0,
                                  },
                                  ...shippingHeadOfCharges?.slice(index + 1),
                                ]);
                              }}
                            >
                              <i class="fa fa-clone" aria-hidden="true"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ChargesModal;
