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

const initData = {
  fromDate: _firstDateOfMonth(),
  toDate: _todayDate(),
};
export default function AuditSchedules() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  useEffect(() => {}, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    const strDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : "";
    getGridData(
      `/fino/Audit/GetAuditEngagementSchedules?BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}${strDate}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
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
                      className="btn btn-primary mt-5"
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
                {gridData?.itemList?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Audit Engagement Name</th>
                          <th>SBU Name</th>
                          <th>Priority</th>
                          <th>Auditor's Name</th>
                          <th>Rate (Dhaka)</th>
                          <th>Rate (Chittagong)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.itemList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.itemCode}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-center">{item?.uomName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.effectiveDate)}
                            </td>
                            <td className="text-center">{item?.itemRate}</td>
                            <td className="text-center">
                              {item?.itemOthersRate}
                            </td>
                            <td className="text-center">
                              <div className="">
                                <span className="" onClick={() => {}}>
                                  <IEdit />
                                </span>
                                <span className="px-5" onClick={() => {}}>
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
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.itemList?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
