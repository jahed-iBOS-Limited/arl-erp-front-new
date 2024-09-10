import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _firstDateOfMonth, _todayDate } from "../../../_helper/_todayDate";
import NewSelect from "../../../_helper/_select";
import IView from "../../../_helper/_helperIcons/_view";

const initData = {
  fromDate: _firstDateOfMonth(),
  toDate: _todayDate(),
};
export default function AuditSchedules() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  useEffect(() => {}, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    const strBusinessUnit = values?.businessUnit
      ? `&BusinessUnitId=${selectedBusinessUnit?.value}`
      : "";
    const strDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : "";
    getGridData(
      `/fino/Audit/GetAuditEngagementSchedules?pageNumber=${pageNo}&pageSize=${pageSize}${strDate}${strBusinessUnit}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const calculateDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0; // If dates are not defined, return 0 days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    return dayDifference > 0 ? dayDifference : 0; // Ensure non-negative days difference
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {loading && <Loading />}
          <IForm
            title="Audit Schedules"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/internal-control/internalaudits/auditschedules/entry"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
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
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      disabled={!values?.fromDate || !values?.toDate}
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, "");
                      }}
                      className="btn btn-primary mt-4"
                    >
                      Show
                    </button>
                  </div>
                </div>
                {gridData?.itemList?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search Enroll & Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Audit Engagement Name</th>
                          <th>SBU Name</th>
                          <th>Priority</th>
                          <th>Auditor's Name</th>
                          <th>Audit start date</th>
                          <th>Audit end date</th>
                          <th>Days to complete the audit assignment</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strAuditEngagementName}</td>
                            <td>{item?.strBusinessUnitName}</td>
                            <td className="text-center">
                              {item?.strPriorityName}
                            </td>
                            <td className="text-center">
                              {item?.strAuditorName}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteStartDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteEndDate)}
                            </td>
                            <td className="text-center">
                              {calculateDaysDifference(
                                item?.dteStartDate,
                                item?.dteEndDate
                              )}
                            </td>

                            <td className="text-center">
                              <div className="">
                                {/* <span className="" onClick={() => {}}>
                                  <IEdit />
                                </span> */}
                                {/* <span className="px-5" onClick={() => {}}>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">History</Tooltip>
                                    }
                                  >
                                    <i
                                      style={{ fontSize: "16px" }}
                                      class="fa fa-history cursor-pointer"
                                      aria-hidden="true"
                                    ></i>
                                  </OverlayTrigger>
                                </span> */}
                                <span
                                  className=""
                                  onClick={() => {
                                    history.push({
                                      pathname: `/internal-control/internalaudits/auditschedules/view`,
                                      state: item,
                                    });
                                  }}
                                >
                                  <IView />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.length > 0 && (
                  <PaginationTable
                    count={getGridData?.length}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
