import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";

// import "./style.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _dateFormatter } from "../../_helper/_dateFormate";
import IForm from "../../_helper/_form";
import { _todayDate } from "../../_helper/_todayDate";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import InputField from "../../_helper/_inputField";
import PaginationTable from "../../_helper/_tablePagination";
import { getLetterHead } from "../../financialManagement/report/bankLetter/helper";
import CommonTable from "../../_helper/commonTable";
import { amountToWords } from "../../_helper/_ConvertnumberToWord";

const initData = {
  businessUnit: "",
  fuelRequisition: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function FuelStationReport() {
  const {
    businessUnitList,
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const printRef = useRef();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const carWiseheadersData = [
    "SL No",
    "Car No",
    "Octane (Ltr)",
    "Diesel(Ltr)",
    "CNG",

    "Amount (Taka)",
    "CNG Amount (Taka)",

    "Remarks",
  ];
  const dailyeadersData = [
    "SL No",
    "Date",
    "Copon No",
    "Car No",

    "Octane (Ltr)",
    "Diesel(Ltr)",
    "CNG",

    "Amount (Taka)",
    "CNG Amount (Taka)",
    "Remarks",
  ];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    console.log(values);
    if (values?.fuelRequisition?.value === 1) {
      getGridData(
        `/tms/FuelRequsition/GetFuelRequsitionReportCarWise?BusinessUnitId=${values?.businessUnit?.value}&Fromdate=${values?.fromDate}&ToDate=${values?.toDate}`
      );
    } else {
      getGridData(
        `/tms/FuelRequsition/GetFuelRequsitionReportDayWise?BusinessUnitId=${values?.businessUnit?.value}&Fromdate=${values?.fromDate}&ToDate=${values?.toDate}`
      );
    }
  };

  const validationSchema = Yup.object().shape({
    businessUnit: Yup.object().required("Business Unit is required"),
    fuelRequisition: Yup.object().required("Fuel Requisition Type is required"),
    toDate: Yup.date().required("To Date is required"),
    fromDate: Yup.date().required("from Date is required"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getLandingData(values, () => {
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
            title="Fuel Station Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => {
                      handlePrint();
                    }}
                  >
                    Print
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
                <div className="col-lg-3">
                  <NewSelect
                    name="fuelRequisition"
                    options={[
                      { value: 1, label: "Car Wise Fuel Requisition" },
                      { value: 2, label: "Day Wise Fuel Requisition" },
                    ]}
                    value={values?.fuelRequisition}
                    label="Requisition Type"
                    onChange={(valueOption) => {
                      setFieldValue("fuelRequisition", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
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

                <div className="col-lg-3">
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

              {gridData?.length > 0 && (
                <div className="mt-5">
                  <div ref={printRef}>
                    <div>
                      <h2 className="text-center">Pubali Filling Station</h2>
                      <h2 className="text-center">
                        Dealer: Padma Oil Company Ltd
                      </h2>
                      <h4 className="text-center">
                        79/A,Motijheel C/A,Dhaka-1000
                      </h4>
                      <p className="text-center">Phone:47122799</p>
                      <p
                        className="text-center"
                        style={{ margin: "-10px 0 0 0" }}
                      >
                        Mobile:01711-174628
                      </p>
                      <div className="d-flex mt-5">
                        <p>
                          <strong>
                            Name:{values?.businessUnit?.label}
                            {`(${values?.businessUnit?.buShortName})`}
                          </strong>
                        </p>
                        <p className="mx-3">
                          <strong>
                            Address:{values?.businessUnit?.address}
                          </strong>
                        </p>
                      </div>
                      <p style={{ marginTop: "-5px" }}>
                        <strong>
                          {" "}
                          Billing Period:{" "}
                          {moment(values?.fromDate).format("LL")} to{" "}
                          {moment(values?.toDate).format("LL")}
                        </strong>
                      </p>
                      <div className="table-responsive ">
                        <div style={{ marginTop: "-7px" }}>
                          <CommonTable
                            headersData={
                              values?.fuelRequisition?.value === 1
                                ? carWiseheadersData
                                : dailyeadersData
                            }
                          >
                            {values?.fuelRequisition?.value === 1 ? (
                              <tbody>
                                {gridData?.map((item, index) => (
                                  <tr>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">
                                      {item?.vehicleNo}
                                    </td>
                                    <td className="text-center">
                                      {item?.octane}
                                    </td>
                                    <td className="text-center">
                                      {item.disel}
                                    </td>
                                    <td className="text-center">{item.cng}</td>
                                    <td className="text-center">
                                      {item?.octaneAmount || item?.diselAmount}
                                    </td>
                                    <td className="text-center">
                                      {item?.cngAmount}
                                    </td>
                                    <td className="text-center">
                                      {item.strRemarks}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td colSpan={2}>Total</td>
                                  <td className="text-right">
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.octane,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.disel,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.cng,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item?.octaneAmount +
                                          item?.diselAmount,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.cngAmount,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right"></td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody>
                                {gridData?.map((item, index) => (
                                  <tr>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">
                                      {_dateFormatter(item?.dteSupplyDate)}
                                    </td>
                                    <td className="text-center">
                                      {item?.copon}
                                    </td>
                                    <td className="text-center">
                                      {item?.vehicleNo}
                                    </td>
                                    <td className="text-center">
                                      {item?.octane}
                                    </td>
                                    <td className="text-center">
                                      {item?.disel}
                                    </td>
                                    <td className="text-center">{item.cng}</td>
                                    <td className="text-center">
                                      {item?.octaneAmount || item?.diselAmount}
                                    </td>
                                    <td className="text-center">
                                      {item?.cngAmount}
                                    </td>
                                    <td className="text-center">
                                      {item?.strRemarks}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td colSpan={4}>Total</td>
                                  <td className="text-right">
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.octane,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.disel,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.cng,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {" "}
                                    {gridData
                                      ?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item?.octaneAmount +
                                          item?.diselAmount,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    {gridData
                                      ?.reduce(
                                        (acc, item) => acc + item?.cngAmount,
                                        0
                                      )
                                      .toFixed(2)}
                                  </td>
                                  <td className="text-right"></td>
                                </tr>
                              </tbody>
                            )}
                          </CommonTable>
                        </div>
                      </div>
                      <p className="mt-5">
                        {" "}
                        <strong>
                          Taka:{" "}
                          {amountToWords(
                            gridData
                              ?.reduce(
                                (acc, item) =>
                                  acc + item?.octaneAmount + item?.diselAmount,
                                0
                              )
                              .toFixed(2)
                          )}
                          {" taka only"}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
