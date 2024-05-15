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
import {
  getPlantNameDDL_api,
  getShopfloorDDL,
  getBOMItemDDL,
  getPoStatusReport,
  getProductionCodeDDL,
} from "../helper";

const initData = {
  plant: "",
  shopFloor: "",
  itemDDL: "",
};

function PoStatusReportLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [productionCodeDDL, setProductionCodeDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

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
      return findItemName[0]?.itemName;
    }
    return false;
  };

  const printRef = useRef();

  console.log(gridData);

  return (
    <>
      <ICustomCard title="PO Report">
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
                        setFieldValue("item", "");
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
                  <div className="col-lg-2">
                    <NewSelect
                      name="shopFloor"
                      options={shopFloorDDL}
                      value={values?.shopFloor}
                      label="Select Shop Floor"
                      onChange={(valueOption) => {
                        setFieldValue("item", "");
                        setGridData([]);
                        setFieldValue("shopFloor", valueOption);
                        getBOMItemDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plant?.value,
                          valueOption?.value,
                          setItemDDL
                        );
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      label="Select Item"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                        getProductionCodeDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setProductionCodeDDL
                        );
                      }}
                      placeholder="Select Item"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="productionCode"
                      options={productionCodeDDL}
                      value={values?.productionCode}
                      label="Select Production Code"
                      onChange={(valueOption) => {
                        setFieldValue("productionCode", valueOption);
                      }}
                      placeholder="Production Code"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getPoStatusReport(
                          values?.item?.value,
                          values?.productionCode?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                      disabled={!values?.item?.value}
                    >
                      View
                    </button>
                  </div>
                  {gridData?.length > 0 && (
                    <div
                      style={{ marginTop: "15px" }}
                      className="col-lg d-flex justify-content-end"
                    >
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
                  )}
                </div>
              </Form>

              {gridData?.length > 0 && (
                <div ref={printRef} className="col-lg-12 pr-0 pl-0">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Lv</th>
                          {/* <th>Item ID</th> */}
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>PO Code</th>
                          <th>PO Qty</th>
                          <th>UoM</th>
                          <th>PO Status</th>
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
                                <div className="text-right pr-2">
                                  {item?.itemCode}
                                </div>
                              </td>
                              <td className="text-left">
                                <span className="pl-2">{item?.itemName}</span>
                              </td>
                              <td className="text-left">
                                <span className="pl-2">{item?.poCode}</span>
                              </td>
                              <td className="text-right">
                                <span className="pr-2">{item?.poQty}</span>
                              </td>
                              <td>
                                <div className="pl-2">{item?.uomName}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {item?.poStatus ? "true" : "false"}
                                </div>
                              </td>
                            </tr>
                          </>
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

export default PoStatusReportLanding;
