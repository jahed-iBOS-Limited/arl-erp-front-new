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
import TextArea from '../../../../_helper/TextArea';

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

  //   [
  //     {
  //         "serviceChargeId": 1,
  //         "bookingId": 1,
  //         "headOfChargeId": 35,
  //         "headOfCharges": "Customs Duty (bfusnugnsfbgysdf)",
  //         "collectionRate": 10.000000,
  //         "collectionQty": 20,
  //         "collectionAmount": 200.000000,
  //         "paymentRate": 30.000000,
  //         "paymentQty": 40,
  //         "paymentAmount": 1200.000000,
  //         "serviceChargeDate": "2025-02-06T11:10:40.057",
  //         "partyId": 106248,
  //         "partyName": "Jaman Interiors and Exteriors Ltd.",
  //         "isActive": true,
  //         "createdBy": 521235,
  //         "createdAt": "2025-02-06T10:10:20.657",
  //         "updatedAt": "2025-02-06T11:10:38.927",
  //         "updatedBy": 521235,
  //         "billRegisterId": null,
  //         "billRegisterCode": null,
  //         "adjustmentJournalId": null,
  //         "invoiceId": null,
  //         "invoiceCode": null
  //     }
  // ]
  const saveHandler = (values) => {
    if (billingDataFilterData?.length === 0)
      return toast.warning('No data found to save');

    if (!clickRowDto?.customerId) return toast.warning('Customer not found');
    const payload = {
      accountId: profileData?.accountId,
      unitId: selectedBusinessUnit?.value,
      bookingDate: new Date(),
      bookingNumber: clickRowDto?.chabookingCode,
      paymentTerms: values?.narration || '',
      actionBy: profileData?.userId,
      businessPartnerId: clickRowDto?.customerId || 0,
      businessPartnerName: clickRowDto?.customerName || '',
      rowString: billingDataFilterData?.map((item) => {
        return {
          intBillingId: item?.bookingId || 0,
          intHeadOfChargeid: item?.headOfChargeId || 0,
          strHeadoffcharges: item?.headOfCharges || '',
          intCurrencyid: 0,
          strCurrency: '',
          numrate: item?.rate || 0,
          numconverstionrate: 0,
          strUom: '',
          numamount: item?.amount || 0,
          numvatAmount: 0,
        };
      }),
    };

    saveLogisticBillRegister(
      `${imarineBaseUrl}/domain/CHAShipment/ChaShipmentBookingInvoice`,
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
        {/* Naration */}
        <div className="col-lg-3">
          <label>Narration</label>
          <TextArea
            placeholder="Write your narration"
            value={values?.narration}
            name="narration"
            type="text"
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

const InvoiceCmp = ({ billingDataFilterData, values }) => {
  return (
    <>
      <div className="form-group row global-form">
        {/* Naration */}
        <div className="col-lg-3">
          <label>Narration</label>
          <TextArea
            placeholder="Write your narration"
            value={values?.narration}
            name="narration"
            type="text"
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
