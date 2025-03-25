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
import PaginationSearch from "../../../../_helper/_search";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import DetailsModal from "./detailsModal";

import {
  getShopfloorDDL,
  getShopfloorIssueReportLandingData,
} from "../helper";
import { getPlantNameDDL_api } from "../../../../_helper/_commonApi";

const initData = {
  plant: "",
  shopFloor: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function ShopFloorIssueReportLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloor, setShopFloorDDL] = useState([]);

  // modal State
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();

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
    getShopfloorIssueReportLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.plant?.value,
      values?.shopFloor?.value,
      values?.fromDate,
      values?.toDate,
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
      <ICustomCard title="Shopfloor Issue Report">
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
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                    />
                  </div>
                  <div style={{ marginTop: "18px" }} className="col-lg-1">
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
                      style={{ marginTop: "18px" }}
                      // className="col-lg-3 d-flex justify-content-end"
                      className="col-lg-1"
                    >
                      <div>
                        <ReactToPrint
                          trigger={() => (
                            <button
                              type="button"
                              className="btn btn-primary px-4 pr-1 btn-sm d-flex"
                            >
                              <img
                                style={{ width: "15px" }}
                                src={printIcon}
                                alt="print-icon"
                              />
                              <span>Print</span>
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
                  placeholder="Item Name Search"
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
                          <th>Request Quantity</th>
                          <th>Issue Quantity</th>
                          <th className="printSectionNone">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              <span className="pr-2">{item?.itemCode}</span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">{item?.itemName}</span>
                            </td>
                            <td className="text-left">
                              <span className="pl-2">{item?.uoMName}</span>
                            </td>
                            <td className="text-center">
                              <span className="pl-2">{item?.requestQuantity}</span>
                            </td>
                            <td className="text-center">
                              <span className="pr-2">
                                {Math.abs(item?.issueQuantity)}
                              </span>
                            </td>
                            <td className="text-center printSectionNone">
                              <button
                                onClick={() => {
                                  setModalData({
                                    item,
                                    values,
                                    profileData,
                                    selectedBusinessUnit,
                                  });
                                  setShowModal(true);
                                }}
                                className="btn btn-primary py-1 px-2"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              <IViewModal
                title="Shopfloor Issue Report Details"
                show={showModal}
                onHide={() => setShowModal(false)}
              >
                <DetailsModal modalData={modalData} />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ShopFloorIssueReportLanding;
