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
  getTerritoryDDL,
  getCustomerDDL,
  inventoryStatement_api,
} from "../helper";
import CustomPaginationActionsTable from "./pagination";
// import { _timeFormatter } from "./../../../../_helper/_timeFormatter";

const initData = {
  territory: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const InventoryStatementTable = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [inventoryStatement, setInventoryStatement] = useState([]);
  const [inventoryStatementAllData, setinventoryStatementAllData] = useState(
    []
  );
  const [tableItem, setTableItem] = useState("");
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
      getTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTerritoryDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const inventoryStatementClickHandler = (values) => {
    inventoryStatement_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.customer?.value || 1,
      values?.fromDate,
      values?.toDate,
      setInventoryStatement,
      setinventoryStatementAllData
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
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="territory"
                    options={territoryDDL || []}
                    value={values?.territory}
                    label="Territory"
                    onChange={(valueOption) => {
                      getCustomerDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setCustomerDDL
                      );
                      setFieldValue("territory", valueOption);
                      setFieldValue("customer", "");
                    }}
                    placeholder="Territory"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    options={customerDDL || []}
                    value={values?.customer}
                    label="Customer"
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                    }}
                    placeholder="Customer"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <div className="d-flex">
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From date"
                      type="date"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <div className="d-flex">
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To date"
                      type="date"
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "14px" }}
                    onClick={() => {
                      inventoryStatementClickHandler(values);
                    }}
                    disabled={!values?.fromDate || !values?.toDate}
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Export button */}
              {inventoryStatement?.length > 0 && (
                <div className="row">
                  <div
                    className="text-right pointer"
                    style={{
                      position: "absolute",
                      top: "161px",
                      right: "42px",
                    }}
                  >
                    <ReactToPrint
                      trigger={() => (
                        <i
                          style={{ fontSize: "18px" }}
                          className="fas fa-print"
                        ></i>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                </div>
              )}

              {/* Table */}
              <div ref={printRef} className="">
                <div className="inventoryStatement_reports_title">
                  <div className="text-center">
                    <h3>{selectedBusinessUnit?.label}</h3>
                  </div>
                  <div className="d-flex justify-content-around">
                    <h6>Plant: {"values?.plant?.label"}</h6>
                    <h6>WareHouse: {"values?.wh?.label"}</h6>
                  </div>
                  <div className="text-center">
                    <h6>Inventory Statement</h6>
                  </div>
                  <div className="d-flex justify-content-around">
                    <h6>From Date: {values?.fromDate} and </h6>
                    <h6>To Date: {values?.toDate} and </h6>
                  </div>
                </div>
                <CustomPaginationActionsTable
                  inventoryStatement={inventoryStatement}
                  setIsShowModal={setIsShowModal}
                  setInventoryStatement={setInventoryStatement}
                  inventoryStatementAllData={inventoryStatementAllData}
                  setTableItem={setTableItem}
                />
              </div>

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

export default InventoryStatementTable;
