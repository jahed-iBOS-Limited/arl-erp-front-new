/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { GetSalesOrderReportByItemWise_api } from "./../helper";
import "../stye.css";
import IViewModal from "./../../../../_helper/_viewModal";
import QtyClickModel from './model/qtyClickModel';
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: { value: 1, label: "Complete" },
};

function ItemWiseOrderReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewClickRowData, setViewClickRowData] = useState("");
  const [isQtyClickModel, setIsQtyClickModel] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetSalesOrderReportByItemWise_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.reportType?.value,
        values?.fromDate,
        values?.toDate,
        setGridData,
        setLoading
      );
    }
  };
  return (
    <div className="itemWiseOrderWrapper">
      <ICustomCard title="Item Wise Order Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      label="Report Type"
                      options={[
                        { value: 1, label: "Complete" },
                        { value: 2, label: "Pending" },
                      ]}
                      value={values?.reportType}
                      placeholder="Report Type"
                      name="reportType"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                      }}
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
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.reportType
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table ">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Uom Name</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.itemName}</td>
                            <td>{item?.uomName}</td>
                            <td
                              className="text-right itemWiseOrderQtyModel pointer"
                              onClick={() => {
                                setIsQtyClickModel(true)
                                setViewClickRowData(item)
                              }}
                            >
                              {item?.quantity}
                            </td>
                            <td className="text-right">{item?.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/*QtyClickModel  */}
                <IViewModal
                  show={isQtyClickModel}
                  onHide={() => setIsQtyClickModel(false)}
                  title="Details"
                >
                  <QtyClickModel viewClickRowData={viewClickRowData} />
                </IViewModal>
                {/*  */}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </div>
  );
}

export default ItemWiseOrderReport;
