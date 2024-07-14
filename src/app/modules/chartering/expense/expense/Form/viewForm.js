/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

// import {
//   calculateNetValue,
//   findPriceComponentId,
//   findSumFromAndSumTo,
//   updateCalculatedValueForPriceStructureModal,
// } from "../helper";

import { useLocation } from "react-router-dom";
import {
  calculateNetValue,
  updateCalculatedValueForPriceStructureModal,
} from "../../../../procurement/purchase-management/purchaseOrder/helper";
import ICustomTable from "../../../../_helper/_customTable";
import { IInput } from "../../../../_helper/_input";

const ths = ["SL", "Component", "Value Type", "Value", "Amount", "is Manual"];

export default function ViewForm({
  currentRowData,
  setRowDto,
  rowDto,
  currentIndex,
  values,
  setIsShowModal,
}) {
  const [data, setData] = useState([]);
  const [calculatedData, setCalculatedData] = useState([]);
  const location = useLocation();
  let isViewPage = location?.pathname?.includes("/view/");

  // input fields data handler dynamically, user will give input
  const dataHandler = (name, value, sl) => {
    const xData = [...data];
    xData[sl][name] = value;
    setData([...xData]);
  };

  // save modal data to rowDto and calculate netValue
  const saveHandler = () => {
    const xData = [...rowDto];

    // calculateNetValue(
    //   currentRowData?.orderQty * currentRowData?.basicPrice,
    //   calculatedData,
    //   rowDto,
    //   currentIndex
    // );
    calculateNetValue(calculatedData, rowDto, currentIndex, setRowDto);

    // if amount type === manual, we will get field value from data array state, else we will get everything from calculatedArray state
    const newData = [];
    data?.length > 0 &&
      data.forEach((item, index) => {
        if (item?.mannual) {
          let newItem = {
            ...item,
            value: item?.value,
            amount: calculatedData[index].amount,
          };
          newData.push(newItem);
        } else {
          newData.push(calculatedData[index]);
        }
      });
    xData[currentIndex] = {
      ...xData[currentIndex],
      priceStructure: newData,
    };
    setRowDto([...xData]);
    setIsShowModal(false);
  };

  // get priceStructure data from table row, and set it to state, later fill up this data from user, and save it to table row
  useEffect(() => {
    const newData = currentRowData?.priceStructure?.map((item, index) => {
      let obj = {
        ...item,
        value:
          index === 0
            ? currentRowData?.orderQty * currentRowData?.basicPrice
            : item?.value,
        amount:
          index === 0
            ? currentRowData?.orderQty * currentRowData?.basicPrice
            : item?.baseComponentId >= 1
            ? item?.amount * item?.factor
            : item?.amount,
      };
      return obj;
    });

    setCalculatedData(newData);
    setData(newData);
  }, []);

  // some row field will be calculated based on user input,
  useEffect(() => {
    if (calculatedData?.length > 0 && data?.length > 0) {
      updateCalculatedValueForPriceStructureModal(
        calculatedData,
        setCalculatedData
      );
    }
  }, [data]);

  console.log(rowDto);

  return (
    <div>
      <div className="text-right">
        {!isViewPage && (
          <button
            className="btn btn-primary my-2"
            onClick={() => saveHandler()}
          >
            Save
          </button>
        )}
        <div className="row mb-2 text-left">
          <div className="col-lg">
            Item name : {currentRowData?.item?.label}
          </div>
          <div className="col-lg">
            Quantity : {currentRowData?.orderQty || 0}{" "}
          </div>
          <div className="col-lg">
            Order total :{" "}
            {calculatedData[calculatedData?.length - 1]?.value || 0}{" "}
          </div>
          <div className="col-lg">Description : {currentRowData?.desc}</div>
        </div>
        {data?.length > 0 && (
          <ICustomTable ths={ths}>
            {data?.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td className="text-center"> {item?.priceComponentName} </td>
                <td className="text-center"> {item?.valueType} </td>
                <td className="disabled-feedback disable-border p-2">
                  <IInput
                    placeholder="value"
                    name="value"
                    type="number"
                    min="0"
                    required
                    value={
                      item?.mannual
                        ? data[index].value
                        : calculatedData[index]?.value
                    }
                    // disabled={!item?.mannual}
                    disabled={isViewPage ? true : !item?.mannual}
                    onChange={(e) => {
                      dataHandler("value", e.target.value, index);
                    }}
                  />
                </td>
                <td className="text-center">
                  {/* {item?.mannual === false
                    ? item?.amount
                    : calculatedData[index].amount} */}
                  {calculatedData[index].amount}
                </td>
                <td className="text-center"> {`${item?.mannual}`} </td>
              </tr>
            ))}
          </ICustomTable>
        )}
      </div>
    </div>
  );
}
