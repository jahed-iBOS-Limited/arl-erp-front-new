import React, { useRef, useEffect } from "react";
import { getUpdatedFirstLevelList } from "../rowDtoTable";

const ItemInformation = ({ currRowInfo, setFieldValue, rowDto, isFromDelivery, setRowDto, isEdit }) => {
  const inputRefs = useRef([]);
  const currentRowIndex = currRowInfo?.rowIndex;
  const itemSerialList = Array.isArray(rowDto[currentRowIndex]?.serialList) ? rowDto[currentRowIndex]?.serialList : []; //from inventory receive page

  const itemList = Array.isArray(rowDto[currentRowIndex]?.scannedItemSerialList) //from customer delivery page
    ? rowDto[currentRowIndex]?.scannedItemSerialList
    : [];

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const onRowChange = ({ value, key, index }) => {
    const updatedList = getUpdatedSecondLevelList(currentRowIndex, index, key, value);
    setRowDto(updatedList);
  };

  const getUpdatedSecondLevelList = (currentRowIndex, index, key, value) => {
    const newList = [...itemSerialList];
    let sl = newList[index];
    sl[key] = value;

    const updateRowDto = getUpdatedFirstLevelList(rowDto, "serialList", currentRowIndex, newList);
    return updateRowDto;
  };

  const singleChecker = ({ value, i }) => {
    const deepClone = JSON.parse(JSON.stringify(rowDto));
    const exactClickedRow = deepClone[currentRowIndex];

    const childList = [...exactClickedRow?.scannedItemSerialList];
    const clickedRow = childList[i];

    if (isEdit && clickedRow) {
      clickedRow.isItWithCurrentPurchaseOrder = value;
    }

    if (clickedRow) {
      clickedRow.isCheck = value;
    }
    setFieldValue("itemLists", deepClone);
  };

  const handleAllCheck = (value) => {
    const deepClone = JSON.parse(JSON.stringify(rowDto));

    const exactClickedRow = deepClone[currentRowIndex];

    if (isEdit) {
      const updatedChildList = exactClickedRow?.scannedItemSerialList.map((item) => {
        return {
          ...item,
          isItWithCurrentPurchaseOrder: value,
        };
      });
      exactClickedRow.scannedItemSerialList = updatedChildList;
    }

    const updatedChildList = exactClickedRow?.scannedItemSerialList.map((item) => {
      return {
        ...item,
        isCheck: value,
      };
    });

    exactClickedRow.scannedItemSerialList = updatedChildList;

    setFieldValue("itemLists", deepClone);
  };

  const onClear = (rowIndex) => {
    // const newList = itemSerialList?.filter((item, index) => rowIndex !== index);
    // const updateRowDto = getUpdatedFirstLevelList(rowDto, "serialList", currentRowIndex, newList);
    // setRowDto(updateRowDto);
    onRowChange({ value: "", key: "barCode", index: rowIndex })
  };

  const getChecked = () => {
    const deepClone = JSON.parse(JSON.stringify(rowDto));
    const exactClickedRow = deepClone[currentRowIndex]; //mother array;
    const childList = [...exactClickedRow?.scannedItemSerialList]; //child array

    return childList?.length > 0 && childList?.every((item) => item?.isCheck || item?.isItWithCurrentPurchaseOrder);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  return (
    <div className="col-lg-12">
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>{`${
        isFromDelivery ? "Item Serial List" : "Add Item Serial Number"
      }`}</div>
      <hr style={{ border: "1px solid black" }} />
      {isFromDelivery ? null : (
        <div
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <div>{currRowInfo?.itemName?.split("-")?.[0]}</div>
        </div>
      )}
      <div className="mt-5">
        <div className="table-responsive" style={{ height: "400px" }}>
          <table className="table table-striped table-bordered inv-table">
            <thead>
              <tr
                style={{
                  position: "sticky",
                  overflow: "auto",
                  top: 0,
                }}
              >
                {isFromDelivery && (
                  <th>
                    <input
                      type="checkbox"
                      name="isCheck"
                      checked={getChecked()}
                      onChange={(e) => {
                        handleAllCheck(e.target.checked);
                      }}
                      id="isSelect"
                    />
                  </th>
                )}
                <th>SL</th>
                <th style={{ textAlign: "left" }}>Serial</th>
                {!isFromDelivery && <th style={{ textAlign: "left" }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {isFromDelivery
                ? itemList?.length > 0 &&
                  itemList?.map((item, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: (() => {
                          const currentDate = new Date();
                          const mrrDate = new Date(item?.mrrDate);
                          const diffInDays = (currentDate - mrrDate) / (1000 * 60 * 60 * 24);

                          if (diffInDays > 30) {
                            return "rgb(255,127,127)";
                          } else if (diffInDays > 15) {
                            return "rgb(255, 255, 210)"; // Light yellow
                          } else if (diffInDays > 5) {
                            return "rgb(230, 255, 230)"; // Light green
                          } else {
                            return "transparent";
                          }
                        })(),
                      }}
                    >
                      <td style={{ width: "5px" }}>
                        <input
                          type="checkbox"
                          name="isCheck"
                          checked={item?.isCheck || item?.isItWithCurrentPurchaseOrder}
                          onChange={(e) => {
                            const value = e.target.checked;
                            singleChecker({ value, i });
                          }}
                          id="isCheck"
                        />
                      </td>
                      <td style={{ width: "5%", textAlign: "center" }}>{i + 1}</td>
                      <td style={{ width: "90%", textAlign: "center" }} className="disabled-feedback disable-border">
                        {typeof item?.serialNumber === "string" ? item?.serialNumber : ""}
                      </td>
                    </tr>
                  ))
                : itemSerialList?.map((item, i) => (
                    <tr key={i}>
                      <td style={{ width: "5%" }}>{i + 1}</td>
                      <td style={{ width: "65%" }} className="disabled-feedback disable-border">
                        <input
                          style={{
                            width: "100%",
                            border: "1px solid white",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                          value={item?.barCode}
                          name="barcode"
                          placeholder={item?.barCode}
                          type="text"
                          onChange={(event) => {
                            onRowChange({ value: event.target.value, key: "barCode", index: i });
                          }}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          ref={(el) => (inputRefs.current[i] = el)}
                          step="any"
                        />
                      </td>
                      <td style={{ width: "15%" }}>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            className="btn btn-primary mr-2"
                            type="button"
                            onClick={() => onClear(i)}
                          >
                            clear
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemInformation;
