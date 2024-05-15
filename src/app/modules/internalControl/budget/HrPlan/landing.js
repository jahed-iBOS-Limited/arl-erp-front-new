/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import HrPlanCreateEditModal from "./hrPlanCreateEditModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

let initData = {
  year: "",
  department: "",
};

export function HrPlanLanding() {
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [yearDDL, getYearDDL, yLoading] = useAxiosGet([]);
  const [departmentDDL, getDepartmentDDL, dLoading] = useAxiosGet([]);
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet([]);
  const [show, setShow] = useState(false);
  const [rowDetailsData, setRowDetailsData] = useState({});

  useEffect(() => {
    getDepartmentDDL(
      `/fino/BudgetFinancial/GetAllHrPlan?partName=DepartmentDDL&businessUnitId=${selectedBusinessUnit?.value}&departmentId=0&designationId=0&yearId=0&autoId=0`
    );
    getYearDDL(
      `/fino/BudgetFinancial/GetAllHrPlan?partName=YearDDL&businessUnitId=${selectedBusinessUnit?.value}&departmentId=0&designationId=0&yearId=0&autoId=0`
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <IForm
      title={"Hr Plan"}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            {(loading || dLoading || yLoading) && <Loading />}
            <div className="form-group  global-form">
              <div className="row">
                <div className="col-lg-2">
                  <NewSelect
                    name="year"
                    options={yearDDL || []}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("year", valueOption);
                        if (values?.department) {
                          getRowDto(
                            `/fino/BudgetFinancial/GetAllHrPlan?partName=PlanVsBudgetLanding&businessUnitId=${selectedBusinessUnit?.value}&departmentId=${values?.department?.value}&designationId=0&yearId=${valueOption?.value}&autoId=0`
                          );
                        }
                      } else {
                        setFieldValue("year", "");
                        setRowDto([]);
                      }
                    }}
                    placeholder="Year"
                    isSearchable={true}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="department"
                    options={departmentDDL || []}
                    value={values?.department}
                    label="Department"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        getRowDto(
                          `/fino/BudgetFinancial/GetAllHrPlan?partName=PlanVsBudgetLanding&businessUnitId=${selectedBusinessUnit?.value}&departmentId=${valueOption?.value}&designationId=0&yearId=${values?.year?.value}&autoId=0`
                        );
                        setFieldValue("department", valueOption);
                      } else {
                        setRowDto([]);
                        setFieldValue("department", "");
                      }
                    }}
                    placeholder="Department"
                    isSearchable={true}
                    isDisabled={false}
                  />
                </div>
              </div>
            </div>
            {values?.department ? (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Position</th>
                            <th>Total Plan Qty</th>
                            <th>Total Budget</th>
                            <th style={{ width: "150px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strDesignation}</td>
                                <td>
                                  {item?.numPlanQty ? item?.numPlanQty : ""}
                                </td>
                                <td className="text-center">
                                  {item?.numTotalBudget
                                    ? item?.numTotalBudget
                                    : ""}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-center">
                                    <span
                                      className="pr-2"
                                      onClick={() => {
                                        setShow(true);
                                        setRowDetailsData(item);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      <i
                                        class="fa fa-plus"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <IViewModal
                      modelSize="lg"
                      show={show}
                      onHide={() => setShow(false)}
                    >
                      <HrPlanCreateEditModal
                        rowDetailsData={rowDetailsData}
                        valueData={values}
                        getRowDto={getRowDto}
                        setShow={setShow}
                      />
                    </IViewModal>
                  </div>
                </div>
              </>
            ) : null}
          </>
        )}
      </Formik>
    </IForm>
  );
}
