import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
// eslint-disable-next-line no-unused-vars
import { _formatMoney } from "../../../../_helper/_formatMoney";
import CashViewForm from "./../view/cash/viewModal";
import BankViewForm from "./../view/bank/viewModal";
import AdjustmentViewForm from "./../view/adjustment/viewModal";
import { useSelector, shallowEqual } from "react-redux";
import { GetGeneralLedgerDDLType_api } from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import InvoiceReportTable from "../view/invoiceReport/viewModal";

const GridData = ({
  rowDto,
  setGirdData,
  loading,
  paginationState,
  setPositionHandler,
  values,
  gridDataFunc,
}) => {
  // eslint-disable-next-line no-unused-vars
  let history = useHistory();
  const printRef = useRef();
  const [modalShow1, setModalShow1] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShow3, setModalShow3] = useState(false);
  const [modalShow4, setModalShow4] = useState(false);
  const [currentItem, setCurrentItem] = useState();
  const [generalLedgerDDL, setGeneralLedgerDDL] = useState([]);
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;

  let { selectedBusinessUnit, profileData } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      GetGeneralLedgerDDLType_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        2,
        setGeneralLedgerDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );
  const bankClearPermission = userRole[24];
  const cashClearPermission = userRole[23];
  const adjusmentPermission = userRole[25];

  return (
    <>
      {/* Table Start */}
      {loading && <Loading />}
      {rowDto?.objData?.length > 0 && (
        <div
          className="global-table print_wrapper"
          componentRef={printRef}
          ref={printRef}
        >
          <div className="row">
            <div className="col-lg-12 text-right printSectionNone">
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: "2px 5px" }}
                  >
                    <img
                      style={{
                        width: "25px",
                        paddingRight: "5px",
                      }}
                      src={printIcon}
                      alt="print-icon"
                    />
                    Print
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>
            <div className="col-lg-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table table-font-size-sm">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>SL</th>
                      <th style={{ width: "100px" }}>Invocie Date</th>
                      <th style={{ width: "100px" }}>Invoice No</th>
                      <th style={{ width: "100px" }}>Partner Code</th>
                      <th style={{ width: "100px" }}>Partner Name</th>
                      <th style={{ width: "100px" }}>Partner Address</th>
                      <th style={{ width: "100px" }}>Invoice Amount</th>
                      <th style={{ width: "100px" }}>Pending Amount</th>
                      <th
                        style={{ width: "300px" }}
                        className="printSectionNone"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.objData?.map((item, index) => (
                      <>
                        <tr>
                          <td className="text-center"> {index + 1}</td>
                          <td className="text-center">
                            {" "}
                            {_dateFormatter(item.transactionDate)}
                          </td>
                          <td className="text-center"> {item?.invoiceCode}</td>
                          <td className="text-center">
                            {item?.businessPartnerCode}
                          </td>
                          <td className="text-center">
                            {item?.businessPartnerName}
                          </td>
                          <td className="text-center">
                            {item?.businessPartnerAddress}
                          </td>
                          <td className="text-right">
                            <div className="pr-2">
                              {parseFloat(item?.amount || 0).toFixed(2)}
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="pr-2">
                              {parseFloat(
                                item?.adjustmentPendingAmount || 0
                              ).toFixed(2)}
                            </div>
                          </td>
                          <td className="text-center printSectionNone">
                            {cashClearPermission?.isCreate && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "5px" }}
                                onClick={() => {
                                  setModalShow1(true);
                                  setCurrentItem(item);
                                }}
                              >
                                Cash
                              </button>
                            )}
                            {bankClearPermission?.isCreate && (
                              <button
                                type="button"
                                className="btn btn-primary ml-1"
                                onClick={() => {
                                  setModalShow2(true);
                                  setCurrentItem(item);
                                }}
                                style={{ padding: "5px" }}
                              >
                                Bank
                              </button>
                            )}
                            {adjusmentPermission?.isCreate && (
                              <button
                                type="button"
                                className="btn btn-primary ml-1"
                                onClick={() => {
                                  setModalShow3(true);
                                  setCurrentItem(item);
                                }}
                                style={{ padding: "5px 5px", width: "86px" }}
                              >
                                Adjustment
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary ml-1"
                              onClick={() => {
                                setModalShow4(true);
                                setCurrentItem(item);
                              }}
                              style={{ padding: "5px 5px", width: "50px" }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        <CashViewForm
                          show={modalShow1}
                          onHide={() => {
                            setModalShow1(false);
                          }}
                          item={currentItem}
                          generalLedgerDDL={generalLedgerDDL}
                          gridDataFunc={gridDataFunc}
                          parentFormValues={values}
                        />
                        <BankViewForm
                          show={modalShow2}
                          onHide={() => {
                            setModalShow2(false);
                          }}
                          item={currentItem}
                          parentFormValues={values}
                          gridDataFunc={gridDataFunc}
                        />
                        <AdjustmentViewForm
                          show={modalShow3}
                          onHide={() => {
                            setModalShow3(false);
                          }}
                          item={currentItem}
                          parentFormValues={values}
                          gridDataFunc={gridDataFunc}
                        />
                        <InvoiceReportTable
                          show={modalShow4}
                          onHide={() => {
                            setModalShow4(false);
                          }}
                          item={currentItem}
                          parentFormValues={values}
                          gridDataFunc={gridDataFunc}
                        />
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {rowDto?.objData?.length > 0 && (
                <div className="printSectionNone">
                  <PaginationTable
                    count={rowDto?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Table End */}
    </>
  );
};

export default withRouter(GridData);
