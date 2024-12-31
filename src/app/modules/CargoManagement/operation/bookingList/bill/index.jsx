import { Box, Tab, Tabs } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import NewSelect from '../../../../_helper/_select';
import { newAttachment_action } from '../../../../_helper/attachmentUpload';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import './style.css';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

const validationSchema = Yup.object().shape({
  paymentParty: Yup.object().shape({
    value: Yup.string().required('Party Type is required'),
    label: Yup.string().required('Party Type is required'),
  }),
});

const BillGenerate = ({ rowClickData, CB }) => {
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [uniqueBookingRequestList, setUniqueBookingRequestList] = useState([]);
  const [uploadImageLoading, setUploadImageLoading] = useState(null);
  const formikRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState('billGenerate');
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
  const [paymentPartyListDDL, setPaymentPartyListDDL] = useState();
  useEffect(() => {
    commonGetByIdHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);
  const commonGetByIdHandler = () => {
    if (bookingRequestId) {
      getMasterBLWiseBilling(
        `${imarineBaseUrl}/domain/ShippingService/GetMasterBLWiseBilling?MasterBlId=${rowClickData?.masterBlId}`,
        (resData) => {
          const billingDataList = resData
            ?.filter((i) => i.paymentPartyId && !i?.billRegisterId)
            ?.map((item) => {
              return {
                value: item?.paymentPartyId,
                label: item?.paymentParty,
              };
            });
          const unique = [
            ...new Map(
              billingDataList.map((item) => [item['paymentPartyId'], item]),
            ).values(),
          ];

          const uniqueBookingRequestList = [
            ...new Map(
              resData.map((item) => [item['bookingRequestId'], item]),
            ).values(),
          ];
          const modifyBookingRequestList = uniqueBookingRequestList?.map(
            (itm) => {
              return {
                bookingId: itm?.bookingRequestId || 0,
                masterBlId: itm?.masterBlId || 0,
                masterBlCode: itm?.masterBlCode || 0,
              };
            },
          );
          setUniqueBookingRequestList(modifyBookingRequestList);
          setPaymentPartyListDDL(unique || []);
        },
      );

      // getMasterBLWiseBilling(
      //   `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      //   (resData) => {
      //     const billingDataList = resData?.billingData
      //       ?.filter((i) => i.paymentPartyId)
      //       ?.map((item) => {
      //         return {
      //           value: item?.paymentPartyId,
      //           label: item?.paymentParty,
      //         };
      //       });
      //     setPaymentPartyListDDL(billingDataList);
      //   },
      // );
    }
  };

  const saveHandler = (values) => {
    if (activeTab === 'billGenerate') {
      const payload = {
        headerData: {
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
              0,
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
      );
    }
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
            !item?.billRegisterId
          );
        })
        .map((item) => {
          return {
            ...item,
            paymentPayAmount:
              (+item?.paymentActualAmount || 0) -
              (+item?.paymentAdvanceAmount || 0),
          };
        });
      setBillingDataFilterData(typeWiseFilter || []);
    }

    if (activeTab === 'advanceGenerate') {
      const typeWiseFilter = masterBLWiseBilling
        ?.filter((item) => {
          return (
            item?.paymentPartyId === valueOption?.value &&
            item?.paymentAdvanceAmount
          );
        })
        .map((item) => {
          return {
            ...item,
            paymentPayAmount: item?.paymentAdvanceAmount,
          };
        });
      setBillingDataFilterData(typeWiseFilter || []);
    }
  };

  const handleChange = (event, newValue) => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      setBillingDataFilterData([]);
    }
    setActiveTab(newValue);
  };
  return (
    <>
      <div>
        {(masterBLWiseBillingLoading || uploadImageLoading) && <Loading />}
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
                {/* Save button add */}
                <>
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={masterBLWiseBilling?.length === 0}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      {activeTab === 'billGenerate'
                        ? 'Bill Generate'
                        : 'Advance Generate'}
                    </button>
                  </div>
                </>
              </div>

              <Box>
                <Tabs
                  value={activeTab}
                  onChange={handleChange}
                  variant="scrollable"
                  indicatorColor="primary"
                  textColor="primary"
                  style={{ backgroundColor: 'white' }}
                >
                  <Tab label="Bill Generate" value="billGenerate" />
                  <Tab label="Advance Generate" value="advanceGenerate" />
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
                  {activeTab === 'advanceGenerate' && (
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
                  )}
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
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects?.filter(
                    (item) => item?.file?.name !== deleteFileObj?.file?.name,
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  newAttachment_action(fileObjects, setUploadImageLoading).then(
                    (data) => {
                      const documentFileId = data?.[0]?.id;
                      setFieldValue('documentFileId', documentFileId || '');
                    },
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
              <th>Attribute</th>
              <th>Advance</th>
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
                  <td style={{ textAlign: 'right' }}>
                    {row?.paymentAdvanceAmount}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {row?.paymentActualAmount}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {row?.paymentPayAmount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const AdvanceGenerateCmp = ({
  errors,
  setFieldValue,
  billingDataFilterData,
  paymentPartyListDDL,
  values,
  invoiceTypeHandeler,
  touched,
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
            label="Party Type"
            onChange={(valueOption) => {
              setFieldValue('paymentParty', valueOption);
              invoiceTypeHandeler(valueOption);
            }}
            placeholder="Select Party Type"
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
              <th>Attribute</th>
              <th>Advance Amount</th>
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
                  <td style={{ textAlign: 'right' }}>
                    {row?.paymentAdvanceAmount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
