/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import PaginationSearch from "./../../../../_helper/_search";
import {
  getPlantNameDDL_api,
  getProductionReportData,
  getShopfloorDDL,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHtmlTableToExcel from "react-html-table-to-excel";

const initData = {
  plant: "",
  shopFloor: "",
  bomType: "",
  itemType: {
    value: 3,
    label: "All",
  },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function ProductionReportLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloor, setShopFloorDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    getPlantNameDDL_api(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const printRef = useRef();

  const girdDataFunc = (values, searchValue) => {
    getProductionReportData({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      pId: values?.plant?.value,
      sId: values?.shopFloor?.value,
      billType: values?.bomType?.value || 0,
      isMainItem: values?.itemType?.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      setter: setGridData,
      setLoading,
      search: searchValue,
    });
  };

  const paginationSearchHandler = (searchValue, values) => {
    girdDataFunc(values, searchValue);
  };
  return (
    <>
      <ICustomCard title="Production Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, touched, errors }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Select Plant"
                      onChange={(valueOption) => {
                        setFieldValue("shopFloor", "");
                        setGridData([]);
                        setFieldValue("plant", valueOption);
                        getShopfloorDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setShopFloorDDL
                        );
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shopFloor"
                      options={[{ value: 0, label: "All" }, ...shopFloor]}
                      value={values?.shopFloor}
                      label="Select Shop Floor"
                      onChange={(valueOption) => {
                        setFieldValue("shopFloor", valueOption);
                      }}
                      placeholder="Select Shop Floor"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {[188].includes(selectedBusinessUnit?.value) ? (
                    <div className="col-lg-3">
                      <NewSelect
                        name="bomType"
                        options={[
                          {
                            value: 1,
                            label: "Main (Paddy to Rice)",
                          },
                          {
                            value: 2,
                            label: "Conversion (Rice to Rice)",
                          },
                          {
                            value: 3,
                            label: "Re-Process (Rice to Rice)",
                          },
                        ]}
                        value={values?.bomType}
                        label="Bom Type"
                        onChange={(valueOption) => {
                          setFieldValue("bomType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={[
                        {
                          value: 3,
                          label: "All",
                        },
                        {
                          value: 1,
                          label: "Main Item",
                        },
                        {
                          value: 2,
                          label: "Others",
                        },
                      ]}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setFieldValue("itemType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        girdDataFunc(values, null);
                      }}
                      disabled={
                        !values?.plant?.value ||
                        !values?.shopFloor?.value ||
                        (selectedBusinessUnit?.value === 188 &&
                          !values?.bomType?.value) ||
                        !values?.itemType?.value
                      }
                    >
                      View
                    </button>
                  </div>
                  {gridData?.length > 0 && (
                    <div
                      style={{ marginTop: "15px" }}
                      className="col-lg-3 d-flex justify-content-end"
                    >
                      <div>
                        <ReactToPrint
                          trigger={() => (
                            <button
                              type="button"
                              className="btn btn-primary px-4 py-1"
                            >
                              <img
                                style={{ width: "25px", paddingRight: "5px" }}
                                src={printIcon}
                                alt="print-icon"
                              />
                              Print
                            </button>
                          )}
                          content={() => printRef.current}
                        />
                      </div>
                    </div>
                  )}
                  <div className="ml-2" style={{ marginTop: "15px" }}>
                    {gridData?.length && (
                      <ReactHtmlTableToExcel
                        id="test-table-xls-button-att-reports"
                        className="btn btn-primary"
                        table={"table-to-xlsx"}
                        filename={"productionReport"}
                        sheet={"productionReport"}
                        buttonText="Export Excel"
                      />
                    )}
                  </div>
                </div>
              </Form>
              <div className="col-lg-12 pr-0 pl-0">
                <PaginationSearch
                  placeholder="Item Name & Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              {gridData?.length > 0 && (
                <div ref={printRef} className="col-lg-12 pr-0 pl-0">
                  <div className="row text-center my-2">
                    <div className="col-lg-12">
                      <h3>{selectedBusinessUnit?.label}</h3>
                      <b className="display-5">
                        Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon,
                        Dhaka-1208.
                      </b>
                      <br />
                      <b
                        className="display-5"
                        style={{ textDecoration: "underline" }}
                      >
                        Production Report
                      </b>
                      <br />
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      id="table-to-xlsx"
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Date</th>
                          <th>Shop Floor</th>
                          <th>Machine</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          {(selectedBusinessUnit?.value === 171 ||
                            selectedBusinessUnit?.value === 224) && (
                            <th>By Product Name</th>
                          )}
                          <th>UoM</th>
                          <th>Production Qty</th>
                          <th>Wastage/By Product Qty</th>
                          <th>Wastage %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-right">
                              <span className="pr-2">
                                {_dateFormatter(item?.dteProductionDate)}
                              </span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">
                                {values?.shopFloor?.label}
                              </span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">
                                {item?.strWorkCenterName}
                              </span>
                            </td>
                            <td className="text-center">
                              <span className="pr-2">{item?.strItemCode}</span>
                            </td>
                            {selectedBusinessUnit?.value === 171 ||
                            selectedBusinessUnit?.value === 224 ? (
                              <>
                                <td className="text-left">
                                  <span className="pr-2">
                                    {item?.isMainItem
                                      ? item?.strMainItenName
                                      : ""}
                                  </span>
                                </td>
                                <td className="text-left">
                                  <span className="pr-2">
                                    {item?.isMainItem ? "" : item?.strItemName}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="text-left">
                                  <span className="pr-2">
                                    {item?.strItemName}
                                  </span>
                                </td>
                              </>
                            )}

                            <td className="text-center">
                              <span className="pr-2">{item?.strUOMName}</span>
                            </td>
                            {selectedBusinessUnit?.value === 171 ||
                            selectedBusinessUnit?.value === 224 ? (
                              <>
                                <td className="text-right">
                                  <span className="pr-2">
                                    {item?.isMainItem ? item?.mainQty : ""}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="pr-2">
                                    {item?.isMainItem ? "" : item?.numQuantity}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="text-right">
                                  <span className="pr-2">
                                    {item?.numQuantity}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="pr-2">
                                    {item?.wastageProductQty}
                                  </span>
                                </td>
                              </>
                            )}
                            <td className="text-right">
                              <span className="pr-2">
                                {item?.numQuantity / item?.wastageProductQty ||
                                  0}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ProductionReportLanding;
