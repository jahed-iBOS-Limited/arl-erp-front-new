/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getOvertimeReqLandingAction,
  removeOvertimeReqByIdAction,
} from "../helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { downloadFile } from "../../../../_helper/downloadFile";

const Table = ({ gridData, removeById }) => (
  <div className="loan-scrollable-table employee-overall-status">
    <div style={{ maxHeight: "500px" }} className="scroll-table _table">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th style={{ minWidth: "70px" }}>Enroll</th>
            <th>Employee Name</th>
            <th>Requested Department</th>
            <th style={{ minWidth: "80px" }}>Requested Date</th>
            <th>Cost Center</th>
            <th>Requested Workplace</th>
            <th>Reason for Overtime</th>
            <th>Current Shift</th>
            <th>Requested OT Shift</th>
            <th style={{ minWidth: "50px" }}>OT Hours</th>
            <th style={{ minWidth: "60px" }}>Supervisor Approve</th>
            <th style={{ minWidth: "80px" }}>Line Manager Approve</th>
            <th style={{ minWidth: "30px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.map((item, index) => (
            <tr key={index}>
              <td>{item?.intEmployeeId}</td>
              <td>{item?.strEmployeeName}</td>
              <td>{item?.intRequestedDepartmentName}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteRequestedDate)}
              </td>
              <td>{item?.intCostCenterName}</td>
              <td>{item?.intWorkPlaceName}</td>
              <td>{item?.strReasonForOvertime}</td>
              <td>{item?.strCurrentShiftName}</td>
              <td>{item?.strRequestedOtShiftName}</td>
              <td className="text-center">{item?.strHoursMinute}</td>
              <td>{item?.supervisorApproveStatus}</td>
              <td>{item?.lineManagerApproveStatus}</td>
              <td className="text-center">
                <IDelete remover={removeById} id={item?.intId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OvertimeRequisitionLanding = () => {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(_todayDate());

  const getReqLanding = () => {
    getOvertimeReqLandingAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      date
    );
  };

  useEffect(() => {
    getReqLanding();
  }, [profileData, selectedBusinessUnit, date]);

  const removeById = (id) => {
    removeOvertimeReqByIdAction(id, getReqLanding);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <ICustomCard
            title="Overtime Requisition"
            createHandler={() =>
              history.push(
                "/human-capital-management/overtime-management/overtimerequisition/create"
              )
            }
          >
            {loading && <Loading />}
            <div className="global-form">
              <div className="row">
                <div className="col-lg-2">
                  <label>Date</label>
                  <InputField
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                  />
                </div>
                {gridData?.length > 0 && (
                  <div className="col-lg-10 text-right">
                    <button
                      style={{ marginTop: "19px", paddingTop: "3px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) =>
                        downloadFile(
                          `/hcm/HCMOvertimeRequisition/GetOvertimeRequisitionLandingDownload?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Date=${date}`,
                          "Overtime Requisition",
                          "xlsx"
                        )
                      }
                    >
                      Export Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
            {gridData?.length > 0 && (
              <Table gridData={gridData} removeById={removeById} />
            )}
          </ICustomCard>
        </>
      )}
    </Formik>
  );
};

export default OvertimeRequisitionLanding;
