import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getGridData } from "../helper";
import { SearchForm } from "./form";
import SalesInvoiceModel from "../viewModal";
import Loading from "./../../../../../_helper/_loading";
import ICustomCard from "./../../../../../_helper/_customCard";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import { setSalesLanding_Action } from "./../../../../../_helper/reduxForLocalStorage/Actions";
import TurnoverModel from "./../../../../transaction/tresuary/trunOverTax/viewModal";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _formatMoney } from "./../../../../../_helper/_formatMoney";
import { getDownlloadFileView_Action } from "./../../../../../_helper/_redux/Actions";
export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [viewClick, setViewClick] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const dispatch = useDispatch();
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Sales Invoice">
        <SearchForm
          setGridData={setGridData}
          setLoading={setLoading}
          onSubmit={(values) => {
            dispatch(setSalesLanding_Action(values));
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values.taxBranch.value,
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading
            );
          }}
        />

        {/* Table Start */}
        <div className="row cash_journal">
          <div className="col-lg-12">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th style={{ width: "100px" }}>Sales Inv No</th>
                    <th style={{ width: "100px" }}>Invoice Date</th>
                    <th style={{ width: "127px" }}>Customer Name</th>
                    <th style={{ width: "500px" }}>Customer Addres</th>
                    <th style={{ width: "170px" }}>Vehicle No</th>
                    <th style={{ width: "110px" }}>Total</th>
                    <th style={{ width: "90px" }}>Attachment</th>
                    <th style={{ width: "70px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>
                        <div className="pl-2">{item?.salesCode}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(item?.taxDeliveryDateTime)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.soldtoPartnerName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.soldtoPartnerAddress}</div>
                      </td>

                      <td>
                        <div className="text-left">{item?.vehicleNo}</div>
                      </td>
                      <td>
                        <div className="text-right">
                          {_formatMoney(item?.grandTotal)}
                        </div>
                      </td>
                      <td>
                        {item?.fileName && (
                          <div className="text-center pl-2">
                            <button
                              className="btn btn-primary"
                              type="button"
                              dispatch={!item?.fileName}
                              style={{
                                backgroundColor: "#b5b5c3",
                                borderColor: "#b5b5c3",
                              }}
                              onClick={() => {
                                if (item?.fileName) {
                                  dispatch(
                                    getDownlloadFileView_Action(item?.fileName)
                                  );
                                }
                              }}
                            >
                              View
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span className="view">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">{"Print"}</Tooltip>
                              }
                            >
                              <span
                                onClick={() => {
                                  setViewClick({
                                    ...item,
                                    taxSalesId: item?.salesId,
                                  });
                                  setModelShow(true);
                                }}
                              >
                                <i class="fas fa-print pointer"></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                          {/* <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/operation/sales/salesInvoice/edit/${item?.taxSalesId}`
                              );
                            }}
                          >
                            <IEdit />
                          </span> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ICustomCard>

      {viewClick?.taxBracketId === 4 ? (
        <>
          {/* Turnover Tax table */}
          <TurnoverModel
            show={modelShow}
            onHide={() => {
              setModelShow(false);
            }}
            viewClick={viewClick}
          />
        </>
      ) : (
        <SalesInvoiceModel
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          loading={loading}
          viewClick={viewClick}
        />
      )}
    </>
  );
}
