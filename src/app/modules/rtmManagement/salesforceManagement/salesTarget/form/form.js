import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  GetDistributionChannelDDL_api,
  GetRegionIdDDL_api,
  getPerentTerritoryInfo,
  getRouteByterritoryId,
  getTerritorySalesTargetInfo,
  getTargetDateByMonth,
  getPerentTerritorySalesTarget,
  GetAreaDDL_api,
  GetTerritoryDDL_api,
  GetPointDDL_api,
  GetSectionDDL_api,
} from "../helper";

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
  buId,
  targetMonthDDL,
  targetYearDDL,
  routeDDL,
  setRouteDDL,
  // Other
  rowData,
  setRowData,
  secondRowData,
  setSecondRowData,
  setDisabled,
  totalTargetAmount,
}) {
  // Parent Territory Name for 2nd Table Name
  const [parentTerritoryName, setParentTerritory] = useState("");
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [regionIdDDL, setRegionIdDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [pointDD, setPointDD] = useState([]);
  const [sectionDDL, setSectionDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  // Quantity Hanlder
  const quantityHandler = (index, value) => {
    if (value >= 0) {
      let newRowData = [...rowData];
      newRowData[index]["caseQty"] = value;
      newRowData[index]["totalAmount"] = +value * newRowData[index]["tprate"];
      setRowData(newRowData);
    }

    // if (+value > secondRowData[index]?.quantity) {
    //   let newRowData = [...rowData];
    //   newRowData[index]["quantity"] = value;
    //   newRowData[index]["totalAmount"] = +value * newRowData[index]["price"];
    //   setRowData(newRowData);
    // } else {
    //   toast.warning(
    //     "Quantity must be greater then (Parent Territory) Sales Target",
    //     {
    //       toastId:
    //         "Quantity must be greater then (Parent Territory) Sales Target",
    //     }
    //   );
    // }
  };

  // Price Handler
  const priceHandler = (index, value) => {
    let newRowData = [...rowData];
    newRowData[index]["tprate"] = +value;
    newRowData[index]["totalAmount"] = +value * newRowData[index]["caseQty"];
    setRowData(newRowData);
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
            setSecondRowData([]);
          });
        }}
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
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="territoryType"
                    options={territoryTypeDDL}
                    value={values?.territoryType}
                    label="Territory Type"
                    onChange={(valueOption) => {
                      setFieldValue("territoryType", valueOption);
                      setFieldValue("territory", "");
                      setFieldValue("route", "");
                      getTerritoryDDL(
                        accountId,
                        buId,
                        valueOption?.value,
                        setTerritoryDDL
                      );
                    }}
                    placeholder="Territory Type"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}

                <div className="col-lg-3">
                  <NewSelect
                    name="chanel"
                    options={distributionChannelDDL || []}
                    value={values?.chanel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue("chanel", valueOption);
                      setFieldValue("Region", "");
                      GetRegionIdDDL_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setRegionIdDDL
                      );
                    }}
                    placeholder="Channel"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="region"
                    options={regionIdDDL || []}
                    value={values?.region}
                    label="Region"
                    onChange={(valueOption) => {
                      setFieldValue("region", valueOption);
                      setFieldValue("area", "");
                      GetAreaDDL_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.chanel?.value,
                        valueOption?.value,
                        setAreaDDL
                      );
                    }}
                    placeholder="Region"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="area"
                    options={areaDDL || []}
                    value={values?.area}
                    label="Area"
                    onChange={(valueOption) => {
                      setFieldValue("area", valueOption);
                      setFieldValue("territory", "");
                      GetTerritoryDDL_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.chanel?.value,
                        valueOption?.value,
                        setTerritoryDDL
                      );
                    }}
                    placeholder="Area"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="territory"
                    options={territoryDDL || []}
                    value={values?.territory}
                    label="Territory Name"
                    onChange={(valueOption) => {
                      setFieldValue("territory", valueOption);
                      setFieldValue("point", "");
                      GetPointDDL_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.chanel?.value,
                        valueOption?.value,
                        setPointDD
                      );
                      // setFieldValue("route", "");
                      // getRouteByterritoryId(
                      //   accountId,
                      //   buId,
                      //   valueOption?.value,
                      //   setRouteDDL
                      // );
                      getPerentTerritoryInfo(
                        accountId,
                        buId,
                        valueOption?.value,
                        setFieldValue,
                        setParentTerritory
                      );
                    }}
                    placeholder="Territory Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="point"
                    options={pointDD || []}
                    value={values?.point}
                    label="Point"
                    onChange={(valueOption) => {
                      setFieldValue("point", valueOption);
                      setFieldValue("section", "");
                      GetSectionDDL_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.chanel?.value,
                        valueOption?.value,
                        setSectionDDL
                      );
                    }}
                    placeholder="Point"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="section"
                    options={sectionDDL || []}
                    value={values?.section}
                    label="Section"
                    onChange={(valueOption) => {
                      setFieldValue("section", valueOption);
                      setFieldValue("route", "");
                      getRouteByterritoryId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setRouteDDL
                      );
                    }}
                    placeholder="Section"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="route"
                    options={routeDDL}
                    value={values?.route}
                    label="Route Name"
                    onChange={(valueOption) => {
                      setFieldValue("route", valueOption);
                    }}
                    placeholder="Route Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <label>Parent Territory Name</label>
                  <InputField
                    value={values?.parentTerritory}
                    name="parentTerritory"
                    placeholder="Parent Territory Name"
                    type="text"
                    disabled={true}
                  />
                </div> */}

                <div className="col-lg-3">
                  <label>Total Target Amount</label>
                  <InputField
                    value={totalTargetAmount}
                    name="totalTargetAmount"
                    placeholder="Total Target Amount"
                    type="number"
                    disabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="targetYear"
                    options={targetYearDDL}
                    value={values?.targetYear}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("targetYear", valueOption);
                      setFieldValue("targetMonth", "");
                    }}
                    placeholder="Year"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="targetMonth"
                    options={targetMonthDDL}
                    value={values?.targetMonth}
                    label="Month"
                    onChange={(valueOption) => {
                      setFieldValue("targetMonth", valueOption);
                      getTargetDateByMonth(
                        accountId,
                        buId,
                        valueOption?.value,
                        values?.targetYear?.value,
                        setFieldValue
                      );
                    }}
                    placeholder="Month"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.targetYear}
                  />
                </div>

                <div className="col-lg-3">
                  <label>Target Start Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="fromDate"
                    type="date"
                    disabled
                  />
                </div>

                <div className="col-lg-3">
                  <label>Target End Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="toDate"
                    type="date"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    style={{ marginTop: "15px" }}
                    className="btn btn-primary"
                    disabled={
                      !values?.territory?.value ||
                      !values?.route?.value ||
                      !values?.targetMonth?.value ||
                      !values?.targetYear?.value ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      // Sales target
                      getTerritorySalesTargetInfo(
                        accountId,
                        buId,
                        values?.section?.value,
                        values?.targetMonth?.value,
                        values?.targetYear?.value,
                        values?.route?.value,
                        setRowData,
                        setDisabled,
                        () => {
                          // Parent Territory Sales Target
                          getPerentTerritorySalesTarget(
                            accountId,
                            buId,
                            values?.section?.value,
                            values?.targetMonth?.value,
                            values?.targetYear?.value,
                            setSecondRowData
                          );
                        }
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>

            <div className="row">
              {/* Sales Target Item */}
              {rowData?.length > 0 && (
                <div className="col-lg-6">
                  <h6>Target Setup</h6>
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th style={{ width: "150px" }}>Item Code</th>
                        <th style={{ width: "80px" }}>Case</th>
                        <th style={{ width: "80px" }}>TP Rate</th>
                        <th style={{ width: "100px" }}>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <span className="pl-2">{item?.itemCode}</span>
                          </td>
                          <td className="text-center">
                            <input
                              value={item?.caseQty || ""}
                              style={{ height: "20px" }}
                              className="form-control"
                              type="number"
                              name="caseQty"
                              onChange={(e) =>
                                quantityHandler(index, e.target.value)
                              }
                              min={0}
                              required
                            />
                          </td>
                          <td className="text-center">
                            <input
                              value={item?.tprate || ""}
                              name="tprate"
                              style={{ height: "20px" }}
                              className="form-control"
                              type="number"
                              onChange={(e) =>
                                priceHandler(index, e.target.value)
                              }
                              min={0}
                              required
                            />
                          </td>
                          <td className="text-right">
                            {" "}
                            <span className="pr-2">
                              {+item?.caseQty * +item?.tprate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Parent Territory Sales Target Item */}
              {secondRowData?.length > 0 && (
                <div className="col-lg-6">
                  <h6>({parentTerritoryName}) Sales Target</h6>
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th style={{ width: "150px" }}>Item Code</th>
                        <th style={{ width: "80px" }}>Case</th>
                        <th style={{ width: "80px" }}>Total Amount</th>
                        <th style={{ width: "80px" }}>Assigned Case</th>
                        <th style={{ width: "120px" }}>Assigned Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {secondRowData?.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{ height: "25px" }}
                            className="text-center"
                          >
                            {index + 1}
                          </td>
                          <td style={{ height: "25px" }}>
                            <span className="pl-2">{item?.itemCode}</span>
                          </td>
                          <td style={{ height: "25px" }} className="text-right">
                            {" "}
                            <span className="pr-2">{item?.caseQty}</span>
                          </td>
                          <td style={{ height: "25px" }} className="text-right">
                            {" "}
                            <span className="pr-2">{item?.totalAmount}</span>
                          </td>
                          <td style={{ height: "25px" }} className="text-right">
                            {" "}
                            <span className="pr-2">
                              {rowData[index]?.caseQty}
                            </span>
                          </td>
                          <td style={{ height: "25px" }} className="text-right">
                            {" "}
                            <span className="pr-2">
                              {+rowData[index]?.caseQty *
                                +rowData[index]?.tprate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </Formik>
    </>
  );
}

export default _Form;
