import React, { useState } from "react";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import IView from "./../../../../_helper/_helperIcons/_view";
import IViewModal from "./../../../../_helper/_viewModal";
import DebitNoteView from "././../../../operation/purchase/debitNote/Table/grid";
// import document from "./document.svg";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
const DebitNoteModel = ({ rowDto, parentRowClickData }) => {
  const [modelShow, setModelShow] = useState(false);
  const [modelShowAll, setModelShowAll] = useState(false);
  const [viewClick, setViewClick] = useState({});
  return (
    <>
      {/* <OverlayTrigger
        overlay={<Tooltip id="cs-icon">{"Details All Log"}</Tooltip>}
      >
        <img
          src={document}
          alt={"document"}
          onClick={() => {
            // setModelShowAll(true);
          }}
          style={{
            width: "18px",
            position: "absolute",
            top: "1px",
            right: "22px",
            cursor: "pointer",
          }}
        />
      </OverlayTrigger> */}
      <div>
        <div className="row global-table">
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>S/N</th>
                  <th style={{ width: "150px" }}>Purchase Invoice</th>
                  <th>Transaction Date</th>
                  <th>SD Total</th>
                  <th>VAT Total</th>
                  <th>Grand Total</th>
                  <th>Action By</th>
                  <th>Activity</th>
                  <th>Modify No</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((tableData, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.purchaseCode} </td>
                      <td> {_dateFormatter(tableData?.purchaseDate)} </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.sdTotal)}{" "}
                      </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.vatTotal)}{" "}
                      </td>
                      <td className="text-right">
                        {" "}
                        {_fixedPoint(tableData?.grandTotal)}{" "}
                      </td>
                      <td> {tableData?.createdBy} </td>
                      <td> {tableData?.activity} </td>
                      <td> {tableData?.modifyNo} </td>
                      <td>
                        <span className="d-flex justify-content-center align-items-center">
                          <span
                            onClick={() => {
                              setViewClick(tableData);
                              setModelShow(true);
                            }}
                          >
                            <IView />
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <IViewModal
          show={modelShow}
          onHide={() => {
            setModelShow(false);
          }}
          title={'View "Debit Note Log"'}
          btnText="Close"
        >
          <DebitNoteView
            redirectAuditLogPage={viewClick}
            title={"DEBIT NOTE"}
          />
        </IViewModal>
        <IViewModal
          show={modelShowAll}
          onHide={() => {
            setModelShowAll(false);
          }}
          title={'View "Purchase Log (Details All)"'}
          btnText="Close"
        >

        </IViewModal>
      </div>
    </>
  );
};

export default DebitNoteModel;
