import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowData,
  vehicleList,
  rowDataHandler,
  ShipPointDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {
          saveHandler(() => {});
        }}
      >
        {({ handleSubmit, resetForm }) => (
          <>
            <Form className="form form-label-right">
              {/* Form */}
              {/* <div className="global-form">
                <div className="row">
                   
                </div>
              </div> */}

              {/* Table */}

              <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>SL</th>
                    <th>Problem type</th>
                    <th>Vehicle</th>
                    <th>ShipPoint</th>
                    <th style={{ width: "200px" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, i) => (
                      <tr key={i + 1}>
                        <td>{i + 1}</td>
                        <td>{item?.problemTypeName}</td>
                        <td>
                          <NewSelect
                            name="vehicle"
                            options={vehicleList || []}
                            value={item?.vehicle}
                            onChange={(valueOption) => {
                              rowDataHandler("vehicle", i, valueOption);
                            }}
                          />
                        </td>
                        <td>
                          <NewSelect
                            name="shipPoint"
                            options={ShipPointDDL || []}
                            value={item?.shipPoint}
                            onChange={(valueOption) => {
                              rowDataHandler("shipPoint", i, valueOption);
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            name="date"
                            value={item?.date}
                            type="date"
                            onChange={(e) => {
                              rowDataHandler("date", i, e?.target?.value);
                            }}
                          />
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
