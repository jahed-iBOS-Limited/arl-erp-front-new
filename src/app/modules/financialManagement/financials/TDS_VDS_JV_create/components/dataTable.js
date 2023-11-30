import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import PaginationTable from "../../../../_helper/_tablePagination";
import "./style.css";

export default function TdsVdsJvDataTable({
  values,
  editableData,
  setEditableData,
  setDisabled,
  handleGetTableData,
  totalCount,
  setFieldValue,
  errors,
  touched,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    const activeStatus =
      values?.costCenter?.value &&
      values?.costElement?.value &&
      values?.profitCenter?.value &&
      values?.accountNo?.value;
    setDisabled(!activeStatus);
    //  if(activeStatus){
    //   setDisabled(false)
    //  }else{
    //   setDisabled(true)
    //  }
  }, [values]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    //load data
    handleGetTableData({
      billType: values?.billType.value,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      status: values?.status?.label === "Pending" ? false : true,
      pageNo,
      pageSize,
    });
    // getLandingData(values, pageNo, pageSize);
    // console.log({values, pageNo, pageSize});
  };

  const handleSelectTableRow = (tableData, index) => {
    const modifiedData = [...tableData];
    if (
      modifiedData[index].taxVatJournalId <= 0 ||
      modifiedData[index].taxVatJournalId == null
    ) {
      if (modifiedData[index]?.isSelect) {
        modifiedData[index].isSelect = ![...modifiedData][index]?.isSelect;
      } else {
        modifiedData[index].isSelect = true;
      }
    }
    setEditableData(modifiedData);
  };

  return (
    <div>
      <div className="loan-scrollable-table employee-overall-status">
        <div style={{ maxHeight: "450px" }} className="scroll-table _table">
          <table className=" table table-striped table-bordered table-font-size-sm">
            <thead>
              <tr>
                <th style={{ minWidth: "40px" }}>SL</th>
                <th style={{ minWidth: "40px", textAlign: "center" }}>
                  <span className="d-flex flex-column justify-content-center align-items-center text-center">
                    <label>Select</label>
                    <input
                      style={{ width: "15px", height: "15px" }}
                      name="isSelect"
                      checked={selectAll}
                      className="form-control ml-2"
                      type="checkbox"
                      disabled={values?.status?.label === 'Complete'}
                      onChange={(e) => {
                        setSelectAll(e.target.checked);
                        setEditableData(
                          editableData?.length > 0 &&
                            editableData?.map((item) => {
                              if (
                                item.taxVatJournalId <= 0 ||
                                item.taxVatJournalId == null
                              ) {
                                return {
                                  ...item,
                                  isSelect: e.target.checked,
                                };
                              } else {
                                return {
                                  ...item,
                                };
                              }
                            })
                        );
                      }}
                    />
                  </span>
                </th>
                <th style={{ minWidth: "75px" }}>Request Date</th>
                <th style={{ minWidth: "120px" }}>Bill Code</th>
                <th style={{ minWidth: "120px" }}>Partner Name</th>
                <th style={{ minWidth: "130px" }}>Request Amount</th>
                <th style={{ minWidth: "70px" }}>TDS Amount</th>
                <th style={{ minWidth: "70px" }}>VDS Amount</th>
                <th style={{ minWidth: "70px" }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ overflow: "scroll" }}>
              {editableData.length > 0 &&
                editableData?.map((item, index, tableData) => {
                  return (
                    <tr key={item.paymentRequestId}>
                      <td
                        className="text-center"
                        style={{ fontSize: 11, width: "15px" }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{ width: "40px", fontSize: 11 }}
                        className="text-center pl-2"
                      >
                        <span className="d-flex flex-column justify-content-center align-items-center text-center">
                          <input
                            style={{ width: "15px", height: "15px" }}
                            name="isSelect"
                            checked={(item.isSelect || item.taxVatJournalId > 0) ?? false}
                            disabled={(() =>
                              item.taxVatJournalId > 0 ||
                              item.taxVatJournalId == null)()}
                            className="form-control ml-2"
                            type="checkbox"
                            // disabled={true}
                            onChange={(e) =>
                              handleSelectTableRow(tableData, index)
                            }
                          />
                        </span>
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {_dateFormatter(item?.paymentRequestDate)}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {item?.refCode}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {item?.partnerName}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {item?.reqestAmount}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {item?.tdsamount}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        {item?.vdsamount}
                      </td>
                      <td className="text-center" style={{ fontSize: 11 }}>
                        <div>{/* <IView /> */}</div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 mb-20"
          style={{
            position: "absolute",
            right: "30px",
            border: "1px solid gray",
          }}
        >
          {editableData.length > 0 && (
            <PaginationTable
              count={totalCount}
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
        </div>
      </div>
    </div>
  );
}
