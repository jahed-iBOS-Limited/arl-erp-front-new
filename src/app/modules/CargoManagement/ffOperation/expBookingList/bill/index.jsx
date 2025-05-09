import { Box, Tab, Tabs } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { DropzoneDialogBase } from 'react-mui-dropzone';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import NewSelect from '../../../../_helper/_select';
import { attachmentUpload } from '../../../../_helper/attachmentUpload';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import './style.css';

const validationSchema = Yup.object().shape({
  paymentParty: Yup.object().shape({
    value: Yup.string().required('Party is required'),
    label: Yup.string().required('Party is required'),
  }),
});

const BillGenerate = ({ rowClickData, CB, isAirOperation }) => {
  const tradeTypeId = rowClickData?.tradeTypeId || 1;
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uniqueBookingRequestList, setUniqueBookingRequestList] = useState([]);
  const [uploadImageLoading, setUploadImageLoading] = useState(null);
  const formikRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState('billGenerate');
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [billingDataFilterData, setBillingDataFilterData] = React.useState([]);

  const bookingRequestId = rowClickData?.bookingRequestId;
  const [
    masterBLWiseBilling,
    getMasterBLWiseBilling,
    masterBLWiseBillingLoading,
  ] = useAxiosGet();
  const [, saveLogisticBillRegister, logisticBillRegisterLoading, ,] =
    useAxiosPost();
  const [paymentPartyListDDL, setPaymentPartyListDDL] = useState();
  useEffect(() => {
    const modeOfTransportId = [1, 3].includes(rowClickData?.modeOfTransportId)
      ? 1
      : rowClickData?.modeOfTransportId;
    formikRef.current.setFieldValue('billingType', modeOfTransportId);
    commonGetByIdHandler(modeOfTransportId, false);
  }, [bookingRequestId]);

  const commonGetByIdHandler = (
    modeOfTransportId,
    isAdvanced,
    isBillGenerate
  ) => {
    let masterBlId = 0;
    // let masterBlCode = '';
    if ([1, 5].includes(modeOfTransportId)) {
      masterBlId = rowClickData?.airmasterBlId;
      // masterBlCode = rowClickData?.airMasterBlCode;
    }
    if (modeOfTransportId === 2) {
      masterBlId = rowClickData?.seamasterBlId;
      // masterBlCode = rowClickData?.seaMasterBlCode;
    }
    if (modeOfTransportId === 4) {
      masterBlId = rowClickData?.landmasterBlId;
    }
    if (!masterBlId) return toast.warning('Master BL Id not found');

    if (bookingRequestId) {
      getMasterBLWiseBilling(
        `${imarineBaseUrl}/domain/ShippingService/GetMasterBLWiseBilling?MasterBlId=${masterBlId}&sAdvanced=${isAdvanced}&modeOfTransportId=${modeOfTransportId}&isAirOperation=${
          isAirOperation || false
        }`,
        (resData) => {
          if (isBillGenerate) {
            const billingDataList = resData
              ?.filter(
                (i) =>
                  i?.paymentPartyId &&
                  i?.billRegisterCode &&
                  (i?.isAirOperation || false) === (isAirOperation || false)
              )
              ?.map((item) => {
                return {
                  paymentPartyId: item?.paymentPartyId,
                  value: item?.paymentPartyId,
                  label: item?.paymentParty,
                };
              });
            const unique = [
              ...new Map(
                billingDataList.map((item) => [item['paymentPartyId'], item])
              ).values(),
            ];
            setUniqueBookingRequestList(resData?.[0]?.bookingDatas || []);
            setPaymentPartyListDDL(unique || []);
          } else {
            const billingDataList = resData
              ?.filter(
                (i) =>
                  i?.paymentPartyId &&
                  !i?.billRegisterCode &&
                  (i?.isAirOperation || false) === (isAirOperation || false)
              )
              ?.map((item) => {
                return {
                  paymentPartyId: item?.paymentPartyId,
                  value: item?.paymentPartyId,
                  label: item?.paymentParty,
                };
              });
            const unique = [
              ...new Map(
                billingDataList.map((item) => [item['paymentPartyId'], item])
              ).values(),
            ];
            setUniqueBookingRequestList(resData?.[0]?.bookingDatas || []);
            setPaymentPartyListDDL(unique || []);
          }
        }
      );
    }
  };

  const saveHandler = (values) => {
    if (billingDataFilterData?.length === 0)
      return toast.warning('No data found to save');
    const payload = {
      headerData: {
        postingType: activeTab === 'billGenerate' ? 'billGenerate' : 'Advance',
        tradeTypeId: tradeTypeId,
        tradeTypeName: tradeTypeId === 1 ? 'Export' : 'Import',
        supplierInvoiceCode: '',
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessUnitName: selectedBusinessUnit?.label,
        sbuid: 0,
        sbuname: '',
        purchaseOrganizationId: 0,
        purchaseOrganizationName: '',
        plantId: 0,
        plantName: '',
        warehouseId: 0,
        warehouseName: '',
        purchaseOrderId: 0,
        purchaseOrderNo: '',
        purchaseOrderDate: new Date(),
        invoiceNumber: '',
        invoiceDate: new Date(),
        totalReferenceAmount: 0,
        grossInvoiceAmount: 0,
        deductionAmount: 0,
        advanceAdjustmentAmount: 0,
        netPaymentAmount:
          billingDataFilterData?.reduce(
            (acc, curr) => acc + (+curr?.paymentPayAmount || 0),
            0
          ) || 0,
        paymentDueDate: new Date(),
        remarks: values?.narration || '',
        actionBy: profileData?.userId,
        lastActionDateTime: new Date(),
        serverDateTime: new Date(),
        active: true,
        advanceAmount: 0,
        businessPartnerId: values?.paymentParty?.value,
        businessrName: values?.paymentParty?.label,
        businessPartnerPartneAddress: '',
        contactNumber: '',
        emailAddress: '',
        binNo: '',
        licenseNo: '',
      },
      rowListData: [],
      imageData: [
        {
          imageId: values?.documentFileId || '',
        },
      ],
      bookingDatas: uniqueBookingRequestList || [],
      chargeDatas:
        billingDataFilterData?.map((item) => {
          return {
            headOfChargeId: item?.headOfChargeId,
            amount: item?.paymentPayAmount,
          };
        }) || [],
    };

    saveLogisticBillRegister(
      `${imarineBaseUrl}/domain/ShippingService/LogisticBillRegister`,
      payload,
      (data) => {
        CB();
      },
      true
    );
  };

  // filter by paymentPartyId

  const invoiceTypeHandeler = (valueOption) => {
    setBillingDataFilterData([]);
    if (activeTab === 'billGenerate') {
      const typeWiseFilter = masterBLWiseBilling
        ?.filter((item) => {
          return (
            item?.paymentPartyId === valueOption?.value &&
            item?.paymentActualAmount &&
            !item?.billRegisterCode &&
            (item?.isAirOperation || false) === (isAirOperation || false)
          );
        })
        .map((item) => {
          const exchangeRate = item?.exchangeRate || 0;
          const paymentAdvanceAmount = item?.paymentAdvanceAmount || 0;
          const paymentActualAmount = item?.paymentActualAmount || 0;
          const paymentAmount = paymentActualAmount - paymentAdvanceAmount;
          const paymentPayAmount = exchangeRate * paymentAmount;
          return {
            ...item,
            paymentAmount: paymentAmount,
            paymentPayAmount: paymentPayAmount,
          };
        });
      setBillingDataFilterData(typeWiseFilter || []);
    }

    // if advance generate
    if (activeTab === 'advanceGenerate') {
      const typeWiseFilter = masterBLWiseBilling
        ?.filter((item) => {
          return (
            item?.paymentPartyId === valueOption?.value &&
            item?.paymentAdvanceAmount
          );
        })
        .map((item) => {
          const exchangeRate = item?.exchangeRate || 0;
          const paymentAdvanceAmount = item?.paymentAdvanceAmount || 0;
          const paymentPayAmount = exchangeRate * paymentAdvanceAmount;
          return {
            ...item,
            paymentPayAmount: paymentPayAmount,
          };
        });
      setBillingDataFilterData(typeWiseFilter || []);
    }

    // if view bill invoice
    if (activeTab === 'viewBillInvoice') {
      const typeWiseFilter = masterBLWiseBilling
        ?.filter((item) => {
          return (
            item?.paymentPartyId === valueOption?.value &&
            item?.billRegisterCode
          );
        })
        .map((item) => {
          const exchangeRate = item?.exchangeRate || 0;
          const paymentAdvanceAmount = item?.paymentAdvanceAmount || 0;
          const paymentActualAmount = item?.paymentActualAmount || 0;
          const paymentAmount = paymentActualAmount - paymentAdvanceAmount;
          const paymentPayAmount = exchangeRate * paymentAmount;
          return {
            ...item,
            paymentPayAmount: paymentPayAmount,
          };
        });
      console.log(typeWiseFilter, 'typeWiseFilter');
      setBillingDataFilterData(typeWiseFilter || []);
    }
  };

  const handleChange = (event, newValue, values) => {
    const copyValues = { ...values };
    if (formikRef.current) {
      formikRef.current.resetForm();
      setBillingDataFilterData([]);
    }
    setActiveTab(newValue);
    const modeOfTransportId = copyValues?.billingType;
    formikRef.current.setFieldValue('billingType', modeOfTransportId);
    if (newValue === 'billGenerate') {
      commonGetByIdHandler(modeOfTransportId, false);
    }
    if (newValue === 'advanceGenerate') {
      commonGetByIdHandler(modeOfTransportId, true);
    }
    if (newValue === 'viewBillInvoice') {
      commonGetByIdHandler(modeOfTransportId, false, true);
    }
  };
  return (
    <>
      <div>
        {(masterBLWiseBillingLoading ||
          uploadImageLoading ||
          logisticBillRegisterLoading) && <Loading />}
      </div>
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            narration: '',
            paymentParty: '',
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
                                handleChange(e, activeTab, {
                                  ...values,
                                  billingType: 1,
                                });
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
                                handleChange(e, activeTab, {
                                  ...values,
                                  billingType: 2,
                                });
                              }}
                            />
                            Sea
                          </label>
                        </>
                      )}
                    </div>
                    {activeTab === 'billGenerate' && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={masterBLWiseBilling?.length === 0}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        {'Bill Generate'}
                      </button>
                    )}
                  </div>
                </>
              </div>
              <p className="p-0  m-0">
                Master BL No:{' '}
                {rowClickData?.seaMasterBlCode &&
                rowClickData?.airMasterBlCode ? (
                  <>
                    {rowClickData?.seaMasterBlCode}{' '}
                    {rowClickData?.airMasterBlCode
                      ? ', ' + rowClickData?.airMasterBlCode
                      : ''}
                  </>
                ) : (
                  rowClickData?.seaMasterBlCode ||
                  rowClickData?.airMasterBlCode ||
                  ''
                )}
              </p>
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
                  <Tab label="Bill Generate" value="billGenerate" />
                  {/* bill view */}
                  <Tab label="View Bill " value="viewBillInvoice" />
                  {/* <Tab label="Advance Generate" value="advanceGenerate" /> */}
                </Tabs>
                <Box mt={1}>
                  {activeTab === 'billGenerate' && (
                    <BillGenerateCmp
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      billingDataFilterData={billingDataFilterData}
                      paymentPartyListDDL={paymentPartyListDDL}
                      saveHandler={saveHandler}
                      invoiceTypeHandeler={invoiceTypeHandeler}
                      setOpen={setOpen}
                    />
                  )}

                  {activeTab === 'viewBillInvoice' && (
                    <BillInvoiceView
                      values={values}
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      paymentPartyListDDL={paymentPartyListDDL}
                      invoiceTypeHandeler={invoiceTypeHandeler}
                      billingDataFilterData={billingDataFilterData}
                    />
                  )}

                  {/* {activeTab === 'advanceGenerate' && (
                    <div>
                      <AdvanceGenerateCmp
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                        billingDataFilterData={billingDataFilterData}
                        paymentPartyListDDL={paymentPartyListDDL}
                        saveHandler={saveHandler}
                        invoiceTypeHandeler={invoiceTypeHandeler}
                        setOpen={setOpen}
                      />
                    </div>
                  )} */}
                </Box>
              </Box>

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={['image/*', 'application/pdf']}
                fileObjects={fileObjects}
                cancelButtonText={'cancel'}
                submitButtonText={'submit'}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                  // console.log(newFileObjs);
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects?.filter(
                    (item) => item?.file?.name !== deleteFileObj?.file?.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  attachmentUpload(fileObjects, setUploadImageLoading).then(
                    (data) => {
                      const documentFileId = data?.[0]?.id;
                      setFieldValue('documentFileId', documentFileId || '');
                    }
                  );
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          )}
        </Formik>
      </>
    </>
  );
};

