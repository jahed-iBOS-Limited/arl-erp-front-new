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
  getDistributionChannelDDL,
  getItemSalesByChanneldDDLApi,
} from "../helper";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
export const validationSchema = Yup.object().shape({
  occurrenceDate: Yup.date().required("Occurrence Date is required"),
  respondentType: Yup.object().shape({
    label: Yup.string().required("Respondent Type is required"),
    value: Yup.string().required("Respondent Type is required"),
  }),
  respondentName: Yup.object().shape({
    label: Yup.string().required("Respondent Name is required"),
    value: Yup.string().required("Respondent Name is required"),
  }),
  respondentContact: Yup.string().required("Respondent Contact is required"),
  issueType: Yup.object().shape({
    label: Yup.string().required("Issue Type is required"),
    value: Yup.string().required("Issue Type is required"),
  }),
  issueTitle: Yup.string().required("Issue Title is required"),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  product: Yup.object().shape({
    label: Yup.string().required("Product is required"),
    value: Yup.string().required("Product is required"),
  }),
  issueDetails: Yup.string().required("Issue Details is required"),
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
  view,
}) {
  const [open, setOpen] = useState(false);
  const [complainCategory, setComplainCategory] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [itemSalesByChanneldDDL, setItemSalesByChanneldDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  useEffect(() => {
    if (accId && buId) {
      customerListDDL(accId, buId, setCustomerDDL);
      getComplainCategory(buId, setComplainCategory);
      getDistributionChannelDDL(
        accId,
        buId,
        setDistributionChannelDDL
      )
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
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICustomCard
            title={"Complain Entry"}
            backHandler={() => {
              history.goBack();
            }}
            saveHandler={
              view
                ? false
                : () => {
                    handleSubmit();
                  }
            }
            resetHandler={() => {
              resetForm(initData);
            }}
          >
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.occurrenceDate}
                    label='Occurrence Date'
                    placeholder='Occurrence Date'
                    name='occurrenceDate'
                    type='date'
                    disabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='respondentType'
                    options={
                      [
                        {
                          value: 1,
                          label: "Customer",
                        },
                        {
                          value: 2,
                          label: "Supplier",
                        },
                        {
                          value: 3,
                          label: "End User",
                        },
                      ] || []
                    }
                    value={values?.respondentType}
                    label='Respondent Type'
                    onChange={(valueOption) => {
                      setFieldValue("respondentType", valueOption);
                    }}
                    placeholder='Respondent Type'
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='respondentName'
                    options={[]}
                    value={values?.respondentName}
                    label='Customer'
                    onChange={(valueOption) => {
                      setFieldValue("respondentName", valueOption);
                    }}
                    placeholder='Respondent Name'
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.respondentContact}
                    label='Respondent Contact'
                    placeholder='Respondent Contact'
                    name='respondentContact'
                    type='number'
                    disabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='issueType'
                    options={complainCategory || []}
                    value={values?.issueType}
                    label='Issue Type'
                    onChange={(valueOption) => {
                      setFieldValue("issueType", valueOption);
                    }}
                    placeholder='Issue Type'
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.issueTitle}
                    label='Issue Title'
                    placeholder='Issue Title'
                    name='issueTitle'
                    type='text'
                    disabled={view}
                  />
                </div>

                <div className='col-lg-3'>
                  <NewSelect
                    name='distributionChannel'
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label='Distribution Channel'
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption);
                      setItemSalesByChanneldDDL([])
                      getItemSalesByChanneldDDLApi(
                        accId,
                        buId,
                        valueOption?.value,
                        setItemSalesByChanneldDDL
                      )
                      setFieldValue("product", "")
                    }}
                    placeholder='Distribution Channel'
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    name='product'
                    options={itemSalesByChanneldDDL || []}
                    value={values?.product}
                    label='Product'
                    onChange={(valueOption) => {
                      setFieldValue("product", valueOption);
                    }}
                    placeholder='Product'
                    errors={errors}
                    touched={touched}
                    isDisabled={view}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Issue Details</label>
                  <TextArea
                    name='issueDetails'
                    value={values?.issueDetails || ""}
                    label='Issue Details'
                    placeholder='Issue Details'
                    touched={touched}
                    rows='3'
                    disabled={view}
                    onChange={(e) => {
                      setFieldValue("issueDetails", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3 d-flex align-items-center'>
                  {!view && (
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
                  )}

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
