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
  getShopfloorDDL,
  getStockReportData,
} from "../helper";

const initData = {
  plant: "",
  shopFloor: "",
};

function StockReportLanding() {
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
    getStockReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.plant?.value,
      values?.shopFloor?.value,
      setGridData,
      setLoading,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    girdDataFunc(values, searchValue);
  };
  return (
    <>
      <ICustomCard title="Stock Report">
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
                      options={shopFloor}
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
                  <div style={{ marginTop: "15px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        girdDataFunc(values, null);
                      }}
                      disabled={
                        !values?.plant?.value || !values?.shopFloor?.value
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
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM Name</th>
                          <th>Block Stock</th>
                          <th>Current Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-right">
                              <span className="pr-2">{item?.itemCode}</span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">{item?.itemName}</span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">{item?.uoMname}</span>
                            </td>
                            <td className="text-right">
                              <span className="pr-2">{item?.blockStock}</span>
                            </td>
                            <td className="text-right">
                              <span className="pr-2">{item?.currentStock}</span>
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

export default StockReportLanding;