export default BillGenerate;

const BillGenerateCmp = ({
  errors,
  touched,
  setFieldValue,
  billingDataFilterData,
  paymentPartyListDDL,
  values,
  invoiceTypeHandeler,
  setOpen,
}) => {
  const dispatch = useDispatch();
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
        <div className="col-lg-3 ">
          <label>Narration</label>
          <InputField
            value={values?.narration}
            name="narration"
            placeholder="Narration"
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-6 mt-5">
          <button
            className="btn btn-primary mr-2 "
            type="button"
            onClick={() => setOpen(true)}
          >
            Attachment
          </button>
          {values?.documentFileId && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                dispatch(getDownlloadFileView_Action(values?.documentFileId));
              }}
            >
              Attachment View
            </button>
          )}
        </div>
      </div>{' '}
      <div className="table-responsive">
        <table className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Booking No</th>
              <th>Attribute</th>
              <th>Currency</th>
              <th>Exchange Rate</th>
              {/* <th>Advance</th> */}
              <th>Actual</th>
              <th>Amount</th>
              <th>Amount (BDT)</th>
            </tr>
          </thead>
          <TableBody
            values={values}
            billingDataFilterData={billingDataFilterData}
          />
        </table>
      </div>
    </>
  );
};

const TableBody = ({ values, billingDataFilterData }) => {
  let totalPaymentAmount = 0;
  let totalPaymentPayAmount = 0;
  let totalPaymentActualAmount = 0;

  return (
    <tbody>
      {values?.paymentParty?.value &&
        billingDataFilterData
          ?.reduce((acc, row) => {
            const existingGroup = acc.find(
              (group) => group.bookingRequestCode === row.bookingRequestCode
            );
            if (existingGroup) {
              existingGroup.rows.push(row);
            } else {
              acc.push({
                bookingRequestCode: row.bookingRequestCode,
                rows: [row],
              });
            }
            return acc;
          }, [])
          .map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.rows.map((row, rowIndex) => {
                const paymentActualAmount =
                  Number(Number(+row?.paymentActualAmount || 0).toFixed(4)) ||
                  0;
                const paymentAmount =
                  Number(Number(+row?.paymentAmount || 0).toFixed(4)) || 0;

                const paymentPayAmount =
                  Number(Number(+row?.paymentPayAmount || 0).toFixed(4)) || 0;

                totalPaymentAmount += paymentAmount;
                totalPaymentPayAmount += paymentPayAmount;
                totalPaymentActualAmount += paymentActualAmount;

                return (
                  <tr key={rowIndex}>
                    {rowIndex === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        style={{
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {groupIndex + 1}
                      </td>
                    )}
                    {rowIndex === 0 && (
                      <td
                        rowSpan={group.rows.length}
                        style={{
                          textAlign: 'middle',
                          verticalAlign: 'middle',
                        }}
                      >
                        {group.bookingRequestCode}
                      </td>
                    )}
                    <td className="text-left align-middle">
                      <label>{row?.headOfCharges}</label>
                    </td>
                    <td className="align-middle">
                      <label>{row?.currency}</label>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {row?.exchangeRate || 0}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {paymentActualAmount}
                    </td>
                    <td style={{ textAlign: 'right' }}>{paymentAmount}</td>
                    <td style={{ textAlign: 'right' }}>{paymentPayAmount}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
      <tr>
        <td colSpan="5" style={{ textAlign: 'right' }}>
          <b>Total</b>
        </td>
        <td style={{ textAlign: 'right' }}>
          <b>{Number((+totalPaymentActualAmount || 0).toFixed(4))}</b>
        </td>
        {
          <td style={{ textAlign: 'right' }}>
            <b> {Number((+totalPaymentAmount || 0).toFixed(4))}</b>
          </td>
        }

        <td style={{ textAlign: 'right' }}>
          <b>{Number((+totalPaymentPayAmount || 0).toFixed(4))}</b>
        </td>
      </tr>
    </tbody>
  );
};

// BillInvoiceView componet
const BillInvoiceView = ({
  values,
  errors,
  touched,
  setFieldValue,
  paymentPartyListDDL,
  invoiceTypeHandeler,
  billingDataFilterData,
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
      </div>

      <div className="table-responsive">
        <table className="table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Bill Register Code</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {values?.paymentParty?.value &&
              billingDataFilterData
                ?.reduce((acc, row) => {
                  const existingGroup = acc.find(
                    (group) => group.billRegisterCode === row.billRegisterCode
                  );
                  if (existingGroup) {
                    existingGroup.rows.push(row);
                  } else {
                    acc.push({
                      billRegisterCode: row.billRegisterCode,
                      rows: [row],
                    });
                  }
                  return acc;
                }, [])
                .map((group, groupIndex) => {
                  const totalPaymentPayAmount = group?.rows?.reduce(
                    (acc, row) => acc + Number(+row?.paymentPayAmount || 0),
                    0
                  );
                  return (
                    <React.Fragment key={groupIndex}>
                      {group.rows.map((row, rowIndex) => {
                        const paymentPayAmount =
                          Number(
                            Number(+row?.paymentPayAmount || 0).toFixed(4)
                          ) || 0;

                        return (
                          <tr key={rowIndex}>
                            {rowIndex === 0 && (
                              <td
                                rowSpan={group.rows.length}
                                style={{
                                  textAlign: 'right',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {groupIndex + 1}
                              </td>
                            )}
                            {rowIndex === 0 && (
                              <td
                                rowSpan={group.rows.length}
                                style={{
                                  textAlign: 'middle',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {group.billRegisterCode}
                              </td>
                            )}
                            <td style={{ textAlign: 'right' }}>
                              {paymentPayAmount}
                            </td>
                          </tr>
                        );
                      })}
                      <td
                        colSpan="2"
                        style={{
                          textAlign: 'right',
                          padding: '0px 2px 0px 0px',
                        }}
                      >
                        <b>Total</b>
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0px 2px 0px 0px',
                        }}
                      >
                        <b>{totalPaymentPayAmount}</b>
                      </td>
                    </React.Fragment>
                  );
                })}
          </tbody>
        </table>
      </div>
    </>
  );
};
