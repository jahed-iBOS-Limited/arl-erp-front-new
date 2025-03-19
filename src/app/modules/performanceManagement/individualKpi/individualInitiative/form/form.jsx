import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { toast } from "react-toastify";
import { getObjectiveDDLAction, getStrategicDataAction } from "../helper";
import InputField from "../../../../_helper/_inputField";
import ICustomTable from "../../../../_helper/_customTable";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { actionPlanSaveAction } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  individualEmpDDL,
  year,
  bscDDL,
  rowDto,
  setRowDto,
  handleDelete,
  setDisabled,
  isDisabled,
  currentItem,
  setCurrentItem,
  currentIndex,
  setCurrentIndex
}) {
  const [objectiveDDL, setObjectiveDDL] = useState([]);

  const nextHandler = () => {
    if (rowDto?.kpiWithActivityList[currentIndex + 1]?.kpiName) {
      setCurrentIndex(currentIndex + 1);
      let data = {...rowDto?.kpiWithActivityList[currentIndex + 1]}
      setCurrentItem(data);
    } else {
      toast.warn("Next data not found");
    }
  };

  const prevHandler = () => {
    if (rowDto?.kpiWithActivityList[currentIndex - 1]?.kpiName) {
      setCurrentIndex(currentIndex - 1);
      let data = {...rowDto?.kpiWithActivityList[currentIndex - 1]}
      setCurrentItem(data);
    } else {
      toast.warn("Previous data not found");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg">
                  <NewSelect
                    label="Select Employee"
                    placeholder="Select Employee"
                    name="employee"
                    options={individualEmpDDL}
                    value={values?.employee}
                    onChange={(valueOption) => {
                      setFieldValue("objective", "");
                      setFieldValue("employee", valueOption);
                      if (values?.bsc?.value && values?.year?.value) {
                        getObjectiveDDLAction(
                          valueOption?.value,
                          values?.bsc?.value,
                          values?.year?.value,
                          setObjectiveDDL
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    label="Select Year"
                    placeholder="Select Year"
                    name="year"
                    options={year}
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("objective", "");
                      setFieldValue("year", valueOption);
                      getObjectiveDDLAction(
                        values?.employee?.value,
                        values?.bsc?.value,
                        valueOption?.value,
                        setObjectiveDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg">
                  <NewSelect
                    label="Select BSC"
                    placeholder="Select BSC"
                    name="bsc"
                    options={bscDDL}
                    value={values?.bsc}
                    onChange={(valueOption) => {
                      setFieldValue("objective", "");
                      setFieldValue("bsc", valueOption);
                      if (values?.employee?.value && values?.year?.value) {
                        getObjectiveDDLAction(
                          values?.employee?.value,
                          valueOption?.value,
                          values?.year?.value,
                          setObjectiveDDL
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                
                <div className="col-lg">
                  <NewSelect
                    label="Select Objective"
                    placeholder="Select Objective"
                    name="objective"
                    options={objectiveDDL}
                    value={values?.objective}
                    isDisabled={
                      !values?.bsc || !values?.year || !values?.employee
                    }
                    onChange={(valueOption) => {
                      setFieldValue("objective", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg" style={{ marginTop: "19px" }}>
                  <button
                    onClick={() => {
                      if (
                        !values?.employee ||
                        !values?.bsc ||
                        !values?.objective ||
                        !values?.year
                      ) {
                        return toast.warn("Please select all fields");
                      }
                      getStrategicDataAction(
                        values?.employee?.value,
                        values?.bsc?.value,
                        values?.year?.value,
                        values?.objective?.value,
                        setDisabled,
                        setRowDto,
                        setCurrentItem
                      );
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>

              {rowDto?.objectiveName && (
                <>
                  <div>
                    <h2
                      className="text-center"
                      style={{
                        background: "#FFD966",
                        marginTop: "10px",
                        padding: "5px",
                      }}
                    >
                      Action Plan
                    </h2>
                  </div>
                  <div
                    style={{
                      padding: "10px 0px 10px 2px",
                      borderBottom: "2px solid #DDE3E8",
                    }}
                    className="d-flex"
                  >
                    <h4>Objective: {rowDto?.objectiveName} </h4>
                    <button
                      style={{ marginLeft: "auto" }}
                      className="btn btn-primary"
                      disabled={isDisabled}
                      onClick={(e) => {
                        if (currentItem?.activityList?.length < 1) {
                          return toast.warn("Please add row");
                        }
                        actionPlanSaveAction(currentItem);
                      }}
                    >
                      Save
                    </button>
                  </div>
                  <div
                    style={{
                      padding: "10px 0px 10px 2px",
                      borderBottom: "2px solid #DDE3E8",
                    }}
                    className="d-flex align-items-center"
                  >
                    <h3>KPI: {currentItem?.kpiName}</h3>
                    <div style={{ marginLeft: "auto" }}>
                      <h4>
                        {currentIndex + 1} /{" "}
                        {rowDto?.kpiWithActivityList?.length}
                      </h4>
                      <i
                        onClick={() => prevHandler()}
                        style={{ fontSize: "25px" }}
                        className="fas fa-arrow-circle-left mr-1 pointer"
                      ></i>
                      <i
                        onClick={() => nextHandler()}
                        style={{ fontSize: "25px" }}
                        className="fas fa-arrow-circle-right pointer"
                      ></i>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-lg-7">
                      <h4>Current Result: {currentItem?.target}</h4>
                    </div>
                    <div className="col-lg-5">
                      <h4>Desired Outcome: {currentItem?.achievement}</h4>
                    </div>
                  </div>
                  <div className="form-group row global-form">
                    <div className="col-lg-3">
                      <InputField
                        label="Task"
                        placeholder="Task"
                        name="task"
                        type="text"
                        value={values?.task}
                        onChange={(e) => {
                          setFieldValue("task", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Start Date"
                        placeholder=""
                        name="fromDate"
                        type="date"
                        value={values?.fromDate}
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="End Date"
                        placeholder=""
                        name="toDate"
                        type="date"
                        value={values?.toDate}
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div style={{ marginTop: "17px" }}>
                      <ButtonStyleOne
                        style={{ fontSize: "12px" }}
                        disabled={
                          !values?.task || !values?.fromDate || !values?.toDate
                        }
                        label="Add"
                        type="button"
                        onClick={() => {
                          const data = [...currentItem?.activityList];
                          let obj = {
                            kpiActivityId: 0,
                            kpiActivityName: values?.task,
                            startDate: values?.fromDate,
                            endDate: values?.toDate,
                          };

                          // update rowDto
                          data.push(obj);
                          let rowData = { ...rowDto };
                          rowData.kpiWithActivityList[currentIndex].activityList.push(obj)
                          setRowDto(rowData);

                          // update current item
                          setCurrentItem({
                            ...currentItem,
                            activityList: data,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    {console.log("Task", values?.task)}
                    <ICustomTable
                      ths={[
                        "SL",
                        "Task Name",
                        "Start Date",
                        "End Date",
                        "Action",
                      ]}
                    >
                      {currentItem?.activityList?.length > 0 &&
                        currentItem?.activityList?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ width: "8px" }}>{index + 1}</td>
                              <td
                                style={{ width: "30px" }}
                                className="text-left"
                              >
                                {item?.kpiActivityName}
                              </td>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {_dateFormatter(item?.startDate)}
                              </td>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {_dateFormatter(item?.endDate)}
                              </td>
                              <td
                                style={{ width: "20px" }}
                                className="text-center"
                              >
                                <IDelete
                                  id={index}
                                  remover={(id) => {
                                    handleDelete(id);
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </ICustomTable>
                  </div>
                </>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
