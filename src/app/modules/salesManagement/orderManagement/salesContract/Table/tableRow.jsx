import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getSalesContactGridData } from "../_redux/Actions";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import SalesContractView from "./salesContractViewModal";
import { Formik } from "formik";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import {
  generateParameterValues,
  groupId,
  reportId,
  reportTypes,
  salesContractDetailsLandingData,
  salesContractInitalValues,
} from "./helper";

export function TableRow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.salesContact?.gridData;
  }, shallowEqual);

  // state
  const [quotationViewModal, setQuotationViewModal] = useState(false);
  const [contactId, setContactId] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // inital sales contract details dispatch
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getSalesContactGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getSalesContactGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue
      )
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // Top Sheet Field Form
  const TopSheetFieldForm = (values, setFieldValue) => (
    <>
      <RATForm
        obj={{
          values,
          setFieldValue,
          onChange: () => {
            setShowReport(false);
          },
          channel: true,
          region: false,
          area: false,
          territory: false,
          zone: false,
        }}
      />

      <FromDateToDateForm
        obj={{
          values,
          setFieldValue,
          onChange: () => {
            setShowReport(false);
          },
        }}
      />

      <IButton onClick={() => setShowReport((prevValue) => !prevValue)} />
    </>
  );
  return (
    <>
      {/* Table Start */}
      {loading && <Loading />}

      <Formik initialValues={salesContractInitalValues} enableReinitialize>
        {({ values, setFieldValue }) => (
          <>
            <form className="form form-label-right">
              <div className="form-group row global-form">
                {/* Common Filed */}
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={reportTypes}
                    label="Report Type"
                    value={values?.reportType}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("reportType", valueOption);
                      setFieldValue("channel", "");
                    }}
                    placeholder="Report Type"
                  />
                </div>
                {/* Top Sheet Form Field */}
                {[2].includes(values?.reportType?.value) ? (
                  TopSheetFieldForm(values, setFieldValue)
                ) : (
                  <>
                    <IButton
                      title="Show"
                      onClick={() =>
                        salesContractDetailsLandingData({
                          dispatch,
                          profileData,
                          selectedBusinessUnit,
                          setLoading,
                          pageNo,
                          pageSize,
                        })
                      }
                    />
                  </>
                )}
              </div>

              {/* Top Sheet Powerbi Report */}
              {showReport && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={generateParameterValues({
                    values,
                    selectedBusinessUnit,
                  })}
                  parameterPanel={false}
                />
              )}

              {/* Sales Contract Details */}
              {[1].includes(values?.reportType?.value) ? (
                <div className="row">
                  <div className="col-lg-12 mt-2 table-responsive">
                    <PaginationSearch
                      placeholder="Contract Code & Party Name & Code"
                      paginationSearchHandler={paginationSearchHandler}
                    />
                    {gridData?.data?.length >= 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table sales_order_landing_table">
                          <thead>
                            <tr>
                              <th style={{ width: "35px" }}>SL</th>
                              <th style={{ width: "90px" }}>Contract Code</th>
                              <th style={{ width: "90px" }}>Contract Date</th>
                              <th>Plant</th>
                              <th>Sales Office</th>
                              <th>Party Name</th>
                              <th style={{ width: "75px" }}>Total Qty</th>
                              <th style={{ width: "75px" }}>Amount</th>
                              <th style={{ width: "60px" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.map((td, index) => (
                              <tr key={index}>
                                <td> {td.sl} </td>
                                <td>
                                  {" "}
                                  <div className="pl-2">
                                    {td.salesContactCode}{" "}
                                  </div>
                                </td>
                                <td className="text-center">
                                  {" "}
                                  {_dateFormatter(td.salesContactDate)}{" "}
                                </td>
                                <td> {td.plantName} </td>
                                <td> {td.salesOfficeName} </td>
                                <td> {td.soldToPartnerName} </td>
                                <td className="text-right">
                                  {" "}
                                  {td.contactQuantity}{" "}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  {td.totalAmount}{" "}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          history.push(
                                            `/sales-management/ordermanagement/salescontract/view/${td.salesContactId}`
                                          );
                                        }}
                                      />
                                    </span>
                                    <span
                                      className="edit"
                                      onClick={() => {
                                        history.push(
                                          `/sales-management/ordermanagement/salescontract/edit/${td.salesContactId}`
                                        );
                                      }}
                                    >
                                      <IEdit />
                                    </span>
                                    <span
                                      onClick={() => {
                                        setContactId(td.salesContactId);
                                        setQuotationViewModal(true);
                                      }}
                                    >
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">Print</Tooltip>
                                        }
                                      >
                                        <i
                                          class="fa fa-print cursor-pointer"
                                          aria-hidden="true"
                                        ></i>
                                      </OverlayTrigger>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>{" "}
                      </div>
                    )}
                  </div>
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
                    />
                  )}
                </div>
              ) : (
                <></>
              )}
            </form>

            <div>
              <IViewModal
                title=""
                show={quotationViewModal}
                onHide={() => {
                  setQuotationViewModal(false);
                  setContactId(null);
                }}
              >
                <SalesContractView contactId={contactId} />
              </IViewModal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
