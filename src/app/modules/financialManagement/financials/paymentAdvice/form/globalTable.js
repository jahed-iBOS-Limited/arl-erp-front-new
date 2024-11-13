import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import LoanCreate from "./loan/create";

export default function GlobalTableForBillType({
  values,
  allSelect,
  setAllSelect,
  rowDto,
  selectIndividualItem,
  updateDate,
  preparepaymentIndex,
  setModalShow,
  setGridItem,
  setPreparePaymentLastAction,
  setBankModelShow,
  setGridData,
  dispatch,
}) {
  let monAmountTotal = 0;
  const [isOpenLoanCreateModal, setIsOpenLoanCreateModal] = useState(false);
  const [singleData, setSingleData] = useState(null)
  return (
    <>
      <div className="loan-scrollable-table employee-overall-status">
        <div style={{ maxHeight: "450px" }} className="scroll-table _table">
          <table className="global-table table table-font-size-sm">
            <thead>
              <tr>
                <th style={{ minWidth: "40px" }}>SL</th>
                {values.type.value !== 2 && (
                  <th style={{ minWidth: "70px", textAlign: "center" }}>
                    <span className="d-flex flex-column justify-content-center align-items-center text-center">
                      <label>Select</label>
                      <input
                        style={{ width: "15px", height: "15px" }}
                        name="isSelect"
                        checked={allSelect}
                        className="form-control ml-2"
                        type="checkbox"
                        disabled={rowDto?.some((item) => item?.isLtr)}
                        onChange={(e) => setAllSelect(!allSelect)}
                      />
                    </span>
                  </th>
                )}
                <th style={{ minWidth: "70px" }}>Pay Date</th>
                {values?.billType?.value === 1 && (
                  <th style={{ minWidth: "70px" }}>Maturity Date</th>
                )}
                <th style={{ minWidth: "70px" }}>Bill NO</th>
                <th style={{ minWidth: "70px" }}>Bill Date</th>
                <th style={{ minWidth: "70px" }}>Description</th>
                <th style={{ minWidth: "70px" }}>Audit Date</th>
                <th style={{ minWidth: "70px" }}>Payee</th>
                <th style={{ minWidth: "70px" }}>Payee Bank Name</th>
                <th style={{ minWidth: "70px" }}>Amount</th>
                {[6].includes(values?.billType?.value) && <th style={{ minWidth: "70px" }}>TDS</th>}
                <th style={{ minWidth: "70px" }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ overflow: "scroll" }}>
              {rowDto?.map((item, index) => {
                monAmountTotal += item?.monAmount || 0;
                return (
                  <tr key={item?.sl}>
                    <td
                      className="text-center"
                      style={{ fontSize: 11, width: "15px" }}
                    >
                      {index + 1}
                    </td>
                    {values.type.value !== 2 && (
                      <td
                        style={{ width: "40px", fontSize: 11 }}
                        className="text-center pl-2"
                      >
                        <span className="d-flex flex-column justify-content-center align-items-center text-center">
                          <input
                            style={{ width: "15px", height: "15px" }}
                            name="isSelect"
                            checked={item?.isSelect}
                            className="form-control ml-2"
                            type="checkbox"
                            disabled={item?.isLtr}
                            onChange={(e) => selectIndividualItem(index)}
                          />
                        </span>
                      </td>
                    )}
                    {/* <td className="pl-2">{item?.paymentRequestId}</td> */}
                    <td className="text-center" style={{ fontSize: 11 }}>
                      <input
                        style={{ width: 115, height: 22 }}
                        type="date"
                        value={_dateFormatter(item?.paymentDate)}
                        onChange={(e) => {
                          updateDate(index, e.target.value);
                        }}
                      />
                    </td>
                    {values?.billType?.value === 1 && (
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {_dateFormatter(item?.dteMaturityDate)}
                      </td>
                    )}
                    <td className="text-center" style={{ fontSize: 11 }}>
                      {item?.strBillNo}
                    </td>
                    <td className="text-center" style={{ fontSize: 11 }}>
                      {_dateFormatter(item?.dteBillDate)}
                    </td>
                    <td className="text-center" style={{ fontSize: 11 }}>
                      {item?.strDescription}
                    </td>
                    <td className="text-center" style={{ fontSize: 11 }}>
                      {_dateFormatter(item?.dteAuditDate)}
                    </td>
                    <td style={{ fontSize: 11 }}>{item?.strPayee}</td>
                    <td style={{ fontSize: 11 }}>{item?.strBankName}</td>
                    <td className="text-right" style={{ fontSize: 11 }}>
                      {item?.monAmount}
                    </td>
                    {[6].includes(values?.billType?.value) && <td className="text-right" style={{ fontSize: 11 }}>
                      {item?.numTds}
                    </td>}
                    <td className="text-center">
                      {/* <span > */}
                      <div className="d-flex justify-content-around align-items-center">
                        <IView
                          classes={
                            preparepaymentIndex === item?.intBillId
                              ? "text-primary"
                              : ""
                          }
                          clickHandler={() => {
                            setGridItem({
                              ...item,
                              billRegisterId: item?.intBillId,
                              monTotalAmount:
                                item?.monTotalAmount || item?.monAmount || 0,
                            });
                            setModalShow(true);
                            dispatch(
                              setPreparePaymentLastAction(item?.intBillId)
                            );
                          }}
                        />
                        {(true || item?.isLtr) && (<span>
                          <OverlayTrigger
                            overlay={<Tooltip id="cs-icon">{"Create Loan"}</Tooltip>}
                          >
                            <span>
                              <i
                                className={`fas fa-plus-square pointer`}
                                onClick={() => { 
                                  setIsOpenLoanCreateModal(true);
                                  setSingleData(item)
                                }}
                              ></i>
                            </span>
                          </OverlayTrigger>
                        </span>)}
                        {values.type.value === 2 && values?.status?.value === 1 && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => {
                              setBankModelShow(true);
                              setGridData(item);
                            }}
                          >
                            Bank
                          </button>
                        )}
                        {/* {values.type.value === 2 &&
                      (
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => {
                            prepareChequeVoucher(values,item)
                          }}
                        >
                          Prepare
                        </button>
                      )} */}
                      </div>
                      {/* </span> */}
                    </td>

                    {/* <td className="text-center">
              <input
                type="number"
                name="numItemPlanQty"
                defaultValue={item?.numItemPlanQty}
                onChange={(e) => {
                  setNumItemPlanQty(e.target.value);
                  setQuantityIndex(index + 1);
                }}
                className="form-control"
                onClick={() => updateItemQuantity()}
                min="0"
              />
            </td> */}
                    {/* <td className="text-center">
              <IDelete id={index} remover={remover} />
            </td> */}
                  </tr>
                );
              })}
              {rowDto.length > 0 && (
                <tr>
                  <td colSpan={9}>
                    <b className="pl-2">Total</b>
                  </td>
                  <td className="text-right">
                    <div>{(monAmountTotal || 0).toFixed(0)}</div>
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>{" "}
      </div>
      {isOpenLoanCreateModal && (
        <IViewModal
          show={isOpenLoanCreateModal}
          onHide={() => {
            setIsOpenLoanCreateModal(false);
            setSingleData(null);
          }}
        >
          <LoanCreate singleData={singleData} />
        </IViewModal>
      )}
    </>
  );
}
