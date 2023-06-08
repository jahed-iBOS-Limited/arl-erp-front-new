import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getTaxItem_api } from "../helper";
const validationSchema = Yup.object().shape({
  transactionDate: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("Transaction Date required"),

  type: Yup.object().shape({
    label: Yup.string().required("Type is required"),
    value: Yup.string().required("Type is required"),
  }),
  partner: Yup.object().shape({
    label: Yup.string().required("Partner is required"),
    value: Yup.string().required("Partner is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  headerData,
  rowDto,
  remover,
  rowDataAddHandler,
  partnerDDL,
  partnerDDLFunc,
  setRowDto,
}) {
  const [itemDDL, setItemDDL] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (headerData?.type?.value) {
      if (headerData?.type?.value === 1) {
        partnerDDLFunc(1);
      } else {
        partnerDDLFunc(2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit.value &&
      headerData?.type?.value
    ) {
      getTaxItem_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        headerData?.type?.value,
        setItemDDL
      );
    }
  }, [profileData, selectedBusinessUnit, headerData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit ? initData : { ...initData, type: headerData?.type }
        }
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
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Raw" },
                      { value: 2, label: "FG" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      if (valueOption?.value === 1) {
                        partnerDDLFunc(1);
                      } else {
                        partnerDDLFunc(2);
                      }
                    }}
                    placeholder="Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3 pl pr-1 mb-1">
                  <NewSelect
                    name="partner"
                    options={partnerDDL || []}
                    value={values?.partner}
                    label="Partner(Supplier)"
                    onChange={(valueOption) => {
                      setFieldValue("partner", valueOption);
                    }}
                    placeholder="Partner(Supplier)"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Transaction Date</label>
                  <InputField
                    value={values?.transactionDate}
                    name="transactionDate"
                    placeholder="Transaction Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
              </div>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={itemDDL || []}
                    value={values?.item}
                    label="Item"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    placeholder="Item"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Quantity</label>
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    type="number"
                    min="0"
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    disabled={!values?.item || !values?.quantity}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      rowDataAddHandler(values);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>SL</th>
                    <th style={{ width: "20px" }}>Item Name</th>
                    <th style={{ width: "20px" }}>UoM</th>
                    <th style={{ width: "20px" }}>Quantity</th>
                    <th style={{ width: "20px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((tableData, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.taxItemGroupName} </td>
                      <td> {tableData?.uomname} </td>
                      <td className="text-center"> {tableData?.quantity} </td>
                      <td className="text-center">
                        <i
                          className="fa fa-trash"
                          onClick={() => remover(index)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
