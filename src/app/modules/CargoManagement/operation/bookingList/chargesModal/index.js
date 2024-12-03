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
const validationSchema = Yup.object().shape({});
function ChargesModal({ rowClickData, CB }) {
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
              };
            });
            const filterNewData = resSveData
              ?.filter((item) => item?.headOfChargeId === 0)
              .map((item) => {
                return {
                  label: item?.headOfCharges,
                  value: 0,
                  checked: true,
                  amount: item?.chargeAmount,
                  billingId: item?.billingId || 0,
                  actualExpense: item?.actualExpense || 0,
                  consigneeCharge: item?.consigneeCharge || '',
                };
              });
            setShippingHeadOfCharges([...modifyData, ...filterNewData]);
          },
        );
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payload = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          exchangeRate: values?.exchangeRate || 0,
          billingId: item?.billingId || 0,
          bookingRequestId: bookingRequestId || 0,
          headOfChargeId: item?.value || 0,
          headOfCharges: item?.label || '',
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
          exchangeRate: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.exchangeRate}
                    label="Exchange Rate"
                    name="exchangeRate"
                    type="text"
                    onChange={(e) => setFieldValue('exchangeRate', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.attribute}
                    label="Attribute"
                    name="attribute"
                    type="text"
                    onChange={(e) => setFieldValue('attribute', e.target.value)}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Shipper Charge ($)"
                    name="amount"
                    type="number"
                    onChange={(e) => setFieldValue('amount', e.target.value)}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeCharge}
                    label="Consignee Charge ($)"
                    name="consigneeCharge"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('consigneeCharge', e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.actualExpense}
                    label="Procured Charge ($)"
                    name=" actualExpense"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('actualExpense', e.target.value)
                    }
                  />
                </div>
                <div className="col-lg-3">
                  {/* add button */}
                  <div className="d-flex justify-content-start align-items-center mt-5">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (!values?.exchangeRate) {
                          return toast.warn('Exchange Rate is required');
                        }

                        if (!values?.attribute) {
                          return toast.warn('Attribute is required');
                        }
                        if (!values?.amount) {
                          return toast.warn('Amount is required');
                        }
                        setShippingHeadOfCharges([
                          ...shippingHeadOfCharges,
                          {
                            label: values?.attribute,
                            value: 0,
                            checked: true,
                            amount: values?.amount,
                            actualExpense: values?.actualExpense,
                            consigneeCharge: values?.consigneeCharge,
                            exchangeRate: values?.exchangeRate
                          },
                        ]);
                        // resetForm();
                        setFieldValue('attribute', '');
                        setFieldValue('amount', '');
                        setFieldValue('actualExpense', '');
                        setFieldValue('consigneeCharge', '');
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                {' '}
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th>
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
                                    amount: e?.target?.checked
                                      ? item?.amount
                                      : '',
                                    actualExpense: e?.target?.checked
                                      ? item?.actualExpense
                                      : '',
                                  };
                                }),
                              );
                            }}
                          />
                        </th>
                        <th className="p-0">SL</th>
                        <th className="p-0">Attribute</th>
                        <th className="p-0">Shipper Charge ($)</th>

                        <th className="p-0">Consignee Charge ($)</th>
                        <th className="p-0">Procured Charge ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingHeadOfCharges?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              checked={item?.checked}
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].checked = e.target.checked;
                                copyprvData[index].amount = '';
                                copyprvData[index].actualExpense = '';
                                setShippingHeadOfCharges(copyprvData);
                              }}
                            />
                          </td>
                          <td> {index + 1} </td>
                          <td className="align-middle">
                            <label>{item?.label}</label>
                          </td>
                          <td className="align-middle">
                            <InputField
                              disabled={!item?.checked}
                              value={item?.amount}
                              required={item?.checked}
                              type="number"
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].amount = e.target.value;
                                setShippingHeadOfCharges(copyprvData);
                              }}
                              name="amount"
                              min="0"
                            />
                          </td>

                          <td className="align-middle">
                            <InputField
                              disabled={!item?.checked}
                              value={item?.consigneeCharge}
                              type="number"
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].consigneeCharge =
                                  e.target.value;
                                setShippingHeadOfCharges(copyprvData);
                              }}
                              name="consigneeCharge"
                              min="0"
                            />
                          </td>
                          <td className="align-middle">
                            <InputField
                              disabled={!item?.checked}
                              value={item?.actualExpense}
                              type="number"
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].actualExpense =
                                  e.target.value;
                                setShippingHeadOfCharges(copyprvData);
                              }}
                              name="actualExpense"
                              min="0"
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        {/* total */}
                        <td colSpan="3" className="text-center">
                          Total
                        </td>
                        <td>
                          {shippingHeadOfCharges
                            ?.filter((item) => item?.checked)
                            .reduce(
                              (acc, item) => acc + (+item?.amount || 0),
                              0,
                            )}
                        </td>
                        <td>
                          {shippingHeadOfCharges
                            ?.filter((item) => item?.checked)
                            .reduce(
                              (acc, item) =>
                                acc + (+item?.consigneeCharge || 0),
                              0,
                            )}
                        </td>
                        <td>
                          {shippingHeadOfCharges
                            ?.filter((item) => item?.checked)
                            .reduce(
                              (acc, item) => acc + (+item?.actualExpense || 0),
                              0,
                            )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ChargesModal;
