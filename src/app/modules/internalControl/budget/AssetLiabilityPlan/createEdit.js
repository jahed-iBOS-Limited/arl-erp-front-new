import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import { toast } from "react-toastify";
import NewSelect from "../../../_helper/_select";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fiscalYear: "",
};

export default function AssetLiabilityPlanCreateEdit() {
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const [, getInventoryData, inventoryDataLoader] = useAxiosGet();

  const [, saveData, saveDataLoader] = useAxiosPost();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {
    if (tableData?.length && tableData[0].msg !== "already exists") {
      const payload = tableData.map((item) => {
        return {
          ...item,
          yearId: values?.fiscalYear?.value,
          yearName: values?.fiscalYear?.label,
          partName: "Create",
          actionBy: profileData?.userId,
        };
      });
      saveData(
        `/fino/BudgetFinancial/CreateAssetLiabilityPlan`,
        payload,
        () => {
          setTableData([]);
        },
        true
      );
    } else {
      return toast.warn("No data to save");
    }
  };

  useEffect(() => {
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillPersentageValueInRow = (PercentageValue, index, initialAmount) => {
    const updatedData = [...tableData];
    let updatedValue = initialAmount;
    const monthsToUpdate = [
      "julAmount",
      "augAmount",
      "sepAmount",
      "octAmount",
      "novAmount",
      "decAmount",
      "janAmount",
      "febAmount",
      "marAmount",
      "aprAmount",
      "mayAmount",
      "junAmount",
    ];
    for (const month of monthsToUpdate) {
      updatedValue += updatedValue * (PercentageValue / 100);
      updatedValue = parseFloat(updatedValue.toFixed(2));
      updatedData[index][month] = updatedValue;
    }
    setTableData(updatedData);
  };

  const calculatePercentageValues = (item) => {
    if (item.entryType === "Percentage") {
      const updatedValue = item.initialAmount;
      let currentValue = updatedValue;

      const monthsToUpdate = [
        "julAmount",
        "augAmount",
        "sepAmount",
        "octAmount",
        "novAmount",
        "decAmount",
        "janAmount",
        "febAmount",
        "marAmount",
        "aprAmount",
        "mayAmount",
        "junAmount",
      ];

      for (const month of monthsToUpdate) {
        currentValue += currentValue * (item.entryTypeValue / 100);
        currentValue = parseFloat(currentValue.toFixed(2));
        item[month] = currentValue;
      }
    }
    return item; // Return the modified item
  };

  const onViewButtonClick = (values) => {
    getTableData(
      `/fino/BudgetFinancial/GetAssetLiabilityPlan?partName=GetForCreate&businessUnitId=${selectedBusinessUnit?.value}&yearId=${values?.fiscalYear?.value}&monthId=0&autoId=0&glId=0`,
      (data) => {
        const updatedData = data?.map((item) => ({
          ...item,
          fillAllManual: item?.initialAmount,
          julAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.julAmount,
          augAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.augAmount,
          sepAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.sepAmount,
          octAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.octAmount,
          novAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.novAmount,
          decAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.decAmount,
          janAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.janAmount,
          febAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.febAmount,
          marAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.marAmount,
          aprAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.marAmount,
          mayAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.mayAmount,
          junAmount:
            item?.entryType === "Manual"
              ? item?.initialAmount
              : item?.junAmount,
        }));
        const updatedDataWithPercentage = updatedData?.map(
          calculatePercentageValues
        );
        data[0]?.msg !== "already exists" &&
          getInventoryData(
            `/mes/SalesPlanning/GetGlWiseMaterialBalance?unitId=${
              selectedBusinessUnit?.value
            }&dteFromDate=${_todayDate()}`,
            (invData) => {
              const updatedDataWithInventory = updatedDataWithPercentage?.map(
                (item) => {
                  const invDataItem = invData?.find(
                    (invItem) => invItem?.intGeneralLedgerId === item?.glId
                  );
                  if (invDataItem) {
                    return {
                      ...item,
                      julAmount: invDataItem?.julAmount.toFixed(2),
                      augAmount: invDataItem?.augAmount.toFixed(2),
                      sepAmount: invDataItem?.sepAmount.toFixed(2),
                      octAmount: invDataItem?.octAmount.toFixed(2),
                      novAmount: invDataItem?.novAmount.toFixed(2),
                      decAmount: invDataItem?.decAmount.toFixed(2),
                      janAmount: invDataItem?.janAmount.toFixed(2),
                      febAmount: invDataItem?.febAmount.toFixed(2),
                      marAmount: invDataItem?.marAmount.toFixed(2),
                      aprAmount: invDataItem?.aprAmount.toFixed(2),
                      mayAmount: invDataItem?.mayAmount.toFixed(2),
                      junAmount: invDataItem?.junAmount.toFixed(2),
                    };
                  } else {
                    return item;
                  }
                }
              );
              setTableData(updatedDataWithInventory);
            }
          );
      }
    );
  };

  const getUpdatedRowObjectForManual = (data, newValue) => {
    return {
      ...data,
      fillAllManual: newValue,
      julAmount: newValue,
      augAmount: newValue,
      sepAmount: newValue,
      octAmount: newValue,
      novAmount: newValue,
      decAmount: newValue,
      janAmount: newValue,
      febAmount: newValue,
      marAmount: newValue,
      aprAmount: newValue,
      mayAmount: newValue,
      junAmount: newValue,
    };
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(tableDataLoader ||
            fiscalYearDDLloader ||
            saveDataLoader ||
            inventoryDataLoader) && <Loading />}
          <IForm
            title={"Asset Liability Plan Create"}
            getProps={setObjprops}
            isHiddenReset={true}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="fiscalYear"
                    options={fiscalYearDDL || []}
                    value={values?.fiscalYear}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("fiscalYear", valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    style={{
                      marginTop: "3px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => onViewButtonClick(values)}
                    disabled={!values?.fiscalYear}
                  >
                    View
                  </button>
                </div>
              </div>

              {values?.fiscalYear?.value &&
              tableData.length &&
              tableData[0].msg === "already exists" ? (
                <div className="text-center mt-5">
                  <p>{tableData[0].msg}</p>
                </div>
              ) : (
                <div className="common-scrollable-table two-column-sticky mt-2">
                  <div
                    style={{ maxHeight: "500px" }}
                    className="scroll-table _table"
                  >
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "60px" }}>SL</th>
                          <th style={{ minWidth: "200px" }}>GL Name</th>
                          <th style={{ minWidth: "100px" }}>GL Class</th>
                          <th style={{ minWidth: "80px" }}>GL Type</th>
                          <th style={{ minWidth: "140px" }}>Value</th>
                          <th style={{ minWidth: "140px" }}>July</th>
                          <th style={{ minWidth: "140px" }}>August</th>
                          <th style={{ minWidth: "140px" }}>September</th>
                          <th style={{ minWidth: "140px" }}>October</th>
                          <th style={{ minWidth: "140px" }}>November</th>
                          <th style={{ minWidth: "140px" }}>December</th>
                          <th style={{ minWidth: "140px" }}>January</th>
                          <th style={{ minWidth: "140px" }}>February</th>
                          <th style={{ minWidth: "140px" }}>March</th>
                          <th style={{ minWidth: "140px" }}>April</th>
                          <th style={{ minWidth: "140px" }}>May</th>
                          <th style={{ minWidth: "140px" }}>June</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 &&
                          tableData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.glName}</td>
                              <td>{item?.glClassName}</td>
                              <td>{item?.entryType}</td>
                              <td>
                                {item?.entryType === "Percentage" ? (
                                  <InputField
                                    value={item?.entryTypeValue}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].entryTypeValue = +e
                                          .target.value;
                                        setTableData(updatedData);
                                        fillPersentageValueInRow(
                                          +e.target.value,
                                          index,
                                          item?.initialAmount
                                        );
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].entryTypeValue = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : item?.entryType === "Inventory" ? (
                                  <span className="text-center pointer"></span>
                                ) : (
                                  <InputField
                                    value={item?.fillAllManual}
                                    type="text"
                                    name="fillAllManual"
                                    onChange={(e) => {
                                      const newValue = +e.target.value;
                                      if (newValue >= 0) {
                                        const updatedData = tableData.map(
                                          (data, idx) =>
                                            idx === index
                                              ? getUpdatedRowObjectForManual(
                                                  data,
                                                  newValue
                                                )
                                              : data
                                        );
                                        setTableData(updatedData);
                                      }
                                    }}
                                  />
                                )}
                              </td>
                              <td>
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.julAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].julAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].julAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.julAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.augAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.augAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].augAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].augAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.augAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.sepAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.sepAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].sepAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].sepAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.sepAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.octAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.octAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].octAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].octAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.octAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.novAmount} */}

                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.novAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].novAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].novAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.novAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.decAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.decAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].decAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].decAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.decAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.janAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.janAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].janAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].janAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.janAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.febAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.febAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].febAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].febAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.febAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.marAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.marAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].marAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].marAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.marAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.aprAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.aprAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].aprAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].aprAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.aprAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.mayAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.mayAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].mayAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].mayAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.mayAmount
                                )}
                              </td>
                              <td>
                                {/* {item?.junAmount} */}
                                {item?.entryType === "Manual" ? (
                                  <InputField
                                    value={item?.junAmount}
                                    type="text"
                                    name="entryTypeValue"
                                    onChange={(e) => {
                                      if (+e.target.value >= 0) {
                                        const updatedData = [...tableData];
                                        updatedData[index].junAmount = +e.target
                                          .value;
                                        setTableData(updatedData);
                                      } else {
                                        const updatedData = [...tableData];
                                        updatedData[index].junAmount = 0;
                                        setTableData(updatedData);
                                        return toast.warn(
                                          "Value must be greater than 0"
                                        );
                                      }
                                    }}
                                  />
                                ) : (
                                  item?.junAmount
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
