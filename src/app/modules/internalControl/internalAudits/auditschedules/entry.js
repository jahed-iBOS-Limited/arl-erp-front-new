import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import AddAuditEngagement from "./addAuditEngagement";
import { loadEmployeeInfo } from "./helper";

// formik init data
const initData = {
  auditEngagement: "",
  businessUnit: "",
  priority: "",
  auditor: "",
  dteScheduleDate: "",
  dteStartDate: "",
  dteEndDate: "",
};

export default function AuditSchedulesEntry() {
  // redux selector
  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [objProps, setObjprops] = useState({});
  const [scheduleList, setScheduleList] = useState([]);
  const [isShowModal, setisShowModal] = useState(false);

  // axios get
  const [
    auditEngagementList,
    getAuditEngagementList,
    auditEngagementListLoading,
    setAuditEngagementList,
  ] = useAxiosGet();

  // axios post
  const [, onSaveAction, loading] = useAxiosPost();

  const getAuditEngagement = () => {
    getAuditEngagementList(`/fino/Audit/GetAuditEngagementsAsync`, (data) => {
      const modifyData = data.map((item) => ({
        ...item,
        value: item?.intAuditEngagementId,
        label: item?.strAuditEngagementName,
      }));
      setAuditEngagementList(modifyData);
    });
  };

  useEffect(() => {
    getAuditEngagement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle double entry with same schedule
  const checkOverlap = (newSchedule) => {
    return scheduleList.some((existingSchedule) => {
      const sameEngagement =
        existingSchedule?.auditEngagement?.value ===
        newSchedule?.auditEngagement?.value;
      const sameBusinessUnit =
        existingSchedule?.businessUnit?.value ===
        newSchedule?.businessUnit?.value;
      const existingStart = new Date(existingSchedule.dteStartDate);
      const existingEnd = new Date(existingSchedule.dteEndDate);
      const newStart = new Date(newSchedule.dteStartDate);
      const newEnd = new Date(newSchedule.dteEndDate);

      const isOverlapping =
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd);

      return sameEngagement && sameBusinessUnit && isOverlapping;
    });
  };

  // save a new schedule
  const saveHandler = async (values, cb) => {
    if (!scheduleList?.length) {
      return toast.warn("Add at least one schedule !");
    }
    const entryApiUrl = `/fino/Audit/SaveAuditEngagementSchedules`;

    const payload = scheduleList.map((item) => ({
      intAuditScheduleId: 0,
      intAuditEngagementId: item?.auditEngagement?.value || 0,
      strAuditEngagementName: item?.auditEngagement?.label || "",
      intBusinessUnitId: item?.businessUnit?.value || 0,
      strBusinessUnitName: item?.businessUnit?.label || "",
      intPriorityId: item?.priority?.value || 0,
      strPriorityName: item?.priority?.label || "",
      intAuditorId: item?.auditor?.value || 0,
      strAuditorName: item?.auditor?.label || "",
      dteStartDate: item?.dteStartDate || "",
      dteEndDate: item?.dteEndDate || "",
      isActive: true,
      intCreateBy: profileData?.userId,
      dteServerDateTime: new Date().toISOString(),
      intUpdateBy: profileData?.userId,
      dteLastActionDateTime: new Date().toISOString(),
    }));

    onSaveAction(entryApiUrl, payload, cb, true);
  };

  // handle add new schedule
  const onAddHandler = (values) => {
    const newSchedule = {
      auditEngagement: values?.auditEngagement,
      businessUnit: values?.businessUnit,
      priority: values?.priority,
      auditor: values?.auditor,
      dteScheduleDate: values?.dteScheduleDate,
      dteStartDate: values?.dteStartDate,
      dteEndDate: values?.dteEndDate,
    };

    if (checkOverlap(newSchedule)) {
      toast.warn(
        "This audit engagement with the same business unit has overlapping dates."
      );
      return;
    }

    setScheduleList([...scheduleList, newSchedule]);
  };

  // handle schedule delete
  const handleDelete = (index) => {
    const updatedList = scheduleList.filter((_, idx) => idx !== index);
    setScheduleList(updatedList);
  };

  return (
    <IForm
      title="Audit Schedules Entry"
      isHiddenReset={true}
      getProps={setObjprops}
    >
      {(loading || auditEngagementListLoading) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setScheduleList([]);
            });
          }}
        >
          {({ handleSubmit, values, setFieldValue, resetForm }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group global-form row">
                  <div className="col-lg-3">
                    <div className="d-flex">
                      <NewSelect
                        name="auditEngagement"
                        options={auditEngagementList}
                        value={values?.auditEngagement}
                        label="Audit Engagement"
                        onChange={(valueOption) => {
                          setFieldValue("auditEngagement", valueOption);
                        }}
                      />
                      <div style={{ marginTop: "23px", paddingLeft: "3px" }}>
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Add"}</Tooltip>}
                        >
                          <span>
                            <i
                              className={`fas fa-plus-square pointer`}
                              onClick={() => setisShowModal(true)}
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="priority"
                      options={[
                        { value: 1, label: "P1" },
                        { value: 2, label: "P2" },
                        { value: 3, label: "P3" },
                        { value: 4, label: "P4" },
                      ]}
                      value={values?.priority}
                      label="Priority"
                      onChange={(valueOption) => {
                        setFieldValue("priority", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Auditor</label>
                    <SearchAsyncSelect
                      selectedValue={values?.auditor}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("auditor", valueOption);
                      }}
                      loadOptions={(searchInput) =>
                        loadEmployeeInfo(profileData?.accountId, searchInput)
                      }
                      name={"auditor"}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <InputField
                      value={values?.dteScheduleDate}
                      label="Scheduled Date"
                      name="dteScheduleDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("dteScheduleDate", e.target.value);
                      }}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.dteStartDate}
                      label="Start Date"
                      name="dteStartDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("dteStartDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.dteEndDate}
                      label="End Date"
                      name="dteEndDate"
                      min={values?.dteStartDate}
                      type="date"
                      onChange={(e) => {
                        setFieldValue("dteEndDate", e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddHandler(values);
                      }}
                      className="btn btn-primary mt-4 ml-3"
                      disabled={
                        !values.auditEngagement ||
                        !values.businessUnit ||
                        !values.priority ||
                        !values.auditor ||
                        !values.dteStartDate ||
                        !values.dteEndDate
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* Table for added schedules */}
                {scheduleList.length > 0 && (
                  <div className="table-responsive mt-4">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Audit Engagement</th>
                          <th>Business Unit</th>
                          <th>Priority</th>
                          <th>Auditor</th>
                          <th>Scheduled Date</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleList?.length > 0 &&
                          scheduleList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.auditEngagement?.label || ""}</td>
                              <td>{item?.businessUnit?.label || ""}</td>
                              <td>{item?.priority?.label || ""}</td>
                              <td>{item?.auditor?.label || ""}</td>
                              <td className="text-center">
                                {item?.dteScheduleDate || ""}
                              </td>
                              <td className="text-center">
                                {item?.dteStartDate || ""}
                              </td>
                              <td className="text-center">
                                {item?.dteEndDate || ""}
                              </td>
                              <td className="text-center">
                                <span>
                                  <IDelete
                                    remover={() => handleDelete(index)}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>

              <IViewModal
                title="Audit Engagement Create"
                modelSize="lg"
                show={isShowModal}
                onHide={() => setisShowModal(false)}
              >
                <AddAuditEngagement getAuditEngagement={getAuditEngagement} />
              </IViewModal>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
