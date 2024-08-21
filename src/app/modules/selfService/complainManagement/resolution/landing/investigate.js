import axios from "axios";
import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import {
  attachment_action,
  getComplainByIdWidthOutModify,
  investigateComplainApi,
} from "../helper";
export const validationSchema = Yup.object().shape({
  investigationDateTime: Yup.string().required(
    "Investigation Date is required"
  ),
});
const initData = {
  investigationDateTime: "",
  investigationPerson: "",
  rootCause: "",
  correctiveAction: "",
  attachment: "",
  investigationDueDate: "",
};

function InvestigateForm({ clickRowData, landingCB }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [fileObjects, setFileObjects] = useState([]);
  const [singleData, setSingleData] = React.useState({});
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
    tokenData: { token },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    let payload = {
      complainId: clickRowData?.complainId || 0,
      statusId: 3,
      status: "Investigate",
      actionById: userId,
      autoId: values?.autoId || 0,
      rootCause: values?.rootCause || "",
      correctiveAction: values?.correctiveAction || "",
      attachment: values?.attachment || "",
      investigationDateTime: moment(values?.investigationDateTime).format(
        "YYYY-MM-DDTHH:mm"
      ),
      tokenData: { token },
    };

    investigateComplainApi(payload, setLoading, () => {
      cb();
      landingCB();
    });
  };
  const formikRef = React.useRef(null);
  useEffect(() => {
    if (clickRowData?.complainId) {
      const id = clickRowData?.complainId;
      getComplainByIdWidthOutModify(id, accId, buId, setLoading, (resData) => {
        setSingleData(resData);
        const matchEmployee = resData?.investigationInfo?.find(
          (itm) => itm?.investigatorId === employeeId
        );

        if (formikRef.current) {
          formikRef.current.setFieldValue(
            "investigationPerson",
            matchEmployee
              ? {
                  value: matchEmployee?.investigatorId,
                  label: matchEmployee?.investigatorName,
                }
              : ""
          );
          formikRef.current.setFieldValue(
            "investigationDueDate",
            _dateFormatter(matchEmployee?.investigationDueDate)
          );

          formikRef.current.setFieldValue(
            "attachment",
            matchEmployee?.attachment || ""
          );
          formikRef.current.setFieldValue(
            "autoId",
            matchEmployee?.autoId || ""
          );
          formikRef.current.setFieldValue(
            "rootCause",
            matchEmployee?.rootCause || ""
          );
          formikRef.current.setFieldValue(
            "correctiveAction",
            matchEmployee?.correctiveAction || ""
          );
          formikRef.current.setFieldValue(
            "investigationDateTime",
            matchEmployee?.investigationDateTime
              ? moment(matchEmployee?.investigationDateTime).format(
                  "YYYY-MM-DDTHH:mm"
                )
              : ""
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);

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
        innerRef={formikRef}
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
            title={"Investigation "}
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
                justifyContent: "space-between",
              }}
            >
              <div>
                <p>
                  <b>Issue Id:</b> {singleData?.complainNo}
                </p>
                <p>
                  <b>Issue Type:</b> {singleData?.complainCategoryName}
                </p>
                <p>
                  <b>Sub Issue Type:</b> {singleData?.complainSubCategoryName}
                </p>
                <p>
                  <b>Occurrence Date Time: </b>{" "}
                  {singleData?.requestDateTime &&
                    moment(singleData?.requestDateTime).format(
                      "YYYY-MM-DD"
                    )}{" "}
                  {singleData?.occurrenceTime &&
                    moment(singleData?.occurrenceTime, "HH:mm:ss").format(
                      "hh:mm A"
                    )}
                </p>

                <p>
                  <b>Issue Details:</b> {singleData?.description}
                </p>
                <p>
                  <b>Respondent Type:</b> {singleData?.respondentTypeName}
                </p>
                <p>
                  <b>Respondent Name:</b> {singleData?.respondentType}
                </p>
                <p>
                  <b>Respondent Contact:</b> {singleData?.contactNo}
                </p>
                <p>
                  <b>Business Unit:</b>{" "}
                  {singleData?.respondentBusinessUnitIdName}
                </p>
                <p>
                  <b>Create By: </b> {singleData?.actionByName}
                </p>
               
              </div>
              <div>
              <p>
                  <b>Create Date: </b>{" "}
                  {singleData?.lastActionDateTime &&
                    moment(singleData?.lastActionDateTime).format(
                      "YYYY-MM-DD hh:mm A"
                    )}
                </p>
                <p>
                  <b>Distribution Channel:</b>{" "}
                  {singleData?.distributionChannelName}
                </p>
                <p>
                  <b>Product Category:</b> {singleData?.itemCategoryName}
                </p>
                <p>
                  <b>Delegate Date Time:</b>{" "}
                  {singleData?.delegateDateTime &&
                    moment(singleData?.delegateDateTime).format(
                      "YYYY-MM-DD, HH:mm A"
                    )}
                </p>
                <p>
                  <b>Delegate To:</b> {singleData?.delegateToName}
                </p>
                <p>
                  <b> Remarks:</b> {singleData?.statusRemarks}
                </p>
                {singleData?.respondentTypeName === "Employee" && (
                  <p>
                    <b> Work Place:</b> {singleData?.workPlace}
                  </p>
                )}
                {singleData?.respondentTypeName === "End User" && (
                  <>
                  <p>
                      <b>Territory Name:</b> {singleData?.territoryName}
                    </p>
                    <p>
                      <b>Area Name:</b> {singleData?.areaName}
                    </p>
                    <p>
                      <b>Region Name:</b> {singleData?.regionName}
                    </p>
                    
                  </>
                )}
                <p>
                  <b>Attachment: </b>
                </p>
              </div>
            </div>
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.investigationDueDate}
                    label='Investigation Due Date'
                    placeholder='Investigation Due Date'
                    name='investigationDueDate'
                    type='date'
                    disabled
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Investigation Person</label>
                  <SearchAsyncSelect
                    selectedValue={values?.investigationPerson}
                    handleChange={(valueOption) => {
                      setFieldValue("investigationPerson", valueOption || "");
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return axios
                        .get(
                          `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${accId}&BusinessUnitId=0&searchTearm=${v}`
                        )
                        .then((res) => {
                          return res?.data?.map((itm) => ({
                            value: itm?.value,
                            label: `${itm?.level} [${itm?.employeeCode}]`,
                          }));
                        })
                        .catch((err) => []);
                    }}
                    placeholder='Search by Enroll/ID No/Name (min 3 letter)'
                    isDisabled
                  />
                  <FormikError
                    name='investigationPerson'
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className='col-lg-3'>
                  <label><b style={{
                    color: "red",
                  }}>*</b> Investigation Date</label>
                  <InputField
                    value={values?.investigationDateTime}
                    
                    placeholder='Investigation Date'
                    name='investigationDateTime'
                    type='datetime-local'
                  />
                </div>

                <div className='col-lg-3'>
                  <InputField
                    value={values?.rootCause}
                    label='Root Cause'
                    placeholder='Root Cause'
                    name='rootCause'
                    type='text'
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.correctiveAction}
                    label='Corrective Action'
                    placeholder='Corrective Action'
                    name='correctiveAction'
                    type='text'
                  />
                </div>
                <div className='col-lg-3 d-flex align-items-center mt-3'>
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

export default InvestigateForm;
