import { Form, Formik } from "formik";
import React from "react";
import Select from "react-select";
import * as Yup from "yup";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";
import customStyles from "../../../../selectCustomStyle";
// import customStyles from "../../../../selectCustomStyle";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
// import FormikError from "../../../../_helper/_formikError";
// import InputField from "../../../../_helper/_inputField";
// import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";

// Validation schema for bank transfer

const validationSchema = Yup.object().shape({
  vahicleCapacity: Yup.object().shape({
    label: Yup.string().required("Vahicle Capacity is required"),
    value: Yup.string().required("Vahicle Capacity is required"),
  }),
  daamount: Yup.number()
    .min(1, "Minimum 1 range")
    .max(10000000, "Maximum 10000000 range")
    .required("DA Amount is required"),
  daComponent: Yup.object().shape({
    label: Yup.string().required("DA Component is required"),
    value: Yup.string().required("DA Component is required"),
  }),
  downTripAllowance: Yup.number()
    .min(0, "Minimum 0 range")
    .max(100000, "Maximum 100000 range")
    .required("DA Amount is required"),
  allowance: Yup.object().shape({
    label: Yup.string().required("Allowance is required"),
    value: Yup.string().required("Allowance is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  remover,
  vahicleCapacity,
  daComponent,
  allowance,
  gridData,
  setDaAmount,
  setter,
  isEdit,
  setRowDto,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          vahicleCapacity: {
            value: gridData[0]?.vehicleCapacityId,
            label: gridData[0]?.vehicleCapacityName,
          },
          daamount: gridData[0]?.daamount,
          daComponent: {
            value: gridData[0]?.dacostComponentId,
            label: gridData[0]?.dacostComponentName,
          },
          downTripAllowance: gridData[0]?.downTripAllowance,
          allowance: {
            value: gridData[0]?.downTripAllowanceId,
            label: gridData[0]?.downTripAllowanceName,
          },
        }}
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
          handleBlur,
          handleChange,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-8">
                  {/* Table Header input */}
                  <div className={"row bank-journal-custom bj-right"}>
                    <div className="col-lg-6 pl pr-1 mb-1">
                      <label>Vahicle Capacity</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("vahicleCapacity", valueOption);
                        }}
                        value={values?.vahicleCapacity || ""}
                        isSearchable={true}
                        options={vahicleCapacity || []}
                        styles={customStyles}
                        name="vahicleCapacity"
                        placeholder="Vahicle Capacity"
                      />
                      <FormikError
                        errors={errors}
                        name="vahicleCapacity"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>DA Amount</label>
                      <InputField
                        value={values?.daamount || ""}
                        name="daamount"
                        placeholder="DA Amount"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "daamount"
                          );
                        }}
                        type="number"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-6 pr-1 pl mb-1">
                      <label>DA Component</label>
                      <Select
                        onChange={(valueOption) => {
                          resetForm()
                          setFieldValue("daComponent", valueOption);
                        }}
                        value={values?.daComponent || ""}
                        isSearchable={true}
                        options={daComponent || []}
                        styles={customStyles}
                        name="daComponent"
                        placeholder="Select DA Component"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="daComponent"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Down Trip Allowance Amount</label>
                      <InputField
                        value={values?.downTripAllowance || ""}
                        name="downTripAllowance"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "downTripAllowance"
                          );
                        }}
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-6 pr-1 pl mb-1">
                      <label>Down Trip Allowance Component</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("allowance", valueOption);
                        }}
                        value={values?.allowance || ""}
                        isSearchable={true}
                        options={allowance || []}
                        styles={customStyles}
                        name="allowance"
                        placeholder="Select DA Allowance"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="allowance"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-1 pl-2 bank-journal">
                      <button
                        style={{ marginTop: "10px" }}
                        type="button"
                        disabled={
                          !values?.vahicleCapacity ||
                          !values?.daamount ||
                          !values?.daComponent ||
                          !values?.downTripAllowance ||
                          !values?.allowance
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          const newValus = {
                            vehicleCapacityId: values?.vahicleCapacity?.value,
                            vehicleCapacityName: values?.vahicleCapacity?.label,
                            daamount: +values?.daamount,
                            dacostComponentId: values?.daComponent?.value,
                            dacostComponentName: values?.daComponent?.label,
                            downTripAllowance: +values?.downTripAllowance,
                            downTripAllowanceId: values?.allowance?.value,
                            downTripAllowanceName: values?.allowance?.label,
                            isDeleted: true,
                          };
                          setter(newValus);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  <div className="row">
                    <div className="col-lg-12 pr-0 table-responsive">
                      <table className={"table table-responsive mt-1 bj-table"}>
                        <thead className={gridData.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "120px" }}>Vehicle Capacity</th>
                            <th style={{ width: "100px" }}>DA Amount</th>
                            <th style={{ width: "100px" }}>DA Component</th>
                            <th style={{ width: "100px" }}>
                              Down Trip Allowance Component
                            </th>
                            <th style={{ width: "100px" }}>
                              Down Trip Allowance Amount
                            </th>

                            <th style={{ width: "50px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.vahicleCapacity?.label ||
                                    item?.vehicleCapacityName}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="text-right pr-2">
                                    <input
                                      name="daamount"
                                      type="number"
                                      className="trans-date cj-landing-date"
                                      style={{
                                        padding: "0 10px",
                                        maxWidth: "98%",
                                      }}
                                      value={item?.daamount}
                                      onChange={(e) => {
                                        if (e.target.value >= 0) {
                                          setDaAmount(
                                            index,
                                            e.target.value,
                                            e.target.name
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.daComponent?.label ||
                                    item?.dacostComponentName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.allowance?.label ||
                                    item?.downTripAllowanceName}
                                </div>
                              </td>
                              <td>
                                {/* <div className="text-center">
                                  {item?.allowance?.label ||
                                    item?.downTripAllowance}
                                </div> */}
                                <div>
                                  <div className="text-right pr-2">
                                    <input
                                      name="downTripAllowance"
                                      type="number"
                                      className="trans-date cj-landing-date"
                                      style={{
                                        padding: "0 10px",
                                        maxWidth: "98%",
                                      }}
                                      value={item?.downTripAllowance}
                                      onChange={(e) => {
                                        if (e.target.value >= 0) {
                                          setDaAmount(
                                            index,
                                            e.target.value,
                                            e.target.name
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td className="text-center">
                                {item?.isDeleted ? (
                                  <IDelete remover={remover} id={index} />
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
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
