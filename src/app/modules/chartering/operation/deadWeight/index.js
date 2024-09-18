import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

import { marineBaseUrlPythonAPI } from "../../../../App";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";

const initData = {};
export default function DeadWeight() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `${marineBaseUrlPythonAPI}/domain/VesselNomination/GetDeadWeightCostLanding?BusinessUnitId=${0}&FromDate=${
        values?.fromDate
      }&ToDate=${values?.toDate}&pageNumber=${pageNo ||
        1}&pageSize=${pageSize || 600}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };
  useEffect(() => {
    getLandingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, pageNo, pageSize);
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
            title="Dead Weight"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
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
                <div className="">
                  <IButton
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={handleSubmit}
                  />
                </div>
              </div>

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Unit</th>
                        <th>Email</th>
                        <th>Vessel Nomination Code</th>
                        <th>Draft Type</th>
                        <th>Displacement Draft Mts</th>
                        <th>Dock Water Density</th>
                        <th>LightShip Mts</th>
                        <th>Fuel Oil Mts</th>
                        <th>Disel Oil Mts</th>
                        <th>Fresh Water Mts</th>
                        <th>Constant Mts</th>
                        <th>UnpumpAble Ballast Mts </th>
                        <th>CargoLoad Mts </th>
                        <th>Final CargoToload Mts </th>
                        <th>strRemarks </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.strBusinessUnitName}
                          </td>
                          <td className="text-center">
                            {item?.strEmailAddress}
                          </td>

                          <td className="text-center">
                            {item?.strVesselNominationCode}
                          </td>
                          <td className="text-center">{item?.strDraftType}</td>
                          <td className="text-center">
                            {item?.intDisplacementDraftMts}
                          </td>
                          <td className="text-center">
                            {item?.intDockWaterDensity}
                          </td>
                          <td className="text-center">
                            {item?.intLightShipMts}
                          </td>
                          <td className="text-center">
                            {item?.intFoFuelOilMts}
                          </td>
                          <td className="text-center">
                            {item?.intFoDoDiselOilMts}
                          </td>
                          <td className="text-center">
                            {item?.intFwFreshWaterMts}
                          </td>
                          <td className="text-center">
                            {item?.intConstantMts}
                          </td>
                          <td className="text-center">
                            {item?.intUnpumpAbleBallastMts}
                          </td>
                          <td className="text-center">
                            {item?.intCargoLoadMts}
                          </td>
                          <td className="text-center">
                            {item?.intFinalCargoToloadMts}
                          </td>
                          <td className="text-center">{item?.strRemarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.length > 0 && (
                <PaginationTable
                  count={gridData?.length}
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
              <div></div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
