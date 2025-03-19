import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import MedicalRegisterDetailsView from "./detailsViewModal";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function MedicalRegisterLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [medicineList, setMedicineListDetails] = useState();

  const [, deleteHandler] = useAxiosPost();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      // `/mes/MSIL/GetAllMedicalRegisterLanding?PageNo=${pageNo}&PageSize=${pageSize}&BusinessunitId=${selectedBusinessUnit?.value}`
      `/mes/MSIL/GetAllMedicalRegisterLanding?BusinessunitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${initData?.fromDate}&ToDate=${initData?.toDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllMedicalRegisterLanding?BusinessunitId=${
        selectedBusinessUnit?.value
      }&PageNo=${pageNo}&PageSize=${pageSize}&search=${searchValue ||
        ""}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
      // `/mes/MSIL/GetAllMedicalRegisterLanding?PageNo=${pageNo}&PageSize=${pageSize}&search=${searchValue ||
      // ""}&date=${values?.date || ""}&BusinessunitId=${selectedBusinessUnit?.value}`
    );
  };
  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Medical Register"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-Production/medicalregister/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="row global-form ">
                  <div className="col-lg-3">
                    <InputField
                      name="fromDate"
                      label="From Date"
                      type="date"
                      value={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="toDate"
                      label="To Date"
                      type="date"
                      value={values?.toDate}
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getRowData(
                          `/mes/MSIL/GetAllMedicalRegisterLanding?BusinessunitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
                        );
                      }}
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>
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
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Date</th>
                            <th>Service Recipient</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Reason</th>
                            <th>Shift</th>
                            <th>Doctor</th>
                            <th style={{ width: "80px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.medicalRegister?.length > 0 &&
                            rowData?.medicalRegister?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.sl}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strServiceRecipientName}</td>
                                <td>{item?.strGender}</td>
                                <td>{item?.intAge}</td>
                                <td>{item?.strDesignationName}</td>
                                <td>{item?.strDepartment}</td>
                                <td>{item?.strSectionName}</td>
                                <td>{item?.strServiceReason}</td>
                                <td>{item?.strShiftName}</td>
                                <td>{item?.strDoctorName}</td>
                                <td className="text-center">
                                  <div className="d-flex align-items-center justify-content-around">
                                    <IEdit
                                      onClick={() =>
                                        history.push({
                                          pathname: `/production-management/msil-Production/medicalregister/edit/${item?.intMedicalRegisterHeaderId}`,
                                          state: { ...item },
                                        })
                                      }
                                    />
                                    <IView
                                      clickHandler={() => {
                                        setMedicineListDetails(item);
                                        setIsShowModel(true);
                                      }}
                                    />
                                    <span
                                      onClick={() => {
                                        deleteHandler(
                                          `/mes/MSIL/DeleteMedicalRegister?Id=${item?.intMedicalRegisterHeaderId}&UserId=${profileData?.userId}&IsActive=false&BusinessunitId=${selectedBusinessUnit?.value}`,
                                          null,
                                          () => {
                                            getRowData(
                                              `/mes/MSIL/GetAllMedicalRegisterLanding?PageNo=${pageNo}&PageSize=${pageSize}&BusinessunitId=${selectedBusinessUnit?.value}`
                                            );
                                          },
                                          true
                                        );
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.medicalRegister?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
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
              </CardBody>
            </Card>
            <IViewModal
              show={isShowModel}
              onHide={() => {
                setIsShowModel(false);
              }}
            >
              <MedicalRegisterDetailsView
                medicineList={medicineList}
                setMedicineListDetails={setMedicineListDetails}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}

export default MedicalRegisterLanding;
