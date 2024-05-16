import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import {
  getRefTypeDDL,
  getRefNoDDL,
  getTransactionTypeDDL,
  // getTransactinGrpDDL,
  // getBusinessPartnerDDL,
  // getEmployeeDDL,
  // getPlantDDL,
  getWareHouseDDL,
  getItemDDL,
} from "../helper";
// import InputField from "../../../../_helper/_inputField";
// import IDelete from "../../../../_helper/_helperIcons/_delete";

// Validation schema
// const validationSchema = Yup.object().shape({
//   controllingUnitCode: Yup.string()
//     .min(2, "Minimum 2 symbols")
//     .max(100, "Maximum 100 symbols")
//     .required("Code is required"),
//   controllingUnitName: Yup.string()
//     .min(2, "Minimum 2 symbols")
//     .max(100, "Maximum 100 symbols")
//     .required("Controlling Unit Name is required"),
//   responsiblePerson: Yup.object().shape({
//     label: Yup.string().required("Responsible Person is required"),
//     value: Yup.string().required("Responsible Person is required"),
//   }),
// });

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  accountId,
  selectedBusinessUnit,
  addRowDtoData,
  rowDto,
  rowDtoHandler,
  remover,
  setRowData,
  // transactionGrpDDL,
  // setRefTypeDDL,
  // refTypeDDL,
  // refNoDDL,
  // setRefNoDDL,
  empDDL,
  isEdit,
}) {
  // DDL
  const [
    transactionGrpDDL,
    // setTransactionGrpDDL
  ] = useState([]);
  const [refTypeDDL, setRefTypeDDL] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);
  const [transactionTypeDDL, setTransactionTypeDDL] = useState([]);
  const [
    buPartnerDDL,
    // setBuPartnerDDL
  ] = useState([]);
  const [
    personnelDDL,
    // setPersonnelDDL
  ] = useState([]);
  const [
    plantFromDDL,
    // setPlantFromtDDL
  ] = useState([]);
  const [wareHouseFromDDL, setWareHouseFromDDL] = useState([]);
  const [wareHouseToDDL, setWareHouseToDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  useEffect(() => {
    // Fetch DDL Data
    // getTransactinGrpDDL(setTransactionGrpDDL)
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (selectedBusinessUnit?.value && accountId) {
      // getBusinessPartnerDDL(accountId, selectedBusinessUnit.value, setBuPartnerDDL)
      // getEmployeeDDL(accountId, selectedBusinessUnit.value, setPersonnelDDL)
      // getPlantDDL(accountId, selectedBusinessUnit.value, setPlantFromtDDL)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, accountId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}

            <Form className="form form-label-right inventory_traction_form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    value={values.transactionGroup}
                    label="Transaction Group"
                    name="transactionGroup"
                    options={transactionGrpDDL}
                    onChange={(data) => {
                      setFieldValue("transactionGroup", data);
                      getRefTypeDDL(data?.value, setRefTypeDDL);
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    value={values.referenceType}
                    label="Reference Type"
                    name="referenceType"
                    options={refTypeDDL}
                    onChange={(data) => {
                      setFieldValue("referenceType", data);
                      getRefNoDDL(
                        data?.value,
                        accountId,
                        selectedBusinessUnit.value,
                        setRefNoDDL
                      );
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    value={values.referenceNo}
                    label="Reference No"
                    name="referenceNo"
                    options={refNoDDL}
                    onChange={(data) => {
                      setFieldValue("referenceNo", data);
                      getTransactionTypeDDL(
                        values.transactionGroup.value,
                        data?.value,
                        setTransactionTypeDDL
                      );
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    value={values.transactionType}
                    label="Transaction Type"
                    name="transactionType"
                    options={transactionTypeDDL}
                    onChange={(data) => {
                      setFieldValue("transactionType", data);
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    value={values.businessPartner}
                    label="Businesss Partner"
                    name="businessPartner"
                    options={buPartnerDDL}
                    onChange={(data) => {
                      setFieldValue("businessPartner", data);
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    value={values.personnel}
                    label="Personnel"
                    name="personnel"
                    options={personnelDDL || []}
                    onChange={(data) => {
                      setFieldValue("personnel", data);
                    }}
                    isDisabled={true}
                    errors={errors}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
              </div>

              <div className="transfer_form">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form_header">Transfer From</div>
                    <div className="row">
                      <div className="col-lg-6">
                        <NewSelect
                          value={values.plantFrom}
                          label="Plant"
                          name="plantFrom"
                          options={plantFromDDL}
                          onChange={(data) => {
                            setFieldValue("plantFrom", data);
                            getWareHouseDDL(
                              accountId,
                              selectedBusinessUnit.value,
                              data?.value,
                              setWareHouseFromDDL
                            );
                            if (values.wareHouseFrom?.value) {
                              getItemDDL(
                                accountId,
                                selectedBusinessUnit.value,
                                data?.value,
                                values.wareHouseFrom.value,
                                setItemDDL
                              );
                            }
                          }}
                          isDisabled={true}
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-6">
                        <NewSelect
                          value={values.wareHouseFrom}
                          label="Warehouse"
                          name="wareHouseFrom"
                          options={wareHouseFromDDL}
                          onChange={(data) => {
                            setFieldValue("wareHouseFrom", data);

                            if (values.plantFrom?.value) {
                              getItemDDL(
                                accountId,
                                selectedBusinessUnit.value,
                                values.plantFrom.value,
                                data?.value,
                                setItemDDL
                              );
                            }
                          }}
                          // isDisabled={!values.plantFrom}
                          isDisabled={true}
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form_header">Transfer To</div>
                    <div className="row">
                      <div className="col-lg-6">
                        <NewSelect
                          value={values.plantTo}
                          label="Plant"
                          name="plantTo"
                          options={plantFromDDL}
                          onChange={(data) => {
                            setFieldValue("plantTo", data);
                            getWareHouseDDL(
                              accountId,
                              selectedBusinessUnit.value,
                              data?.value,
                              setWareHouseToDDL
                            );
                          }}
                          isDisabled={true}
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-6">
                        <NewSelect
                          value={values.wareHouseTo}
                          label="Warehouse"
                          name="wareHouseTo"
                          options={wareHouseToDDL}
                          onChange={(data) => {
                            setFieldValue("wareHouseTo", data);
                          }}
                          // isDisabled={!values.plantTo}
                          isDisabled={true}
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row" style={{ marginTop: "15px" }}>
                <div className="col-lg-3">
                  <NewSelect
                    value={values.item}
                    label="Item"
                    name="item"
                    options={itemDDL}
                    onChange={(data) => {
                      setFieldValue("item", data);
                    }}
                    errors={errors}
                    // isDisabled={!values.referenceType}
                    isDisabled={true}
                    touched={touched}
                    // disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    disabled={true}
                    style={{ marginTop: "15px" }}
                    class="btn btn-primary ml-2"
                    type="button"
                    onClick={(e) => {
                      addRowDtoData(values.item);
                      setFieldValue("item", "");
                    }}
                  >
                    add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table
                  class="table table table-head-custom table-vertical-center inv_rowDto_tbl"
                  style={{ marginTop: "15px" }}
                >
                  <thead>
                    <tr>
                      <th tabindex="0">SL</th>
                      <th tabindex="0">Item Code</th>
                      <th tabindex="0">Item Name</th>
                      <th tabindex="0">Ref Qty</th>
                      <th tabindex="0">Rest Qty</th>
                      <th tabindex="0">Location</th>
                      <th tabindex="0">Stock Type</th>
                      <th tabindex="0">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.map((item, i) => (
                      <tr>
                        <td tabindex="0">{i}</td>
                        <td tabindex="0">{item.code}</td>
                        <td tabindex="0">{item.label}</td>
                        <td tabindex="0">{item.refQty}</td>
                        <td tabindex="0">{item.restQty}</td>
                        <td tabindex="0">{item.location.label}</td>
                        <td tabindex="0">{item.stockType.label}</td>
                        <td tabindex="0">{item.quantity}</td>
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
