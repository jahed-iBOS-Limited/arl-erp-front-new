import React, { useCallback, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { processHandler, getGridData } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  workPlaceDDL,
  monthDDL,
  yearDDL,
  statusDDL,
}) {
  const [gridData, setGridData] = useState([]);
  const [allSelect, setAllSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...gridData];
    newRowDto[index].isSelect = value;
    setGridData(newRowDto);
  };

  const setAllDataChecked = (checked) => {
    let newData = gridData.map((item) => ({ ...item, isSelect: checked }));
    setGridData(newData);
  };

  let tempOtShiftName = null;

  const shiftNameRowHandler = (data) => {
    tempOtShiftName = data.strRequestedOtShiftName;
    return (
      <tr style={{ background: "#61AFFE" }}>
        <td></td>
        <td colspan="11" style={{ color: "#fff" }}>
          <div style={{ fontWeight: "bold" }} className="pl-2">
            {data?.strRequestedOtShiftName}
          </div>
        </td>
      </tr>
    );
  };

  const checkedData = useCallback(
    gridData.filter((item) => item.isSelect),
    [gridData]
  );

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
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <NewSelect
                    label="Work Place"
                    placeholder="Work Place"
                    name="workPlace "
                    options={workPlaceDDL}
                    value={values?.workPlace}
                    onChange={(valueOption) => {
                      setFieldValue("workPlace", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Month"
                    placeholder="Month"
                    name="month"
                    options={monthDDL}
                    value={values?.month}
                    onChange={(valueOption) => {
                      setFieldValue("month", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Year "
                    placeholder="Year"
                    name="year"
                    options={yearDDL}
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Status "
                    placeholder="Status"
                    name="status"
                    options={statusDDL}
                    value={values?.status}
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div style={{ marginTop: "14px" }} className="col-lg d-flex">
                  <button
                    className="btn btn-primary mr-5"
                    onClick={() => {
                      getGridData(
                        selectedBusinessUnit?.value,
                        values?.workPlace?.value,
                        values?.month?.value,
                        values?.year?.value,
                        values?.status?.value,
                        setGridData,
                        setLoading
                      );
                    }}
                    disabled={!values?.workPlace}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={checkedData.length < 1}
                    onClick={() => {
                      processHandler(gridData, setLoading, profileData?.userId);
                    }}
                  >
                    Process
                  </button>
                </div>
              </div>

              <div
                style={{ marginTop: "20px" }}
                className="loan-scrollable-table employee-overall-status"
              >
                <div
                  style={{ maxHeight: "500px" }}
                  className="scroll-table _table"
                >
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {gridData.length > 0 && (
                          <th style={{ minWidth: "20px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                setAllSelect(event.target.checked);
                                setAllDataChecked(event.target.checked);
                              }}
                              checked={allSelect}
                            />
                          </th>
                        )}
                        <th style={{ minWidth: "70px" }}>SL</th>
                        <th style={{ minWidth: "70px" }}>Shift</th>
                        <th style={{ minWidth: "70px" }}>Employee Id</th>
                        <th style={{ minWidth: "70px" }}>ERP Emp. Id</th>
                        <th style={{ minWidth: "100px" }}>Employee Code</th>
                        <th style={{ minWidth: "100px" }}>Employee Name</th>
                        <th style={{ minWidth: "130px" }}>Department</th>
                        <th style={{ minWidth: "150px" }}>Designation</th>
                        <th style={{ minWidth: "90px" }}>Date</th>
                        <th style={{ minWidth: "80px" }}>In Time</th>
                        <th style={{ minWidth: "80px" }}>Out Time</th>
                        <th style={{ minWidth: "130px" }}>
                          Target Working Hour
                        </th>
                        <th style={{ minWidth: "130px" }}>
                          Actual Working Hour
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((data, index) => {
                        return (
                          <>
                            {tempOtShiftName !== data?.strRequestedOtShiftName &&
                              shiftNameRowHandler(data)}
                            <tr key={index}>
                              <td style={{ marginTop: "2px" }}>
                                <input
                                  id="isSelect"
                                  type="checkbox"
                                  checked={data?.isSelect}
                                  onChange={(e) => {
                                    singleCheckBoxHandler(
                                      e.target.checked,
                                      index
                                    );
                                  }}
                                />
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {index + 1}
                              </td>
                              <td style={{ textAlign: "center" }}>{data?.strCurrentShiftName}</td>
                              <td style={{ textAlign: "center" }}>
                                {data?.intEmployeeId}
                              </td>
                              <td  style={{textAlign:"center"}}>{data?.erpemployeeId}</td>
                              <td style={{ textAlign: "center" }}>
                                {data?.strEmployeeCode}
                              </td>
                              <td>{data?.strEmployeeName}</td>

                              <td>{data?.strCurrentDepartmentName}</td>
                              <td>{data?.strCurrentDesignationName}</td>
                              <td style={{ textAlign: "center" }}>
                                {_dateFormatter(data?.dteRequestedDate)}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {data?.strInTime}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {data?.strOutTime}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {data?.strHoursMinute}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {data?.workingHour}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

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
