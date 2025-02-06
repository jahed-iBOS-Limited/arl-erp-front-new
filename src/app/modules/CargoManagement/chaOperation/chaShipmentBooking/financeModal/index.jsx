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

const FinanceModal = ({ rowClickData, CB }) => {
  const tradeTypeId = rowClickData?.tradeTypeId || 1;
  const formikRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState('invoice');
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [billingDataFilterData, setBillingDataFilterData] = React.useState([]);

  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    masterBLWiseBilling,
    getMasterBLWiseBilling,
    masterBLWiseBillingLoading,
  ] = useAxiosGet();
  const [
    ,
    saveLogisticBillRegister,
    logisticBillRegisterLoading,
    ,
  ] = useAxiosPost();

  useEffect(() => {
    commonGetByIdHandler(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const commonGetByIdHandler = (modeOfTransportId, isAdvanced) => {};

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

  // filter by paymentPartyId

  const invoiceTypeHandeler = (valueOption) => {
    setBillingDataFilterData([]);
    if (activeTab === 'invoice') {
    }

    if (activeTab === 'billGenerate') {
    }
  };

  const handleChange = (event, newValue, values) => {
    const copyValues = { ...values };
    if (formikRef.current) {
      formikRef.current.resetForm();
      setBillingDataFilterData([]);
    }
    setActiveTab(newValue);
    // const modeOfTransportId = copyValues?.billingType;
    // formikRef.current.setFieldValue('billingType', modeOfTransportId);
    // if (newValue === 'invoice') {
    //   commonGetByIdHandler(modeOfTransportId, false);
    // }
    // if (newValue === 'billGenerate') {
    //   commonGetByIdHandler(modeOfTransportId, true);
    // }
  };
  return (
    <>
      <div>
        {(masterBLWiseBillingLoading || logisticBillRegisterLoading) && (
          <Loading />
        )}
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
                      disabled={masterBLWiseBilling?.length === 0}
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
              invoiceTypeHandeler(valueOption);
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
              <th> Rate</th>
              <th>Actual</th>
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
                </tr>
              ))}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>
                Total
              </td>
              <td style={{ textAlign: 'right' }}>
                {billingDataFilterData?.reduce(
                  (acc, curr) => acc + (+curr?.paymentPayAmount || 0),
                  0,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const InvoiceCmp = ({ billingDataFilterData, values }) => {
  return (
    <>
      <div className="table-responsive">
        <table className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Attribute</th>
              <th> Rate</th>
              <th>Actual</th>
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
                </tr>
              ))}
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>
                Total
              </td>
              <td style={{ textAlign: 'right' }}>
                {billingDataFilterData?.reduce(
                  (acc, curr) => acc + (+curr?.paymentPayAmount || 0),
                  0,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
