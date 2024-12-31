import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import './style.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const validationSchema = Yup.object().shape({});
function ChargesModal({ rowClickData, CB }) {
  const formikRef = React.useRef(null);
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, getSaveBookedRequestBilling, bookedRequestBilling] = useAxiosPost();
  const [shipingCargoTypeDDL, getShipingCargoTypeDDL] = useAxiosGet();
  const [
    ,
    getBookedRequestBillingData,
    bookedRequestBillingDataLoading,
  ] = useAxiosGet();
  const [
    shippingHeadOfCharges,
    getShippingHeadOfCharges,
    shippingHeadOfChargesLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();
  const [currencyList, GetBaseCurrencyList, , setCurrencyList] = useAxiosGet();
  console.log(rowClickData, 'rowClickData');
  useEffect(() => {
    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges`,
      (resShippingHeadOfCharges) => {
        getBookedRequestBillingData(
          `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}`,
          (resSveData) => {
            if (formikRef.current) {
              // profitSharePercentage add
              formikRef.current.setFieldValue(
                'profitSharePercentage',
                resSveData?.[0]?.profitSharePercentage || '',
              );
            }
            const modifyData = resShippingHeadOfCharges?.map((item) => {
              const findData = resSveData?.find(
                (findItem) => findItem?.headOfChargeId === item?.value,
              );
              return {
                ...item,
                currencyId: findData?.currencyId || 0,
                currency: findData?.currency || '',
                exchangeRate: findData?.exchangeRate || '',
                billingId: findData?.billingId || 0,
                checked: findData ? true : false,
                amount: findData?.chargeAmount || '',
                actualExpense: findData?.actualExpense || '',
                headOfCharges: item?.label || '',
                headOfChargeId: item?.value || 0,
                collectionPartyType: findData?.collectionPartyType || '',
                collectionActualAmount: findData?.collectionActualAmount || '',
                collectionDummyAmount: findData?.collectionDummyAmount || '',
                paymentActualAmount: findData?.paymentActualAmount || '',
                paymentDummyAmount: findData?.paymentDummyAmount || '',
                paymentAdvanceAmount: findData?.paymentAdvanceAmount || '',
                paymentPartyType: findData?.paymentPartyType || 0,
                paymentPartyTypeId: findData?.paymentPartyTypeId || 0,
                paymentParty: findData?.paymentParty || 0,
                paymentPartyId: findData?.paymentPartyId || 0,
                collectionPartyTypeId: findData?.collectionPartyTypeId || 0,
                collectionPartyId: findData?.collectionPartyId || 0,
                collectionParty: findData?.collectionParty || '',
                isActulCombindToMbl: findData?.isActulCombindToMbl || false,
                IsDummyCombindToMbl: findData?.IsDummyCombindToMbl || false,
                IsPaymentCombindToMbl: findData?.IsPaymentCombindToMbl || false,
                profitSharePercentage: findData?.profitSharePercentage || 0,
                billingDate: item?.billingDate || new Date(),
              };
            });
            const filterNewData = resSveData
              ?.filter((item) => item?.headOfChargeId === 0)
              .map((item) => {
                return {
                  ...item,
                  currencyId: item?.currencyId || 0,
                  currency: item?.currency || '',
                  exchangeRate: item?.exchangeRate || '',
                  headOfCharges: item?.headOfCharges,
                  headOfChargeId: item?.headOfChargeId,
                  checked: true,
                  amount: item?.chargeAmount,
                  billingId: item?.billingId || 0,
                  actualExpense: item?.actualExpense || 0,
                  collectionPartyType: item?.collectionPartyType || 0,
                  collectionActualAmount: item?.collectionActualAmount || '',
                  collectionDummyAmount: item?.collectionDummyAmount || '',
                  paymentActualAmount: item?.paymentActualAmount || '',
                  paymentDummyAmount: item?.paymentDummyAmount || '',
                  paymentAdvanceAmount: item?.paymentAdvanceAmount || '',
                  paymentPartyType: item?.paymentPartyType || 0,
                  paymentPartyTypeId: item?.paymentPartyTypeId || 0,
                  paymentParty: item?.paymentParty || 0,
                  paymentPartyId: item?.paymentPartyId || 0,
                  isActulCombindToMbl: item?.isActulCombindToMbl || false,
                  IsDummyCombindToMbl: item?.IsDummyCombindToMbl || false,
                  IsPaymentCombindToMbl: item?.IsPaymentCombindToMbl || false,
                  profitSharePercentage: item?.profitSharePercentage || 0,
                  collectionPartyTypeId: item?.collectionPartyTypeId || 0,
                  collectionPartyId: item?.collectionPartyId || 0,
                  collectionParty: item?.collectionParty || '',
                  billingDate: item?.billingDate || new Date(),
                };
              });
            setShippingHeadOfCharges([...modifyData, ...filterNewData]);
          },
        );
      },
    );
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
    const payload = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          exchangeRate: +item?.exchangeRate || 0,
          currencyId: item?.currencyId || 0,
          currency: item?.currency || '',
          billingId: item?.billingId || 0,
          bookingRequestId: bookingRequestId || 0,
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
          isDummyCombindToMbl: item?.IsDummyCombindToMbl || false,
          isPaymentCombindToMbl: item?.IsPaymentCombindToMbl || false,
          profitSharePercentage: values?.profitSharePercentage || 0,

          masterBlId: rowClickData?.masterBlId || 0,
          masterBlCode: rowClickData?.masterBlCode || '',
          modeOfTransportId: rowClickData?.modeOfTransportId || 0,
          paymentActualCombindAmount: item?.paymentActualAmount || 0,
          paymentDummyCombindAmount: item?.paymentDummyAmount || 0,
          paymentAdvanceCombindAmount: item?.paymentAdvanceAmount || 0,
          billRegisterId: 0,
          billRegisterCode: '',
          advancedBillRegisterId: 0,
          advancedBillRegisterCode: '',
        };
      });
    if (payload.length === 0) {
      return toast.warn('Please select at least one charge');
    }
    getSaveBookedRequestBilling(
      `${imarineBaseUrl}/domain/ShippingService/SaveBookedRequestBilling`,
      payload,
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
          // exchangeRate: '',
          // currency: '',
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
                <div className="d-flex justify-content-end">
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
                />
              </div>
            </div>{' '}
            <div className="table-responsive">
              <table className="table global-table">
                <thead>
                  <tr>
                    <th rowspan="2">
                      {/* <input
                        type="checkbox"
                        checked={
                          shippingHeadOfCharges?.length > 0
                            ? shippingHeadOfCharges?.every(
                                (item) => item?.checked,
                              )
                            : false
                        }
                        onChange={(e) => {
                          setShippingHeadOfCharges(
                            shippingHeadOfCharges?.map((item) => {
                              return {
                                ...item,
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
                              };
                            }),
                          );
                        }}
                      /> */}
                    </th>
                    <th rowspan="2">SL</th>
                    <th rowspan="2">Attribute</th>
                    <th rowspan="2">Currency</th>
                    <th rowspan="2">Exchange Rate</th>
                    <th colspan="4" class="group-header">
                      Collection <span>(Amounts & Party)</span>
                    </th>
                    <th colspan="5" class="group-header">
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
                            disabled={
                              item?.billRegisterId ||
                              item?.advancedBillRegisterId
                            }
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
                            isDisabled={isDisabled}
                          />
                        </td>
                        <td>
                          <InputField
                            disabled={isDisabled}
                            value={item?.exchangeRate}
                            label=""
                            name="exchangeRate"
                            type="text"
                            onChange={(e) => {
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].exchangeRate = e.target.value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </td>

                        {/* "Collection Type" =  NewSelect component */}
                        <td>
                          <NewSelect
                            isDisabled={isDisabled}
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
                              isDisabled || !item?.collectionPartyType
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
                            disabled={isDisabled}
                            value={item?.collectionActualAmount}
                            name="collectionActualAmount"
                            type="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionActualAmount = value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
                          />
                        </td>
                        {/* "Collection Dummy  Dummy Amount" =  InputField component */}
                        <td>
                          <InputField
                            disabled={isDisabled}
                            value={item?.collectionDummyAmount}
                            name="collectionDummyAmount"
                            type="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              const copyPrv = [...shippingHeadOfCharges];
                              copyPrv[index].collectionDummyAmount = value;
                              setShippingHeadOfCharges(copyPrv);
                            }}
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
                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                (item?.billingId &&
                                  item?.isActulCombindToMbl) ||
                                item?.billRegisterId ||
                                isDisabled
                                  ? true
                                  : false
                              }
                            />
                            <div>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="products-delete-tooltip">
                                    Is Actual Combind To MBL
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={item?.isActulCombindToMbl}
                                  onChange={(e) => {
                                    const copyPrv = [...shippingHeadOfCharges];
                                    copyPrv[index].isActulCombindToMbl =
                                      e?.target?.checked;
                                    setShippingHeadOfCharges(copyPrv);
                                  }}
                                  disabled={
                                    (item?.billingId &&
                                      item?.isActulCombindToMbl) ||
                                    item?.billRegisterId ||
                                    isDisabled
                                      ? true
                                      : false
                                  }
                                />
                              </OverlayTrigger>
                            </div>
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
                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                (item?.billingId &&
                                  item?.IsDummyCombindToMbl) ||
                                item?.billRegisterId ||
                                isDisabled
                                  ? true
                                  : false
                              }
                            />
                            <div>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="products-delete-tooltip">
                                    Is Dummy Combind To MBL
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={item?.IsDummyCombindToMbl}
                                  onChange={(e) => {
                                    const copyPrv = [...shippingHeadOfCharges];
                                    copyPrv[index].IsDummyCombindToMbl =
                                      e?.target?.checked;
                                    setShippingHeadOfCharges(copyPrv);
                                  }}
                                  disabled={
                                    (item?.billingId &&
                                      item?.IsDummyCombindToMbl) ||
                                    item?.billRegisterId ||
                                    isDisabled
                                      ? true
                                      : false
                                  }
                                />
                              </OverlayTrigger>
                            </div>
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
                                setShippingHeadOfCharges(copyPrv);
                              }}
                              disabled={
                                (item?.billingId &&
                                  item?.IsPaymentCombindToMbl) ||
                                item?.billRegisterId ||
                                item?.advancedBillRegisterId ||
                                isDisabled
                                  ? true
                                  : false
                              }
                            />
                            <div>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="products-delete-tooltip">
                                    Is Advance Combind To MBL
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  checked={item?.IsPaymentCombindToMbl}
                                  onChange={(e) => {
                                    const copyPrv = [...shippingHeadOfCharges];
                                    copyPrv[index].IsPaymentCombindToMbl =
                                      e?.target?.checked;
                                    setShippingHeadOfCharges(copyPrv);
                                  }}
                                  disabled={
                                    (item?.billingId &&
                                      item?.IsPaymentCombindToMbl) ||
                                    item?.billRegisterId ||
                                    item?.advancedBillRegisterId ||
                                    isDisabled
                                      ? true
                                      : false
                                  }
                                />
                              </OverlayTrigger>
                            </div>
                          </div>
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
                              disabled={isDisabled}
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
                            {/* delate */}
                            {/* {item?.headOfChargeId === 0 && ( */}
                            <span
                              type="button"
                              onClick={() => {
                                setShippingHeadOfCharges(
                                  shippingHeadOfCharges?.filter(
                                    (data, i) => i !== index,
                                  ),
                                );
                              }}
                            >
                              <IDelete />
                            </span>
                            {/* )} */}
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
