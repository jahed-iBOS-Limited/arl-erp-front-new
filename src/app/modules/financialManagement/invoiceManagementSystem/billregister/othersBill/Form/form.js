import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import InputField from "../../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import NewSelect from "../../../../../_helper/_select";
import IView from "../../../../../_helper/_helperIcons/_view";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import { getPartnerTypeDDL, loadPartners } from "../helper";
import TextArea from "antd/lib/input/TextArea";
const validationSchema = Yup.object().shape({
  partnerType: Yup.object().required("Partner Type is Required"),
  partner: Yup.object().required("Partner  is Required"),
  billAmount: Yup.number().required("Bill Amount is required"),
  narration: Yup.string().required("Narration is required"),
  billDate: Yup.date().required("Bill Date is required")
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  selectedBusinessUnit,
  setFileObjects,
  fileObjects,
  setGridData,
  resetBtnRef,
  profileData,
}) {
  const [open, setOpen] = React.useState(false);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setFileObjects([]);
          });
        }}
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
          <>
            <Form className="form global-form">
              <div className="row">
                <div className="col-lg-3">
                  <NewSelect
                    name="partnerType"
                    options={partnerTypeDDL}
                    value={values?.partnerType}
                    label="Partner Type"
                    onChange={(v) => {
                      setFieldValue("partnerType", v);
                    }}
                    placeholder="Partner Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>
                    {values?.partnerType?.label ? `${values?.partnerType?.label} Name` : "Partner Name"}
                  </label>
                  <SearchAsyncSelect
                    selectedValue={values?.partner}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("partner", valueOption);
                    }}
                    loadOptions={e => {
                      return loadPartners(e, profileData?.accountId, selectedBusinessUnit?.value, values?.partnerType?.reffPrtTypeId)
                    }}
                    isDisabled={!values?.partnerType}
                  />
                  <FormikError
                    errors={errors}
                    name="partner"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Bill Amount</label>
                  <InputField
                    value={values?.billAmount}
                    placeholder="Bill Amount"
                    name="billAmount"
                    type="number"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Bill Date</label>
                  <InputField
                    value={values?.billDate}
                    placeholder="Bill Date"
                    name="billDate"
                    type="date"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Narration</label>
                  <TextArea
                    name="narration"
                    value={values?.narration}
                    label="Narration"
                    placeholder="Narration"
                    touched={touched}
                    rows="3"
                    onChange={e => {
                      setFieldValue('narration', e.target.value)
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="narration"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="row align-items-end h-100">
                    <div className="col-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                      {values?.attachmentId && (
                        <IView
                          classes="purchaseInvoiceAttachIcon"
                          clickHandler={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                values?.attachmentId
                              )
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <DropzoneDialogBase
              filesLimit={5}
              acceptedFiles={["image/*"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={100000000000000}
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
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </>
        )}
      </Formik>
    </>
  );
}
