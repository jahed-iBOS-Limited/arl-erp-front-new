/* eslint-disable eqeqeq */
import { Field, Form, Formik } from 'formik';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  Input,
  ModalProgressBar,
} from '../../../../../../../_metronic/_partials/controls';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import IView from '../../../../../_helper/_helperIcons/_view';
import InputField from '../../../../../_helper/_inputField';
import Loading from '../../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../../_helper/_redux/Actions';
import { _todayDate } from '../../../../../_helper/_todayDate';
import {
  CommercialCostingForTypeTwo,
  empAttachment_action,
  getCommercialBreakdownForAdvanceAndBill,
} from '../helper';
import FormikError from './../../../../../_helper/_formikError';

const initData = {
  billNo: '',
  dteTransactionDate: _todayDate(),
  numAmount: '',
  vatAmount: '',
  description: '',
  numAdvanceAdjust: '',
  attachment: '',
};

// Validation schema
const validationSchema = Yup.object().shape({
  billNo: Yup.string().required('Bill No is required'),
  // billDate: Yup.string().required("Bill Date is required"),
  dteTransactionDate: Yup.string().required('Bill Date is required'),
  // billAmount: Yup.string().required("Bill Amount is required"),
  numAmount: Yup.number().required('Bill Amount is required'),
});

