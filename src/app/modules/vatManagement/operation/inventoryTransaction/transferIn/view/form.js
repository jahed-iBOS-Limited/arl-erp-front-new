/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";
import FormikError from "../../../../../_helper/_formikError";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
// Validation schema for bank transfer
const validationSchema = Yup.object().shape({});
export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  createPageGrid,
  rowDto,
  selectedItemType
}) {

  const [valid, setValid] = useState(true);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ values, errors, touched, isValid }) => (
          <>
            <Form className="form form-label-right">
              <div className="row ">
                <div className="col-lg-7 p-0 pr-1">
                  <div className="row global-form h-100 m-0">
                    <div className="col-lg-3 pl pr-1 mb-1 ">
                      <NewSelect
                        name="transferNo"
                        value={values?.transferNo}
                        label="Transfer No."
                        placeholder="Transfer No."
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <NewSelect
                        name="otherBranchName"
                        value={values?.otherBranchName}
                        label="Branch (From)"
                        placeholder="From Branch"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>From Address</label>
                      <InputField
                        value={values?.otherBranchAddress}
                        name="otherBranchAddress"
                        placeholder="From Address"
                        type="text"
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="otherBranchAddress"
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 p-0 pr-4">
                  <div className={"row bank-journal-custom bj-right"}>
                    <div className="col-lg-6">
                      <div>
                        <p>
                          Transfer Date:
                          <b>
                            {createPageGrid
                              ? _dateFormatter(createPageGrid?.purchaseDateTime)
                              : "No Data"}
                          </b>
                        </p>
                        <p>
                          Item Type:{" "}
                          <b>
                            {createPageGrid
                              ? selectedItemType?.label
                              : "No Data"}
                          </b>
                        </p>
                        <p>
                          Transfer From:{" "}
                          <b>
                            {createPageGrid
                              ? createPageGrid?.taxBranchName
                              : "No Data"}
                          </b>
                        </p>
                        <p>
                          Reference No:{" "}
                          <b>
                            {createPageGrid
                              ? createPageGrid?.referanceNo
                              : "No Data"}
                          </b>
                        </p>
                      </div>
                      {/* ))} */}
                    </div>
                    <div className="col-lg-6">
                      <p>
                        Transaction Type:{" "}
                        <b>
                          {createPageGrid
                            ? createPageGrid?.taxTransactionTypeName
                            : "No Data"}{" "}
                        </b>
                      </p>
                      <p>
                        Vehicle Info:{" "}
                        <b>
                          {createPageGrid
                            ? createPageGrid?.vehicleNo
                            : "No Data"}
                        </b>
                      </p>
                      <p>
                        Address:{" "}
                        <b>
                          {createPageGrid
                            ? createPageGrid?.otherBranchAddress
                            : "No Data"}
                        </b>
                      </p>
                      <p>
                        Reference Date:{" "}
                        <b>
                          {createPageGrid
                            ? _dateFormatter(createPageGrid?.referanceDate)
                            : "No Data"}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 mt-3 p-0">
                  <table className={"table mt-1 bj-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "120px" }}>Item Name</th>
                        <th style={{ width: "100px" }}>UOM</th>
                        <th style={{ width: "50px" }}>Quantity</th>
                        <th style={{ width: "50px" }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.taxItemGroupName}
                            </div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.uomname}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Math.abs(item?.quantity)}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {item?.invoicePrice}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
