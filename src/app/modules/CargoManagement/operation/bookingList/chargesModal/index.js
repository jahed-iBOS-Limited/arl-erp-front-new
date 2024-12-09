import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import './style.css';
import NewSelect from '../../../../_helper/_select';
import IDelete from '../../../../_helper/_helperIcons/_delete';
const paymentTypeDDL = [
  {
    value: 1,
    label: 'Shipper',
  },
  {
    value: 2,
    label: 'Consignee',
  },
  {
    value: 3,
    label: 'Delivery Agent',
  },
  {
    value: 4,
    label: 'Notify Party(1)',
  },
  {
    value: 5,
    label: 'Notify Party(2)',
  },
];
const validationSchema = Yup.object().shape({
  // exchangeRate: Yup.number().required('Exchange Rate is required'),
  currency: Yup.object().shape({
    label: Yup.string().required('Currency is required'),
    value: Yup.string().required('Currency is required'),
  }),
});
function ChargesModal({ rowClickData, CB }) {
  const formikRef = React.useRef(null);
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, getSaveBookedRequestBilling, bookedRequestBilling] = useAxiosPost();
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

  useEffect(() => {
    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges`,
      (resShippingHeadOfCharges) => {
        getBookedRequestBillingData(
          `${imarineBaseUrl}/domain/ShippingService/GetBookedRequestBillingData?bookingId=${bookingRequestId}`,
          (resSveData) => {
            const modifyData = resShippingHeadOfCharges?.map((item) => {
              const findData = resSveData?.find(
                (findItem) => findItem?.headOfChargeId === item?.value,
              );
              return {
                ...item,
                billingId: findData?.billingId || 0,
                checked: findData ? true : false,
                amount: findData?.chargeAmount || '',
                actualExpense: findData?.actualExpense || '',
                consigneeCharge: findData?.consigneeCharge || '',
                headOfCharges: item?.label || '',
                headOfChargeId: item?.value || 0,
              };
            });
            const filterNewData = resSveData
              ?.filter((item) => item?.headOfChargeId === 0)
              .map((item) => {
                return {
                  headOfCharges: item?.headOfCharges,
                  headOfChargeId: item?.headOfChargeId,
                  checked: true,
                  amount: item?.chargeAmount,
                  billingId: item?.billingId || 0,
                  actualExpense: item?.actualExpense || 0,
                  consigneeCharge: item?.consigneeCharge || '',
                };
              });

            if (formikRef.current) {
              formikRef.current.setFieldValue(
                'currency',
                resSveData?.[0]
                  ? {
                      label: resSveData?.[0]?.currency,
                      value: resSveData?.[0]?.currencyId,
                    }
                  : '',
              );
              formikRef.current.setFieldValue(
                'exchangeRate',
                resSveData?.[0] ? resSveData?.[0]?.exchangeRate : '',
              );
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payload = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          exchangeRate: +values?.exchangeRate || 0,
          currencyId: values?.currency?.value || 0,
          currency: values?.currency?.label || '',
          billingId: item?.billingId || 0,
          bookingRequestId: bookingRequestId || 0,
          headOfChargeId: item?.headOfChargeId || 0,
          headOfCharges: item?.headOfCharges || '',
          chargeAmount: item?.amount || 0,
          consigneeCharge: item?.consigneeCharge || 0,
          actualExpense: item?.actualExpense || 0,
          isActive: true,
          billingDate: new Date(),
          createdBy: profileData?.userId || 0,
          createdAt: new Date(),
          updatedBy: new Date(),
          updatedAt: profileData?.userId || 0,
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
          consigneeCharge: '',
          exchangeRate: '',
          currency: '',
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
          <>
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
              <div className="form-group ">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      label={'Currency'}
                      options={currencyList}
                      value={values?.currency}
                      name="currency"
                      onChange={(valueOption) => {
                        setFieldValue('currency', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.exchangeRate}
                      label="Exchange Rate"
                      name="exchangeRate"
                      type="text"
                      onChange={(e) =>
                        setFieldValue('exchangeRate', e.target.value)
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-6">
                  <InputField
                    value={values?.attribute}
                    label="Attribute"
                    name="attribute"
                    type="text"
                    onChange={(e) => setFieldValue('attribute', e.target.value)}
                  />
                </div>
                <div className="col-lg-3">
                  {/* add button */}
                  <div className="d-flex justify-content-start align-items-center mt-5">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (!values?.attribute) {
                          return toast.warn('Attribute is required');
                        }
                        setShippingHeadOfCharges([
                          ...shippingHeadOfCharges,
                          {
                            headOfCharges: values?.attribute,
                            headOfChargeId: 0,
                            checked: true,
                            collectionAccrualAmount: '',
                            collectionDummyAmount: '',
                            collectionType: '',
                            paymentAccrualAmount: '',
                            paymentDummyAmount: '',
                            paymentType: '',
                          },
                        ]);
                        // resetForm();
                        setFieldValue('attribute', '');
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>{' '}
              <div className="table-responsive">
                <table className="table global-table">
                  <thead>
                    <tr>
                      <th rowspan="2">
                        <input
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
                                  collectionAccrualAmount: e?.target?.checked
                                    ? item?.collectionAccrualAmount
                                    : '',
                                  collectionDummyAmount: e?.target?.checked
                                    ? item?.collectionDummyAmount
                                    : '',
                                  collectionType: e?.target?.checked
                                    ? item?.collectionType
                                    : '',
                                  paymentAccrualAmount: e?.target?.checked
                                    ? item?.paymentAccrualAmount
                                    : '',
                                  paymentDummyAmount: e?.target?.checked
                                    ? item?.paymentDummyAmount
                                    : '',
                                  paymentType: e?.target?.checked
                                    ? item?.paymentType
                                    : '',
                                };
                              }),
                            );
                          }}
                        />
                      </th>
                      <th rowspan="2">SL</th>
                      <th rowspan="2">Attribute</th>
                      <th colspan="3" class="group-header">
                        Collection <span>(Amounts & Types)</span>
                      </th>
                      <th colspan="3" class="group-header">
                        Payment <span>(Amounts & Types)</span>
                      </th>
                      <th rowspan="2">Action</th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          width: '60px',
                        }}
                      >
                        Accrual Amount
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                      >
                        Dummy Amount
                      </th>
                      <th>Type</th>
                      <th
                        style={{
                          width: '60px',
                        }}
                      >
                        Accrual Amount
                      </th>
                      <th
                        style={{
                          width: '60px',
                        }}
                      >
                        Dummy Amount
                      </th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippingHeadOfCharges?.map((item, index) => {
                      return (
                        <>
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                checked={item?.checked}
                                onChange={(e) => {
                                  setShippingHeadOfCharges(
                                    shippingHeadOfCharges?.map((data) => {
                                      if (data?.value === item?.value) {
                                        return {
                                          ...data,
                                          checked: e?.target?.checked,
                                          collectionAccrualAmount: e?.target
                                            ?.checked
                                            ? item?.collectionAccrualAmount
                                            : '',
                                          collectionDummyAmount: e?.target
                                            ?.checked
                                            ? item?.collectionDummyAmount
                                            : '',
                                          collectionType: e?.target?.checked
                                            ? item?.collectionType
                                            : '',
                                          paymentAccrualAmount: e?.target
                                            ?.checked
                                            ? item?.paymentAccrualAmount
                                            : '',
                                          paymentDummyAmount: e?.target?.checked
                                            ? item?.paymentDummyAmount
                                            : '',
                                          paymentType: e?.target?.checked
                                            ? item?.paymentType
                                            : '',
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

                            {/*  "Collection  Accrual Amount" =  InputField component */}
                            <td>
                              <InputField
                                disabled={!item?.checked}
                                value={item?.collectionAccrualAmount}
                                name="collectionAccrualAmount"
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const copyPrv = [...shippingHeadOfCharges];
                                  copyPrv[
                                    index
                                  ].collectionAccrualAmount = value;
                                  setShippingHeadOfCharges(copyPrv);
                                }}
                              />
                            </td>
                            {/* "Collection Dummy  Dummy Amount" =  InputField component */}
                            <td>
                              <InputField
                                disabled={!item?.checked}
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
                            {/* "Collection Type" =  NewSelect component */}
                            <td>
                              <NewSelect
                                isDisabled={!item?.checked}
                                options={
                                  paymentTypeDDL?.filter(
                                    (item) =>
                                      item?.value !== item?.paymentType?.value,
                                  ) || []
                                }
                                value={item?.collectionType}
                                name="collectionType"
                                onChange={(valueOption) => {
                                  const value = valueOption;
                                  const copyPrv = [...shippingHeadOfCharges];
                                  copyPrv[index].collectionType = value;
                                  setShippingHeadOfCharges(copyPrv);
                                }}
                              />
                            </td>
                            {/* "Payment Accrual Amount" =  InputField component */}
                            <td>
                              <InputField
                                disabled={!item?.checked}
                                value={item?.paymentAccrualAmount}
                                name="paymentAccrualAmount"
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const copyPrv = [...shippingHeadOfCharges];
                                  copyPrv[index].paymentAccrualAmount = value;
                                  setShippingHeadOfCharges(copyPrv);
                                }}
                              />
                            </td>
                            {/* "Payment Dummy Amount" =  InputField component */}
                            <td>
                              <InputField
                                disabled={!item?.checked}
                                value={item?.paymentDummyAmount}
                                name="paymentDummyAmount"
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const copyPrv = [...shippingHeadOfCharges];
                                  copyPrv[index].paymentDummyAmount = value;
                                  setShippingHeadOfCharges(copyPrv);
                                }}
                              />
                            </td>
                            {/* "Payment Type" =  NewSelect component */}
                            <td>
                              <NewSelect
                                isDisabled={!item?.checked}
                                options={
                                  paymentTypeDDL?.filter(
                                    (item) =>
                                      item?.value !== item?.paymentType?.value,
                                  ) || []
                                }
                                value={item?.paymentType}
                                name="paymentType"
                                onChange={(valueOption) => {
                                  const value = valueOption;
                                  const copyPrv = [...shippingHeadOfCharges];
                                  copyPrv[index].paymentType = value;
                                  setShippingHeadOfCharges(copyPrv);
                                }}
                              />
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
                                  disabled={!item?.checked}
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    // copy above row item copy and add new row
                                    const aboveRow =
                                      shippingHeadOfCharges?.[index];
                                    if (!aboveRow) {
                                      return toast.warn(
                                        'Please select above row',
                                      );
                                    }
                                    // insert new row below the above row
                                    setShippingHeadOfCharges([
                                      ...shippingHeadOfCharges?.slice(
                                        0,
                                        index + 1,
                                      ),
                                      {
                                        ...aboveRow,
                                        billingId: aboveRow?.billingId || 0,
                                      },
                                      ...shippingHeadOfCharges?.slice(
                                        index + 1,
                                      ),
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
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ChargesModal;
