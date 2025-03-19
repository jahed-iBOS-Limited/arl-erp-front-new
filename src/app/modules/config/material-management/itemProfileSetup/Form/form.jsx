import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import IViewModal from "./../../../../_helper/_viewModal";
import DdlOptionViewModel from "./ddlOptionViewModel";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import { GetProfileControlerTypeDDL_api } from "../helper";

const validationSchema = Yup.object().shape({
  sectionName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("Section Name required"),
  // businessUnit: Yup.object().shape({
  //   label: Yup.string().required("Business Unit required"),
  //   value: Yup.string().required("Business Unit required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  setter,
  setDdlOptionRow,
  ddlOptionRow,
  ddlOptionsRemoveFunc,
  addDdlOptionFuc,
}) {
  const [modalShowDDL, setModalShowDDL] = useState(false);
  const [createTableRowItm, setCreateTableRowItm] = useState("");
  const [controlerTypeDDL, setControlerTypeDDL] = useState([]);

  useEffect(() => {
    GetProfileControlerTypeDDL_api(setControlerTypeDDL);
  }, []);
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Section Name</label>
                  <InputField
                    value={values?.sectionName}
                    name="sectionName"
                    placeholder="Section Name"
                    type="text"
                  />
                </div>
              </div>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Attribute Name</label>
                  <InputField
                    value={values?.attributeName}
                    name="attributeName"
                    placeholder="Attribute Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-2">
                  <div
                    className="mr-5 pt-5"
                  >
                    <Field
                      name="isMendatory"
                      component={() => (
                        <input
                          id="isMendatory"
                          type="checkbox"
                          style={{
                            position: "relative",
                            top: "2px",
                            marginLeft: "3px",
                          }}
                          label="Is Mandatory"
                          className="mr-3"
                          value={values?.isMendatory}
                          checked={values?.isMendatory}
                          name="isMendatory"
                          onChange={(e) => {
                            setFieldValue("isMendatory", e.target.checked);
                          }}
                        />
                      )}
                    />
                    <label htmlFor="isMendatory">Is Mandatory ? </label>
                  </div>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="controlName"
                    options={controlerTypeDDL || []}
                    value={values?.controlName}
                    label="Control Name"
                    onChange={(valueOption) => {
                      setFieldValue("controlName", valueOption);
                      valueOption?.label === "DDL" && setModalShowDDL(true);
                    }}
                    placeholder="Control Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.attributeName}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary mt-4"
                    disabled={!values?.attributeName || !values?.controlName}
                    onClick={() => {
                      const obj = {
                        attributeName: values?.attributeName,
                        isMendatory: values?.isMendatory,
                        controlName: values?.controlName?.label,
                        controlId: values?.controlName?.value,
                        optionList: ddlOptionRow,
                        attributeId: 0,
                      };
                      setter(obj);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>SL</th>
                    <th style={{ width: "20px" }}>Attribute Name</th>
                    <th style={{ width: "20px" }}>Is Mandatory</th>
                    <th style={{ width: "20px" }}>Control Name</th>
                    <th style={{ width: "20px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((tableData, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.attributeName} </td>
                      <td> {tableData?.isMendatory ? "true" : "false"} </td>
                      <td>
                        {tableData?.controlName === "DDL" ? (
                          <span
                            onClick={() => {
                              setModalShowDDL(true);
                              setCreateTableRowItm({
                                ...tableData,
                                index: index,
                              });
                              setDdlOptionRow(tableData?.optionList);
                            }}
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              borderBottom: "1px solid",
                            }}
                          >
                            {tableData?.controlName}
                          </span>
                        ) : (
                          tableData?.controlName
                        )}
                      </td>
                      <td className="text-center">
                        {tableData?.attributeId === 0 && (
                          <IDelete
                            id={index}
                            remover={(id) => {
                              setRowDto(
                                rowDto.filter((itm, idx) => idx !== id)
                              );
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              <IViewModal
                modelSize="lg"
                show={modalShowDDL}
                onHide={() => {
                  setModalShowDDL(false);
                  setCreateTableRowItm("");
                  createTableRowItm?.controlName === "DDL" &&
                    setDdlOptionRow([]);
                }}
                title={`Attribute Name: ${
                  createTableRowItm?.attributeName
                    ? createTableRowItm?.attributeName
                    : values?.attributeName
                }`}
                btnText="Close"
              >
                <DdlOptionViewModel
                  createFormValues={values}
                  setModalShowOther={setModalShowDDL}
                  ddlOptionRow={ddlOptionRow}
                  ddlOptionsRemoveFunc={ddlOptionsRemoveFunc}
                  addDdlOptionFuc={addDdlOptionFuc}
                  createTableRowItm={createTableRowItm}
                />
              </IViewModal>
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
                onClick={() => {
                  resetForm(initData);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
