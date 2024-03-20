import React from "react";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";

export default function OtherTableForBillType({
  values,
  allSelect,
  setAllSelect,
  rowDto,
  setRowDto,
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
  let monAmountTotal = 0,
    numVdsTotal = 0,
    numTdsTotal = 0;

  return (
    <div className='loan-scrollable-table employee-overall-status'>
      <div style={{ maxHeight: "450px" }} className='scroll-table _table'>
        <table className='global-table table table-font-size-sm'>
          <thead>
            <tr>
              <th style={{ minWidth: "40px" }}>SL</th>
              {values.type.value !== 2 && (
                <th style={{ minWidth: "40px", textAlign: "center" }}>
                  <span className='d-flex flex-column justify-content-center align-items-center text-center'>
                    <label>Select</label>
                    <input
                      style={{ width: "15px", height: "15px" }}
                      name='isSelect'
                      checked={allSelect}
                      className='form-control ml-2'
                      type='checkbox'
                      onChange={(e) => setAllSelect(!allSelect)}
                    />
                  </span>
                </th>
              )}
              <th style={{ minWidth: "75px" }}>Pay Date</th>
              {values?.billType?.value === 1 && (
                <th style={{ minWidth: "70px" }}>Maturity Date</th>
              )}
              <th style={{ minWidth: "100px" }}>Bill NO</th>
              <th style={{ minWidth: "70px" }}>Bill Date</th>
              <th style={{ minWidth: "70px" }}>Description</th>
              <th style={{ minWidth: "70px" }}>Audit Date</th>
              <th style={{ minWidth: "130px" }}>Payee</th>
              {values?.billType?.value === 1 && (
                <th style={{ minWidth: "70px" }}>Approved Amount</th>
              )}
              <th style={{ minWidth: "70px" }}>TDS</th>
              <th style={{ minWidth: "70px" }}>VDS</th>
              <th style={{ minWidth: "70px" }}>Amount</th>
              <th style={{ minWidth: "300px" }}>Payee Bank Name</th>
              <th style={{ minWidth: "70px" }}>Action</th>
            </tr>
          </thead>
          <tbody style={{ overflow: "scroll" }}>
            {rowDto?.map((item, index) => {
              monAmountTotal += +item?.monAmount || 0;
              numVdsTotal += +item?.numVds || 0;
              numTdsTotal += +item?.numTds || 0;
              return (
                <tr key={item?.sl}>
                  <td
                    className='text-center'
                    style={{ fontSize: 11, width: "15px" }}
                  >
                    {index + 1}
                  </td>
                  {values.type.value !== 2 && (
                    <td
                      style={{ width: "40px", fontSize: 11 }}
                      className='text-center pl-2'
                    >
                      <span className='d-flex flex-column justify-content-center align-items-center text-center'>
                        <input
                          style={{ width: "15px", height: "15px" }}
                          name='isSelect'
                          checked={item?.isSelect}
                          className='form-control ml-2'
                          type='checkbox'
                          onChange={(e) => selectIndividualItem(index)}
                        />
                      </span>
                    </td>
                  )}
                  {/* <td className="pl-2">{item?.paymentRequestId}</td> */}
                  <td className='text-center' style={{ fontSize: 11 }}>
                    <input
                      style={{ width: 75, height: 22 }}
                      type='date'
                      value={_dateFormatter(item?.paymentDate)}
                      onChange={(e) => {
                        updateDate(index, e.target.value);
                      }}
                    />
                  </td>
                  {values?.billType?.value === 1 && (
                    <td className='text-center' style={{ fontSize: 11 }}>
                      {_dateFormatter(item?.dteMaturityDate)}
                    </td>
                  )}
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.strBillNo}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {_dateFormatter(item?.dteBillDate)}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {item?.strDescription}
                  </td>
                  <td className='text-center' style={{ fontSize: 11 }}>
                    {_dateFormatter(item?.dteAuditDate)}
                  </td>
                  <td style={{ fontSize: 11 }}>{item?.strPayee}</td>
                  {values?.billType?.value === 1 && (
                    <td className='text-center' style={{ fontSize: 11 }}>
                      {item?.approvedAmount}
                      {console.log("approvedAmount",item?.approvedAmount)}
                    </td>
                  )}
                  <td>
                    <input
                      style={{ width: 70, height: 22 }}
                      type='number'
                      value={item?.numTds || ""}
                      onChange={(e) => {
                        // negative value not allowed
                        if (+e.target.value >= 0 || +e.target.value === "") {
                          if (
                            +e.target.value + +item["numVds"] >
                            +item?.apiAmount
                          ) {
                            return toast.warn(
                              `TDS: ${e.target.value} + VDS: ${
                                item["numVds"]
                              } = ${+e.target.value +
                                +item["numVds"]} cann't be greater than ${
                                item["apiAmount"]
                              }`
                            );
                          }
                          const gridData = [...rowDto];

                          gridData[index]["numTds"] = +e.target.value || 0;

                          // monAmount calculation
                          const numTdsAndVds =
                            (+e.target.value || 0) + (+item["numVds"] || 0);
                          const apiAmount = +item?.apiAmount || 0;
                          const monAmount = apiAmount - numTdsAndVds;
                          gridData[index]["monAmount"] = monAmount;

                          setRowDto(gridData);
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                      style={{ width: 70, height: 22 }}
                      type='number'
                      value={item?.numVds || ""}
                      onChange={(e) => {
                        // negative value not allowed
                        if (+e.target.value >= 0 || +e.target.value === "") {
                          if (
                            +e.target.value + +item["numTds"] >
                            +item?.apiAmount
                          ) {
                            return toast.warn(
                              `TDS: ${item["numTds"]} + VDS: ${
                                e.target.value
                              } = ${+item["numTds"] +
                                +e.target.value} cann't be greater than ${
                                item["apiAmount"]
                              }`
                            );
                          }
                          const gridData = [...rowDto];
                          gridData[index]["numVds"] = +e.target.value || 0;

                          // monAmount calculation
                          const numTdsAndVds =
                            (+e.target.value || 0) + (+item["numTds"] || 0);
                          const apiAmount = +item?.apiAmount || 0;
                          const monAmount = apiAmount - numTdsAndVds;
                          gridData[index]["monAmount"] = monAmount;
                          setRowDto(gridData);
                        }
                      }}
                    />
                  </td>
                  <td className='text-right' style={{ fontSize: 11 }}>
                    {item?.monAmount}
                  </td>
                  <td style={{ fontSize: 11 }}>{item?.strBankName}</td>
                  <td className='text-center'>
                    {/* <span > */}
                    <div className='d-flex justify-content-around align-items-center'>
                      <IView
                        classes={
                          preparepaymentIndex === item?.intBillId
                            ? "text-primary"
                            : ""
                        }
                        clickHandler={() => {
                          setModalShow(true);
                          setGridItem({
                            ...item,
                            billRegisterId: item?.intBillId,
                            monTotalAmount:
                              item?.monTotalAmount || item?.monAmount || 0,
                          });
                          dispatch(
                            setPreparePaymentLastAction(item?.intBillId)
                          );
                        }}
                      />
                      {values.type.value === 2 && values?.status?.value === 1 && (
                        <button
                          className='btn btn-primary'
                          type='button'
                          onClick={() => {
                            setBankModelShow(true);
                            setGridData(item);
                          }}
                        >
                          Bank
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {rowDto.length > 0 && (
              <tr>
                <td colSpan={9}>
                  <b className='pl-2'>Total</b>
                </td>
                <td>
                  <div>{(numTdsTotal || 0).toFixed(0)}</div>
                </td>
                <td>
                  <div>{(numVdsTotal || 0).toFixed(0)}</div>
                </td>
                <td className='text-right'>
                  <div>{(monAmountTotal || 0).toFixed(0)}</div>
                </td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
