/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  closeRentAsset,
  getBusinessPartnerDDL,
  getLandingPaginationData,
} from "../helper";
import SalesOrderReportModal from "./salesOrderReportModal";

const initData = {
  partner: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function AssetRentLanding() {
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
    getLandingPaginationData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      0,
      null,
      pageNo,
      pageSize,
      setGridData
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const getLandingData = (values, pageNo, pageSize) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingPaginationData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.partner?.value || 0,
        null,
        pageNo,
        pageSize,
        setGridData
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  // confirm to cancel
  const confirmToCancel = (id, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        closeRentAsset(id, setLoading, () => {
          getLandingPaginationData(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            values?.partner?.value || 0,
            null,
            pageNo,
            pageSize,
            setGridData
          );
        });
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <ICustomCard
        title="Asset Rent"
        createHandler={() =>
          history.push(`/mngAsset/assetRentMangmnt/rentAsset/create`)
        }
      >
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
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
                        <th>Rent Type Name</th>
                        <th>Business Partner Name</th>
                        <th>SBU</th>
                        <th>Asset Name</th>
                        <th>Rent From Date</th>
                        <th>Rent To Date</th>
                        <th>Rent Rate</th>
                        <th>Currency Name</th>
                        <th>Conversation Rate</th>
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
                            <div className="pl-2">{item?.rentTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.businessPartnerName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.sbuName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.assetName}</div>
                          </td>
                          <td>
                            <div className="text-center">
                              {_dateFormatter(item?.rentFromDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {item?.rentToDate
                                ? _dateFormatter(item?.rentToDate)
                                : "-"}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">{item?.rentRate}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.currencyName}</div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item?.currConversationRate}
                            </div>
                          </td>
                          <td style={{ minWidth: "80px" }}>
                            <div className="d-flex justify-content-center">
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngAsset/assetRentMangmnt/rentAsset/view/${item?.rentAssetId}`,
                                    state: {
                                      rentAssetId: item?.rentAssetId,
                                    },
                                  });
                                }}
                                className="ml-2"
                              >
                                <i
                                  className={`fa pointer fa-eye fa-lg`}
                                  aria-hidden="true"
                                ></i>
                              </span>

                              {!item?.isClosed ? (
                                <span
                                  onClick={() => {
                                    history.push({
                                      pathname: `/mngAsset/assetRentMangmnt/rentAsset/edit/${item?.rentAssetId}`,
                                      state: {
                                        rentAssetId: item?.rentAssetId,
                                      },
                                    });
                                  }}
                                  className="ml-2 mr-2"
                                >
                                  <i className={`fas fa-pen-square`}></i>
                                </span>
                              ) : null}

                              {!item?.isClosed ? (
                                <span
                                  className="ml-2"
                                  onClick={() => {
                                    confirmToCancel(item?.rentAssetId, values);
                                  }}
                                >
                                  <i
                                    className="fa fa-times-circle fa-lg"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              ) : null}
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

export default AssetRentLanding;
