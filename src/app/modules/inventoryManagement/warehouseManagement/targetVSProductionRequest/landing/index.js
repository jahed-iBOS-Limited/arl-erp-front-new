/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IClose from "../../../../_helper/_helperIcons/_close";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  acceptProductionRequest,
  getProductionRequests,
  cancelProductionRequest,
} from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import CancelProductionRequest from "./cancelModal";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function TargetVSProductionRequest() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");

  const getLandingData = (values, pageNo = 0, pageSize = 15) => {
    getProductionRequests(
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  const acceptHandler = (id, values) => {
    acceptProductionRequest(id, setLoading, () => {
      getLandingData(values, pageNo, pageSize);
    });
  };

  const cancelHandler = (id, values, setLoading) => {
    cancelProductionRequest(id, values?.remarks, setLoading, () => {
      getLandingData(values, pageNo, pageSize);
      setShow(false);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="Target VS Production Request"
        createHandler={() =>
          history.push(
            `/inventory-management/warehouse-management/targetvsproductionrequset/entry`
          )
        }
      >
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
                        getLandingData(
                          { ...values, fromDate: e.target.value },
                          pageNo,
                          pageSize
                        );
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
                        getLandingData(
                          { ...values, toDate: e.target.value },
                          pageNo,
                          pageSize
                        );
                      }}
                    />
                  </div>
                </div>
                {gridData?.objdata?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Region</th>
                          <th>Item Name</th>
                          <th>Target Year</th>
                          <th>Target Month</th>
                          <th>Target Quantity</th>
                          <th>Requisition Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.objdata?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{td?.sl}</td>
                            <td>
                              <div className="pl-2">{td?.nl5}</div>
                            </td>
                            <td>
                              <div className="pl-2">{td?.strItemName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{td?.targetYearId}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {getMonth(td?.targetMonthId)}
                              </div>
                            </td>

                            <td>
                              <div className="pl-2">
                                {td?.numTargetQuantity}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.numRequisitionQuantity}
                              </div>
                            </td>
                            <td>
                              <span className="d-flex justify-content-around">
                                <span
                                  onClick={() => {
                                    acceptHandler(td?.intId, values);
                                  }}
                                >
                                  <IApproval title="Accept Production Requisition" />
                                </span>
                                <span
                                  onClick={() => {
                                    setId(td?.intId);
                                    setShow(true);
                                  }}
                                >
                                  <IClose title="Cancel Production Requisition" />
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.objdata?.length > 0 && (
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
              <IViewModal
                modelSize="md"
                show={show}
                onHide={() => setShow(false)}
              >
                <CancelProductionRequest
                  cancelHandler={cancelHandler}
                  id={id}
                  value={values}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default TargetVSProductionRequest;
