import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { setData } from "../../trainingRequisition/Form/helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  rowDtoAddHandler,
  rowDto,
  remover,
  profileData,
  requisitionList,
  setRequisitionList,
  isFromRequisition,
  setIsFromRequisition,
}) {
  const [trainingScheduleDDL, getTrainingScheduleDDL] = useAxiosGet();
  console.log(requisitionList, "requisitionList");
  useEffect(() => {
    getTrainingScheduleDDL(`/hcm/Training/TrainingScheduleDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const addHandler = (values, resetForm, setFieldValue) => {
    if (!values?.trainingSchedule?.value)
      return toast.warn("Training Schedule is");
    if (!values?.employee?.value) return toast.warn("Employee is required");
    if (
      requisitionList.some(
        (item) => item?.employee?.value === values?.employee?.value
      )
    )
      return toast.warn("Employee already exist");
    setRequisitionList([{ ...values, isFromRequisition }, ...requisitionList]);
    resetForm(initData);
    setFieldValue("phone", "");
  };

  const removeHandler = (index) => {
    const data = requisitionList?.filter((item, i) => i !== index);
    setRequisitionList([...data]);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
              {false && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="trainingSchedule"
                    isDisabled={true}
                    options={trainingScheduleDDL || []}
                    value={values?.trainingSchedule}
                    label="Training Schedule"
                    onChange={(valueOption) => {
                      setFieldValue("trainingSchedule", valueOption);
                    }}
                    errors={errors}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Employee</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                      setData(valueOption, setFieldValue);
                    }}
                    loadOptions={loadSupervisorAndLineManagerList}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.resourcePerson}
                    label="Resourse Person"
                    name="resourcePerson"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isDisabled={true}
                    name="designation"
                    options={[]}
                    value={values?.designation}
                    label="Designation"
                    onChange={(valueOption) => {
                      setFieldValue("designation", valueOption);
                    }}
                    errors={errors}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    isDisabled={true}
                    name="jobType"
                    options={[]}
                    value={values?.jobType}
                    label="Job Type"
                    onChange={(valueOption) => {
                      setFieldValue("jobType", valueOption);
                    }}
                    errors={errors}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    disabled={true}
                    value={values?.email}
                    label="Email"
                    name="email"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.phone}
                    label="Phone"
                    name="phone"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    disabled={true}
                    value={values?.gender}
                    label="Gender"
                    name="gender"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    disabled={true}
                    value={values?.supervisor}
                    label="Supervisor"
                    name="supervisor"
                  />
                </div>
                <div
                  style={{ marginTop: "17px", marginLeft: "12px" }}
                  className="d-flex"
                >
                  <input
                    type="checkbox"
                    checked={isFromRequisition}
                    onChange={() => {
                      setIsFromRequisition(!isFromRequisition);
                    }}
                  />
                  <div style={{ paddingLeft: "5px", paddingTop: "1px" }}>
                    <label>Is Requisition (Approval Needed)</label>
                  </div>
                </div>

                <div style={{ marginTop: "15px" }} className="col-lg-1">
                  <button
                    type="button"
                    onClick={() => {
                      addHandler(values, resetForm, setFieldValue);
                    }}
                    className="btn btn-primary"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "100px" }}>Enroll</th>
                        <th>Name</th>
                        <th>Training Name</th>
                        <th>Designation</th>
                        <th>Job Type</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>Supervisor</th>
                        <th>Resource Person</th>
                        <th style={{ width: "50px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requisitionList?.length > 0 &&
                        requisitionList?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {item?.employee?.value}
                            </td>
                            <td>{item?.employee?.name}</td>
                            <td>{item?.trainingSchedule?.name}</td>
                            <td>{item?.designation?.label}</td>
                            <td>{item?.jobType?.label}</td>
                            <td>{item?.email || ""}</td>
                            <td>{item?.phone || ""}</td>
                            <td>{item?.gender}</td>
                            <td>{item?.supervisor}</td>
                            <td>{item?.resourcePerson}</td>
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
    </>
  );
}
