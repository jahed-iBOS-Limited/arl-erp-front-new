/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import customStyles from "./../../../../../../selectCustomStyle";
import { getBenifitsAndAllowancesDDL } from "./helper";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";

function OtherAllowances({
  rowData,
  setRowData,
  netPayable,
  setNetPayable,
  basicSalery,
  accountId,
  allowanceTotal,
  setAllowanceTotal,
}) {
  const [DDL, setDDL] = useState([]);

  useEffect(() => {
    getBenifitsAndAllowancesDDL(accountId, setDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({
    component: "",
    amount: "",
  });

  useEffect(() => {
    let totalAmount = +formData?.amount;
    for (let i = 0; i < rowData?.length > 0; i++) {
      totalAmount = +totalAmount + +rowData[i].amount;
    }
    setAllowanceTotal(totalAmount);
  }, [rowData]);

  const addHandler = () => {
    // Check Duplicate
    let foundData = rowData.filter(
      (item) => item?.component?.value === formData?.component.value
    );

    if (foundData.length > 0) {
      toast.warning("Component Already Exists");
    } else {
      setRowData([
        ...rowData,
        {
          component: formData?.component,
          amount: formData?.amount,
          total: formData?.amount,
          parsentage: (100 * +formData?.amount) / +basicSalery,
        },
      ]);
      setNetPayable(+netPayable + Number(formData?.amount));
      setFormData({ component: "", amount: "" });
    }
  };

  const removeHandler = (index) => {
    let amount = Number(rowData[index]?.amount);
    setNetPayable(+netPayable + amount);
    let newRowData = rowData.filter((item, i) => index !== i);
    setRowData(newRowData);
  };

  return (
    <>
      <div className="global-form w-100">
        <h4>{"Benefits & Allowances"}</h4>
        <div className="row w-100">
          <div className="col-lg-3">
            <label> Component </label>
            <Select
              options={DDL}
              value={formData?.component}
              isSearchable={true}
              name="component"
              styles={customStyles}
              placeholder="Component"
              onChange={(valueOption) => {
                setFormData({
                  ...formData,
                  component: {
                    value: valueOption?.value,
                    label: valueOption?.label,
                    code: valueOption?.code,
                  },
                });
              }}
            />
          </div>
          <div className="col-lg-3">
            <label>Amount</label>
            <input
              value={formData?.amount}
              name="amount"
              min="0"
              placeholder="Amount"
              type="number"
              className="form-control"
              onChange={(e) => {
                if (e.target.value >= 0) {
                  setFormData({ ...formData, amount: e.target.value });
                }
              }}
            />
          </div>
          <div className="col-lg-3" style={{ marginTop: "15px" }}>
            <ButtonStyleOne
              disabled={!formData?.component || !formData?.amount}
              type="button"
              onClick={() => addHandler()}
              className="btn btn-primary"
              label="Add"
            />
          </div>
        </div>
      </div>
      <div className="w-100">
        <table className="global-table w-100 table-bordered border-secondary">
          <thead>
            <tr>
              <th className="text-center">SL</th>
              <th className="text-center">Component</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData &&
              rowData.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="pl-2">{item?.component?.label}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.amount}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span onClick={(e) => removeHandler(index)}>
                          <IDelete />
                        </span>
                      </td>
                    </tr>
                  </>
                );
              })}
            <tr>
              <td></td>
              <td></td>
              <td>Total :{allowanceTotal}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OtherAllowances;
