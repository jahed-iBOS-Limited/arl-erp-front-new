import { Form, Formik } from "formik";
import React from "react";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../../_helper/_select";
import IButton from "../../../../../_helper/iButton";
import { loadUserList } from "../../helper";


export default function _Form({
  accId,
  buId,
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  shipPointDDL,
  addRow,
  removeRow,
  rowData,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={({ resetForm }) => {
          saveHandler(() => {
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3  ">
                  <label>User Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.user}
                    handleChange={(valueOption) => {
                      setFieldValue("user", valueOption);
                    }}
                    loadOptions={(v) => loadUserList(v, accId, buId)}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL}
                    value={values?.shipPoint}
                    label="Select ShipPoint"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    placeholder="Ship Point"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <IButton
                  colSize={"col=lg-1"}
                  onClick={() => {
                    addRow(values, () => {
                      setFieldValue("shipPoint", "");
                    });
                  }}
                  disabled={!values?.user || !values?.shipPoint}
                >
                  {" "}
                  +Add{" "}
                </IButton>
              </div>
              {rowData?.length > 0 && (
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "35px" }}>SL</th>
                      <th>User Name</th>
                      <th>ShipPoint</th>
                      <th>Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((tableData, index) => (
                      <tr key={index}>
                        <td> {index + 1} </td>
                        <td> {tableData.userName} </td>
                        <td> {tableData.shippingPointName} </td>
                        <td className="text-center">
                          <IDelete remover={removeRow} id={index} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
