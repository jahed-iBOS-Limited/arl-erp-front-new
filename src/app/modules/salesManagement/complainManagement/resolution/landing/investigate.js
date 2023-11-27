import axios from "axios";
import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  attachment_action,
  getComplainByIdWidthOutModify,
  getInvestigateComplainbyApi,
  investigateComplainApi,
} from "../helper";
export const validationSchema = Yup.object().shape({});

function InvestigateForm({ clickRowData, landingCB }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [fileObjects, setFileObjects] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = React.useState({});
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const loadEmpList = (v) => {
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
  };

  const saveHandler = (values, cb) => {
    // rowDto empty check
    if (rowDto.length === 0) {
      return toast.error("Please add at least one row");
    }
    let payload = {
      complainId: clickRowData?.complainId || 0,
      statusId: 3,
      status: "Investigate",
      actionById: userId,
      investigationInfo: rowDto || [],
    };

    investigateComplainApi(payload, setLoading, () => {
      cb();
      landingCB();
    });
  };

  useEffect(() => {
    if (clickRowData?.status === "Investigate") {
      getInvestigateComplainbyApi(clickRowData?.complainId, setRowDto);
    }
    if (clickRowData?.complainId) {
      const id = clickRowData?.complainId;
      getComplainByIdWidthOutModify(id, accId, buId, setLoading, setSingleData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickRowData]);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          investigationDate: _todayDate(),
          investigationPerson: "",
          rootCause: "",
          correctiveAction: "",
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
                  <b>Respondent Name:</b> {singleData?.respondentName}
                </p>
                <p>
                  <b>Respondent Contact:</b> {singleData?.contactNo}
                </p>
              </div>
              <div>
                <p>
                  <b>Business Unit:</b>{" "}
                  {singleData?.respondentBusinessUnitIdName}
                </p>
                <p>
                  <b>Create By: </b> {singleData?.actionByName}
                </p>
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
              </div>
            </div>
            <form>
              <div className='row global-form'>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.investigationDate}
                    label='Investigation Date'
                    placeholder='Investigation Date'
                    name='investigationDate'
                    type='date'
                  />
                </div>
                <div className='col-lg-3'>
                  <label>Investigation Person</label>
                  <SearchAsyncSelect
                    selectedValue={values?.investigationPerson}
                    handleChange={(valueOption) => {
                      setFieldValue("investigationPerson", valueOption || "");
                    }}
                    loadOptions={loadEmpList}
                    placeholder='Search by Enroll/ID No/Name (min 3 letter)'
                  />
                  <FormikError
                    name='investigationPerson'
                    errors={errors}
                    touched={touched}
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

                <div className='col d-flex align-items-center justify-content-end'>
                  <button
                    className='btn btn-primary'
                    type='button'
                    onClick={() => {
                      const obj = {
                        autoId: 0,
                        investigatorId: values?.investigationPerson?.value || 0,
                        investigatorName:
                          values?.investigationPerson?.label || "",
                        investigationDateTime: moment(
                          values?.investigationDate || undefined
                        ).format("YYYY-MM-DD"),
                        rootCause: values?.rootCause || "",
                        correctiveAction: values?.correctiveAction || "",
                        attachment: values?.attachment || "",
                      };
                      setRowDto([...rowDto, obj]);
                      setFieldValue("investigationPerson", "");
                      setFieldValue("rootCause", "");
                      setFieldValue("correctiveAction", "");
                      setFieldValue("attachment", "");
                    }}
                    disabled={
                      !values?.investigationPerson ||
                      !values?.investigationDate ||
                      !values?.rootCause ||
                      !values?.correctiveAction
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Investigation Date</th>
                    <th>Investigation Person</th>
                    <th>Root Cause</th>
                    <th>Corrective Action</th>
                    <th>Attachment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td className='text-center'> {index + 1}</td>
                      <td>{_dateFormatter(item?.investigationDateTime)}</td>
                      <td>{item?.investigatorName}</td>
                      <td>{item?.rootCause}</td>
                      <td>{item?.correctiveAction}</td>
                      <td>
                        <div className='d-flex align-items-center justify-content-center'>
                          {item?.attachment && (
                            <span
                              onClick={() => {
                                dispatch(
                                  getDownlloadFileView_Action(item?.attachment)
                                );
                              }}
                            >
                              <i
                                class='fa fa-paperclip pointer'
                                aria-hidden='true'
                              ></i>
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center justify-content-center'>
                          <span
                            onClick={() => {
                              const newData = rowDto.filter(
                                (itm, idx) => idx !== index
                              );
                              setRowDto(newData);
                            }}
                          >
                            <i
                              class='fa fa-trash pointer'
                              aria-hidden='true'
                            ></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
