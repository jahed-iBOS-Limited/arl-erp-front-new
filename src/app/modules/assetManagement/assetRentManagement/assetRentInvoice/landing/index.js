/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getBusinessPartnerDDL, getLandingPaginationData } from "../helper";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function AssetRentInvoiceLanding() {
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
      _todayDate(),
      _todayDate(),
      0,
      "",
      pageNo,
      pageSize,
      setGridData
    );
  }, [profileData, selectedBusinessUnit]);

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingPaginationData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.partner?.value || 0,
        searchValue,
        pageNo,
        pageSize,
        setGridData
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <ICustomCard
        title="Asset Rent Invoice"
        createHandler={() =>
          history.push(`/mngAsset/assetRentMangmnt/rentAssetInvoice/create`)
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

                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL}
                      value={values?.partner}
                      label="Customer"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                      }}
                      placeholder="Customer"
                      errors={errors}
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
                  <PaginationSearch
                    placeholder="Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                )}
                {gridData?.data?.length > 0 && (
                 <div className="table-responsive">
                   <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Business Partner Name</th>
                        <th>SBU</th>
                        <th>Invoice Date</th>
                        <th>Rent Invoice Code</th>
                        <th>Total Invoice Amount</th>
                        <th>Total Collection Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="text-center">{index + 1}</div>
                          </td>
                          {/* <td>
                            <div className="pl-2">{item?.rentTypeName}</div>
                          </td> */}
                          <td>
                            <div className="pl-2">
                              {item?.businessPartnerName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.sbuName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {_dateFormatter(item?.invoiceDate)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {item?.rentInvoiceCode}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item?.totalInvoiceAmount}
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {item?.totalCollectionAmount}
                            </div>
                          </td>
                          <td style={{ maxWidth: "100px" }}>
                            <div className="d-flex justify-content-center">
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngAsset/assetRentMangmnt/rentAssetInvoice/view/${item?.rentInvoiceId}`,
                                  });
                                }}
                                className="ml-2 mr-3"
                              >
                                <IView />
                              </span>

                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    Payment Collection
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={() => {
                                    history.push({
                                      pathname: `/mngAsset/assetRentMangmnt/rentAssetInvoice/cash/${item?.rentInvoiceId}`,
                                    });
                                  }}
                                >
                                  <i class="fas pointer fa-hand-holding-usd"></i>
                                </span>
                              </OverlayTrigger>
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
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default AssetRentInvoiceLanding;
