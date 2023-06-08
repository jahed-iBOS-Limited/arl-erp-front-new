import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";


// Validation schema
const validationSchema = Yup.object().shape({
  rosterGroupName: Yup.string()
    .min(2, "Minimum 2 strings")
    .max(100, "Maximum 100 strings")
    .required("Roster group name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  calenderList,
  rowDto,
  setRowDto,
  remover,
  setter,
  employeeList,
}) {
  const filterCalenderListFunc = (values) => {
    let filterCalenderList = calenderList?.filter(
      (item) => item?.value !== values?.calender?.value
    );
    return filterCalenderList;
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
            setRowDto([]);
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
          setValues,
          isValid,
        }) => (
          <>
            {console.log(errors)}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Roster Group Name</label>
                    <InputField
                      value={values?.rosterGroupName}
                      name="rosterGroupName"
                      placeholder="Roster Group Name"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="calender"
                      options={calenderList}
                      value={values?.calender}
                      label="Calendar"
                      isDisabled={rowDto?.length > 0}
                      onChange={(valueOption) => {
                        setFieldValue("nextCalender", "");
                        setFieldValue("calender", valueOption);
                      }}
                      placeholder="Calendar"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>No. of Change days</label>
                    <InputField
                      value={values?.noOfChangeDays}
                      name="noOfChangeDays"
                      placeholder="No. of Change days"
                      type="number"
                      min="0"
                    />
                  </div>

                  {/* Assign By Mim Apu (BA) */}
                  {/* <div className="col-lg-3"> 
                    <label>Next Change Date</label>
                    <InputField
                      value={values?.nextChangeDate}
                      name="nextChangeDate"
                      placeholder="Next Change Date"
                      type="date"
                    />
                  </div> */}
                  {/* Assign By Mim Apu (BA) */}

                  <div className="col-lg-3">
                    <NewSelect
                      name="nextCalender"
                      options={filterCalenderListFunc(values)}
                      value={values?.nextCalender}
                      label="Next Calendar"
                      onChange={(valueOption) => {
                        setFieldValue("nextCalender", valueOption);
                      }}
                      placeholder="Next Calendar"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3" style={{ marginTop: "18px" }}>
                    <div className="d-flex">
                      <span className="mr-2">Running Calendar</span>
                      <Field type="checkbox" name="runningCalender" />
                    </div>
                  </div> */}
                  <div style={{ marginTop: "14px" }} className="col-lg">
                    <button
                      disabled={
                        !values?.rosterGroupName ||
                        !values?.noOfChangeDays ||
                        !values?.nextCalender ||
                        !values?.calender
                      }
                      className="btn btn-primary"
                      onClick={() => {
                        setter(values);
                        setFieldValue("calender", values?.nextCalender);
                        setFieldValue("nextCalender", "");
                      }}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* RowDto */}

              <div className="text-right">
              <button type="button" style={{fontSize: "14px", padding: "4px 16px", lineHeight: "14px"}} onClick={() => setRowDto([])} className="btn btn-primary">
                Clear
              </button>
              </div>
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Calendar</th>
                    <th>No. of Change Days</th>
                    <th>Next Calendar</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.calender?.label}</td>
                      <td className="text-center">{item?.noOfChangeDays}</td>
                      <td>{item?.nextCalender?.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