export default function AddBill({
  bill,
  setBill,
  accountId,
  bussinessUnitId,
  data,
  poNumber,
  supplierName,
  state,
  itemData,
  referenceId,
  supplierId,
  setAdvanceBill,
  advanceBill,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState({});
  const [uploadImage, setUploadImage] = useState([]);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // const singleData = {
  //   ...bill,
  //   dteTransactionDate: _dateFormatter(bill?.dteTransactionDate),
  // };

  function validate(values) {
    let error = {};
    if (+values?.vatAmount > +values?.numAmount) {
      error.vatAmount = 'Vat amount is greater than bill amount';
    }
    setError(error);
  }

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  console.log('initData: ', initData);

  const saveHandler = (values, cb) => {
    const payload = {
      //"billAndAdvanceId": 0,
      // accountId: accountId,
      // businessUnitId: bussinessUnitId,
      // poId: data?.poId,
      // poNo: poNumber,
      // lcId: data?.lcId,
      // sbuId: state?.sbu?.value,
      // plantId: state?.plant?.value,
      // warehouseId: 0,
      // warehouseName: "",
      // shipmentId: data?.shipmentId,
      // commercialReferenceId: data?.referenceId,
      // supplierId: data?.supplierId,
      // supplierName: data?.supplierName,
      // dteTransactionDate: values?.dteTransactionDate,
      // numAmount: values?.numAmount,
      // vatAmount: values?.vatAmount,
      // billNo: values?.billNo,
      // description: values?.description,
      // attachment: values?.attachment || "",
      // numAdvanceAdjust: values?.numAdvanceAdjust,
      // actionBy: profileData?.userId,
      jason: [
        {
          costId: data?.referenceId,
          bookedAmount: data?.numContractedAmount || 0,
          totalAmount:
            values?.numAmount < values?.numAdvanceAdjust
              ? 0
              : values?.numAmount - values?.numAdvanceAdjust || 0,
          vat: +values?.vatAmount || 0,
          numAdvanceAdjust:
            values?.numAmount < values?.numAdvanceAdjust
              ? values?.numAmount
              : values?.numAdvanceAdjust || 0,
        },
      ],
      imageString: {
        imageId: values?.attachment ? values?.attachment : '',
      },
    };
    CommercialCostingForTypeTwo(
      accountId,
      bussinessUnitId,
      state?.plant?.value,
      state?.sbu?.value,
      itemData?.businessPartnerId,
      profileData?.userId,
      data?.supplierId,
      values?.billNo,
      values?.attachment,
      data?.referenceId,
      values?.numAmount,
      setIsLoading,
      payload,
      cb,
      null,
      values?.numAdvanceAdjust,
    );
    // createCommercialBreakdownForBill(payload, setIsLoading);
    // if (bill) {
    //   resetForm(bill);
    // } else {
    //   resetForm(initData);
    // }
    // resetForm(bill ? bill : initData);
  };
  console.log('data:', data);
  // useEffect(() => {
  //   return ()=>{setBill("")};
  // }, [setBill]);
  console.log('bill', bill);

  let totalBillAmountWithVat = 0;
  let totalVatAmount = 0;
  let totalAdvanceAdjust = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={bill ? bill : initData}
        initialValues={{
          ...initData,
          numAdvanceAdjust: advanceBill[0]?.remainAdvance || 0,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div className="bill">
            <Card>
              {isLoading && <Loading />}
              {true && <ModalProgressBar />}
              <CardHeader style={{ padding: '5px' }}>
                <div className="card-title">
                  <h3 style={{ fontSize: '12px', color: '#000000' }}>
                    <span style={{ fontWeight: 'bold' }}>{supplierName}</span>
                  </h3>
                </div>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      saveHandler(values, () => {
                        resetForm(initData);
                        getCommercialBreakdownForAdvanceAndBill(
                          referenceId,
                          supplierId,
                          setAdvanceBill,
                          setBill,
                        );
                      });
                    }}
                    className="btn btn-primary"
                    type="button"
                    // disabled={bill?.billAndAdvanceId}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody style={{ padding: '3px 7px 3px 7px' }}>
                {console.log('values: ', values)}
                {console.log('errors: ', errors)}
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <label>Bill No</label>
                      <InputField
                        value={values?.billNo}
                        name="billNo"
                        placeholder="Bill No"
                        type="text"
                        // disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Bill Date</label>
                      <InputField
                        // value={
                        //   bill?.dteTransactionDate
                        //     ? _dateFormatter(bill?.dteTransactionDate)
                        //     : values?.dteTransactionDate
                        // }
                        value={values?.dteTransactionDate}
                        name="dteTransactionDate"
                        placeholder="Bill Date"
                        type="date"
                        // disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Bill Amount (Including Vat)</label>
                      <InputField
                        value={values?.numAmount}
                        name="numAmount"
                        placeholder="Bill Amount"
                        onChange={(e) => {
                          if (e.target.value < 1) {
                            setFieldValue('numAmount', '');
                          } else {
                            setFieldValue('numAmount', e.target.value);
                          }
                        }}
                        type="number"
                        // disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Vat Amount</label>
                      <Field
                        value={values?.vatAmount}
                        name="vatAmount"
                        placeholder="Vat Amount"
                        type="number"
                        component={Input}
                        validate={() => validate(values)}
                        // disabled={bill?.billAndAdvanceId}
                        onChange={(e) => {
                          const inputValue = +e.target.value;
                          const isValidInput =
                            inputValue >= 1 && inputValue <= +values?.numAmount;
                          setFieldValue(
                            'vatAmount',
                            isValidInput ? inputValue : '',
                          );
                        }}
                      />
                      {errors && touched && (
                        <FormikError
                          errors={error}
                          touched={touched}
                          name="vatAmount"
                        />
                      )}
                    </div>
                    <div className="col-lg-3">
                      <label>Advance Adjust</label>
                      <InputField
                        value={values?.numAdvanceAdjust || ''}
                        name="numAdvanceAdjust"
                        placeholder="Advance Adjust"
                        type="number"
                        // disabled={bill?.billAndAdvanceId}
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Description</label>
                      <InputField
                        value={values?.description}
                        name="description"
                        placeholder="Description"
                        type="text"
                        // disabled={bill?.billAndAdvanceId}
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-primary mr-2"
                        style={{ marginTop: '20px' }}
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {values?.attachment && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          style={{ marginTop: '20px' }}
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(uploadImage[0]?.id),
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      )}
                    </div>
                    <DropzoneDialogBase
                      filesLimit={5}
                      acceptedFiles={['image/*']}
                      fileObjects={fileObjects}
                      cancelButtonText={'cancel'}
                      submitButtonText={'submit'}
                      maxFileSize={1000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObjects([].concat(newFileObjs));
                      }}
                      onDelete={(deleteFileObj) => {
                        const newData = fileObjects.filter(
                          (item) => item.file.name !== deleteFileObj.file.name,
                        );
                        setFileObjects(newData);
                      }}
                      onClose={() => setOpen(false)}
                      onSave={() => {
                        setOpen(false);
                        empAttachment_action(fileObjects).then((data) => {
                          setUploadImage(data);
                          setFieldValue('attachment', data[0]?.id);
                        });
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </div>
                  <div className="react-bootstrap-table table-responsive mt-3">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Bill No</th>
                          <th>Bill Date</th>
                          <th>Bill Amount (Including Vat)</th>
                          <th>Vat Amount</th>
                          <th>Advance Adjust</th>
                          <th>Description</th>
                          <th style={{ width: '70px' }}>Attachment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bill?.length > 0 &&
                          bill?.map((item, index) => {
                            totalBillAmountWithVat += +item?.numAmount || 0;
                            totalVatAmount += +item?.vatAmount || 0;
                            totalAdvanceAdjust += +item?.numAdvanceAdjust || 0;

                            return (
                              <>
                                <tr key={index}>
                                  <td
                                    style={{ width: '30px' }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>
                                    <span className="pl-2 text-center">
                                      {item?.billNo}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="pl-2 text-center">
                                      {_dateFormatter(item?.dteTransactionDate)}
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="pl-2">
                                      {item?.numAmount}
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="pl-2">
                                      {item?.vatAmount}
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="pl-2">
                                      {item?.numAdvanceAdjust}
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="pl-2">
                                      {item?.description}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    {item?.attachment ? (
                                      <IView
                                        clickHandler={() => {
                                          dispatch(
                                            getDownlloadFileView_Action(
                                              item?.attachment,
                                            ),
                                          );
                                        }}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        <tr>
                          <td
                            className="text-center font-weight-bold"
                            colSpan="3"
                          >
                            Total
                          </td>
                          <td className="text-right font-weight-bold">
                            {totalBillAmountWithVat}
                          </td>
                          <td className="text-right font-weight-bold">
                            {totalVatAmount}
                          </td>
                          <td className="text-right font-weight-bold">
                            {totalAdvanceAdjust}
                          </td>
                          <td colSpan="2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
