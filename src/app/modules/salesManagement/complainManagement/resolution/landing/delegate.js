import axios from "axios";
import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
import moment from "moment";
import { _todayDate } from "../../../../_helper/_todayDate";
import { updateComplain } from "../helper";
import Loading from "../../../../_helper/_loading";
import { _currentTime } from "../../../../_helper/_currentTime";
export const validationSchema = Yup.object().shape({
  delegateDate: Yup.date().required("Delegate Date is required"),
  delegateTo: Yup.string().required("Delegate To is required"),
  remarks: Yup.string().required("Remarks is required"),
});

function DelegateForm({ clickRowData, landingCB }) {
  //   const [open, setOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    profileData: { accountId: accId, userId, userName },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${buId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const saveHandler = (values, cb) => {
    let delegateDateTime = moment(
      `${values?.delegateDate} ${values?.delegateTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");

    const payload = {
      complainId: clickRowData?.complainId || 0,
      respondentTypeId: clickRowData?.respondentTypeId || 0,
      respondentTypeName: clickRowData?.respondentTypeName || "",
      respondentId: clickRowData?.respondentId || 0,
      respondentName: clickRowData?.respondentName || "",
      contactNo: clickRowData?.contactNo || "",
      itemId: clickRowData?.itemId || 0,
      requestDateTime: clickRowData?.requestDateTime || new Date(),
      complainCategoryId: clickRowData?.complainCategoryId || 0,
      issueTitle: clickRowData?.issueTitle || "",
      statusRemarks: values?.remarks || "",
      description: clickRowData?.description || "",
      attachment: clickRowData?.attachment || "",
      delegateToId: values?.delegateTo?.value || 0,
      statusId: 2,
      status: "Delegate",
      actionById: userId,
      distributionChannelId: clickRowData?.distributionChannelId || 0,
      delegateDateTime: delegateDateTime,


      complainCategoryName: clickRowData?.complainCategoryName || "",
      accountId: accId,
      businessUnitId: buId,
      complainNo: clickRowData?.complainNo || "",
      actionByName: userName,
      distributionChannelName: clickRowData?.distributionChannelName || "",
      respondentBusinessUnitId: clickRowData?.respondentBusinessUnitId || 0,
      respondentBusinessUnitIdName: clickRowData?.respondentBusinessUnitIdName || "",
      respondentOrg: clickRowData?.respondentOrg || "",
      strDesignationOrRelationship:clickRowData?.strDesignationOrRelationship  || "",
      commentAndSuggestion: clickRowData?.commentAndSuggestion || "",
      itemCategoryId: clickRowData?.itemCategoryId || 0,
      itemCategoryName: clickRowData?.itemCategoryName || "",
      challanOrPoId: clickRowData?.challanOrPoId || 0,
      challanOrPoName: clickRowData?.challanOrPoName || "",
      deliveryDate: clickRowData?.deliveryDate || "",
      reference: clickRowData?.reference || "",
      occurrenceTime: clickRowData?.occurrenceTime || "",
      sl: 0,
      itemName: "",
      delegateToName: "",
      delegateById: 0,
      delegateByName: "",
      investigatorAssignById: 0,
      investigatorAssignByName: {},
      investigatorAssignDate: "",
      finishDateTime: "",
      isActive: true,
      lastActionDateTime: "",
      totalTime: "",
      isReopen: true,
      respondentType: "",
    };
    updateComplain(payload, setLoading, () => {
      cb();
      landingCB();
    });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          delegateDate: _todayDate(),
          delegateTo: "",
          remarks: "",
          delegateTime: _currentTime(),
        }}
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
            title={" Delegate "}
            saveHandler={() => {
              handleSubmit();
            }}
            resetHandler={() => {
              resetForm();
            }}
          >
            {loading && <Loading />}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2px 35px",
              }}
            >
              <p>
                <b>Issue Id:</b> {clickRowData?.complainNo}
              </p>
              <p>
                <b>Issue Title:</b> {clickRowData?.issueTitle}
              </p>
              <p>
                <b>Respondent Type:</b> {clickRowData?.respondentTypeName}
              </p>
              <p>
                <b>Respondent Name:</b> {clickRowData?.respondentName}
              </p>
              <p>
                <b>Distribution Channel:</b>{" "}
                {clickRowData?.distributionChannelName}
              </p>
              <p>
                <b>Product:</b> {clickRowData?.itemName}
              </p>
              <p>
                <b>Contact: </b> {clickRowData?.contactNo}
              </p>
              <p>
                <b>Create By: </b> {clickRowData?.actionByName}
              </p>
              <p>
                <b>Create Date: </b>{" "}
                {clickRowData?.lastActionDateTime &&
                  moment(clickRowData?.lastActionDateTime).format(
                    "YYYY-MM-DD hh:mm A"
                  )}
              </p>
            </div>
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <div
                    style={{
                      display: "flex",
                      gap: "0px 5px",
                      alignItems: "end",
                    }}
                  >
                    <InputField
                      value={values?.delegateDate}
                      label='Delegate Date'
                      placeholder='Delegate Date'
                      name='delegateDate'
                      type='date'
                      disabled
                    />
                    <InputField
                      value={values?.delegateTime}
                      type='time'
                      name='delegateTime'
                      disabled
                    />
                  </div>
                </div>
                <div className='col-lg-3'>
                  <label>Delegate To</label>
                  <SearchAsyncSelect
                    selectedValue={values?.delegateTo}
                    handleChange={(valueOption) => {
                      setFieldValue("delegateTo", valueOption || "");
                    }}
                    loadOptions={loadEmpList}
                    placeholder='Search by Enroll/ID No/Name (min 3 letter)'
                  />
                  <FormikError
                    name='delegateTo'
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-6'>
                  <label>Remarks</label>
                  <TextArea
                    name='remarks'
                    value={values?.remarks || ""}
                    placeholder='Remarks'
                    touched={touched}
                    rows='3'
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                    errors={errors}
                  />
                </div>
                {/* <div className='col-lg-3 d-flex align-items-center'>
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
                </div> */}
              </div>
            </form>
            {/* 
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
            /> */}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default DelegateForm;
