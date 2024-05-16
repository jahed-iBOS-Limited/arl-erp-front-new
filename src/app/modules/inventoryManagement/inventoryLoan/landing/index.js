/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import {
  getBusinessPartnerDDL,
  getLandingPaginationData,
  getLoanSingleData,
} from "../helper";
import SalesOrderReportModal from "./salesOrderReportModal";

const initData = {
  partner: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function InventoryLoadLanding() {
  const [details, setDetails] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const getLandingData = (values, pageNo, pageSize) => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      values?.partner?.value
    ) {
      getLandingPaginationData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.partner?.value,
        pageNo,
        pageSize,
        setGridData
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      <ICustomCard
        title="Inventory Loan"
        createHandler={() =>
          history.push(
            `/inventory-management/inventory-loan/inventory-loan/create`
          )
        }
      >
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL}
                      value={values?.partner}
                      label="Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      placeholder="Business Partner"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize);
                      }}
                      disabled={!values?.partner?.value}
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Business Partner Name</th>
                          <th>Trans Type Name</th>
                          <th>Warehouse Name</th>
                          <th>Survey Report No</th>
                          <th>Lighter Vessel Name</th>
                          <th>Mother Vessel Name</th>
                          <th>Trans Date</th>
                          <th>Item Name</th>
                          <th>Item Qty</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.businessPartnerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.transTypeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.wareHouseName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.surveyReportNo}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.lighterVesselName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.motherVesselName}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.transDate)}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.itemName}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.itemQty}
                              </div>
                            </td>

                            <td className="action-att-report-print-disabled">
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      // setModalShow(true);
                                      history.push({
                                        pathname: `/inventory-management/inventory-loan/inventory-loan/create/`,
                                        state: { loanId: item?.loanId },
                                      });
                                    }}
                                    classes="text-primary"
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </Form>

              {/* Modal */}
              <SalesOrderReportModal
                data={details}
                setData={setDetails}
                show={modalShow}
                landingDataCallback={() => {
                  // getLandingData(values);
                  setModalShow(false);
                }}
                onHide={() => setModalShow(false)}
                setLoading={setLoading}
              />
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default InventoryLoadLanding;
