import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";


export default function TdsVdsJvDataTable({
  values,
  // rowData,
  editableData,
  setEditableData,
  setDisabled,
  // allSelect ="",
  // setAllSelect,
  setFieldValue,
  errors,
  touched,
}) {
  const [selectAll, setSelectAll] = useState(false);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    const activeStatus =
      values?.costCenter?.value &&
      values?.costElement?.value &&
      values?.profitCenter?.value &&values?.accountNo?.value;
    setDisabled(!activeStatus);
    //  if(activeStatus){
    //   setDisabled(false)
    //  }else{
    //   setDisabled(true)
    //  }
  }, [values]);

  const handleSelectTableRow = (tableData, index) => {
    const modifiedData = [...tableData];
    if (tableData[index]?.isSelect) {
      modifiedData[index].isSelect = ![...tableData][index]?.isSelect;
    } else {
      modifiedData[index].isSelect = true;
    }
    setEditableData(modifiedData);
  };

  return (
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
                    // disabled={true}
                    onChange={(e) => {
                      setSelectAll(e.target.checked);
                      setEditableData(
                        editableData?.length > 0 &&
                          editableData?.map((item) => ({
                            ...item,
                            isSelect: e.target.checked,
                          }))
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
                          checked={item?.isSelect ?? false}
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
                      <div>
                        {/* <IView /> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
