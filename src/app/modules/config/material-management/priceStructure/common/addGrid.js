import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";
import customStyles from "../../../../selectCustomStyle";
import { toArray } from "lodash";
import shortid from "shortid";
import NewSelect from "./../../../../_helper/_select";

export default function AddGrid({ setRowDto, rowDto, pcDDL, row, setRow }) {
  const tableRef = useRef();
  const valueType = [
    { value: "amount", label: "Amount" },
    { value: "percent", label: "Percent" },
  ];

  const [bases, setBases] = useState([]);

  // Add Row Handler
  const addTrigger = () => {
    const td = {
      id: shortid(),
    };
    setRow([...row, td]);
  };

  // Delete Row Handler
  const deleteTrigger = () => {
    const table = tableRef.current;
    const rowLength = table.rows.length;
    if (rowLength >= 2) {
      const cloneRow = [...row];
      cloneRow.pop();
      setRow(cloneRow);
      const lastItem = toArray(rowDto).length;
      let cloneDto = rowDto;
      delete cloneDto[lastItem];
      setRowDto({ ...rowDto, ...cloneDto });
    }
  };

  // Node adjuster function
  const nodeAjuster = () => {
    const table = tableRef.current;
    const rowLength = table.rows.length;
    const addNode = (
      <div className="mt-2" onClick={() => addTrigger()}>
        <i
          style={{ fontSize: "15px", color: "black" }}
          className="fa pointer fa-plus-circle"
          aria-hidden="true"
        ></i>
      </div>
    );
    const fullNode = (
      <div className="d-flex justify-content-center mt-2">
        <span onClick={() => addTrigger()}>
          <i
            style={{ fontSize: "15px", color: "black" }}
            className="fa pointer fa-plus-circle"
            aria-hidden="true"
          ></i>
        </span>
        <span onClick={() => deleteTrigger()}>
          <i
            style={{ fontSize: "15px", color: "red" }}
            className="fa pointer fa-trash-alt ml-1"
            aria-hidden="true"
          ></i>
        </span>
      </div>
    );
    let lastRow = table.rows[table.rows.length - 1];
    let lastCell = lastRow.cells[lastRow.cells.length - 1];
    if (rowLength > 2) {
      ReactDOM.render(fullNode, lastCell);
    } else {
      ReactDOM.render(addNode, lastCell);
    }
  };

  //call nodeAjuster
  useEffect(() => {
    nodeAjuster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row]);

  // Get component type ddl from server
  // useEffect(() => {
  //   if (selectedBusinessUnit?.value && profileData?.accountId) {
  //     Axios.get(
  //       `/item/PriceComponent/GetPriceComponentDDL?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit.value}`
  //     )
  //       .then((res) => {
  //         const { status, data } = res;
  //         if (status === 200 && data) {
  //           let items = [];
  //           data.forEach((itm) => {
  //             let temp = {
  //               value: itm.priceComponentId,
  //               label: itm.priceComponentName,
  //               priceComponentTypeId: itm.priceComponentTypeId,
  //             };
  //             items.push(temp);
  //           });
  //           setPcDDL(items);
  //         }
  //       })
  //       .catch((err) => {
  //
  //       });
  //   }
  // }, [selectedBusinessUnit, profileData]);
  // function for onchange Component ddl
  // remove action handler from previos row
  useEffect(() => {
    setTimeout(() => {
      const table = tableRef.current;
      const rowLength = table.rows.length;
      if (rowLength > 2) {
        const firstRow = table.rows[rowLength - 2];
        const firstCell = firstRow.cells[firstRow.cells.length - 1];
        if (firstCell && firstRow) {
          ReactDOM.render(null, firstCell);
        }
      }
    }, 0);
  }, [row]);

  //Handle factor
  const handleFactor = async (sl, cid, ptid) => {
    const table = tableRef.current;
    const targetedRow = table.rows[sl];
    const cell = targetedRow.cells[5];
    // if (ptid == 6) {
    //   cell.innerHTML = "null";
    // } else {
    //   const {
    //     data: { factorName },
    //   } = await getFactor(cid);
    //   cell.innerHTML = factorName || "null";
    // }
    const {
      data: { factorName },
    } = await getFactor(cid);
    cell.innerHTML = factorName || "null";
  };

  //Get Factor from server with cid
  const getFactor = (cid) => {
    return Axios.get(
      `/item/PriceStructure/GetFactorbyComponentId?componentId=${cid}`
    );
  };

  // Set and get value in rowdto
  const rowDtoHandler = (name, value, sl) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
      },
    });
  };

  // Set bases on rowdto change
  useEffect(() => {
    const rowDtoArray = toArray(rowDto);
    if (rowDtoArray.length) {
      let tempBases = [];
      rowDtoArray.forEach((itm) => {
        let tempBase = {
          value: itm?.priceComponent?.value,
          label: itm?.priceComponent?.label,
        };
        tempBases.push(tempBase);
      });
      setBases(tempBases);
    }
  }, [rowDto]);

  return (
    <div
      className="table-responsive"
      style={{ minHeight: "500px", tableLayout: "fixed" }}
    >
      <table
        ref={tableRef}
        className="table  table-striped table-bordered mt-3 global-table"
      >
        <thead>
          <tr className="text-center">
            <th>SL</th>
            <th>Component</th>
            <th>Value Type</th>
            <th>Value</th>
            <th>Base</th>
            <th>Factor</th>
            <th>Sum Form</th>
            <th>Sum To</th>
            <th>is Manual</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {row.map((itm, idx) => {
            return (
              <tr key={idx} className="text-center">
                <td>{idx + 1}</td>
                <td>
                  <NewSelect
                    name="pcDDL"
                    options={pcDDL || []}
                    value={rowDto[idx]?.priceComponent}
                    onChange={(v) => {
                      if (idx === 0 && v?.priceComponentTypeId !== 1) {
                        alert("First component type must be price!");
                      } else {
                        rowDtoHandler("priceComponent", v, idx);
                        handleFactor(idx + 1, v.value, v.priceComponentTypeId);
                      }
                    }}
                    // placeholder="select.."
                  />
                </td>
                <td>
                  <NewSelect
                    name="valueType"
                    options={valueType || []}
                    value={
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                        ? { label: "", value: "" }
                        : rowDto[idx]?.valueType
                    }
                    onChange={(v) => rowDtoHandler("valueType", v, idx)}
                    // placeholder="select.."
                    isDisabled={
                      !idx ||
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                    }
                  />
                </td>
                <td>
                  <input
                    className="form-control-sm form-control-custom"
                    type={
                      rowDto[idx]?.priceComponent.label === "VAT"
                        ? "tel"
                        : "number"
                    }
                    min={rowDto[idx]?.priceComponent.label === "VAT" ? 0 : 1}
                    step={0.5}
                    pattern="\d*"
                    // max="10"
                    value={
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                        ? 0
                        : rowDto[idx]?.numValue
                    }
                    max={
                      rowDto[idx]?.valueType?.value === "percent"
                        ? 100
                        : 10000000
                    }
                    disabled={
                      !idx ||
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                    }
                    onChange={(e) => {
                      if (+e.target.value < 0)
                        return rowDtoHandler("numValue", "", idx);
                      rowDtoHandler("numValue", e.target.value, idx);
                    }}
                  />
                </td>
                <td>
                  <NewSelect
                    isDisabled={
                      !bases.length ||
                      !idx ||
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                    }
                    options={bases || []}
                    value={rowDto[idx]?.baseComponent}
                    onChange={(v) => rowDtoHandler("baseComponent", v, idx)}
                    // placeholder="select.."
                  />
                </td>
                <td>null</td>
                <td>
                  <NewSelect
                    isDisabled={
                      !idx ||
                      rowDto[idx]?.priceComponent?.priceComponentTypeId !== 6
                    }
                    styles={customStyles}
                    options={Array.from({ length: idx }, (v, k) => {
                      return { label: k + 1, value: k + 1 };
                    })}
                    value={rowDto[idx]?.sumFromSerial}
                    onChange={(v) => rowDtoHandler("sumFromSerial", v, idx)}
                    // placeholder="select.."
                  />
                </td>
                <td>
                  <NewSelect
                    // placeholder="select.."
                    isDisabled={
                      !idx ||
                      rowDto[idx]?.priceComponent?.priceComponentTypeId !== 6
                    }
                    styles={customStyles}
                    value={rowDto[idx]?.sumToSerial}
                    options={
                      idx
                        ? Array.from({ length: idx }, (v, k) => {
                            return { label: k + 1, value: k + 1 };
                          })
                        : []
                    }
                    onChange={(v) => rowDtoHandler("sumToSerial", v, idx)}
                  />
                </td>
                <td>
                  <input
                    className="pointer"
                    type="checkbox"
                    name="isManual"
                    id="isManual"
                    disabled={
                      rowDto[idx]?.priceComponent?.priceComponentTypeId === 6
                    }
                    value={rowDto[idx]?.isMannual}
                    defaultChecked={!idx}
                    style={{
                      marginTop: "8px",
                    }}
                    onChange={(e) =>
                      rowDtoHandler("isManual", e.target.checked, idx)
                    }
                  />
                </td>
                <td className="text-center">....</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
