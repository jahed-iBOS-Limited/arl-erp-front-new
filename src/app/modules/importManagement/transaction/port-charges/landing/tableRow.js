import React, { useState } from "react";
import Loading from "../../../../_helper/_loading";
import {
  getCNFPaymentPortCharge,
  getPortCharge,
  getPortChargeLanding,
  getShipmentDDL,
} from "../helper";
import serviceBreakdonw from "../serviceBreakdonw.png";

import Axios from "axios";
import { Form, Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  clickSaveBtn,
  disabledFunction,
  initData,
  setDataToGridData,
} from "../utils";
// import ICustomTable from "../../../../_helper/_customTable";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import BreakDownModal from "../breakDown/breakDownModal";
import ClosingModal from "../closing/closing";
// const header = [
//   "SL",
//   "Charge Type",
//   "Supplier",
//   "Service Receive Date",
//   "Total Amount (Including VAT)",
//   "VAT Amount",
//   "Payment/Due Date",
//   "Action",
// ];

export default function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [chargeTypeId, setSubChargeTypeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setDisabled] = useState(false);
  const [shipmentDDL, setShipmentDDL] = useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [data, setData] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowClosingModal, setIsShowClosingModal] = useState(false);
  const [polcNo, setPolcNo] = useState({});
  const [referenceId, setReferenceId] = useState(0);
  const [shipmentId, setShipmentId] = useState(0);
  const [closingReferenceId, setClosingReferenceId] = useState(0);
  const [closingTotalBookedAmount, setClosingTotalBookedAmount] = useState(0);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Service Charges"></CardHeader>
              <CardBody>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <span>
                    <span style={{ fontWeight: "900" }}>
                      Beneficiary Name :
                    </span>{" "}<br/>
                    {data?.beneficiaryName}
                  </span>
                  <span className="mx-4">
                    <span style={{ fontWeight: "900" }}>PO No:</span>
                    <br/>
                    {data?.poNo}
                  </span>
                  <span>
                    <span style={{ fontWeight: "900" }}>LC No :</span>{" "}
                    <br/>
                    {data?.lcNo}
                  </span>
                  <span className="ml-4">
                    <span style={{ fontWeight: "900" }}>Total PI Amount :</span>{" "}
                    <br/>
                    {numberWithCommas(data?.totalPiAmount)}
                  </span>
                  <span className="ml-4">
                    <span style={{ fontWeight: "900" }}>Vassel Name :</span>{" "}
                    <br/>
                    {data?.vasselName}
                  </span>
                </div>

                <Form className="form form-label-right">
                  {/* Header Start */}

                  <div className="row global-form">
                    <div className="col-md-3 col-lg-3">
                      <label>PO/LC No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLcDDL}
                        paddingRight={10}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setData(valueOption ? { ...data } : {});
                          setFieldValue("shipmentExchangeRate", "");
                          setFieldValue("poLcDDL", valueOption);
                          setPolcNo(valueOption);
                          getShipmentDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.label,
                            setShipmentDDL
                          );
                          setFieldValue("shipmentDDL", "");
                          getPortCharge(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.poId || 0,
                            values?.shipmentDDL?.value || 0,
                            setData
                          );
                        }}
                        loadOptions={polcList}
                        placeholder="Search by PO/LC No"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipmentDDL"
                        options={shipmentDDL}
                        label="Shipment"
                        value={values?.shipmentDDL}
                        onChange={(valueOption) => {
                          setFieldValue("shipmentDDL", valueOption);
                          setShipmentId(valueOption?.value);
                          setFieldValue("shipmentExchangeRate", "");
                          getPortChargeLanding(
                            profileData?.accountId,
                            selectedBusinessUnit.value,
                            values?.poLcDDL?.label,
                            valueOption?.label,
                            setGridData,
                            setLoading
                          );
                          getPortCharge(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.poLcDDL?.poId || 0,
                            valueOption?.value || 0,
                            setData,
                            setReferenceId
                          );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <div className="text-wrap">
                    <div className="row mt-2 ">
                      <span className="col-auto">
                        <span style={{ fontWeight: "900" }}>
                          {`Shipment Invoice Amount${
                            data?.currencyName
                              ? " (" + data?.currencyName + ")"
                              : ""
                          } :`}
                        </span>{" "}
                        {numberWithCommas(data?.shipmentInvoiceAmountFc)}
                      </span>

                      <div className="col-auto d-flex">
                        <label style={{ fontWeight: "900", width: "8rem" }}>
                          Exchange Rate:
                        </label>
                        <input
                          name="shipmentExchangeRate"
                          value={values?.shipmentExchangeRate}
                          placeholder="Exchange Rate"
                          type="Number"
                          disabled={!values?.shipmentDDL}
                          min="0"
                          onChange={(e) => {
                            setFieldValue(
                              "shipmentExchangeRate",
                              e?.target?.value ? +e?.target.value : ""
                            );

                            setData({
                              ...data,
                              shippmentInvoiceAmountBDT:
                                +e?.target?.value *
                                data?.shipmentInvoiceAmountFc,
                            });
                            getCNFPaymentPortCharge(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              gridData[2]?.row[0]?.value,
                              +e?.target?.value * data?.shipmentInvoiceAmountFc,
                              gridData,
                              setGridData,
                              2,
                              "vendor",
                              "CnF Payment"
                            );
                          }}
                        />
                      </div>
                      <span className="col-auto">
                        <span style={{ fontWeight: "900" }}>
                          Shipment Invoice Amount(BDT) :
                        </span>{" "}
                        {numberWithCommas(
                          data?.shippmentInvoiceAmountBDT?.toFixed(2)
                        ) || 0}
                      </span>
                    </div>
                  </div>

                  <div className="row cash_journal">
                    {loading && <Loading />}
                    {values?.poLcDDL?.poId && values?.shipmentDDL?.value && (
                      <div className="col-md-12">
                        <div className="global-form">
                          <div className="react-bootstrap-table table-responsive">
                            <table className="table table-striped table-bordered global-table">
                              <thead>
                                <tr>
                                  <th>SL</th>
                                  <th>Charge Type</th>
                                  <th>Supplier</th>
                                  <th>Service Receive Date</th>
                                  <th>Total Amount (Including VAT)</th>
                                  <th>VAT Amount</th>
                                  <th>Payment/Due Date</th>
                                  <th style={{ width: "150px" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {gridData?.length > 0 &&
                                  gridData?.map((item, index) => {
                                    return (
                                      <>
                                        <tr key={index}>
                                          <td>
                                            <span className="pl-2">
                                              {index + 1}
                                            </span>
                                          </td>
                                          <td style={{ width: "220px" }}>
                                            <span className="pl-2">
                                              {item?.label}
                                            </span>
                                          </td>
                                          <td style={{ width: "240px" }}>
                                            <NewSelect
                                              name="vendor"
                                              menuPosition="fixed"
                                              value={
                                                item?.status
                                                  ? {
                                                      label: item?.providerName,
                                                      value: item?.providerId,
                                                    }
                                                  : item?.vendor
                                              }
                                              options={item?.row}
                                              onChange={(valueOption) => {
                                                setFieldValue(
                                                  "vendor",
                                                  valueOption
                                                );
                                                setDataToGridData(
                                                  "vendor",
                                                  index,
                                                  valueOption,
                                                  gridData,
                                                  setGridData,
                                                  item?.label
                                                );
                                                // getCNFPaymentPortCharge(
                                                //   profileData?.accountId,
                                                //   selectedBusinessUnit?.value,
                                                //   valueOption?.value,
                                                //   data?.shippmentInvoiceAmountBDT,
                                                //   gridData,
                                                //   setGridData,
                                                //   index,
                                                //   "vendor",
                                                //   item?.label
                                                // );
                                              }}
                                              errors={errors}
                                              touched={touched}
                                              isDisabled={
                                                item?.status === true ||
                                                disabledFunction(
                                                  values?.shipmentExchangeRate,
                                                  item?.label,
                                                  "vendor",
                                                  gridData,
                                                  index
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <InputField
                                              style={{ width: "135px" }}
                                              name="serviceReceiveDate"
                                              value={_dateFormatter(
                                                item?.serviceReceiveDate
                                              )}
                                              onChange={(e) => {
                                                // setFieldValue(
                                                //   "serviceReceiveDate",
                                                //   e?.target?.value
                                                // );
                                                setDataToGridData(
                                                  "serviceReceiveDate",
                                                  index,
                                                  e?.target?.value,
                                                  gridData,
                                                  setGridData,
                                                  item?.label
                                                );
                                              }}
                                              placeholder=""
                                              type="date"
                                              disabled={item?.status === true}
                                            />
                                          </td>
                                          <td style={{ width: "150px" }}>
                                            <InputField
                                              name="totalAmount"
                                              value={item?.totalAmount}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "totalAmount",
                                                  e?.target?.value
                                                );
                                                setDataToGridData(
                                                  "totalAmount",
                                                  index,
                                                  e?.target?.value,
                                                  gridData,
                                                  setGridData,
                                                  item?.label
                                                );
                                              }}
                                              placeholder="Amount BDT"
                                              type="number"
                                              disabled={item?.status === true}
                                            />
                                          </td>
                                          <td style={{ width: "100px" }}>
                                            <InputField
                                              value={item?.vatAmount}
                                              name="vatAmount"
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "vatAmount",
                                                  e?.target?.value
                                                );
                                                setDataToGridData(
                                                  "vatAmount",
                                                  index,
                                                  e?.target?.value,
                                                  gridData,
                                                  setGridData,
                                                  item?.label
                                                );
                                              }}
                                              type="number"
                                              placeholder="VAT"
                                              min="0"
                                              disabled={item?.status === true}
                                            />
                                          </td>

                                          <td>
                                            <InputField
                                              style={{ width: "135px" }}
                                              name="dueDate"
                                              value={_dateFormatter(
                                                item?.dueDate
                                              )}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "dueDate",
                                                  e?.target?.value
                                                );
                                                setDataToGridData(
                                                  "dueDate",
                                                  index,
                                                  e?.target?.value,
                                                  gridData,
                                                  setGridData,
                                                  item?.label
                                                );
                                              }}
                                              placeholder=""
                                              type="date"
                                              disabled={item?.status === true}
                                            />
                                          </td>
                                          {/* <td>
                                      <InputField
                                        style={{ width: "135px" }}
                                        name='serviceReceiveDate'
                                        value={_dateFormatter(
                                          item?.serviceReceiveDate
                                        )}
                                        onChange={(e) => {
                                          // setFieldValue(
                                          //   "serviceReceiveDate",
                                          //   e?.target?.value
                                          // );
                                          setDataToGridData(
                                            "serviceReceiveDate",
                                            index,
                                            e?.target?.value,
                                            gridData,
                                            setGridData,
                                            item?.label
                                          );
                                        }}
                                        placeholder=''
                                        type='date'
                                        disabled={item?.status === true}
                                      />
                                    </td> */}
                                          <td className="text-center">
                                            <>
                                              {item?.status === true &&
                                              (item?.value === 4 ||
                                                item?.value === 5 ||
                                                item?.value === 6 ||
                                                item?.value === 7 ||
                                                item?.value === 8 ||
                                                item?.value === 9 ||
                                                item?.value === 10) ? (
                                                <span
                                                  style={{ marginLeft: "3px" }}
                                                >
                                                  {/* <span>
                                              <img width="16px" src={serviceBreakdonw} alt="" />
                                            </span> */}
                                                  <button
                                                    className="btn mr-1 pointer"
                                                    type="button"
                                                    onClick={() => {
                                                      setIsShowModal(true);
                                                      setSupplierDDL(item.row);
                                                      setSubChargeTypeId(
                                                        item.value
                                                      );
                                                      getPortCharge(
                                                        profileData?.accountId,
                                                        selectedBusinessUnit?.value,
                                                        values?.poLcDDL?.poId ||
                                                          0,
                                                        values?.shipmentDDL
                                                          ?.value || 0,
                                                        setData,
                                                        setReferenceId,
                                                        item?.value
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      width="13px"
                                                      src={serviceBreakdonw}
                                                      alt=""
                                                    />
                                                  </button>
                                                  <span
                                                    onClick={() => {
                                                      setIsShowClosingModal(
                                                        true
                                                      );
                                                      item?.value === 5
                                                        ? setClosingReferenceId(
                                                            data?.surveyReferenceId
                                                          )
                                                        : item?.value === 6
                                                        ? setClosingReferenceId(
                                                            data?.unloadingReferenceId
                                                          )
                                                        : item?.value === 7
                                                        ? setClosingReferenceId(
                                                            data?.cleaningReferenceId
                                                          )
                                                        : item?.value === 8
                                                        ? setClosingReferenceId(
                                                            data?.othersReferenceId
                                                          )
                                                        : item?.value === 4
                                                        ? setClosingReferenceId(
                                                            data?.transportReferenceId
                                                          )
                                                        : item?.value === 9
                                                        ? setClosingReferenceId(
                                                            data?.hatchReferenceId
                                                          )
                                                        : item?.value === 10
                                                        ? setClosingReferenceId(
                                                            data?.scavatoryReferenceId
                                                          )
                                                        : setClosingReferenceId(
                                                            0
                                                          );

                                                      setClosingTotalBookedAmount(
                                                        item?.totalAmount
                                                      );
                                                      //confirmToCancel(item?.renewalId)
                                                    }}
                                                    className="btn p-0"
                                                  >
                                                    <i class="fas fa-check-circle"></i>
                                                  </span>
                                                </span>
                                              ) : (
                                                <button
                                                  style={{
                                                    padding: "1px 5px",
                                                    fontSize: "11px",
                                                    width: "85px",
                                                  }}
                                                  className="btn btn-outline-dark mr-1 pointer"
                                                  type="button"
                                                  disabled={
                                                    item?.status === true
                                                  }
                                                  onClick={() => {
                                                    clickSaveBtn(
                                                      item,
                                                      values,
                                                      setDisabled,
                                                      profileData,
                                                      selectedBusinessUnit,
                                                      setGridData,
                                                      setLoading,
                                                      setData,
                                                      setReferenceId
                                                    );
                                                  }}
                                                >
                                                  Save
                                                </button>
                                              )}
                                            </>
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                          {/* <ICustomTable ths={header}>
                            
                          </ICustomTable> */}
                        </div>
                      </div>
                    )}
                    {/* {gridData?.data?.length > 0 && (
                      <PaginationTable
                        count={gridData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                      />
                    )} */}
                  </div>
                </Form>
              </CardBody>
            </Card>
            <BreakDownModal
              show={isShowModal}
              onHide={() => setIsShowModal(false)}
              supplierDDL={supplierDDL}
              polcNo={polcNo}
              referenceId={referenceId}
              setReferenceId={setReferenceId}
              shipmentId={shipmentId}
              chargeTypeId={chargeTypeId}
            />
            <ClosingModal
              show={isShowClosingModal}
              onHide={() => setIsShowClosingModal(false)}
              supplierDDL={supplierDDL}
              polcNo={polcNo}
              referenceId={referenceId}
              closingReferenceId={closingReferenceId}
              setReferenceId={setReferenceId}
              shipmentId={shipmentId}
              closingTotalBookedAmount={closingTotalBookedAmount}
              setClosingReferenceId={setClosingReferenceId}
              allPoInfo={data}
            />
          </>
        )}
      </Formik>
    </>
  );
}
