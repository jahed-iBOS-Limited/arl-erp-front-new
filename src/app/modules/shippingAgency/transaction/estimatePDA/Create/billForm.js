import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { attachment_action } from "../helper";
const initData = {
  billDate: _todayDate(),
  billType: "",
  amount: "",
  vat: "",
  popdandfw: "",
  povat: "",
  total: "",
  status: {
    value: 1,
    label: "Paid",
  },
};
function BillForm({clickRowData}) {
  const [loading, setLoading] = useState(false);
  const [billRowDto, setBillRowDto] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const saveHandler = (values, cb) => {};
  const rowAddHandelar = (values, setFieldValue) => {};

  return (
    <>
      <>
        {loading && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setBillRowDto([]);
            });
          }}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            resetForm,
            handleSubmit,
          }) => (
            <>
              <ICustomCard
                title='Bill Create'
                saveHandler={() => {
                  handleSubmit();
                }}
                resetHandler={() => {
                  resetForm(initData);
                }}
              >
                <div className='row global-form my-3'>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.billDate}
                      label='Bill Date'
                      name='billDate'
                      type='date'
                      onChange={(e) => {
                        setFieldValue("billDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      value={values?.billType || ""}
                      options={[
                        {
                          value: 1,
                          label: "FW",
                        },
                        {
                          value: 2,
                          label: "PD",
                        },
                        {
                          value: 3,
                          label: "WTR",
                        },
                      ]}
                      name='billType'
                      placeholder='Bill Type'
                      label='Bill Type'
                      onChange={(valueOption) => {
                        setFieldValue("billType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.amount}
                      label='Amount'
                      name='amount'
                      placeholder='Amount'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.vat}
                      label='VAT'
                      name='vat'
                      placeholder='VAT'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.popdandfw}
                      label='PO PD & FW'
                      name='popdandfw'
                      placeholder='PO PD & FW'
                      type='text'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <InputField
                      value={values?.povat}
                      label='PO VAT'
                      name='povat'
                      placeholder='PO VAT'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <InputField
                      value={values?.total}
                      label='Total'
                      name='total'
                      placeholder='Total'
                      type='number'
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <NewSelect
                      value={values?.status || ""}
                      options={[
                        {
                          value: 1,
                          label: "Paid",
                        },
                        {
                          value: 2,
                          label: "Unpaid",
                        },
                      ]}
                      name='status'
                      placeholder='Status'
                      label='Status'
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className='col-lg-3 d-flex align-items-center'>
                    <div className=''>
                      <button
                        className='btn btn-primary mr-2 mt-3'
                        type='button'
                        onClick={() => setOpen(true)}
                        style={{ padding: "4px 5px" }}
                      >
                        Attachment
                      </button>
                    </div>

                    <div>
                      {values?.attachment && (
                        <button
                          className='btn btn-primary'
                          type='button'
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.attachment)
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='col d-flex align-items-center justify-content-end'>
                    <div className=''>
                      <button
                        className='btn btn-primary mr-2 mt-3'
                        type='button'
                        onClick={() => {
                          rowAddHandelar(values, setFieldValue);
                        }}
                        disabled={
                          !values?.billDate ||
                          !values?.billType ||
                          !values?.amount ||
                          !values?.popdandfw ||
                          !values?.total ||
                          !values?.status
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <BillRowTable
                  billRowDto={billRowDto}
                  setBillRowDto={setBillRowDto}
                />

                <DropzoneDialogBase
                  filesLimit={1}
                  acceptedFiles={["image/*", "application/pdf"]}
                  fileObjects={fileObjects}
                  cancelButtonText={"cancel"}
                  submitButtonText={"submit"}
                  maxFileSize={1000000}
                  open={open}
                  onAdd={(newFileObjs) => {
                    setFileObjects([].concat(newFileObjs));
                  }}
                  onDelete={(deleteFileObj) => {
                    const newData = fileObjects.filter(
                      (item) => item.file.name !== deleteFileObj.file.name
                    );
                    setFileObjects(newData);
                  }}
                  onClose={() => setOpen(false)}
                  onSave={() => {
                    setOpen(false);
                    attachment_action(fileObjects, setFieldValue, setLoading);
                  }}
                  showPreviews={true}
                  showFileNamesInPreview={true}
                />
              </ICustomCard>
            </>
          )}
        </Formik>
      </>
    </>
  );
}

export default BillForm;

function BillRowTable({ billRowDto, setBillRowDto }) {
  return (
    <div>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Bill Date</th>
            <th>Bill Type</th>
            <th>Amount</th>
            <th>VAT</th>
            <th>PO PD & FW</th>
            <th>PO VAT</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {billRowDto?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td>{item?.demo}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
