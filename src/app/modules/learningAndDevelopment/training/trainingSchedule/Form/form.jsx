import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { useState } from "react";
import AddTraining from "./addTraining";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  rowDtoAddHandler,
  rowDto,
  remover,
  rowData,
  setRowData,
  profileData,
  isRequested,
  setIsRequested,
  location,
}) {
  const [isShowModal, setisShowModal] = useState(false);
  const [trainingNameDDL, getTrainingName] = useAxiosGet();

  useEffect(() => {
    getTrainingName(`/hcm/Training/TrainingNameDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addHandler = (values, resetForm) => {
    if (!values?.trainigName) return toast.warn("Training Name is required");
    if (!values?.duration) return toast.warn("Duration is required");
    if (!values?.fromDate) return toast.warn("From Date is required");
    if (!values?.toDate) return toast.warn("To Date is required");
    if (!values?.monthYear) return toast.warn("Month-Year is required");
    if (!values?.venue) return toast.warn("Venue is required");
    if (!values?.resourcePerson)
      return toast.warn("Resource Person is required");
    if (!values?.batchSize) return toast.warn("Batch Size is required");
    if (!values?.batchNo) return toast.warn("Batch No is required");
    if (isRequested && !values?.requestedPerson?.value)
      return toast.warn("Requested Person is required");
    const obj = {
      trainigName: values?.trainigName,
      duration: values?.duration,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      monthYear: values?.monthYear,
      venue: values?.venue,
      resourcePerson: values?.resourcePerson,
      batchSize: values?.batchSize,
      batchNo: values?.batchNo,
      isRequested: isRequested,
      requestedPerson: values?.requestedPerson,
      remarks: values?.remarks,
    };
    setRowData([obj, ...rowData]);
    resetForm(initData);
    setIsRequested(false);
  };

  const removeHandler = (index) => {
    const data = rowData?.filter((item, i) => i !== index);
    setRowData([...data]);
  };

  const loadSupervisorAndLineManagerList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setRowData([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <div className="d-flex">
                    <NewSelect
                      name="trainigName"
                      options={trainingNameDDL || []}
                      value={values?.trainigName}
                      label="Training Name"
                      isDisabled={location?.state?.intTrainingId}
                      onChange={(valueOption) => {
                        setFieldValue("trainigName", valueOption);
                      }}
                      errors={errors}
                    />
                    {!location?.state?.intTrainingId ? (
                      <div style={{ marginTop: "23px", paddingLeft: "3px" }}>
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Add"}</Tooltip>}
                        >
                          <span>
                            <i
                              className={`fas fa-plus-square`}
                              onClick={() => setisShowModal(true)}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.duration}
                    label="Duration(Hours)"
                    name="duration"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    min={values?.fromDate}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.monthYear}
                    label="Month-Year"
                    name="monthYear"
                    type="month"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.venue}
                    label="Venue"
                    name="venue"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.resourcePerson}
                    label="Resource Person"
                    name="resourcePerson"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="batchSize"
                    value={values?.batchSize}
                    label="Batch Size"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.batchNo}
                    label="Batch No"
                    name="batchNo"
                    type="text"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                  />
                </div>
                <div
                  style={{ marginTop: "20px", marginLeft: "15px" }}
                  className="d-flex"
                >
                  <input
                    checked={isRequested}
                    onChange={() => setIsRequested(!isRequested)}
                    type="checkbox"
                  />
                  <div style={{ paddingLeft: "5px" }}>
                    <label>Requested Schedule</label>
                  </div>
                </div>

                {isRequested ? (
                  <div className="col-lg-3">
                    <label>Requested By</label>
                    <SearchAsyncSelect
                      selectedValue={values?.requestedPerson}
                      handleChange={(valueOption) => {
                        setFieldValue("requestedPerson", valueOption);
                      }}
                      loadOptions={loadSupervisorAndLineManagerList}
                      placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                    />
                  </div>
                ) : (
                  ""
                )}
                {!location?.state?.intTrainingId ? (
                  <div style={{ marginTop: "18px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        addHandler(values, resetForm);
                      }}
                      className="btn btn-primary"
                    >
                      ADD
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {!location?.state?.intTrainingId ? (
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "50px" }}>Training Name</th>
                          <th style={{ width: "50px" }}>Resource Person</th>
                          <th style={{ width: "50px" }}>Month-Year</th>
                          <th style={{ width: "50px" }}>Date</th>
                          <th style={{ width: "50px" }}>Duration</th>
                          <th style={{ width: "50px" }}>Venue</th>
                          <th style={{ width: "50px" }}>BatchSize</th>
                          <th style={{ width: "50px" }}>BatchNo</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.trainigName?.label}</td>
                              <td>{item?.resourcePerson}</td>
                              <td className="text-center">{item?.monthYear}</td>
                              <td className="text-center">{`${_dateFormatter(
                                item?.fromDate
                              )} to ${item?.toDate}`}</td>
                              <td className="text-center">
                                {`${item?.duration}`}
                                {item?.duration > 1 ? ` days` : ` day`}
                              </td>
                              <td>{item?.venue}</td>
                              <td>{item?.batchSize}</td>
                              <td>{item?.batchNo}</td>
                              <td className="text-center">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{"Remove"}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fa fa-trash`}
                                      onClick={() => {
                                        removeHandler(index);
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                ""
              )}

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
          </>
        )}
      </Formik>

      <IViewModal
        title="Training Name Create"
        modelSize="lg"
        show={isShowModal}
        onHide={() => setisShowModal(false)}
      >
        <AddTraining getTrainingName={getTrainingName} />
      </IViewModal>
    </>
  );
}
