import React, { useRef, useState, useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Formik, Form } from "formik";
import { CashForm } from "./cashForm";
import { BankForm } from "./bankForm";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import {
  getInstrumentTypeDDL,
  getTransactionDDL,
  createBankCashPayment,
} from "../helper";
import { toast } from "react-toastify";
import { getGridData } from "../helper";
import { getPurchaseClearPagination_api } from "./../helper";

const initData = {
  type: "cash",
  // Cash Form
  cashGl: "",
  amount: "",
  paidTo: "",
  date: _todayDate(),

  // Bank Form
  instumentType: "",
  instumentNo: "",
  instumentDate: _todayDate(),
  bank: "",

  transaction: "",
  transactionAmount: "",

  currentDate: _todayDate(),
};

const claculator = (arr, key) => {
  const total = arr?.reduce((acc, cur) => (acc += cur?.[key]), 0);
  return total;
};

export default function PaymentModal({
  show,
  onHide,
  profileData,
  selectedBusinessUnit,
  selectedPurchase,
  glGridData,
  setGlGridData,
  cashGlDDL,
  bankAcDDL,
  setPaymentModal,
  plantNameInitData,
  setGridData,
  setLoading,
  pageNo,
  pageSize,
}) {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);

  const [instumentType, setInstumentType] = useState([]);
  const [transactionDDL, setTransactionDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTransactionDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTransactionDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getInstrumentTypeDDL(setInstumentType);
  }, []);

  const rowTotal = claculator(rowDto, "amount") * Math.sign(-1);

  const setter = (values, cb) => {
    const arr = rowDto?.filter(
      (item) => item?.value === values?.transaction?.value
    );
    if (arr?.length > 0) {
      toast.warn("Not allowed to duplicate items");
    } else {
      const selectedTransaction = values?.transaction;
      const item = {
        ...values?.transaction,
        glCode: selectedTransaction?.generalLedgerCode,
        glName: selectedTransaction?.generalLedgerName,
        transaction: selectedTransaction?.label,
        // convert into negative number
        amount: -Math.abs(values?.transactionAmount),
      };
      setRowDto([...rowDto, item]);
      cb();
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const calculateTotalAmount = (initialAmount) => {
    let total = -Math.abs(initialAmount);
    rowDto.forEach((item) => {
      total -= item.amount;
    });
    return total;
  };

  const saveHandler = async (values, cb) => {
    // setDisabled(true);

    const row = rowDto.map((item, idx) => ({
      amountTypeId: 0,
      bankAccountId: values?.bank?.value || 0,
      bankAccNo: values?.bank ? values?.bank?.label.split(" ")[0] : "",
      businessTransactionId: item.value || 0,
      businessTransactionCode: item.businessTransactionCode || "",
      businessTransactionName: item.label || "",
      generalLedgerId: item.generalLedgerId || 0,
      generalLedgerCode: item.generalLedgerName || "",
      generalLedgerName: item.generalLedgerName || "",
      deductionAmount: item.amount || 0,
      narration: "",
    }));

    const grid = glGridData.map((item, index) => ({
      amountTypeId: 0,
      bankAccountId: values?.bank?.value || 0,
      bankAccNo: values?.bank ? values?.bank?.label.split(" ")[0] : "",
      businessTransactionId: item.glId || 0,
      businessTransactionCode: item.glCode || "",
      businessTransactionName: item.glName || "",
      generalLedgerId: item.generalLedgerId || 0,
      generalLedgerCode: item.generalLedgerName || "",
      generalLedgerName: item.generalLedgerName || "",
      deductionAmount:
        index === 0
          ? values?.amount
          : -Math.abs(calculateTotalAmount(values.amount)),
      narration: "",
    }));

    const payload = {
      objPay: {
        intSupplierInvoiceId: selectedPurchase?.supplierInvoiceId,
        paymentProcessType: values?.type === "cash" ? 1 : 0,
        invoiceCode: selectedPurchase?.invoiceCode || "",
        journalDate: "2020-12-27T08:29:58.817Z",
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        sbuid: selectedPurchase?.sbuId || 0,
        receiveFrom: "",
        transferTo: "",
        paidTo: values?.paidTo || "",
        // payAmount: +values?.amount || 0,
        payAmount: -Math.abs(values?.amount) || 0,
        narration: "",
        businessPartnerId: selectedPurchase?.partnerId || 0,
        businessPartnerCode: "",
        businessPartnerName: "",
        generalLedgerId: values?.cashGl?.value || 0,
        generalLedgerCode: values?.cashGl?.generalLedgerCode || "",
        generalLedgerName: values?.cashGl?.label || "",
        actionBy: 0,
        bankId: values?.bank?.bankId || 0,
        bankName: values?.bank?.bankName || "",
        bankBranchId: values?.bank?.bankBranch_Id || 0,
        bankBranchName: values?.bank?.bankBranchName || "",
        bankAccountId: values?.bank?.value || 0,
        bankAccountNumber: values?.bank
          ? values?.bank?.label.split(" ")[0]
          : "",
        isPlacedInBank: true,
        placingDate: "2020-12-27T08:29:58.817Z",
        completeDateTime: "2020-12-27T08:29:58.817Z",
        instrumentId: values?.instumentType?.value || 0,
        instrumentName: values?.instumentType?.label || "",
        instrumentNo: values.instumentNo || "",
        instrumentDate: values.instumentDate || "2020-12-27T08:29:58.817Z",
      },

      objList: [...grid, ...row],
    };

    if (rowTotal > values?.amount) {
      toast.warn("Must be less than zero");
    } else {
      const customCallback = () => {
        cb();
        setPaymentModal(false);
        getPurchaseClearPagination_api(
          selectedBusinessUnit?.value,
          plantNameInitData?.value,
          profileData?.accountId,
          setGridData,
          setLoading,
          pageNo,
          pageSize
        );
      };

      createBankCashPayment(payload, customCallback, setRowDto);
    }
  };

  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
          setRowDto([]);
          setGlGridData([]);
        }}
        title={"Payment"}
        btnText="Close"
        componentRef={printRef}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            cashGl: {
              value: cashGlDDL ? cashGlDDL[0]?.value : "",
              label: cashGlDDL ? cashGlDDL[0]?.label : "",
            },
            bank: {
              value: bankAcDDL ? bankAcDDL[0]?.value : "",
              label: bankAcDDL ? bankAcDDL[0]?.label : "",
            },
            paidTo: selectedPurchase ? selectedPurchase?.partnerName : "",
            amount: selectedPurchase ? selectedPurchase?.invoiceAmount : "",
          }}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, resetForm);
            // onSubmit(values);
          }}
        >
          {({
            errors,
            touched,
            setFieldValue,
            isValid,
            values,
            handleSubmit,
            resetForm,
          }) => (
            <>
              <Form>
                <div className="text-right">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "14px" }}
                    type="submit"
                  >
                    Save
                  </button>
                </div>

                <div className="row">
                  <div className="col-lg-2">
                    <label> Partner : {selectedPurchase.partnerName}</label>
                  </div>
                  <div className="col-lg-2">
                    <label>
                      {" "}
                      Ledger Balance : {selectedPurchase.ledgerBalance}
                    </label>
                  </div>
                  <div className="col-lg-2">
                    <label> PO Amount : {selectedPurchase.poAmount}</label>
                  </div>
                  <div className="col-lg-2">
                    <label> GRN Amount : {selectedPurchase.grnAmount}</label>
                  </div>
                  <div className="col-lg-2">
                    <label>
                      {" "}
                      Invoice Amount : {selectedPurchase.invoiceAmount}
                    </label>
                  </div>
                </div>

                <div className="global-form">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: "15px",
                    }}
                  >
                    <label className="checkbox-inline mr-2">
                      <input
                        type="radio"
                        style={{ marginRight: "10px" }}
                        name="type"
                        checked={values.type === "cash"}
                        onChange={(e) => setFieldValue("type", "cash")}
                        className="mr-2"
                      />
                      Cash
                    </label>

                    <label className="checkbox-inline">
                      <input
                        type="radio"
                        name=""
                        checked={values.type === "bank"}
                        onChange={(e) => setFieldValue("type", "bank")}
                        className="mr-2"
                      />
                      Bank
                    </label>
                  </div>

                  {values.type === "cash" ? (
                    <CashForm
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      isValid={isValid}
                      values={values}
                      cashGlDDL={cashGlDDL}
                      onAmountChange={(amount) => {
                        getGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          selectedPurchase.sbuId || 0,
                          selectedPurchase.partnerId || 0,
                          values.type === "cash" ? values.cashGl.value : 0,
                          amount,
                          values.type === "bank" ? values.bank.value : 0,
                          setGlGridData
                        );
                      }}
                      selectedPurchase={selectedPurchase}
                    />
                  ) : (
                    <BankForm
                      errors={errors}
                      touched={touched}
                      setFieldValue={setFieldValue}
                      isValid={isValid}
                      values={values}
                      instumentType={instumentType}
                      bankAcDDL={bankAcDDL}
                      onAmountChange={(amount) => {
                        getGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          selectedPurchase.sbuId || 0,
                          selectedPurchase.partnerId || 0,
                          values.type === "cash" ? values.cashGl.value : 0,
                          amount,
                          values.type === "bank" ? values.bank.value : 0,
                          setGlGridData
                        );
                      }}
                      selectedPurchase={selectedPurchase}
                    />
                  )}

                  {/* ADD TRANSACTION FORM */}

                  <div
                    className="row custom_space"
                    style={{ marginTop: "18px" }}
                  >
                    <div className="col-lg-2">
                      <NewSelect
                        name="transaction"
                        options={transactionDDL}
                        value={values?.transaction}
                        label="Deduction Header"
                        onChange={(valueOption) => {
                          setFieldValue("transaction", valueOption);
                        }}
                        placeholder="Deduction Header"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        value={values?.transactionAmount}
                        label="Deduction Amount"
                        // disabled={id ? true : false}
                        type="number"
                        name="transactionAmount"
                        placeholder="Deduction Amount"
                        onChange={(e) => {
                          setFieldValue("transactionAmount", +e.target.value);
                        }}
                        min="0"
                      />
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "14px" }}
                        type="button"
                        disabled={
                          !values.transaction ||
                          !values.transactionAmount ||
                          rowTotal > values?.amount ||
                          values.transactionAmount > values.amount ||
                          values.transactionAmount + rowTotal > values?.amount
                        }
                        onClick={(e) => {
                          setter(values, () => {
                            setFieldValue("transactionAmount", "");
                            setFieldValue("transaction", "");
                          });
                        }}
                      >
                        add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction Item Table */}
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "70px" }}>GL Code</th>
                        <th style={{ width: "70px" }}>GL Name</th>
                        <th style={{ width: "85px" }}>Transaction</th>
                        <th style={{ width: "60px" }}>Amount</th>
                        <th style={{ width: "60px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glGridData.map((item, index) => (
                        <tr>
                          <td>
                            <div className="pl-2">{item.glCode}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.glName}</div>
                          </td>
                          <td>
                            <div className="pl-2">NA</div>
                          </td>
                          {index === 0 ? (
                            <td>
                              <div className="text-right pr-2">
                                {values?.amount}
                              </div>
                            </td>
                          ) : (
                            <td>
                              <div className="text-right pr-2">
                                {rowDto.length > 0
                                  ? calculateTotalAmount(values.amount)
                                  : values.amount * Math.sign(-1)}
                              </div>
                            </td>
                          )}
                          <td>
                            <div className="pl-2"></div>
                          </td>
                        </tr>
                      ))}

                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="pl-2">{item.glCode}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.glName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item.transaction} </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {item.amount}{" "}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                className="edit"
                                onClick={() => {
                                  remover(index);
                                }}
                              >
                                <IDelete />
                                {/* <IDelete /> */}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* <button
                  className="btn btn-primary"
                  style={{ marginTop: "14px" }}
                  type="submit"
                >
                  Create
                </button> */}
              </Form>
            </>
          )}
        </Formik>
      </IViewModal>
    </div>
  );
}
