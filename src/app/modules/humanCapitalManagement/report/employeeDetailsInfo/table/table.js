import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import NewSelect from "../../../../_helper/_select";
import {
  getEmployeeDetailsReport,
  getIndividualInfo,
  getJobStations,
} from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const EmployeeDetailsInfo = () => {
  const initData = {
    type: "",
    jobStation: "",
    enroll: "",
  };

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const headers = [
    "SL",
    "Employee Name",
    "Employee Id",
    "Email",
    "Login Id",
    "Phone",
    "Department",
    "Designation",
    "lang",
    "lat",
    "Region",
    "Area",
    "Territory",
    "Supervisor",
    "Workplace",
  ];
  const typeDDL = [
    { value: 1, label: "Supervisor" },
    { value: 2, label: "JobStation" },
    { value: 3, label: "UnitWise" },
    { value: 4, label: "Individual" },
  ];

  const [jobStationDDL, setJobStationDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJobStations(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setJobStationDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getEmployeeDetailsInfo = (values) => {
    if (values?.type?.value === 4) {
      getIndividualInfo(values?.enroll?.value, setGridData, setLoading);
    } else {
      getEmployeeDetailsReport(
        selectedBusinessUnit?.value,
        profileData?.emailAddress,
        values?.jobStation?.value,
        values?.type?.value,
        setGridData,
        setLoading
      );
    }
  };

  const employeeList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/tms/TMSReport/GetEmployeeListUnitWise?businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <ICard title="Employee Details Information">
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={typeDDL}
                      value={values?.type}
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                      }}
                      label="Report Type"
                      placeholder="Report Type"
                    />
                  </div>

                  {values?.type?.value === 2 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="jobStation"
                        options={jobStationDDL}
                        value={values?.jobStation}
                        onChange={(valueOption) => {
                          setFieldValue("jobStation", valueOption);
                        }}
                        label="Job Station"
                        placeholder="Job Station"
                      />
                    </div>
                  )}
                  {values?.type?.value === 4 && (
                    <div className="col-lg-3">
                      <label>Employee Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.enroll}
                        handleChange={(valueOption) => {
                          setFieldValue("enroll", valueOption);
                        }}
                        loadOptions={employeeList || []}
                      />
                    </div>
                  )}
                  <div className="col-lg-1 mt-4">
                    <button
                      type="button"
                      onClick={() => getEmployeeDetailsInfo(values)}
                      className="btn btn-primary"
                      disabled={!values?.type}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div>
              {loading && <Loading />}
              {gridData?.length ? (
                <ICustomTable ths={headers}>
                  {gridData?.map((itm, i) => {
                    return (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{itm?.employeeName}</td>
                        <td>{itm?.employeeId}</td>
                        <td>{itm?.email}</td>
                        <td>{itm?.loginId}</td>
                        <td>{itm?.contact}</td>
                        <td>{itm?.departmentName}</td>
                        <td>{itm?.designationName}</td>
                        <td>{itm?.lang}</td>
                        <td>{itm?.lat}</td>
                        <td>{itm?.nL5}</td>
                        <td>{itm?.nL6}</td>
                        <td>{itm?.territoryName}</td>
                        <td>{itm?.supervisorName}</td>
                        <td>{itm?.workplaceName}</td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              ) : null}
            </div>
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default EmployeeDetailsInfo;
