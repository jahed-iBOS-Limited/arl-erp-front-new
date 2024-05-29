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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import {
  getPlantNameDDL_api,
  getShopfloorDDL,
  getBOMItemDDL,
  getBOMReport,
} from "../helper";
import axios from "axios";

const initData = {
  plant: "",
  shopFloor: "",
  item: "",
  rawItem: "",
};

function BomReportLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [show, setShow] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    getPlantNameDDL_api(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const yellowMaker = (lv, index, itemId, prevItemId) => {
    if (itemId !== prevItemId) {
      const findItemName = gridData?.filter(
        (item) => item?.itemid === itemId && item?.itemLv === lv - 1
      );
      console.log(findItemName);
      return findItemName[0]?.itemName;
    }
    return false;
  };

  const printRef = useRef();
  const [
    backCalculationId,
    checkIsBackCalculation,
    loadingOnCheckIsBackCalculation,
  ] = useAxiosGet();
  const [
    bomReportBasedOnBackCalculationId,
    getBomReportBasedOnBackCalculationId,
    loadingOnGetBomReportBasedOnBackCalculationId,
    setBomReportBasedOnBackCalculationId,
  ] = useAxiosGet();
  useEffect(() => {
    checkIsBackCalculation(
      `/mes/MESReport/BackcalculationByBuId?id=${selectedBusinessUnit?.value}`
    );
  }, []);
  return (
    <>
      <ICustomCard title="BOM Report">
        {(loading ||
          loadingOnCheckIsBackCalculation ||
          loadingOnGetBomReportBasedOnBackCalculationId) && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, touched, errors }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-md-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Select Plant"
                      onChange={(valueOption) => {
                        setFieldValue("item", "");
                        setFieldValue("shopFloor", "");
                        setFieldValue("rawItem", "");
                        setGridData([]);
                        setFieldValue("plant", valueOption);
                        if (valueOption?.value) {
                          getShopfloorDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setShopFloorDDL
                          );
                        }
                        setBomReportBasedOnBackCalculationId([]);
                        setShow(false);
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="shopFloor"
                      options={shopFloorDDL}
                      value={values?.shopFloor}
                      label="Select Shop Floor"
                      onChange={(valueOption) => {
                        setFieldValue("item", "");
                        setGridData([]);
                        setFieldValue("shopFloor", valueOption);
                        if (valueOption?.value) {
                          getBOMItemDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.value,
                            setItemDDL
                          );
                        }
                        setBomReportBasedOnBackCalculationId([]);
                        setShow(false);
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      label="Select Item"
                      onChange={(valueOption) => {
                        setFieldValue("rawItem", "");
                        setFieldValue("item", valueOption);
                        setBomReportBasedOnBackCalculationId([]);
                      }}
                      placeholder="Select Item"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {backCalculationId?.backcalculationId === 2 ? (
                    <div className="col-md-3">
                      <label>Select Item Name Raw</label>
                      <SearchAsyncSelect
                        isDisabled={!values?.plant?.value}
                        selectedValue={values?.rawItem || ""}
                        handleChange={(valueOption) => {
                          setFieldValue("item", "");
                          setFieldValue("rawItem", valueOption);
                          setBomReportBasedOnBackCalculationId([]);
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/mes/MesDDL/GetItemNameRawMaterialDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&search=${v}`
                            )
                            .then((res) => {
                              return res?.data;
                            });
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div style={{ marginTop: "15px" }} className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (backCalculationId?.backcalculationId === 2) {
                          getBomReportBasedOnBackCalculationId(
                            `/mes/MESReport/BomReportDependOnBackCalculation?plantId=${
                              values?.plant?.value
                            }&ShopFloorId=${values?.shopFloor?.value}${
                              values?.item
                                ? `&itemId=${values?.item?.value}`
                                : values?.rawItem
                                ? `&itemRawMaterialId=${values?.rawItem?.value}`
                                : ""
                            }`
                          );
                        } else {
                          getBOMReport(
                            values?.item?.value,
                            values?.shopFloor?.value,
                            setGridData,
                            setLoading
                          );
                        }
                        setShow(true);
                      }}
                      disabled={!values?.item?.value && !values?.rawItem?.value}
                    >
                      View
                    </button>
                  </div>
                </div>
                {show && (values?.item || values?.rawItem) ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <span>
                        <b>{values?.rawItem ? "Raw " : ""} Item Name: </b>
                        {values?.rawItem?.label || values?.item?.label || ""}
                      </span>
                      <span className="ml-3">
                        <b>UoM: </b>
                        {values?.rawItem?.description ||
                          values?.item?.baseUomName ||
                          ""}
                      </span>
                    </div>
                    {gridData?.length > 0 ||
                    bomReportBasedOnBackCalculationId?.length > 0 ? (
                      <div className=" d-flex justify-content-end align-items-center">
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
                        <ReactHtmlTableToExcel
                          id="test-table-xls-button-att-report"
                          className="btn btn-primary m-0 ml-2 p-2"
                          table="table-to-xlsx"
                          filename="BOM Report"
                          sheet="BOM Report"
                          buttonText="Export Excel"
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : null}
              </Form>

              {gridData?.length > 0 &&
              backCalculationId?.backcalculationId !== 2 ? (
                <div ref={printRef} className="col-lg-12 pr-0 pl-0">
                  <div className="table-responsive">
                    <table
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                      id="table-to-xlsx"
                    >
                      <thead>
                        <tr>
                          <th>Lv</th>
                          {/* <th>Item ID</th> */}
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Lot Size</th>
                          <th>Qty</th>
                          <th>UoM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <>
                            {yellowMaker(
                              item?.itemLv,
                              index,
                              item?.parentItemid,
                              gridData[index - 1]?.parentItemid
                            ) && (
                              <>
                                <tr>
                                  <td
                                    colSpan={6}
                                    align="left"
                                    style={{ backgroundColor: "#FEF3C7" }}
                                  >
                                    <div className="text-left pl-2">
                                      {yellowMaker(
                                        item?.itemLv,
                                        index,
                                        item?.parentItemid,
                                        gridData[index - 1]?.parentItemid
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </>
                            )}

                            <tr key={index}>
                              <td className="text-center">
                                <span className="pl-2">{item?.itemLv}</span>
                              </td>
                              {/* <td className="text-left">
                              <span className="pl-2">{item?.itemid}</span>
                            </td> */}
                              <td>
                                <div className="text-center pr-2">
                                  {item?.itemCode}
                                </div>
                              </td>
                              <td className="text-left">
                                <span className="pl-2">{item?.itemName}</span>
                              </td>
                              <td>
                                <div className="text-center pr-2">
                                  {item?.lotSize}
                                </div>
                              </td>
                              <td className="text-right">
                                <span className="pr-2">
                                  {item?.qty?.toFixed(4)}
                                </span>
                              </td>
                              <td>
                                <div className="pl-2">{item?.uomName}</div>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <></>
              )}
              {backCalculationId?.backcalculationId === 2 &&
              bomReportBasedOnBackCalculationId?.length > 0 ? (
                <>
                  <div ref={printRef} className="col-lg-12 pr-0 pl-0">
                    <div className="table-responsive">
                      <table
                        className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                        id="table-to-xlsx"
                      >
                        <thead>
                          <tr>
                            <th>Plant</th>
                            <th>Shop Floor</th>
                            <th>Item</th>
                            <th>BOM Version</th>
                            <th>UOM</th>
                            <th>Lot Size</th>
                            <th>Raw Material</th>
                            <th>Raw Item Code</th>
                            <th>Raw Item UOM</th>
                            <th>Raw Item Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bomReportBasedOnBackCalculationId?.map(
                            (item, index) => (
                              <>
                                <tr key={index}>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {values?.plant?.label}
                                  </td>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {values?.shopFloor?.label}
                                  </td>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {item?.itemName} {`[${item?.itemCode}]`}
                                  </td>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {item?.bomVersion}
                                  </td>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {item?.uomName}
                                  </td>
                                  <td
                                    rowSpan={
                                      item?.itemRawMaterials?.length || 1
                                    }
                                  >
                                    {item?.lotSize}
                                  </td>
                                  <td>
                                    {
                                      item?.itemRawMaterials?.[0]
                                        ?.itemRawMaterialName
                                    }
                                  </td>
                                  <td>
                                    {
                                      item?.itemRawMaterials?.[0]
                                        ?.itemRawMaterialCode
                                    }
                                  </td>

                                  <td>
                                    {
                                      item?.itemRawMaterials?.[0]
                                        ?.itemRawMaterialUomName
                                    }
                                  </td>
                                  <td>
                                    {
                                      item?.itemRawMaterials?.[0]
                                        ?.itemRawMaterialQty
                                    }
                                  </td>
                                </tr>
                                {item?.itemRawMaterials?.map(
                                  (nestedItem, ind) =>
                                    ind === 0 ? (
                                      <></>
                                    ) : (
                                      <tr>
                                        <td>
                                          {nestedItem?.itemRawMaterialName}
                                        </td>
                                        <td>
                                          {nestedItem?.itemRawMaterialCode}
                                        </td>
                                        <td>
                                          {nestedItem?.itemRawMaterialUomName}
                                        </td>
                                        <td>
                                          {nestedItem?.itemRawMaterialQty}
                                        </td>
                                      </tr>
                                    )
                                )}
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default BomReportLanding;
