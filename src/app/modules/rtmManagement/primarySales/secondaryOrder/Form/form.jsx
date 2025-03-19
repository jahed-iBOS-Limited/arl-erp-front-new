/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { getBeatNameDDL } from "../helper";
import InputField from "./../../../../_helper/_inputField";
import {
  getOutletNameDDL,
  getItemDDL,
  getdistributorNameDDL,
  getdistributorCahnelNameDDL,
  getTerrotoryDDL,
} from "./../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryName: Yup.object().shape({
    label: Yup.string().required("Territory Name Name is required"),
    value: Yup.string().required("Territory Name Name is required"),
  }),
  distributorName: Yup.object().shape({
    label: Yup.string().required("Distributor Name Name is required"),
    value: Yup.string().required("Distributor Name Name is required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel Name is required"),
    value: Yup.string().required("Distribution Channel Name is required"),
  }),
  routeName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(1000000, "Maximum 1000000 symbols")
    .required("Route Name is required"),
  beatName: Yup.object().shape({
    label: Yup.string().required("Market Name is required"),
    value: Yup.string().required("Market Name is required"),
  }),
  outlateName: Yup.object().shape({
    label: Yup.string().required("Outlet Name is required"),
    value: Yup.string().required("Outlet Name is required"),
  }),
  receivedAmount: Yup.number().required("Received Amount is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  routeDDL,
  setBeatNameDDL,
  beatNameDDL,
  outletNameDDl,
  setOutletNameDDL,
  isEdit,
  setRowData,
  rowData,
  rowDtoHandler,
  totalAmount
}) {
  const [trrytoryDDL, setTrrytoryDDL] = useState([]);
  const [distibiotuorDDL, setDistibiotuorDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannel] = useState([]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getTerrotoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTrrytoryDDL
      );
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([])
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
            {/* {disableHandler(!isValid)} */} 
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="territoryName"
                      options={trrytoryDDL || []}
                      value={values?.territoryName}
                      label="Territory Name*"
                      onChange={(valueOption) => {
                        setFieldValue("territoryName", valueOption);
                        setFieldValue("distributionChannel", "");
                        setFieldValue("distributorName", "");
                        getdistributorNameDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setDistibiotuorDDL,
                          setFieldValue
                        );
                      }}
                      isDisabled={isEdit}
                      placeholder="Territory Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributorName"
                      options={distibiotuorDDL || []}
                      value={values?.distributorName}
                      label="Distributor Name*"
                      onChange={(valueOption) => {
                        setFieldValue("distributorName", valueOption);
                        setFieldValue("distributionChannel", "");
                        getdistributorCahnelNameDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setDistributionChannel
                        );
                      }}
                      isDisabled={isEdit}
                      placeholder="Distributor Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="routeName"
                      options={routeDDL}
                      value={values?.routeName}
                      label="Route Name"
                      onChange={(valueOption) => {
                        setFieldValue("beatName", "");
                        setFieldValue("routeName", valueOption);
                        getBeatNameDDL(valueOption?.value, setBeatNameDDL);
                        getOutletNameDDL(valueOption?.value, setOutletNameDDL);
                      }}
                      isDisabled={isEdit}
                      placeholder="Route Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="beatName"
                      options={beatNameDDL}
                      value={values?.beatName}
                      label="Market Name"
                      onChange={(valueOption) => {
                        setFieldValue("beatName", valueOption);
                      }}
                      isDisabled={isEdit}
                      placeholder="Market Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="outlateName"
                      options={outletNameDDl}
                      value={values?.outlateName}
                      label="Outlet Name"
                      onChange={(valueOption) => {
                        setFieldValue("outlateName", valueOption);
                      }}
                      isDisabled={isEdit}
                      placeholder="Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={distributionChannelDDL || []}
                      value={values?.distributionChannel}
                      label="Distribution Channel*"
                      onChange={(valueOption) => {
                        setFieldValue("distributionChannel", valueOption);
                        getItemDDL(
                          setRowData,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value
                        );
                      }}
                      isDisabled={isEdit}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="number"
                      value={values?.receivedAmount}
                      label="Received Amount"
                      placeholder="Received Amount"
                      name="receivedAmount"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Total Order Amount</label>
                    <InputField
                      value={totalAmount}
                      name="totalAmount"
                      placeholder="Total Order Amount"
                      type="number"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              {/* item table */}
              <div className="">
                <div className="">
                  {rowData?.length >= 0 ? (
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>UOM</th>
                          <th>Rate</th>
                          <th>Order Qty</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData.map((itm, idx) => {
                          return (
                            <tr key={idx}>
                              <td className="text-center">{idx + 1}</td>
                              <td>
                                <div>
                                  <div className="pl-2">{itm?.itemName}</div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="pl-2">{itm?.uomName}</div>
                                </div>
                              </td>
                              <td style={{width:"150px"}}>
                                <input
                                  value={rowData[idx]?.rate || ""}
                                  name="rate"
                                  placeholder="Rate"
                                  style={{paddingLeft:"10px"}}
                                  type="number"
                                  step="any"
                                  onChange={(e) => {
                                    rowDtoHandler("rate", e.target.value, idx);
                                  }}
                                  min="0"
                                  errors={errors}
                                  touched={touched}
                                />
                              </td>
                              <td style={{width:"150px"}}>
                                <input
                                  value={rowData[idx]?.orderQty || ""}
                                  name="orderQty"
                                  style={{paddingLeft:"10px"}}
                                  placeholder="Order Qty"
                                  type="number"
                                  step="any"
                                  onChange={(e) => {
                                    rowDtoHandler(
                                      "orderQty",
                                      e.target.value,
                                      idx
                                    );
                                  }}
                                  min="0"
                                />
                              </td>
                              <td className="text-right pr-2">{itm?.orderQty * itm?.rate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    ""
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
