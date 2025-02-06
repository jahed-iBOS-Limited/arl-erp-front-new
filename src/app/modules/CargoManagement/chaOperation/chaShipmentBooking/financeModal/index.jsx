import { Box, Tab, Tabs } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import NewSelect from '../../../../_helper/_select';

const validationSchema = Yup.object().shape({
  // paymentParty: Yup.object().shape({
  //   value: Yup.string().required('Party is required'),
  //   label: Yup.string().required('Party is required'),
  // }),
});

const FinanceModal = ({ clickRowDto, CB }) => {
  const [paymentPartyListDDL, setPaymentPartyListDDL] = useState([]);

  const [
    chaServiceChargeData,
    getChaServiceChargeData,
    chaServiceChargeLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState('invoice');
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [billingDataFilterData, setBillingDataFilterData] = React.useState([]);

  const [
    ,
    saveLogisticBillRegister,
    chaBillRegisterLoading,
    ,
  ] = useAxiosPost();

  const commonGetByIdHandler = (dataList, type, values) => {
    setBillingDataFilterData([]);
    if (type === 'invoice') {
      // filter by collectionAmount
      const filterByCollectionAmount = dataList?.filter(
        (item) => (+item?.collectionAmount || 0) > 0 && !item?.invoiceCode,
      );
      const newData = filterByCollectionAmount?.map((item) => {
        return {
          ...item,
          rate: item?.collectionRate,
          amount: item?.collectionAmount,
          qty: item?.collectionQty,
        };
      });
      setBillingDataFilterData(newData);
    }

    if (type === 'billGenerate') {
      const filterByPaymentParty = dataList?.filter(
        (item) =>
          item?.partyId === values?.paymentParty?.value &&
          (+item?.paymentAmount || 0) > 0 &&
          !item?.billRegisterCode,
      );
      const newData = filterByPaymentParty?.map((item) => {
        return {
          ...item,
          rate: item?.paymentRate,
          amount: item?.paymentAmount,
          qty: item?.paymentQty,
        };
      });
      setBillingDataFilterData(newData);
    }
  };

  const saveHandler = (values) => {
    if (billingDataFilterData?.length === 0)
      return toast.warning('No data found to save');
    const payload = {
      headerData: {},
    };

    saveLogisticBillRegister(
      `${imarineBaseUrl}/domain/ShippingService/LogisticBillRegister`,
      payload,
      (data) => {
        CB();
      },
      true,
    );
  };

  const handleChange = (event, newValue, values) => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
    commonGetByIdHandler(chaServiceChargeData, newValue);
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (clickRowDto?.chabookingId) {
      getChaServiceChargeData(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaServiceChargeData?ChabookingId=${clickRowDto?.chabookingId}`,
        (resData) => {
          commonGetByIdHandler(resData, 'invoice');

          const billingDataList = resData
            ?.filter((i) => i.partyId)
            ?.map((item) => {
              return {
                ...item,
                value: item?.partyId,
                label: item?.partyName,
                partyId: item?.partyId,
              };
            });
          const unique = [
            ...new Map(
              billingDataList.map((item) => [item['partyId'], item]),
            ).values(),
          ];
          setPaymentPartyListDDL(unique || []);
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);

  const invoiceTypeHandeler = (values) => {
    commonGetByIdHandler(chaServiceChargeData, activeTab, values);
  };

  return (
    <>
      <div>
        {(chaServiceChargeLoading || chaBillRegisterLoading) && <Loading />}
      </div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            narration: '',
            paymentParty: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm();
            });
          }}
          innerRef={formikRef}
        >
          {({
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            values,
            resetForm,
          }) => (
            <Form className="form form-label-right">
              <div className="">
                <>
                  <div className="d-flex justify-content-end mt-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={billingDataFilterData?.length === 0}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </>
              </div>
              <Box>
                <Tabs
                  value={activeTab}
                  onChange={(event, newValue) => {
                    handleChange(event, newValue, values);
                  }}
                  variant="scrollable"
                  indicatorColor="primary"
                  textColor="primary"
                  style={{ backgroundColor: 'white' }}
                >
                  <Tab label="Invoice" value="invoice" />
                  <Tab label="Bill Generate" value="billGenerate" />
                </Tabs>
                <Box>
                  {activeTab === 'invoice' && (
                    <InvoiceCmp
                      values={values}
                      billingDataFilterData={billingDataFilterData}
                    />
                  )}
                  {activeTab === 'billGenerate' && (
                    <BillCmp
                      values={values}
                      billingDataFilterData={billingDataFilterData}
                      invoiceTypeHandeler={invoiceTypeHandeler}
                      paymentPartyListDDL={paymentPartyListDDL}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                    />
                  )}
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </>
    </>
  );
};

export default FinanceModal;

const BillCmp = ({
  errors,
  touched,
  setFieldValue,
  billingDataFilterData,
  paymentPartyListDDL,
  values,
  invoiceTypeHandeler,
}) => {
  return (
    <>
      <div className="form-group row global-form">
        <div className="col-lg-3">
          <NewSelect
            name="paymentParty"
            options={paymentPartyListDDL || []}
            value={values?.paymentParty}
            label="Partner"
            onChange={(valueOption) => {
              setFieldValue('paymentParty', valueOption);
              invoiceTypeHandeler({
                ...values,
                paymentParty: valueOption,
              });
            }}
            placeholder="Select Partner"
            errors={errors}
            touched={touched}
          />
        </div>
      </div>{' '}
      <div className="table-responsive">
        <table className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Attribute</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {values?.paymentParty?.value &&
              billingDataFilterData?.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'right' }}> {index + 1} </td>
                  <td className="align-middle">
                    <label>{row?.headOfCharges}</label>
                  </td>
                  <td style={{ textAlign: 'right' }}>{row?.rate}</td>
                  <td style={{ textAlign: 'right' }}>{row?.qty}</td>
                  <td style={{ textAlign: 'right' }}>{row?.amount}</td>
                </tr>
              ))}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>
                <b>Total</b>
              </td>
              <td style={{ textAlign: 'right' }}>
                <b>
                  {' '}
                  {billingDataFilterData?.reduce(
                    (acc, curr) => acc + (+curr?.amount || 0),
                    0,
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const InvoiceCmp = ({ billingDataFilterData }) => {
  return (
    <>
      <div className="table-responsive">
        <table className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Attribute</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {billingDataFilterData?.map((row, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'right' }}> {index + 1} </td>
                <td className="align-middle">
                  <label>{row?.headOfCharges}</label>
                </td>
                <td style={{ textAlign: 'right' }}>{row?.rate}</td>
                <td style={{ textAlign: 'right' }}>{row?.qty}</td>
                <td style={{ textAlign: 'right' }}>{row?.amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>
                <b>Total</b>
              </td>
              <td style={{ textAlign: 'right' }}>
                <b>
                  {billingDataFilterData?.reduce(
                    (acc, curr) => acc + (+curr?.amount || 0),
                    0,
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
