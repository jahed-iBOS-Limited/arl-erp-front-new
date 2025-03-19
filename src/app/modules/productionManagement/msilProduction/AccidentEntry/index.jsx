import React, { useState } from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import PaginationSearch from "../../../_helper/_search";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IViewModal from "../../../_helper/_viewModal";
import AccidentEntryModal from "./modal";
import { _todayDate } from "../../../_helper/_todayDate";
import { useEffect } from "react";
import IForm from "../../../_helper/_form";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
const AccidentEntry = () => {
  const [
    accidentEntryData,
    getAccidentEntryData,
    accidentEntryDataLoader,
  ] = useAxiosGet();
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [clickedRowItem, setClickedRowItem] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getAccidentEntryData(
      `/mes/MSIL/AccidentEntryLanding?BusinessUnitId=${
        selectedBusinessUnit?.value
      }&PageNo=${pageNo}&PageSize=${pageSize}&Search=${searchValue ||
        ""}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  useEffect(() => {
    getAccidentEntryData(
      `/mes/MSIL/AccidentEntryLanding?BusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${initData?.fromDate}&ToDate=${initData?.toDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {false && <Loading />}
          <IForm
            title="Accident Entry"
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
                        "/production-management/msil-Production/accidententry/create"
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
              <div>
                <div className=" row mb-4 global-form">
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
                  <div className="col-lg-3">
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getAccidentEntryData(
                          `/mes/MSIL/AccidentEntryLanding?BusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
                        );
                      }}
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {accidentEntryDataLoader && <Loading />}
                <div>
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Employee Code</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Departmant</th>
                            <th>Accident Date & Time</th>
                            <th>Contact Number</th>
                            <th>Name of Injuries</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accidentEntryData?.accidentEntry?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.employeeCode}</td>
                                <td>{item?.employeeName}</td>
                                <td>{item?.designationName}</td>
                                <td>{item?.departmentName}</td>
                                <td>
                                  {_dateFormatter(item?.accidentDateTime)}
                                </td>
                                <td>{item?.contactNumber}</td>
                                <td>{item?.nameOfInjuries}</td>
                                <td
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                  }}
                                >
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-Production/accidententry/edit/${item?.accidentEntryId}`,
                                        state: { ...item },
                                      });
                                    }}
                                  />
                                  <IView
                                    clickHandler={() => {
                                      setClickedRowItem(item);
                                      setIsShowRowItemModal(true);
                                    }}
                                  />
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {accidentEntryData?.accidentEntry?.length > 0 && (
                      <PaginationTable
                        count={accidentEntryData?.accidentEntry?.length}
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
                  </div>
                </div>
                <IViewModal
                  show={isShowRowItemModal}
                  onHide={() => setIsShowRowItemModal(false)}
                  title="Accident Entry Details"
                  modelSize="lg"
                >
                  <AccidentEntryModal clickedRowItem={clickedRowItem} />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default AccidentEntry;
