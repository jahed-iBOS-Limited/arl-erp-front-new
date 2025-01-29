import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../../chartering/_chartinghelper/images/print-icon.png";
import LayTimeTableBody from "./layTimeTableBody";
import PrintHeader from "./printHeader";

export default function PrintView({
  id,
  rowData,
  values,
  setRowData,
  singleData,
  errors,
  touched,
}) {
  const print = useRef();
  return (
    <div>
      <ReactToPrint
        pageStyle={
          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
        }
        trigger={() => (
          <button type="button" className={"btn btn-primary px-3 py-2 my-4"}>
            <img
              style={{ width: "25px", paddingRight: "5px" }}
              src={printIcon}
              alt="print-icon"
            />
            Print
          </button>
        )}
        content={() => print.current}
      />
      <div ref={print} style={{ padding: "20px" }}>
        <PrintHeader singleData={{ ...singleData, id: id }} />
        <LayTimeTableBody
          rowData={rowData}
          setRowData={setRowData}
          values={values}
          hideDeleteBtn={true}
          errors={errors}
          touched={touched}
        />
      </div>
    </div>
  );
}
