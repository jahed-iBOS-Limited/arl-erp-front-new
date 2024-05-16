/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  deleteCastingSchedule,
  getCastingEntryList,
  getShipPointist,
} from "../helper";
import "./style.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import PaginationTable from "../../../../_helper/_tablePagination";
import moment from "moment";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";

const initData = {
  toDate: _todayDate(),
  fromDate: _todayDate(),
  shipPoint: "",
};

function CastingScheduleLanding() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getShipPointist(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getLandingData = (values, pgNo, pgSize) => {
    getCastingEntryList(
      selectedBusinessUnit?.value,
      values,
      pgNo,
      pgSize,
      setGridData,
      setLoading
    );
  };

  const setPositionHandler = (pgNo, pgSize, values) => {
    getLandingData(values, pgNo, pgSize);
  };

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="Casting Schedule"
        createHandler={() =>
          history.push(
            `/inventory-management/warehouse-management/liftingplanentry/entry`
          )
        }
      >
        <Formik enableReinitialize={true} initialValues={{ ...initData }}>
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
                      name="shipPoint"
                      options={shipPointDDL}
                      value={values?.shipPoint}
                      label="Ship Point"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder="Ship Point"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3 d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary mt-4 mr-4"
                      disabled={!values?.shipPoint?.value}
                      onClick={() => {
                        setGridData([]);
                        getLandingData(values, pageNo, pageSize);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Ship point</th>
                          <th>Client Name</th>
                          <th>Project Address</th>
                          <th>Contact Person</th>
                          <th>Type of work</th>
                          <th>Total Qty</th>
                          <th>Casting Time</th>
                          <th>Marketing Concern</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{td?.strShippingPointName}</td>
                            <td>{td?.strCustomerName}</td>
                            <td>{td?.strAddress}</td>
                            <td>{td?.strContactPerson}</td>
                            <td>{td?.strWorkTypeName}</td>
                            <td>{td?.numTotalOrderQuantity}</td>
                            <td style={{ width: "105px" }}>
                              {moment(td?.dteCastingDate).format(
                                "YYYY-MM-DD HH:mm"
                              )}
                            </td>
                            <td>{td?.strCastingProcedureBy}</td>
                            <td>
                              {td?.intStatusId === 0 ? (
                                <span class="badge badge-pill badge-warning">
                                  Pending
                                </span>
                              ) : null}
                              {td?.intStatusId === 1 ? (
                                <span class="badge badge-pill badge-success">
                                  Approved
                                </span>
                              ) : null}
                              {td?.intStatusId === 2 ? (
                                <span class="badge badge-pill badge-danger">
                                  Rejected
                                </span>
                              ) : null}
                            </td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-center">
                                {/* View Only if Rejected */}
                                {td?.intStatusId === 2 ||
                                td?.intStatusId === 1 ? (
                                  <span
                                    className="mr-2"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/inventory-management/warehouse-management/liftingplanentry/entry/${td?.intId}/view`,
                                      });
                                    }}
                                  >
                                    <IView />
                                  </span>
                                ) : null}

                                {/* If Pending Then Edit  */}
                                {td?.intStatusId === 0 ? (
                                  <span
                                    className="mr-2"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/inventory-management/warehouse-management/liftingplanentry/entry/${td?.intId}/edit`,
                                      });
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                ) : null}

                                {td?.intStatusId === 0 ? (
                                  <span
                                    className="mr-2"
                                    onClick={() => {
                                      let confirmObject = {
                                        title: "Are you sure?",
                                        message: "Delete Casting Schedule",
                                        yesAlertFunc: async () => {
                                          deleteCastingSchedule(
                                            td?.intId,
                                            setLoading,
                                            () => {
                                              getLandingData(
                                                values,
                                                pageNo,
                                                pageSize
                                              );
                                            }
                                          );
                                        },
                                        noAlertFunc: () => {
                                          "";
                                        },
                                      };
                                      IConfirmModal(confirmObject);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="6" className="text-right">
                            <strong>Total</strong>
                          </td>
                          <td colSpan="1">
                            <strong>
                              {gridData?.data?.reduce(
                                (acc, obj) => acc + +obj?.numTotalOrderQuantity,
                                0
                              )}
                            </strong>
                          </td>
                          <td colSpan="10"></td>
                        </tr>
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
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default CastingScheduleLanding;
