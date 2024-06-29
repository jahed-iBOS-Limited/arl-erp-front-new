import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IViewModal from "../../../_helper/_viewModal";
import { useHistory } from "react-router-dom";
import IEdit from "../../../_helper/_helperIcons/_edit";

const initData = {
  businessUnit: "",
};
export default function MachineEmpAssign() {
  const {
    businessUnitList,
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleRowItem, setSingleRowItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/mes/ProductionPlanning/GetAssignMachineonEmployeeLanding?businessUnitId=${values?.businessUnit?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const validationSchema = Yup.object().shape({
    businessUnit: Yup.object().required("Business Unit is required"),
  });
  const history = useHistory();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, pageNo, pageSize, "");
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
            title="Machine Employee Assign"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      history.push(
                        `/production-management/mes/machine-employee-assign/create`
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
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3 mt-1">
                  <button
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize, "");
                    }}
                    type="submit"
                    className="btn  btn-primary mt-5"
                  >
                    View
                  </button>
                </div>
              </div>
              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Employee Name</th>
                        <th>Plant</th>
                        <th>Machine Name</th>
                        <th>Month Year</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.strEmployeeName}
                          </td>
                          <td className="text-center">{item?.strPlantName}</td>
                          <td className="text-center">
                            {item?.strMachineName}
                          </td>
                          <td className="text-center">
                            {moment(`${item?.intMonthId}`, "M").format("MMMM")}-
                            {item?.intYearId}
                          </td>

                          <td className="text-center">
                            <div className="btn-container">
                              <span
                                className="mt-2"
                                onClick={() => {
                                  history.push({
                                    pathname: `/production-management/mes/machine-employee-assign/edit/${item?.intMachineAssignId}`,
                                    state: item,
                                  });
                                }}
                              >
                                <IEdit />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.data?.length > 0 && (
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
            </Form>
            <IViewModal
              title={"Print Template"}
              show={showModal}
              onHide={() => {
                setShowModal(false);
              }}
            >
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    margin: "20px;",
                  }}
                >
                  <button
                    style={{ cursor: "pointer" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      //   handlePrint();
                      setShowModal(false);
                    }}
                  >
                    Print
                  </button>
                </div>
              </>
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
