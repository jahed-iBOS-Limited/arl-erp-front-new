import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import {
  getRefTypeDDL,
  getTransTypeDDL,
  getRowAndHeaderLabelData,
} from "../helper";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  reftype: Yup.object().shape({
    label: Yup.string().required("Reference Type is required"),
    value: Yup.string().required("Reference Type is required"),
  }),
  refNo: Yup.string().required("Refference No is required"),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  remover,
  rowDto,
  setRowDto,
  accountId,
  selectedBusinessUnit,
  location,
}) {
  //DDL State
  const [refTypeDDl, setRefTypeDDl] = useState([]);
  const [transTypeDDl, setTransTypeDDl] = useState([]);

  useEffect(() => {
    getRefTypeDDL(setRefTypeDDl);
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="reftype"
                    options={refTypeDDl || []}
                    value={values?.reftype}
                    label="Reference Type"
                    onChange={(valueOption) => {
                      setFieldValue("reftype", valueOption);
                      getTransTypeDDL(valueOption?.value, setTransTypeDDl);
                    }}
                    placeholder="Reference Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="transType"
                    options={transTypeDDl || []}
                    value={values?.transType}
                    label="Transaction Type"
                    onChange={(valueOption) => {
                      setFieldValue("transType", valueOption);
                    }}
                    placeholder="Transaction Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.refNo}
                    label="Reference No"
                    placeholder="Reference No"
                    type="text"
                    name="refNo"
                  />
                </div>
                <div className="col-lg-2 mt-9">
                  <button
                    style={{ marginTop: "-7px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      getRowAndHeaderLabelData(
                        values?.refNo,
                        accountId,
                        selectedBusinessUnit?.value,
                        location?.state?.sbu?.value,
                        location?.state?.plant?.value,
                        location?.state?.wh?.value,
                        setRowDto
                      )
                    }
                    type="button"
                    disabled={
                      !values?.reftype || !values?.transType || !values?.refNo
                    }
                  >
                    Show
                  </button>
                </div>
              </div>

              <div className="row global-form">
                <div className="col-lg-3">
                  <h6>Transaction Code: {rowDto?.transactionCode} </h6>
                </div>
                <div className="col-lg-3">
                  <h6>Refference Code: {rowDto?.refCode} </h6>
                </div>
                <div className="col-lg-3">
                  <h6>
                    Transaction Date:{" "}
                    {rowDto?.transactionId === 0
                      ? ""
                      : _dateFormatter(rowDto?.date)}{" "}
                  </h6>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-12">
                  <div className="row px-4">
                    {/* Start Table Part */}
                    <div className="table-responsive">
                      <table
                        style={{ marginTop: "5px" }}
                        className="table table-striped table-bordered"
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            {/* <th>Item Code</th> */}
                            <th>Item Name</th>
                            <th>Uom</th>
                            <th>Quantity</th>
                            <th>Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.rowData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {index + 1}
                              </td>
                              {/* <td className="text-center align-middle">
                              {item.itemCode}
                            </td> */}

                              <td className="text-center align-middle table-input">
                                {item?.itemName}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.uomName}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.quantity}
                              </td>
                              <td className="text-center align-middle table-input">
                                {item?.inventoryLocationName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* End Table Part */}
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
