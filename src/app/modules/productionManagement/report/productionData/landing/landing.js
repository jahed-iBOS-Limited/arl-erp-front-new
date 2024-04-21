import { Form, Formik } from "formik";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  GetProductionDataReport,
  getItemNameDDL,
  getPlantNameDDL_api,
  getShopfloorDDL,
} from "../helper";

const initData = {
  plant: "",
  shopFloor: "",
  itemName: "",
  bomType: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const bomTypeDDL = [
  { value: 0, label: "All" },
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
];

function ProductionDataLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState([]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const printRef = useRef();

  const girdDataFunc = (values, searchValue) => {
    GetProductionDataReport({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      sId: values?.shopFloor?.value,
      itemId: values?.itemName?.value,
      billType: values?.bomType?.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      setter: setGridData,
      setLoading,
    });
  };

  return (
    <>
      <ICustomCard title="Production Data">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, touched, errors }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Select Plant"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        setFieldValue("shopFloor", "");
                        setFieldValue("itemName", "");
                        setGridData([]);
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
                      options={shopFloor || []}
                      value={values?.shopFloor}
                      label="Select Shop Floor"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("shopFloor", valueOption);
                        setFieldValue("itemName", "");
                        setItemName([]);
                        getItemNameDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plant?.value,
                          valueOption?.value,
                          setItemName
                        );
                      }}
                      placeholder="Select Shop Floor"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder="Select Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("itemName", valueOption);
                        setGridData([]);
                      }}
                      options={[{ value: 0, label: "All" }, ...itemName] || []}
                      value={values?.itemName || ""}
                      isSearchable={true}
                      name="itemName"
                      isDisabled={!values?.plant || !values?.shopFloor}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="bomType"
                      options={bomTypeDDL || []}
                      value={values?.bomType}
                      label="BOM Type"
                      onChange={(valueOption) => {
                        setFieldValue("bomType", valueOption);
                        setGridData([]);
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
                        !values?.plant ||
                        !values?.shopFloor ||
                        !values?.itemName ||
                        !values?.bomType ||
                        !values?.fromDate ||
                        !values?.toDate
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
              {/* <div className="col-lg-12 pr-0 pl-0">
                <PaginationSearch
                  placeholder="Item Name & Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div> */}
              {gridData?.length > 0 && (
                <div ref={printRef} className="col-lg-12 pr-0 pl-0">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th> Order Number </th>
                          <th> Item Name (Main Output) </th>
                          <th>UOM</th>
                          <th> Produce Qty </th>
                          <th> IN MT </th>
                          <th> Total MT </th>
                          <th> Production Entry Date & Time </th>
                          <th> Warehouse Approve Date & Time </th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.productionOrderCode}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.uomName}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.productionQty)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.subTotalMT)}
                              </td>
                              {item?.count ? (
                                <td
                                  rowSpan={item?.count}
                                  className="text-right"
                                >
                                  <b>{_fixedPoint(item?.totalSubTotalMT)}</b>
                                </td>
                              ) : null}
                              <td className="text-center">
                                {item?.productionDate
                                  ? moment(item?.productionDate).format(
                                      "YYYY-MM-DD HH:mm A"
                                    )
                                  : ""}
                              </td>
                              <td className="text-center">
                                {item?.approveProductionDate
                                  ? moment(item?.approveProductionDate).format(
                                      "YYYY-MM-DD HH:mm A"
                                    )
                                  : ""}
                              </td>
                            </tr>
                          );
                        })}

                        <tr>
                          <td colSpan={4} className="text-right">
                            {" "}
                            Total{" "}
                          </td>

                          <td className="text-right">
                            <b>
                              {" "}
                              {_fixedPoint(
                                _.sumBy(
                                  gridData,
                                  (item) => +item?.productionQty || 0
                                )
                              )}
                            </b>
                          </td>

                          <td className="text-right">
                            <b>
                              {_fixedPoint(
                                _.sumBy(
                                  gridData,
                                  (item) => +item?.subTotalMT || 0
                                )
                              )}
                            </b>
                          </td>
                          {/* <td className="text-right">
                            <b>
                              {_fixedPoint(
                                _.sumBy(
                                  gridData,
                                  (item) => (+item?.totalProductionQty || 0)
                                )
                              )}
                            </b>
                          </td> */}
                          <td colSpan={3}></td>
                        </tr>
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

export default ProductionDataLanding;
