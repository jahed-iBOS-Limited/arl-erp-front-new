import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import ICard from "../../../../_helper/_card";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import DailyDeliveryStatusForm from "../callModal/addEditForm";
import { GetCustomerDeliveryInqueryLanding_api } from "./../helper";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import moment from "moment";
import PaginationSearch from "./../../../../_helper/_search";
const DeliveryInquiryLanding = () => {
  const [open, setOpen] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [loading, setLoading] = useState(false);
  const [clickRowData, setClickRowData] = useState("");
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);

  const initData = {
    date: _todayDate(),
  };

  const commonGridFunc = (pageNo, pageSize, values, searchValue) => {
    const { date } = values;
    GetCustomerDeliveryInqueryLanding_api(
      date,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
      searchValue
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridFunc(pageNo, pageSize, values);
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      commonGridFunc(pageNo, pageSize, { date: _todayDate() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const paginationSearchHandler = (searchValue, values) => {
    commonGridFunc(pageNo, pageSize, values, searchValue);
  };
  return (
    <>
      {" "}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <ICard
              printTitle="Print"
              isPrint={true}
              isShowPrintBtn={false}
              isExcelBtn={true}
              excelFileNameWillbe="Delivery Inquiry"
              title="Delivery Inquiry"
            >
              <form>
                <div className="form-group row global-form form form-label-right">
                  <div className="col-lg-3">
                    <label>Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        commonGridFunc(pageNo, pageSize, {
                          ...values,
                          date: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <PaginationSearch
                    placeholder="Customer Name & Challan Number Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
              </form>
              <div className="loan-scrollable-table">
                <div
                  className="scroll-table _table"
                  style={{ maxHeight: "540px" }}
                >
                  <table
                    id="table-to-xlsx"
                    className="table table-striped table-bordered global-table"
                  >
                    <thead>
                      <tr>
                        <th style={{ minWidth: "30px" }}>SL</th>
                        <th style={{ minWidth: "65px" }}>Unit</th>
                        <th style={{ minWidth: "130px" }}>Challan Number</th>
                        <th style={{ minWidth: "130px" }}>Sales Order Code</th>
                        <th style={{ minWidth: "75px" }}>Challan Date</th>
                        <th>Out Date Time</th>
                        <th style={{ minWidth: "140px" }}>
                          Estimated Received Date Time
                        </th>
                        <th style={{ minWidth: "320px" }}>Ship To Address</th>
                        <th style={{ minWidth: "180px" }}>Customer Name</th>
                        <th style={{ minWidth: "201px" }}>Customer Address</th>
                        <th style={{ minWidth: "100px" }}>Customer Phone</th>
                        <th style={{ minWidth: "100px" }}>Ship To Contact</th>
                        <th style={{ minWidth: "100px" }}>Vehicle No</th>
                        <th style={{ minWidth: "100px" }}>Own/Rental</th>
                        <th style={{ minWidth: "100px" }}>Vehicle Type</th>
                        <th style={{ minWidth: "100px" }}>Driver Name</th>
                        <th style={{ minWidth: "100px" }}>Driver Phone</th>
                        <th style={{ minWidth: "100px" }}>
                          {" "}
                          Product Description
                        </th>
                        <th style={{ minWidth: "100px" }}>Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((itm) => (
                        <tr>
                          <td>{itm?.sl}</td>
                          <td>{itm?.unit}</td>
                          <td>{itm?.challanNumber}</td>
                          <td className="text-center">{itm?.salesOrderCode}</td>
                          <td>{_dateFormatter(itm?.challanDate)}</td>
                          <td className="text-center">
                            {`${itm?.outDateTime?.split("T")[0]} ${moment(itm?.outDateTime).format("h:mm:ss a")}`}
                          </td>
                          <td>
                            {_dateFormatter(itm?.estimatedReceiveDateTime)}
                            {", "}
                            {moment(itm?.estimatedReceiveDateTime).format(
                              "h:mm:ss a"
                            )}
                          </td>
                          <td>{itm?.shipToAddress}</td>
                          <td>{itm?.customerName}</td>
                          <td>{itm?.customerAddress}</td>
                          <td>{itm?.customerPhone1}</td>
                          <td>{itm?.customerPhone2}</td>
                          <td>{itm?.vehicleNo}</td>
                          <td>{itm?.ownerType}</td>
                          <td>{itm?.vehicleType}</td>
                          <td>{itm?.driverName}</td>
                          <td>{itm?.driverPhone}</td>
                          <td>{itm?.productDescription}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setOpen(true);
                                setClickRowData(itm);
                              }}
                            >
                              Call
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  values={values}
                />
              )}
            </ICard>
            <IViewModal show={open} onHide={() => setOpen(false)}>
              <DailyDeliveryStatusForm
                clickRowData={clickRowData}
                setOpen={setOpen}
                commonGridFunc={commonGridFunc}
                pageNo={pageNo}
                pageSize={pageSize}
                landingValues={values}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default DeliveryInquiryLanding;
