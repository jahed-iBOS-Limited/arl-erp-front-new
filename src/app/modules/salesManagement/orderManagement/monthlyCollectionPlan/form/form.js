import { Form, Formik } from "formik";
import React from "react";
// import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getEmployeeRAT,
  getMonthlyCollectionPlanData,
  weekList,
} from "../helper";

export default function _Form({
  type,
  buId,
  accId,
  title,
  history,
  rowData,
  initData,
  allSelect,
  setLoading,
  selectedAll,
  saveHandler,
  setRowData,
  rowDataHandler,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values, errors, touched, setFieldValue }) => (
          <>
            <ICustomCard
              title={title}
              backHandler={() => {
                history.goBack();
              }}
              resetHandler={() => {
                resetForm();
              }}
              saveHandler={() => {
                saveHandler(values, () => {
                  resetForm();
                  setRowData([]);
                });
              }}
            >
              <Form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  <div className="col-lg-3">
                    <NewSelect
                      name="salesman"
                      options={[]}
                      value={values?.salesman}
                      label="Salesman Name"
                      onChange={(e) => {}}
                      placeholder="Salesman Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="designation"
                      options={[]}
                      value={values?.designation}
                      label="Designation"
                      onChange={(e) => {}}
                      placeholder="Designation"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <YearMonthForm obj={{ values, setFieldValue, setRowData }} />
                  {/* <RATForm obj={{ values, setFieldValue }} /> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      value={values?.area}
                      label="Area"
                      placeholder="Area"
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      value={values?.territory}
                      label="Territory"
                      placeholder="Territory"
                      isDisabled={true}
                    />
                  </div>
                  <IButton
                    onClick={() => {
                      getEmployeeRAT(
                        values?.salesman?.value,
                        setLoading,
                        (RAT) => {
                          getMonthlyCollectionPlanData(
                            1,
                            accId,
                            buId,
                            values?.salesman?.value,
                            setRowData,
                            setLoading,
                            RAT
                          );
                          setFieldValue("area", {
                            value: RAT?.areaId,
                            label: RAT?.areaName,
                          });
                          setFieldValue("territory", {
                            value: RAT?.territoryId,
                            label: RAT?.territoryName,
                          });
                        }
                      );
                    }}
                    disabled={!values?.month}
                  />
                </div>
              </Form>

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
                        rowSpan={2}
                      >
                        <input
                          type="checkbox"
                          value={selectedAll()}
                          checked={selectedAll()}
                          onChange={() => {}}
                        />
                      </th>
                      <th rowSpan={2}>SL</th>
                      <th rowSpan={2}>Client ID</th>
                      <th rowSpan={2}>Client Name</th>
                      <th rowSpan={2}>Area</th>
                      <th rowSpan={2}>Territory</th>
                      <th rowSpan={2}>Total Dues</th>
                      <th rowSpan={2}>Overdue</th>
                      <th rowSpan={2}>OD %</th>
                      <th colSpan={6}>Collection Plan</th>
                    </tr>
                    <tr>
                      {values?.month &&
                        weekList(values?.month?.value)?.map((item, i) => {
                          return (
                            <th style={{ width: "120px" }} key={i}>
                              {item}
                            </th>
                          );
                        })}
                      <th>Total</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => {
                      return (
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

                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.intBusinessPartnerId}</td>
                          <td>{item?.strBusinessPartnerName}</td>
                          <td>{item?.area}</td>
                          <td>{item?.territory}</td>
                          <td className="text-right">{item?.dueAmount}</td>
                          <td className="text-right">{item?.overDue}</td>
                          <td className="text-right" style={{ width: "60px" }}>
                            {item?.od || 0}
                          </td>
                          <td>
                            <InputField
                              value={item?.week1}
                              name="week1"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week1",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week2}
                              name="week2"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week2",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week3}
                              name="week3"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week3",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week4}
                              name="week4"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week4",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td className="text-right" style={{ width: "90px" }}>
                            {item?.total}
                          </td>
                          <td className="text-right" style={{ width: "60px" }}>
                            {item?.percent}
                          </td>
                        </tr>
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
