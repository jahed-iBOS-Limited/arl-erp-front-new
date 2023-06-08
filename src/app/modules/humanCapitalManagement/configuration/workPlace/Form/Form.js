import React from "react";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import TableRowCreatePage from "../Table/tableRowCreatePage";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { workPlaceGroupById } from "../Helper/Actions";
const validationSchema = Yup.object().shape({
  // workplaceName: Yup.string().required("Workplace is required"),
  // workplaceGroupName: Yup.object().shape({
  //   label: Yup.string().required("Workplace Group is required"),
  //   value: Yup.string().required("Workplace Group is required"),
  // }),
  // businessUnitName: Yup.object().shape({
  //   label: Yup.string().required("Business Unit is required"),
  //   value: Yup.string().required("Business Unit is required"),
  // }),
});

export default function WorkPlaceForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  id,
  workplaceDDLData,
  // businessDDLData,
  isEdit,
  setRowData,
  rowData,
  rowDataAddHandler,
  location,
}) {
  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const deleteHandler = (id) => {
    const deleteData = rowData.filter((data, index) => id !== index);
    setRowData(deleteData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          workplaceGroupName: {
            value: location?.state?.workplaceGroupId,
            label: location?.state?.workplaceGroup,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
                <div className="col-lg-6">
                  <label>Workplace Group Name</label>
                  <NewSelect
                    name="workplaceGroupName"
                    options={workplaceDDLData}
                    value={values?.workplaceGroupName}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroupName", valueOption);
                      workPlaceGroupById(
                        valueOption?.value,
                        profileData?.accountId,
                        setRowData
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
              </div>
              <div className="row global-form">
                {/* <div className="col-lg-3">
                  <label>Business Unit Name</label>
                  <NewSelect
                    name="businessUnitName"
                    options={businessDDLData}
                    value={values?.businessUnitName}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnitName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <IInput
                    value={values?.workplaceName}
                    label="Workplace Name"
                    name="workplaceName"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.workplaceCode}
                    label="Workplace Code"
                    name="workplaceCode"
                  />
                </div>
                <div className="col-lg-3 pt-5">
                  <button
                    disabled={
                      // !values.businessUnitName ||
                      !values.workplaceName || !values.workplaceCode
                    }
                    // className={isEdit ? "d-none" : "btn btn-primary"}
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) =>
                      rowDataAddHandler(
                        values,
                        setFieldValue("workplaceName", ""),
                        setFieldValue("workplaceCode", "")
                      )
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={() => handleSubmit}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <br />
          </>
        )}
      </Formik>
      {/* {isEdit ? ( */}
      {/* "" */}
      {/* ) : ( */}
      <TableRowCreatePage
        rowData={rowData}
        deleteHandler={deleteHandler}
      ></TableRowCreatePage>
      {/* )} */}
    </>
  );
}
