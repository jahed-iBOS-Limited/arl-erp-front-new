/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDispatch } from "react-redux";
import { _dateTimeFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

const headers = [
  "SL",
  "Business Partner",
  "Deposit Bank Name",
  "Deposit Branch Name",
  "Payee Bank Name",
  // "Challan no",
  // "Invoice no",
  "Amount",
  // "Collection",
  // "Delivery Code",
  "Deposit Mode",
  // "Outstanding",
  // "Days of collection",
  "Instrument No",
  "Insertion Date",
  "Action",
];

const GridView = ({ rowData, setRowData, values }) => {
  const dispatch = useDispatch();

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data?.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  let totalAmount = 0;
  return (
    <>
      {rowData?.length > 0 && (
       <div className="table-responsive">
         <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {[1, 2].includes(values?.type?.value) && (
                <th
                  onClick={() => allSelect(!selectedAll())}
                  style={{ width: "30px" }}
                >
                  <input
                    type="checkbox"
                    value={selectedAll()}
                    checked={selectedAll()}
                    onChange={() => {}}
                  />
                </th>
              )}
              {headers?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              totalAmount += item?.numAmount;
              return (
                <tr key={index}>
                  {[1, 2].includes(values?.type?.value) && (
                    <td
                      style={
                        item?.isSelected
                          ? {
                              backgroundColor: "#aacae3",
                              width: "30px",
                            }
                          : { width: "30px" }
                      }
                      onClick={() => {
                        rowDataHandler("isSelected", index, !item.isSelected);
                      }}
                      className="text-center"
                    >
                      <input
                        type="checkbox"
                        value={item?.isSelected}
                        checked={item?.isSelected}
                        onChange={() => {}}
                      />
                    </td>
                  )}
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.strBusinessPartnerName}</td>
                  <td>{item?.strBankName}</td>
                  <td>{item?.strBranchName}</td>
                  <td>{item?.strPayeeBankName}</td>
                  {/* <td>{item?.strDeliveryCode}</td>
                  <td>{item?.strInvoice}</td> */}
                  {/* <td className="text-right">
                    {_fixedPoint(item?.decChallanAmount, true, 0)}
                  </td> */}
                  <td className="text-right">{item?.numAmount}</td>
                  <td>{item?.strDepositMode}</td>
                  {/* <td className="text-right">
                    {_fixedPoint(item?.outstanding, true, 0)}
                  </td>
                  <td>{item?.daysoffcollection}</td> */}
                  <td>{item?.strRefNo}</td>
                  <td>{_dateTimeFormatter(item?.dteInsertDate)}</td>
                  <td className="text-center">
                    <IView
                      title="View Attachment"
                      clickHandler={() => {
                        dispatch(
                          getDownlloadFileView_Action(item?.intAttachmentid)
                        );
                      }}
                    />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                className="text-right"
                colSpan={[1, 2].includes(values?.type?.value) ? 6 : 5}
              >
                <b>Total</b>
              </td>
              <td className="text-right">
                <b>{totalAmount}</b>
              </td>
              <td className="text-right" colSpan={4}></td>
            </tr>
          </tbody>
        </table>
       </div>
      )}
    </>
  );
};

export default GridView;
