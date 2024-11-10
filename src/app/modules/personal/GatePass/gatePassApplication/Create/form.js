import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
// Validation schema
const validationSchema = Yup.object().shape({
  rosterGroupName: Yup.string()
    .min(2, "Minimum 2 strings")
    .max(100, "Maximum 100 strings"),
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
            
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 mb-2">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="itemSourceType"
                        checked={values?.privacyType === "1"}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(valueOption) => {
                          setFieldValue("privacyType", "1");
                          // setFieldValue("employee", {
                          //   value: profileData?.employeeId,
                          //   label: profileData?.employeeFullName,
                          // });
                          // leaveAppLandingPagintaion_api(
                          //   profileData?.userReferenceId,
                          //   setRowDto,
                          //   setLoader
                          // );
                          // OfficialMoveLandingPagination_api(
                          //   profileData?.userReferenceId,
                          //   setRowDtoTwo,
                          //   setLoader
                          // );
                        }}
                      />
                          Office Items
                        </label>
                    <label>
                      <input
                        type="radio"
                        name="itemSourceType"
                        checked={values?.privacyType === "2"}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                          setFieldValue("privacyType", "2");
                          //  setFieldValue("employee", "");
                        }}
                      />
                          Others
                        </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={calenderList}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Gate Pass Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Gate Pass Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From</label>
                    <InputField
                      value={values?.noOfChangeDays}
                      name="noOfChangeDays"
                      placeholder="Address"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To</label>
                    <InputField
                      value={values?.noOfChangeDays}
                      name="noOfChangeDays"
                      placeholder="Address"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="nextCalender"
                      options={filterCalenderListFunc(values)}
                      value={values?.nextCalender}
                      label="Item"
                      onChange={(valueOption) => {
                        setFieldValue("nextCalender", valueOption);
                      }}
                      placeholder="Next Calendar"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Quantity</label>
                    <InputField
                      value={values?.noOfChangeDays}
                      name="noOfChangeDays"
                      placeholder="No. of Change days"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div style={{ marginTop: "14px" }} className="col-lg">
                    <button
                      disabled={
                        !values?.rosterGroupName ||
                        !values?.noOfChangeDays ||
                        // !values?.nextChangeDate ||
                        !values?.nextCalender ||
                        !values?.calender
                      }
                      className="btn btn-primary"
                      onClick={() => setter(values)}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* RowDto */}
              <div className='table-responsive'>
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.calender?.label}</td>
                      <td className="text-center">{item?.noOfChangeDays}</td>
                      {/* <td className="text-right">
                        {_dateFormatter(item?.nextChangeDate)}
                      </td>
                      <td>{item?.nextCalender?.label}</td> */}
                      {/* <td>{`${item?.runningCalender}`}</td> */}
                      <td className="text-center">
                        <IDelete remover={remover} id={index} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
