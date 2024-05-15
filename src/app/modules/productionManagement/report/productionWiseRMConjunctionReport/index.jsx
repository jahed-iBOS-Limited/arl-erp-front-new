import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import NewSelect from "../../../_helper/_select";
import { getProductDDL } from "../../manufacturingExecutionSystem/billOfMaterial/helper";
import SearchAsyncSelect from "../../../../modules/_helper/SearchAsyncSelect";
import useAxiosGet from "../../../../modules/_helper/customHooks/useAxiosGet";
import { getPlantNameDDL_api } from "../poStatusReport/helper";
import { onGetProductWiseRMConjunctionReport } from "./helper";
import printIcon from "../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const initialValues = {
  plant: null,
  item: null,
  rawItem: null,
  productionCode: null,
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const ProductionWiseRMConjunctionReport = () => {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData, shallowEqual);
  const [loading] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const printRef = useRef();
  const [
    productionWiseRMConjunctionReportData,
    getProductionWiseRMConjunctionReport,
    loadingOnGetData,
    setResponse,
  ] = useAxiosGet();
  useEffect(() => {
    getPlantNameDDL_api(
      userId,
      accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [userId, accountId, selectedBusinessUnit]);
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues,
    onSubmit: (formValues) => {
      onGetProductWiseRMConjunctionReport(
        formValues,
        getProductionWiseRMConjunctionReport,
        setResponse,
        selectedBusinessUnit
      );
    },
  });
  return (
    <>
      {(loading || loadingOnGetData) && <Loading />}
      <ICustomCard title="Production Wise RM Consumption Report">
        <div className="row global-form">
          <div className="col-lg-3">
            <NewSelect
              name="plant"
              options={plantDDL}
              value={values?.plant}
              label="Plant Name"
              onChange={(valueOption) => {
                if (
                  valueOption?.value &&
                  values?.plant?.value !== valueOption?.value
                ) {
                  getProductDDL(
                    accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setItemDDL
                  );
                }
                if (values?.plant?.value !== valueOption?.value) {
                  setFieldValue("item", null);
                  setFieldValue("rawItem", null);
                  setFieldValue("productionCode", null);
                }
                setFieldValue("plant", valueOption);
              }}
              placeholder="Plant Name"
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              isDisabled={values?.rawItem}
              name="item"
              options={itemDDL}
              value={values?.item}
              label="Item Name"
              onChange={(valueOption) => {
                setFieldValue("item", valueOption);
                if (valueOption) {
                  setFieldValue("rawItem", null);
                }
              }}
              placeholder="Select Item"
            />
          </div>
          <div className="col-lg-3">
            <label>Item Name Raw</label>
            <SearchAsyncSelect
              isDisabled={values?.item}
              selectedValue={values?.rawItem}
              handleChange={(valueOption) => {
                setFieldValue("rawItem", valueOption);
                if (valueOption) {
                  setFieldValue("item", null);
                }
              }}
              loadOptions={(v) => {
                if (v?.length < 3 || !values?.plant?.value) return [];
                return axios
                  .get(
                    `/mes/MesDDL/GetItemNameRMDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&search=${v}`
                  )
                  .then((res) => {
                    return res?.data || [];
                  });
              }}
            />
          </div>
          <div className="col-lg-3">
            <label>Production Code</label>
            <SearchAsyncSelect
              selectedValue={values?.productionCode}
              handleChange={(valueOption) => {
                setFieldValue("productionCode", valueOption);
              }}
              loadOptions={(v) => {
                if (v?.length < 3 || !values?.plant?.value) return [];
                return axios
                  .get(
                    `/mes/MesDDL/GetProductionCodeDDL?BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&search=${v}`
                  )
                  .then((res) => {
                    return res?.data?.data || [];
                  });
              }}
            />
          </div>

          <div className="col-lg-3">
            <div>From Date</div>
            <input
              className="form-control trans-date cj-landing-date"
              value={values?.fromDate}
              name="fromDate"
              onChange={(e) => {
                setFieldValue("fromDate", e.target.value);
              }}
              type="date"
            />
          </div>
          <div className="col-lg-3">
            <div>To Date</div>
            <input
              className="form-control trans-date cj-landing-date"
              value={values?.toDate}
              name="toDate"
              onChange={(e) => {
                setFieldValue("toDate", e.target.value);
              }}
              type="date"
            />
          </div>
          <div style={{ marginTop: "14px" }} className="col-lg-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!values?.plant || !values?.fromDate || !values?.toDate}
            >
              View
            </button>
          </div>
          {productionWiseRMConjunctionReportData?.length > 0 && (
            <div
              style={{ marginTop: "14px" }}
              className="col-lg-3 d-flex align-items-center"
            >
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button type="button" className="btn btn-primary px-4">
                      <img
                        style={{ width: "20px", paddingRight: "5px" }}
                        src={printIcon}
                        alt="print-icon"
                      />
                      Print
                    </button>
                  )}
                  content={() => printRef?.current}
                />
              </div>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button btn btn-primary ml-2"
                table="production-wise-rm-conjunction-report-table"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Export Excel"
              />
            </div>
          )}
        </div>
        {productionWiseRMConjunctionReportData?.length > 0 ? (
          <div className="row mt-5" ref={printRef}>
            <div className="col-lg-12">
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
                    Production Wise RM Consumption Report
                  </b>
                  <br />
                </div>
              </div>
              <div className="table-responsive">
                <table
                  id="production-wise-rm-conjunction-report-table"
                  className="table table-striped table-bordered bj-table bj-table-landing material-consumption-variance"
                >
                  <thead>
                    <tr>
                      <th>Production Code</th>
                      <th>Item Name</th>
                      <th>UOM</th>
                      <th>
                        Production <br /> Order Qty
                      </th>
                      <th>
                        Production <br /> Qty
                      </th>
                      <th>
                        Item Name <br /> Raw
                      </th>
                      <th>UOM</th>
                      <th>
                        Request <br />
                        Qty Raw
                      </th>
                      <th>
                        Issue <br />
                        Qty Raw
                      </th>
                      <th>WIP Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productionWiseRMConjunctionReportData?.map(
                      (item, index) => (
                        <tr key={index}>
                          {item?.isShow ? (
                            <>
                              <td rowSpan={item?.intSectionCount}>
                                {" "}
                                {item?.productionCode}
                              </td>
                              <td
                                className="text-center"
                                rowSpan={item?.intSectionCount}
                              >
                                {" "}
                                {item?.itemName}{" "}
                              </td>
                              <td
                                className="text-center"
                                rowSpan={item?.intSectionCount}
                              >
                                {" "}
                                {item?.UoMRawName}{" "}
                              </td>
                              <td
                                className="text-center"
                                rowSpan={item?.intSectionCount}
                              >
                                {item?.OrderQty}
                              </td>
                              <td
                                className="text-center"
                                rowSpan={item?.intSectionCount}
                              >
                                {item?.productionEntryQuantity}
                              </td>
                            </>
                          ) : null}
                          <td
                            className={
                              item?.isTotal ? "text-left" : "text-left"
                            }
                          >
                            {item?.ItemRawName}
                          </td>
                          <td className="text-center">
                            {item?.ItemRawName ? item.UoMRawName : ""}
                          </td>
                          <td
                            className={
                              item?.isTotal ? "text-right" : "text-right"
                            }
                          >
                            {item?.RequestQuantityRaw}
                          </td>
                          <td
                            className={
                              item?.isTotal ? "text-right" : "text-right"
                            }
                          >
                            {item?.IssueQuantityRaw}
                          </td>
                          <td
                            className={
                              item?.isTotal ? "text-right" : "text-right"
                            }
                          >
                            {item?.wip}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </ICustomCard>
    </>
  );
};

export default ProductionWiseRMConjunctionReport;
