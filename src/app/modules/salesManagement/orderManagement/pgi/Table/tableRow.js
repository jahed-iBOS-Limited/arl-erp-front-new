import React from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { getPGIGridData } from "../_redux/Actions";
import { toast } from "react-toastify";

export default function TableRow({
  gridData,
  savePgiData,
  IsPGICheck,
  profileData,
  selectedBusinessUnit,
  shippointDDL,
  initData,
  initialData,
  btnRef,
  saveHandler,
  resetBtnRef,
  itemSlectedHandler,
  allGridCheck,
  shippoinHandler,
}) {
  const dispatch = useDispatch();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialData,
          pgiShippoint: {
            value: shippointDDL[0]?.value,
            label: shippointDDL[0]?.label,
          },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialData);
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
            {/* {
            shippointDDL.map(val => v.push(val.organizationUnitReffName))
            } */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Shippoint"
                          options={shippointDDL}
                          defaultValue={values?.pgiShippoint}
                          name="pgiShippoint"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          dependencyFunc={(currentValue, value, setter) => {
                            dispatch(
                              getPGIGridData(
                                profileData.accountId,
                                selectedBusinessUnit.value,
                                currentValue
                              )
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-1 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            var isTrue = false;
                            gridData.forEach((itm) => {
                              if (itm.itemCheck) {
                                isTrue = true;
                                savePgiData(itm.shipmentId);
                                dispatch(
                                  getPGIGridData(
                                    profileData.accountId,
                                    selectedBusinessUnit.value,
                                    values.pgiShippoint
                                  )
                                );
                                window.location.reload(false);
                              }
                            });
                            if (isTrue) {
                              toast.success("All selected pgi are saved...!", {
                                toastId: 456,
                              });
                            } else {
                              toast.warn("Select a pgi first..", {
                                toastId: 456,
                              });
                            }
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </>
                  </div>
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
                onSubmit={() => resetForm(initialData)}
              ></button>
            </Form>

            {/* Table Start */}
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0">
                {gridData?.length >= 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th style={{ width: "90px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                          <th>Shipment Id</th>
                          <th>Shipment Code</th>
                          <th>No of Challan</th>
                          <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((td, index) => (
                          <tr key={index}>
                            <td>
                              <Field
                                name={values.itemCheck}
                                component={() => (
                                  <input
                                    id="itemCheck"
                                    type="checkbox"
                                    className="ml-2"
                                    value={td.itemCheck}
                                    checked={td.itemCheck}
                                    name={td.itemCheck}
                                    onChange={(e) => {
                                      itemSlectedHandler(
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                )}
                                label="Transshipment"
                              />
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {td.shipmentId}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="text-right pr-2">
                                {td.shipmentCode}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {td.deliveryChallanCount}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <button
                                  type="button"
                                  className="prurchaseBtn ml-4 small-button"
                                  onClick={() => {
                                    if (IsPGICheck) {
                                      savePgiData(td.shipmentId);
                                      dispatch(
                                        getPGIGridData(
                                          profileData.accountId,
                                          selectedBusinessUnit.value
                                        )
                                      );
                                      window.location.reload(false);
                                    } else {
                                      alert("Inventory is not true!");
                                    }
                                  }}
                                >
                                  Create PGI
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
