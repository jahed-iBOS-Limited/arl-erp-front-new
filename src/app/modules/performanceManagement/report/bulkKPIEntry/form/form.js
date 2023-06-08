/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";

export default function _Form({
  soDDL,
  rowData,
  initData,
  tempRows,
  allSelect,
  setRowData,
  selectedAll,
  saveHandler,
  employeeList,
  getPendingKPI,
  rowDataHandler,
}) {
  const history = useHistory();
  const paginationSearchHandler = (v) => {
    if (!v) {
      setRowData(tempRows);
    } else {
      const value = v?.toString();
      setRowData(
        tempRows?.filter(
          (item) =>
            item?.intEmployeeId?.toString()?.substring(0, value?.length) ===
            value
        )
      );
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={{}}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <ICustomCard
              title={"Bulk KPI Entry"}
              backHandler={() => history.goBack()}
              resetHandler={() => {
                resetForm(initData);
              }}
              saveHandler={() => handleSubmit()}
              saveDisabled={
                rowData?.filter((item) => item?.isSelected)?.length < 1
              }
            >
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="SO"
                        options={soDDL || []}
                        value={values?.SO}
                        label="Sales Organization"
                        onChange={(e) => {
                          setFieldValue("SO", e);
                        }}
                        placeholder="Sales Organization"
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                    <RATForm
                      obj={{ values, setFieldValue, territory: false }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="employee"
                        options={[{ value: 0, label: "All" }, ...employeeList]}
                        value={values?.employee}
                        label="Employee Name"
                        onChange={(e) => {
                          setFieldValue("employee", e);
                        }}
                        placeholder="Employee Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
                    <IButton
                      onClick={() => {
                        getPendingKPI(values);
                      }}
                      disabled={
                        !values?.SO || !values?.area || !values?.employee
                      }
                    />
                  </div>
                </div>
              </Form>
              <div className="col-lg-3 mt-3">
                <PaginationSearch
                  placeholder="Search by Enroll"
                  paginationSearchHandler={paginationSearchHandler}
                />
              </div>
              {rowData?.length > 0 && (
                <table
                  id="table-to-xlsx"
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
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

                      {[
                        "SL",
                        "Employee Name",
                        "Enroll",
                        "Department",
                        "Designation",
                        "BSC Perspective",
                        "KPI Master Name",
                        "KPI Master Code",
                        "Month",
                        "Target",
                        "Achievement",
                      ]?.map((th, index) => {
                        return <th key={index}> {th} </th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  index,
                                  !item.isSelected
                                );
                              }}
                              className="text-center"
                              style={
                                item?.isSelected
                                  ? {
                                      backgroundColor: "#aacae3",
                                      width: "30px",
                                    }
                                  : { width: "30px" }
                              }
                            >
                              <input
                                type="checkbox"
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            </td>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.strEmployeeName}</td>
                            <td>{item?.intEmployeeId}</td>
                            <td>{item?.strDepartment}</td>
                            <td>{item?.strDesignation}</td>
                            <td>{item?.strBscPerspectiveName}</td>
                            <td>{item?.strKpiMasterName}</td>
                            <td>{item?.strKpiMasterCode}</td>
                            <td>{item?.strMonthName}</td>
                            <td className="text-right">{item?.numTarget}</td>
                            <td className="text-right">
                              {
                                <InputField
                                  name="numAchivement"
                                  value={item?.numAchivement}
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "numAchivement",
                                      index,
                                      e?.target?.value
                                    );
                                  }}
                                />
                              }
                            </td>
                          </tr>
                          {item?.intEmployeeId !==
                            rowData[index + 1]?.intEmployeeId &&
                            rowData?.length - 1 !== index && (
                              <tr
                                style={{
                                  height: "5px",
                                }}
                              >
                                <td
                                  colSpan={12}
                                  style={{
                                    backgroundColor: "rgb(141 143 145)",
                                  }}
                                ></td>
                              </tr>
                            )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
