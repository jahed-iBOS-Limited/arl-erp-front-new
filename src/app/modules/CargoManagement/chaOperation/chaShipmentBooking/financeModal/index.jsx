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
  narration: Yup.string(),
  paymentParty: Yup.mixed().when('activeTab', {
    is: 'billGenerate',
    then: Yup.mixed().required('Payment Party is required'),
    otherwise: Yup.mixed(),
  }),
});

const FinanceModal = ({ clickRowDto, CB }) => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [paymentPartyListDDL, getPaymentPartyListDDL, ,] = useAxiosGet();
  const [
    chaServiceChargeData,
    getChaServiceChargeData,
    chaServiceChargeLoading,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);

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
        (item) => (+item?.paymentAmount || 0) > 0 && !item?.billRegisterCode,
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

    if (activeTab === 'invoice') {
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
    }

    // Bill Generate
    if (activeTab === 'billGenerate') {
      const paylaod = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          businessUnitName: selectedBusinessUnit?.label,
          expenseForId: values?.paymentParty?.value || 0,
          expenseForName: values?.paymentParty?.label || '',
          dteFromDate: new Date(),
          dteToDate: new Date(),
          numTotalAmount: billingDataFilterData?.reduce(
            (acc, curr) => acc + (+curr?.amount || 0),
            0,
          ),
          comments: values?.narration || '',
          actionBy: profileData?.userId,

          sbuid: 0,
          sbuname: '',
          countryId: 0,
          plantId: 0,
          countryName: '',
          currencyId: 0,
          currencyName: '',
          internalAccountId: 0,
          projectId: 0,
          projectName: '',
          costCenterId: 0,
          costCenterName: '',
          instrumentId: 0,
          instrumentName: '',
          disbursementCenterId: 0,
          disbursementCenterName: '',
          vehicleId: '',
          numTotalApprovedAmount: 0,
          paymentCompleteBy: 0,
          adjustmentAmount: 0,
          pendingAmount: 0,
          expenseGroup: '',
        },
        objRow: billingDataFilterData?.map((item) => {
          return {
            numQuantity: +item?.qty || 0,
            numRate: +item?.rate || 0,
            numAmount: +item?.amount || 0,
            headOfChargeId: item?.headOfChargeId || 0,
            headOfCharge: item?.headOfCharges || '',
            headOfChargeTypeId: 2,
            headOfChargeTypeName: 'ChaChargeHead',
            dteExpenseDate: new Date(),
            rowId: 0,
            expenseId: 0,
            businessTransactionId: 0,
            businessTransactionName: '',
            expenseLocation: '',
            comments: values?.narration || '',
            attachmentLink: '',
            driverId: 0,
            costCenterId: 0,
            costCenterName: '',
            profitCenterId: 0,
            profitCenterName: '',
            costElementId: 0,
            costElementName: '',
            subGlaccountHeadId: 0,
            strSubGlaccountHead: '',
          };
        }),
      };

      saveLogisticBillRegister(
        `${imarineBaseUrl}/domain/CHAShipment/CreateChaExpenceRegister`,
        paylaod,
        (data) => {
          CB();
        },
        true,
      );
    }
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
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowDto]);

  useEffect(() => {
    getPaymentPartyListDDL(
      `${imarineBaseUrl}/domain/CHAShipment/GetChaEmployeeDDL`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            activeTab: activeTab,
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
                    setFieldValue('activeTab', newValue);
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
