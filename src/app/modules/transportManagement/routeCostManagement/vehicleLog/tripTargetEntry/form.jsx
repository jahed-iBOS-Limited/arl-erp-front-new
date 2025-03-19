import { Form, Formik } from "formik";
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowData,
  rowDataHandler,
  ShipPointDDL,
  vehicleCategories,
  getAndSetRows,
  setRowData,
  allSelect,
  selectedAll,
}) {
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
            setRowData([]);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, setFieldValue }) => (
          <>
            <Form className="form form-label-right">
              {/* Form */}
              <div className="global-form">
                <div className="row">
                  <YearMonthForm obj={{ values, setFieldValue }} />
                  <div className="col-lg-3">
                    <InputField
                      label="Total Day In The Month"
                      placeholder="Total Day In The Month"
                      name="targetTrip"
                      value={
                        daysInMonth(
                          values?.month?.value,
                          values?.year?.value
                        ) || ""
                      }
                      type="text"
                      disabled
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      label="ShipPoint"
                      placeholder="ShipPoint"
                      options={ShipPointDDL || []}
                      value={values?.shipPoint}
                      isDisabled={rowData?.length}
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="vehicleCategory"
                      options={vehicleCategories || []}
                      value={values?.vehicleCategory}
                      label="Vehicle Category"
                      onChange={(valueOption) => {
                        setFieldValue("vehicleCategory", valueOption);

                        getAndSetRows({
                          ...values,
                          vehicleCategory: valueOption,
                        });
                        setRowData([]);
                      }}
                      placeholder="Vehicle Category"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}

              <div className="row">
                <div className="col-lg-6">
                  {rowData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          {" "}
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            style={{ minWidth: "30px" }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                          <th style={{ width: "50px" }}>SL</th>
                          <th>Vehicle</th>
                          <th>Vehicle Capacity</th>
                          <th>Target Trip</th>
                          <th>Avg. Target Trip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, i) => (
                          <tr key={i + 1}>
                            <td
                              onClick={() => {
                                rowDataHandler(
                                  "isSelected",
                                  i,
                                  !item.isSelected
                                );
                              }}
                              className="text-center"
                            >
                              <input
                                type="checkbox"
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            </td>
                            <td>{i + 1}</td>
                            <td>{item?.vehicleName}</td>
                            <td>{item?.vehicleCategory}</td>
                            <td>
                              <InputField
                                name="tripTarget"
                                value={item?.tripTarget}
                                type="text"
                                onChange={(e) => {
                                  rowDataHandler(
                                    "tripTarget",
                                    i,
                                    e?.target?.value
                                  );
                                }}
                              />
                            </td>
                            <td>
                              {_fixedPoint(
                                item?.tripTarget /
                                  daysInMonth(
                                    values?.month?.value,
                                    values?.year?.value
                                  ),
                                true
                              ) || ""}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="text-right" colSpan={4}>
                            <b>Total</b>
                          </td>
                          <td className="text-left">
                            <b>
                              {_fixedPoint(
                                rowData?.reduce(
                                  (total, curr) => (total += +curr?.tripTarget),
                                  0
                                ),
                                true
                              )}
                            </b>
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  )}
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
