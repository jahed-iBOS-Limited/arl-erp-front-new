import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import FormikError from "../../../../_helper/_formikError";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import {
  getVatBranches,
  getSupplierDDL,
  getTradeTypeDDL,
  getPaymentTermDDL,
  getItemDDL,
  getUomDDL,
  getTaxConfig
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";


// Validation schema
const validationSchema = Yup.object().shape({
  taxBranchName: Yup.object().shape({
    label: Yup.string().required("Tax Branch Name required"),
    value: Yup.string().required("Tax Branch Name required"),
  }),
  taxBranchAddress: Yup.string().required("Tax Branch Address other required"),
  businessUnitName: Yup.object().shape({
    label: Yup.string().required("Supply Type  is required"),
    value: Yup.string().required("Supply Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  remover,
  setter,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  dataHandler,
  itemSelectHandler,
}) {
  const [taxBranchName, setTaxBranchName] = useState([]);

  const [supplierDDL, setSupplierDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [uomDDL, setUomDDL] = useState([]);
  const [taxConfig, setTaxConfig] = useState({});


  // const [check, setCheck] = useState(false);
  useEffect(() => {
    if ((profileData.accountId, selectedBusinessUnit.value)) {

      getVatBranches(setTaxBranchName);

      getSupplierDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSupplierDDL
      )
      getTaxConfig(
        selectedBusinessUnit.value,
        setTaxConfig
      )
      getTradeTypeDDL(setTradeTypeDDL)
      getPaymentTermDDL(setPaymentTermDDL)
      getItemDDL(setItemDDL)
      getUomDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setUomDDL
      )

    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>

      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
          setValues,
          setFieldValue,
          isValid,
        }) => (
            <>
              {disableHandler(!isValid)}
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-12">
                    <div
                      className="row bank-journal  "
                      // style={{ paddingBottom: "20px" }}
                      style={{ paddingBottom: "20px 0" }}
                    >
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <NewSelect
                          name="supplier"
                          options={supplierDDL}
                          value={values?.supplier}
                          label="Supplier Name"
                          onChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          placeholder="Supplier Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Address</label>
                        <InputField
                          value={values?.address}
                          name="address"
                          placeholder="Address"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">

                        <InputField
                          value={_dateFormatter(values?.transactionDate)}
                          label="Transaction Date"
                          // disabled={id ? true : false}
                          type="date"
                          name="transactionDate"
                          placeholder=""
                        />

                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <NewSelect
                          name="tradeType"
                          options={tradeTypeDDL}
                          value={values?.tradeType}
                          label="Trade Type"
                          onChange={(valueOption) => {
                            setFieldValue("tradeType", valueOption);
                          }}
                          placeholder="Unit"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <NewSelect
                          name="paymentTerm"
                          options={paymentTermDDL}
                          value={values?.paymentTerm}
                          label="Payment Term"
                          onChange={(valueOption) => {
                            setFieldValue("paymentTerm", valueOption);
                          }}
                          placeholder="Unit"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Vehical Info</label>
                        <InputField
                          value={values?.vehicalInfo}
                          name="vehicalInfo"
                          placeholder="Vehical Info"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Refference No</label>
                        <InputField
                          value={values?.refferenceNo}
                          name="refferenceNo"
                          placeholder="Refference No"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">

                        <InputField
                          value={_dateFormatter(values?.refferenceDate)}
                          label="Refference Date"
                          // disabled={id ? true : false}
                          type="date"
                          name="refferenceDate"
                          placeholder=""
                        />
                      </div>

                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Total TDS Amount</label>
                        <InputField
                          value={values?.totalTdsAmount}
                          name="totalTdsAmount"
                          placeholder="Total TDS Amount"
                          type="number"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Total VDS Amount</label>
                        <InputField
                          value={values?.totalVdsAmount}
                          name="totalVdsAmount"
                          placeholder="Total VDS Amount"
                          type="number"
                          disabled={isEdit}
                        />
                      </div>

                      {taxConfig?.isAit && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total AIT Amount</label>
                          <InputField
                            value={values?.totalAit}
                            name="totalAit"
                            placeholder="Total AIT Amount"
                            type="number"
                            disabled={isEdit}
                          />

                        </div>
                      )}
                      {taxConfig?.isAtv && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total ATV Amount</label>
                          <InputField
                            value={values?.totalAtv}
                            name="totalAtv"
                            placeholder="Total ATV Amount"
                            type="number"
                            disabled={isEdit}
                          />

                        </div>
                      )}



                      {/* <div className="col-lg-3 bank-journal">
                        <button
                          style={{ marginTop: "10px" }}
                          type="button"
                          disabled={!values?.taxBranchName}
                          className="btn btn-primary"
                          onClick={() => {
                            setter(values);
                          }}
                        >
                          View
                      </button>
                      </div> */}
                    </div>
                  </div>

                  {/* <div className="col-md-12">
                    <div className="row "
                      style={{ padding: "20px 0" }}
                    >
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Total TDS Amount</label>
                        <InputField
                          value={values?.totalTdsAmount}
                          name="totalTdsAmount"
                          placeholder="Total TDS Amount"
                          type="number"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3 pl pr-1 mb-1">
                        <label>Total VDS Amount</label>
                        <InputField
                          value={values?.totalVdsAmount}
                          name="totalVdsAmount"
                          placeholder="Total VDS Amount"
                          type="number"
                          disabled={isEdit}
                        />
                      </div>

                      {taxConfig?.isAit && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total AIT Amount</label>
                          <InputField
                            value={values?.totalAit}
                            name="totalAit"
                            placeholder="Total AIT Amount"
                            type="number"
                            disabled={isEdit}
                          />

                        </div>
                      )}
                      {taxConfig?.isAtv && (
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total ATV Amount</label>
                          <InputField
                            value={values?.totalAtv}
                            name="totalAtv"
                            placeholder="Total ATV Amount"
                            type="number"
                            disabled={isEdit}
                          />

                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Item Input */}
                  <div className="col-md-12">
                    <div className="row "
                      style={{ paddingTop: "20px" }}
                    >
                      <div className="col-lg-2 pl pr-1 mb-1">
                        <NewSelect
                          name="selectedItem"
                          options={itemDDL}
                          value={values?.selectedItem}
                          label="Item"
                          onChange={(valueOption) => {
                            setFieldValue("selectedItem", valueOption);
                          }}
                          placeholder="Item Name"
                          errors={errors}
                          touched={touched}
                        // isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 pl pr-1 mb-1">
                        <NewSelect
                          name="selectedUom"
                          options={uomDDL}
                          value={values?.selectedUom}
                          label="UOM"
                          onChange={(valueOption) => {
                            setFieldValue("selectedUom", valueOption);
                          }}
                          placeholder="Select Uom"
                          errors={errors}
                          touched={touched}
                        // isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-2 pl pr-1 mb-1">
                        <label>Quantity</label>
                        <InputField
                          value={values?.quantity}
                          name="quantity"
                          placeholder="Total VDS Amount"
                          type="number"
                        // disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-2 pl pr-1 mb-1">
                        <label>Rate</label>
                        <InputField
                          value={values?.rate}
                          name="rate"
                          placeholder="rate"
                          type="number"
                        // disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-2 pl pr-1 mb-1">
                        <button
                          disabled={!values.selectedItem || !values.selectedUom || !values.quantity || !values.rate}
                          style={{
                            marginTop: "16px"
                          }}
                          onClick={e => {
                            setter(values, () => {

                              setValues({
                                ...values,
                                selectedItem: "",
                                selectedUom: "",
                                quantity: "",
                                rate: ""
                              })
                            })
                          }}
                          class="btn btn-primary ml-2">Add</button>
                      </div>
                    </div>
                  </div>

                </div>


                <div className="row">
                  <div className="col-lg-12 pr-0">
                    <table className={"table mt-1 bj-table"}>
                      <thead
                      // className={rowDto?.length < 1 && "d-none"}
                      >
                        <tr>
                          <th style={{ width: "20px" }}>SL</th>
                          <th style={{ width: "120px" }}>Item Name</th>
                          <th style={{ width: "100px" }}>UOM</th>
                          <th style={{ width: "50px" }}>Quantity</th>
                          <th style={{ width: "50px" }}>Rate</th>
                          {taxConfig?.isCd && (<th style={{ width: "50px" }}>CD%</th>)}
                          {taxConfig?.isRd && (<th style={{ width: "50px" }}>RD%</th>)}
                          {taxConfig?.isSd && (<th style={{ width: "50px" }}>SD%</th>)}
                          {taxConfig?.isVat && (<th style={{ width: "50px" }}>VAT%</th>)}
                          {/* {taxConfig?.isAit && (<th style={{ width: "50px" }}>AIT%</th>)} */}
                          {/* {taxConfig?.isAtv && (<th style={{ width: "50px" }}>ATV</th>)} */}
                          <th style={{ width: "50px" }}>Rebate/Refund %</th>
                          <th style={{ width: "50px" }}>Rebate Amont</th>
                          <th style={{ width: "50px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.label}
                              </div>
                            </td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.uom?.label}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <input
                                  onChange={e => {
                                    dataHandler(
                                      "quantity",
                                      e.target.value,
                                      index
                                    )
                                    if (item.refund && item.rate) {
                                      const rebateAmount = e.target.value ?
                                        (parseInt(item.refund) / 100) * (item.rate * e.target.value)
                                        : 0;
                                      dataHandler(
                                        "rebateAmount",
                                        rebateAmount,
                                        index
                                      )
                                    }
                                  }}
                                  className="form-control"
                                  type="number"
                                  name="quantity"
                                  value={item.quantity}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <input
                                  onChange={e => {
                                    dataHandler(
                                      "rate",
                                      e.target.value,
                                      index
                                    )
                                    if (item.refund && item.quantity) {
                                      const rebateAmount = e.target.value ?
                                        (parseInt(item.refund) / 100) * (e.target.value * item.quantity)
                                        : 0;

                                      dataHandler(
                                        "rebateAmount",
                                        rebateAmount,
                                        index
                                      )
                                    }
                                  }}
                                  className="form-control"
                                  type="number"
                                  name="rate"
                                  value={item.rate}
                                />
                              </div>
                              {/* <div className="text-center">
                                <input
                                  style={{
                                    marginTop: "10px",
                                  }}
                                  type="checkbox"
                                  name="isFree"
                                  value={item.isFree}
                                  checked={item.isFree}
                                  onChange={(e) => {
                                    itemSelectHandler(
                                      index,
                                      e.target.checked,
                                      e.target.name
                                    );
                                  }}
                                />
                              </div> */}
                            </td>
                            {taxConfig?.isCd && (
                              <td>
                                <input
                                  onChange={e =>
                                    dataHandler(
                                      "cd",
                                      e.target.value,
                                      index
                                    )}
                                  className="form-control"
                                  type="number"
                                  name="cd"
                                  value={item.cd}
                                />
                              </td>
                            )}
                            {taxConfig?.isRd && (<td>
                              <input
                                onChange={e =>
                                  dataHandler(
                                    "rd",
                                    e.target.value,
                                    index
                                  )}
                                className="form-control"
                                type="number"
                                name="rd"
                                value={item.rd}
                              />
                            </td>
                            )}
                            {taxConfig?.isSd && (<td>
                              <input
                                onChange={e =>
                                  dataHandler(
                                    "sd",
                                    e.target.value,
                                    index
                                  )}
                                className="form-control"
                                type="number"
                                name="sd"
                                value={item.sd}
                              />
                            </td>)}
                            {taxConfig?.isVat && (
                              <td>
                                <input
                                  onChange={e =>
                                    dataHandler(
                                      "vat",
                                      e.target.value,
                                      index
                                    )}
                                  className="form-control"
                                  type="number"
                                  name="vat"
                                  value={item.vat}
                                />
                              </td>
                            )}
                            {/* {taxConfig?.isAit && (
                            <td>
                              <input
                                onChange={e =>
                                  dataHandler(
                                    "ait",
                                    e.target.value,
                                    index
                                  )}
                                className="form-control"
                                type="number"
                                name="ait"
                                value={item.ait}
                              />
                            </td>
                            )}
                            {taxConfig?.isAtv && (
                            <td>
                              <input
                                onChange={e =>
                                  dataHandler(
                                    "atv",
                                    e.target.value,
                                    index
                                  )}
                                className="form-control"
                                type="number"
                                name="atv"
                                value={item.atv}
                              />
                            </td>
                            )} */}
                            <td>
                              <input
                                onChange={e => {

                                  dataHandler(
                                    "refund",
                                    e.target.value,
                                    index
                                  )
                                  if (item.rate && item.quantity) {
                                    const rebateAmount = e.target.value ?
                                      (parseInt(e.target.value) / 100) * (item.rate * item.quantity)
                                      : 0;
                                    dataHandler(
                                      "rebateAmount",
                                      rebateAmount,
                                      index
                                    )
                                  }


                                }}
                                className="form-control"
                                type="number"
                                name="refund"
                                value={item.refund}
                              />
                            </td>
                            <td>
                              <input
                                onChange={e =>
                                  dataHandler(
                                    "rebateAmount",
                                    e.target.value,
                                    index
                                  )}
                                className="form-control"
                                type="number"
                                name="rebateAmount"
                                value={item.rebateAmount}
                                disabled={true}
                              />
                            </td>
                            <td className="text-center">
                              <IDelete remover={remover} id={index} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
