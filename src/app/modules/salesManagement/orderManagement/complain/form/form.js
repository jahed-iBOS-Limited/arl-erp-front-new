import TextArea from "antd/lib/input/TextArea";
import { Formik } from "formik";
import * as Yup from "yup";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  attachment_action,
  customerListDDL,
  getComplainCategory,
} from "../helper";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
export const validationSchema = Yup.object().shape({
  customerName: Yup.object().shape({
    label: Yup.string().required("Customer Name is required"),
    value: Yup.string().required("Customer Name is required"),
  }),
  complainCategoryName: Yup.object().shape({
    label: Yup.string().required("Ticket Type is required"),
    value: Yup.string().required("Ticket Type is required"),
  }),
  requestDateTime: Yup.date().required("Date is required"),
  issueTitle: Yup.string().required("Date is required"),
});

function Form({
  initData,
  saveHandler,
  history,
  fileObjects,
  setFileObjects,
  setLoading,
  accId,
  buId,
}) {
  const [open, setOpen] = useState(false);
  const [complainCategory, setComplainCategory] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  useEffect(() => {
    getComplainCategory(setComplainCategory);
  }, []);
  useEffect(() => {
    if (accId && buId) {
      customerListDDL(accId, buId, setCustomerDDL);
    }
  }, [accId, buId]);

  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, handleSubmit, errors, touched }) => (
          <ICustomCard
            title={"Complain Entry"}
            backHandler={() => {
              history.goBack();
            }}
            saveHandler={() => {
              handleSubmit();
            }}
          >
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.requestDateTime}
                    label='date'
                    placeholder='date'
                    name='requestDateTime'
                    type='date'
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='customerName'
                    options={customerDDL || []}
                    value={values?.customerName}
                    label='Customer'
                    onChange={(valueOption) => {
                      setFieldValue("customerName", valueOption);
                    }}
                    placeholder='Customer'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.complainByName}
                    label='Complain By'
                    placeholder='Complain By'
                    name='complainByName'
                    type='text'
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.contactNo}
                    label='Mobile No'
                    placeholder='Mobile No'
                    name='contactNo'
                    type='number'
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='complainCategoryName'
                    options={complainCategory || []}
                    value={values?.complainCategoryName}
                    label='Ticket Type'
                    onChange={(valueOption) => {
                      setFieldValue("complainCategoryName", valueOption);
                    }}
                    placeholder='Ticket Type'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.issueTitle}
                    label='Issue Title'
                    placeholder='Issue Title'
                    name='issueTitle'
                    type='text'
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Issue Description</label>
                  <TextArea
                    name='remarks'
                    value={values?.remarks}
                    label='Issue Description'
                    placeholder='Issue Description'
                    touched={touched}
                    rows='3'
                  />
                </div>
                <div className='col-lg-3 d-flex align-items-center'>
                  <div className=''>
                    <button
                      className='btn btn-primary mr-2'
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
              </div>
            </form>

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
        )}
      </Formik>
    </>
  );
}

export default Form;
