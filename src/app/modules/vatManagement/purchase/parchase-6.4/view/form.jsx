/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { useDispatch } from "react-redux";
import {
  getVatBranches,
  getSupplierDDL,
  getTradeTypeDDL,
  getPaymentTermDDL,
  getTaxConfig,
  getTaxPortDDL,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  isDisabled,
}) {
  const [
    ,
    // taxBranchName
    setTaxBranchName,
  ] = useState([]);

  const [supplierDDL, setSupplierDDL] = useState([]);
  const [tradeTypeDDL, setTradeTypeDDL] = useState([]);
  const [paymentTermDDL, setPaymentTermDDL] = useState([]);
  const [taxConfig, setTaxConfig] = useState({});
  const dispatch = useDispatch();
  const [taxPortDDL, setTaxPortDDL] = useState([]);

  // const [check, setCheck] = useState(false);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getVatBranches(setTaxBranchName);
      getSupplierDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSupplierDDL
      );
      getTaxPortDDL(setTaxPortDDL);
      getTradeTypeDDL(setTradeTypeDDL);
      getPaymentTermDDL(setPaymentTermDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit.value &&
      initData?.tradeType?.value
    ) {
      getTaxConfig(
        profileData.accountId,
        selectedBusinessUnit.value,
        initData?.tradeType?.value,
        setTaxConfig
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, initData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            {isDisabled && <Loading />}
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
                        name="supplier"
                        options={supplierDDL}
                        value={values?.supplier}
                        label="Supplier Name"
                        onChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                          setFieldValue("address", valueOption?.address || "");
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
                        disabled={true}
                        type="date"
                        name="transactionDate"
                        placeholder=""
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

                    {values?.tradeType?.label === "Import" && (
                      <>
                        <div className="col-lg-3 mb-1">
                          <NewSelect
                            name="customsHouse"
                            options={[]}
                            value={values?.customsHouse}
                            label="Customs House"
                            onChange={(valueOption) => {}}
                            placeholder="Customs House"
                            errors={errors}
                            touched={touched}
                            isDisabled
                          />
                        </div>
                        {values?.customsHouse?.code && (
                          <div className="col-lg-3 mb-1">
                            <label>Customs House Code</label>
                            <InputField
                              value={values?.CustomsHouseCode}
                              name="CustomsHouseCode"
                              placeholder="Customs House"
                              type="text"
                              disabled
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="col-lg-3 pl pr-1 mb-1">
                      <label>
                        {" "}
                        {values?.tradeType?.label === "Local Purchase"
                          ? "Challan No"
                          : "Bill Of Entry No"}
                      </label>
                      <InputField
                        value={values?.refferenceNo}
                        name="refferenceNo"
                        placeholder={
                          values?.tradeType?.label === "Local Purchase"
                            ? "Challan No"
                            : "Bill Of Entry No"
                        }
                        type="text"
                        disabled
                      />
                    </div>

                    <div className="col-lg-3 mb-1">
                      <label>
                        {values?.tradeType?.label === "Local Purchase"
                          ? "Challan Date"
                          : "Bill of Entry Date"}
                      </label>
                      <InputField
                        value={values?.refferenceDate}
                        type="date"
                        name="refferenceDate"
                        placeholder=""
                        disabled
                      />
                    </div>

                    {values?.tradeType?.label === "Import" && (
                      <>
                        <div className="col-lg-3 mb-1">
                          <label>LC No.</label>
                          <InputField
                            value={values?.lcNumber}
                            name="lcNumber"
                            placeholder="LC No."
                            type="text"
                            disabled
                            onChange={(e) => {}}
                          />
                        </div>
                        <div className="col-lg-3 mb-1">
                          <label>LC Date</label>
                          <InputField
                            value={values?.lcDate}
                            name="lcDate"
                            placeholder="LC Date"
                            type="date"
                            disabled={isEdit}
                          />
                        </div>
                        <div className="col-lg-3 mb-1">
                          <NewSelect
                            name="country"
                            options={[]}
                            value={values?.country}
                            label="Country Of Origin"
                            onChange={(valueOption) => {
                              setFieldValue("country", valueOption);
                            }}
                            placeholder="Country Of Origin"
                            errors={errors}
                            touched={touched}
                            isDisabled
                          />
                        </div>

                        <div className="col-lg-3 mb-1">
                          <NewSelect
                            name="port"
                            options={taxPortDDL}
                            value={values?.port}
                            label="Port"
                            onChange={(valueOption) => {
                              setFieldValue("port", valueOption);
                            }}
                            placeholder="Port"
                            errors={errors}
                            touched={touched}
                            isDisabled
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Number Of Item</label>
                          <InputField
                            value={values?.numberOfItem}
                            name="numberOfItem"
                            placeholder="Number Of Item"
                            type="number"
                            min="0"
                            disabled
                            onChange={(e) => {}}
                          />
                        </div>
                      </>
                    )}

                    {values?.tradeType?.label === "Local Purchase" && (
                      <>
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total TDS Amount(%)</label>
                          <InputField
                            value={values?.totalTdsAmount}
                            name="totalTdsAmount"
                            s
                            placeholder="Total TDS Amount"
                            type="number"
                            disabled={isEdit}
                            min={0}
                          />
                        </div>
                        <div className="col-lg-3 pl pr-1 mb-1">
                          <label>Total VDS Amount(%)</label>
                          <InputField
                            value={values?.totalVdsAmount}
                            name="totalVdsAmount"
                            placeholder="Total VDS Amount"
                            type="number"
                            disabled={isEdit}
                            min={0}
                          />
                        </div>
                      </>
                    )}

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
                    {values?.tradeType?.label === "Import" && (
                      <div className="col-lg-3">
                        <label>CPC Code</label>
                        <InputField
                          value={values?.CPCCode?.label || values?.CPCCode}
                          name="CPCCode"
                          placeholder="CPC Code"
                          type="text"
                          disabled={isEdit}
                          onChange={(e) => {}}
                        />
                      </div>
                    )}

                    <div className="col-lg-3">
                      <label>GRN Number</label>
                      <InputField
                        value={values?.grnCode?.label || values?.grnCode}
                        name="grnCode"
                        placeholder="GRN Number"
                        type="text"
                        disabled
                        onChange={(e) => {}}
                      />
                    </div>

                    {values?.fileName && (
                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary mt-7"
                          type="button"
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(values?.fileName)
                            );
                          }}
                        >
                          Attachment View
                        </button>
                      </div>
                    )}

                    <div
                      class={`col-lg-3 d-flex flex-column justify-content-end align-items-end ${values
                        ?.tradeType?.label !== "Import" && "offset-6"}`}
                    >
                      <p className="mb-1">
                        <strong>Amount (Without SD/VAT): </strong>{" "}
                        {rowDto
                          ?.reduce(
                            (acc, cur) => acc + cur?.quantity * cur?.rate,
                            0
                          )
                          .toFixed(2)}
                      </p>
                      <p className="mb-1">
                        <strong>Amount (SD/VAT): </strong>
                        {rowDto
                          ?.reduce((acc, cur) => {
                            const amount = cur?.quantity * cur?.rate;
                            // const sdAmount = (amount * cur?.sd) / 100;
                            // const vatAmount = (amount * cur?.vat) / 100;
                            const sdAmount = +cur?.sd || 0;
                            const vatAmount = +cur?.vat || 0;
                            return acc + (amount + sdAmount + vatAmount);
                          }, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 pr-0 pr-3">
                  <table className="table table-striped table-bordered mt-3 global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "120px" }}>Item Name</th>
                        <th style={{ width: "100px" }}>UOM</th>
                        <th style={{ width: "50px" }}>Quantity</th>
                        <th style={{ width: "50px" }}>Rate</th>
                        {taxConfig?.isCd && (
                          <th style={{ width: "50px" }}>CD</th>
                        )}
                        {taxConfig?.isRd && (
                          <th style={{ width: "50px" }}>RD</th>
                        )}
                        {taxConfig?.isSd && (
                          <th style={{ width: "50px" }}>SD</th>
                        )}
                        {taxConfig?.isVat && (
                          <th style={{ width: "50px" }}>VAT</th>
                        )}
                        {taxConfig?.isAt && (
                          <th style={{ width: "50px" }}>AT</th>
                        )}
                        <th style={{ width: "50px" }}>Rebate/Refund</th>
                        <th style={{ width: "50px" }}>Rebate Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-left pl-2">{item?.label}</div>
                          </td>
                          <td>
                            <div className="text-left pl-2">
                              {item?.uom?.label}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Number(item?.quantity?.toFixed(3))}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Number(item?.rate.toFixed(2))}
                            </div>
                          </td>
                          {taxConfig?.isCd && (
                            <td>
                              <div className="text-center">
                                {Number(item?.cd.toFixed(2))}
                              </div>
                            </td>
                          )}
                          {taxConfig?.isRd && (
                            <td>
                              <div className="text-center">
                                {Number(item?.rd.toFixed(2))}
                              </div>
                            </td>
                          )}
                          {taxConfig?.isSd && (
                            <td>
                              <div className="text-center">
                                {Number(item?.sd.toFixed(2))}
                              </div>
                            </td>
                          )}
                          {taxConfig?.isVat && (
                            <td>
                              <div className="text-center">
                                {Number(item?.vat.toFixed(2))}
                              </div>
                            </td>
                          )}
                          {taxConfig?.isAt && (
                            <td>
                              <div className="text-center">
                                {Number(item?.at.toFixed(2))}
                              </div>
                            </td>
                          )}

                          <td>
                            <div className="text-center">
                              {Number(item?.refund.toFixed(2))}
                            </div>
                          </td>
                          <td>
                            <div className="text-center">
                              {Number(item?.rebateAmount.toFixed(2))}
                            </div>
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
