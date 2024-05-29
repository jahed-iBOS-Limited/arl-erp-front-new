import React, { useState, useRef, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import DetailsModal from "./detailsModal";
import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import "../style.css";
import {
  businessUnitPlant_api,
  wearhouse_api,
  inventoryStatement_api,
  ItemSubCategory_api,
  getItemTypeListDDL_api,
  getItemCategoryDDLByTypeId_api,
} from "../helper";
import CustomPaginationActionsTable from "./pagination";
import { _timeFormatter } from "./../../../../_helper/_timeFormatter";
import { _currentTime } from "../../../../_helper/_currentTime";
import Loading from "../../../../_helper/_loading";

const initData = {
  plant: "",
  wh: "",
  itemCategory: "",
  itemSubCategory: "",
  fromDate: _todayDate(),
  fromTime: _currentTime(),
  toDate: _todayDate(),
  toTime: _currentTime(),
  itemType: "",
};

const InventoryStatementTableNotUse = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemSUBCategoryDDL, setItemSubCategoryDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [inventoryStatement, setInventoryStatement] = useState([]);
  const [inventoryStatementAllData, setinventoryStatementAllData] = useState(
    []
  );
  const [tableItem, setTableItem] = useState("");
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      businessUnitPlant_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        7,
        setPlantDDL
      );
      getItemTypeListDDL_api(setItemTypeOption);
      // ItemCategory_api(profileData?.accountId,
      //   selectedBusinessUnit?.value,setItemCategoryDDL)
    }
  }, [selectedBusinessUnit, profileData]);

  const inventoryStatementClickHandler = (values) => {
    inventoryStatement_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.wh?.value,
      values?.plant?.value,
      values?.itemType?.value,
      values?.itemCategory?.value,
      values?.itemSubCategory?.value,
      values?.fromDate,
      values?.toDate,
      setInventoryStatement,
      setinventoryStatementAllData,
      setLoading
    );
  };

  return (
    <ICustomCard title="Inventory Statement">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              {/* Form */}
              {loading && <Loading />}
              <div className="row global-form">
                <div className="col-lg-2">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      setFieldValue("wh", "");
                      wearhouse_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        profileData?.userId,
                        valueOption?.value,
                        setwareHouseDDL
                      );
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="wh"
                    options={wareHouseDDL || []}
                    value={values?.wh}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      setFieldValue("wh", valueOption);
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="itemType"
                    options={itemTypeOption || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      valueOption?.value !== 0 &&
                        setFieldValue("itemCategory", "");

                      getItemCategoryDDLByTypeId_api(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        setItemCategoryDDL
                      );
                    }}
                    placeholder="Item Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemCategory"
                    options={itemCategoryDDL || []}
                    value={values?.itemCategory}
                    label="Item Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", valueOption);
                      setFieldValue("itemSubCategory", "");
                      ItemSubCategory_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setItemSubCategoryDDL
                      );
                    }}
                    placeholder="Item Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemSubCategory"
                    options={itemSUBCategoryDDL || []}
                    value={values?.itemSubCategory}
                    label="Item Sub Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemSubCategory", valueOption);
                    }}
                    placeholder="Sub Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-5">
                  <label>From date and time</label>
                  <div className="d-flex">
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From date"
                      type="date"
                    />
                    <InputField
                      value={values?.fromTime}
                      name="fromTime"
                      placeholder="Time"
                      type="time"
                    />
                  </div>
                </div>
                <div className="col-lg-5 mt-1">
                  <label>To date and time</label>
                  <div className="d-flex">
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To date"
                      type="date"
                    />
                    <InputField
                      value={values?.toTime}
                      name="toTime"
                      placeholder="Time"
                      type="time"
                    />
                  </div>
                </div>
                <div style={{ marginTop: "17px" }} className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      inventoryStatementClickHandler(values);
                    }}
                    disabled={
                      !values?.plant ||
                      !values?.wh ||
                      !values?.itemCategory ||
                      !values?.itemSubCategory ||
                      !values?.fromDate ||
                      !values?.fromTime ||
                      !values?.toDate ||
                      !values?.toTime
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Export button */}
              {inventoryStatement?.length > 0 && (
                <div
                  className="text-right pointer"
                  style={{ position: "absolute", top: "200px", right: "42px" }}
                >
                  <ReactToPrint
                    trigger={() => (
                      <i
                        style={{ fontSize: "18px" }}
                        className="fas fa-print text-primary"
                      ></i>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              )}

              {/* Table */}
              <div ref={printRef} className="inventoryStatement-reports">
                <div className="inventoryStatement_reports_title">
                  <div className="text-center">
                    <h3>{selectedBusinessUnit?.label}</h3>
                  </div>
                  <div className="d-flex justify-content-center">
                    <h6 className="pr-2">Plant: {values?.plant?.label}, </h6>
                    <h6>WareHouse: {values?.wh?.label}</h6>
                  </div>
                  <div className="text-center">
                    <h6>Inventory Statement</h6>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6>
                      From Date: {values?.fromDate} and{" "}
                      {_timeFormatter(values?.fromTime)}
                    </h6>
                    <h6>
                      To Date: {values?.toDate} and{" "}
                      {_timeFormatter(values?.toTime)}
                    </h6>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Opening Qty.</th>
                          <th>Value</th>
                          <th>Receive Qty.</th>
                          <th>Value</th>
                          <th>Issue Qty.</th>
                          <th>Value</th>
                          <th>Return Qty.</th>
                          <th>Value</th>
                          <th>Transfer Qty.</th>
                          <th>Value</th>
                          <th>Remove Qty.</th>
                          <th>Value</th>
                          <th>Adjust Qty.</th>
                          <th>Value</th>
                          <th>Closing Qty.</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryStatement?.map((row, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{row?.itemCode}</td>
                            <td>{row?.itemName}</td>
                            <td>{row?.baseUom}</td>
                            <td>{row?.openingQty}</td>
                            <td>{row?.openingValue}</td>
                            <td>{row?.recieveQty}</td>
                            <td>{row?.recieveValue}</td>
                            <td>{row?.issueQty}.</td>
                            <td>{row?.issueValue}</td>
                            <td>{row?.returnQty}</td>
                            <td>{row?.returnValue}</td>
                            <td>{row?.transferQty}</td>
                            <td>{row?.transferValue}</td>
                            <td>{row?.removeQty}</td>
                            <td>{row?.removeValue}</td>
                            <td>{row?.adjustQty}</td>
                            <td>{row?.adjustValue}</td>
                            <td>{row?.closingQty}.</td>
                            <td>{row?.closingValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <CustomPaginationActionsTable
                inventoryStatement={inventoryStatement}
                setIsShowModal={setIsShowModal}
                setInventoryStatement={setInventoryStatement}
                inventoryStatementAllData={inventoryStatementAllData}
                setTableItem={setTableItem}
              />

              {/* Modal */}
              <IViewModal
                title=""
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <DetailsModal tableItem={tableItem} values={values} />
              </IViewModal>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default InventoryStatementTableNotUse;
