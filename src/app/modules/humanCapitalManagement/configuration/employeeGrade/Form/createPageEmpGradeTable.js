import React from "react";

import ICustomTable from "../../../../_helper/_customTable";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Select from "react-select";
import customStyles from "./../../../../selectCustomStyle";

const headers = ["SL", "Grade Code", "Employee Grade", "Base Grade", "Action"];

const TBody = ({ rowData, removeHandler, changeDDL, isEdit, setRowData }) => {
  const baseGradeHandler = (value, index) => {
    const data = [...rowData];

    data[index].baseGrade = value;

    setRowData([...data]);
    console.log(data);
  };

  const generateOptions = (index) => {
    let options = [];

    if (index > 1) {
      for (let i = 0; i < index; i++) {
        let option = {
          value: rowData[i].employeeGrade,
          label: rowData[i].employeeGrade,
        };
        options.push(option);
      }
    }
    console.log("Please", options);
    return options;
  };

  return (
    <>
      {rowData?.length > 0 &&
        rowData?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{item?.code}</td>
              <td style={{ textAlign: "center" }}>{item?.employeeGrade}</td>
              {index > 1 ? (
                <div>
                  <Select
                    onChange={(valueOption) =>
                      baseGradeHandler(valueOption, index)
                    }
                    options={generateOptions(index) || []}
                    value={item?.baseGrade}
                    isSearchable={true}
                    name="baseGrade"
                    styles={customStyles}
                    placeholder="Select one"
                  />
                </div>
              ) : (
                <td>
                  <span> {item?.baseGrade?.label} </span>
                </td>
              )}

              <td style={{ textAlign: "center" }}>
                <span onClick={(e) => removeHandler(index)}>
                  <IDelete />
                </span>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export default function({ rowData, removeHandler, changeDDL, setRowData }) {
  return (
    <ICustomTable
      ths={headers}
      children={
        <TBody
          rowData={rowData}
          removeHandler={removeHandler}
          changeDDL={changeDDL}
          setRowData={setRowData}
        />
      }
    />
  );
}
