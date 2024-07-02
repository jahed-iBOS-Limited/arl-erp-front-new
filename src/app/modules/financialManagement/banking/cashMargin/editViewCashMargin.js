import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  date: "",
  type: "",
  amount: "",
  rowNarration: "",

  cashMarginCode: "",
  refType: "",
  refNo: "",
  bankName: "",
  principleAmount: "",
  marginPercent: "",
  marginAmount: "",
  balance: "",
  maturityDate: "",
  narration: "",
};

// const validationSchema = Yup.object().shape({
//   //  cashMarginCode: Yup.object()
//   //     .shape({
//   //        label: Yup.string().required('Cash Margin Code is required'),
//   //        value: Yup.string().required('Cash Margin Code is required'),
//   //     })
//   //     .typeError('Cash Margin Code is required'),
//    refType: Yup.object()
//       .shape({
//          label: Yup.string().required('Ref Type is required'),
//          value: Yup.string().required('Ref Type is required'),
//       })
//       .typeError('Ref Type is required'),
//    bankName: Yup.object()
//       .shape({
//          label: Yup.string().required('Bank Name is required'),
//          value: Yup.string().required('Bank Name is required'),
//       })
//       .typeError('Bank Name is required'),

//    principleAmount: Yup.number().required('Principal Amount is required'),
//    marginPercent: Yup.number().required('Margin Percent is required'),
//    marginAmount: Yup.number().required('Margin Amount is required'),
//    narration: Yup.string().required('Margin Amount is required'),
//   //  balance: Yup.number().required('Balance is required'),
//    maturityDate: Yup.date().required('Maturity Date is required'),
// });

export default function ViewEditCashMargin() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [bankAccountDDL, getBankAccountDDL] = useAxiosGet([]);
  const [objProps, setObjprops] = useState({});
  const { actionType, id } = useParams();
  const [rowData, setRowData] = useState([]);
  const [, getByDataForCashMargin] = useAxiosGet();
  const [, editHandler, editLoading] = useAxiosPost();
  const location = useLocation();
  const [modifyData, setModifyData] = useState({});
  const [bankDDL, getBankDDL] = useAxiosGet();
  useEffect(() => {
    if (location?.state?.intCashMarginId) {
      getByDataForCashMargin(
        `/fino/FundManagement/GetFundCashMarginById?cashMarginId=${location?.state?.intCashMarginId}`,
        (data) => {
          const { cashMarginHeader, cashMarginRow } = data;

          setModifyData({
            cashMarginCode: cashMarginHeader?.strCashMarginCode,
            refType: {
              label: cashMarginHeader?.strReffType,
              value: cashMarginHeader?.strReffType,
            },
            refNo: cashMarginHeader?.strReffNo,
            bankName: {
              value: cashMarginHeader?.intBankId,
              label: cashMarginHeader?.strBankName,
              code: cashMarginHeader?.strBankCode,
            },
            principleAmount: cashMarginHeader?.numPrincipleAmount,
            marginPercent: cashMarginHeader?.numMarginPercent,
            marginAmount: cashMarginHeader?.numMarginAmount,
            narration: cashMarginHeader?.strRemarks,
            maturityDate: _dateFormatter(cashMarginHeader?.dteMaturityDate),
            bankAccountNo: cashMarginHeader?.intBankAccountId
              ? {
                  value: cashMarginHeader?.intBankAccountId,
                  label: cashMarginHeader?.strBankAccountName,
                }
              : "",
            cashMarginType: cashMarginHeader?.strCashMarginType
              ? {
                  label: cashMarginHeader?.strCashMarginType,
                  value:
                    cashMarginHeader?.strCashMarginType === "Cash Refund"
                      ? 1
                      : 2,
                }
              : "",
          });
          setRowData(cashMarginRow);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const saveHandler = (values, cb) => {
    const payload = {
      cashMarginHeader: {
        sl: 0,
        intCashMarginId: id ? +id : 0,
        strCashMarginCode: values?.cashMarginCode,
        intBusinessUnitId: selectedBusinessUnit?.value,
        strReffType: values?.refType?.label,
        strReffNo: values?.refNo,
        intBankId: values?.bankName?.value,
        strBankName: values?.bankName?.label,
        strBankCode: values?.bankName?.code,
        numPrincipleAmount: values?.principleAmount,
        numMarginPercent: values?.marginPercent,
        numMarginAmount: values?.marginAmount,
        numBalance: 0,
        dteMaturityDate: values?.maturityDate,
        strRemarks: values?.narration,
        intCreatedBy: profileData?.userId,
        strBankAccountName: values?.bankAccountNo?.label || "",
        intBankAccountId: values?.bankAccountNo?.value || 0,
        strCashMarginType: values?.cashMarginType?.label || "",
      },
      cashMarginRow: rowData,
    };
    editHandler(
      `/fino/FundManagement/EditFundCashMargin`,
      payload,
      () => {
        // getByDataForCashMargin(
        //   `/fino/FundManagement/GetFundCashMarginById?cashMarginId=${location?.state?.intCashMarginId}`,
        //   (data) => {
        //     const { cashMarginHeader, cashMarginRow } = data;

        //     setModifyData({
        //       cashMarginCode: cashMarginHeader?.strCashMarginCode,
        //       refType: {
        //         label: cashMarginHeader?.strReffType,
        //         value: cashMarginHeader?.strReffType,
        //       },
        //       refNo: cashMarginHeader?.strReffNo,
        //       bankName: {
        //         value: cashMarginHeader?.intBankId,
        //         label: cashMarginHeader?.strBankName,
        //         code: cashMarginHeader?.strBankCode,
        //       },
        //       principleAmount: cashMarginHeader?.numPrincipleAmount,
        //       marginPercent: cashMarginHeader?.numMarginPercent,
        //       marginAmount: cashMarginHeader?.numMarginAmount,
        //       narration: cashMarginHeader?.strRemarks,
        //       maturityDate: _dateFormatter(cashMarginHeader?.dteMaturityDate),
        //     });
        //     setRowData(cashMarginRow);
        //   }
        // );
      },
      true
    );
  };

  const rowDataSetter = (values) => {
    const cashMarginRow = {
      intRowId: 0,
      intCashMarginId: id ? +id : 0,
      dteTransactionDate: values?.date,
      numTransactionAmount:
        values?.type?.value === 2 ? +values?.amount * -1 : +values?.amount,
      numDepositeAmount: values?.type?.value === 1 ? +values?.amount : 0,
      numAdjustmentAmount: values?.type?.value === 2 ? +values?.amount : 0,
      strNarration: values?.rowNarration,
      isActive: true,
    };
    setRowData([...rowData, cashMarginRow]);
  };

  const deleteHandler = (index) => {
    setRowData(rowData?.filter((_, i) => i !== index));
  };

  // let numBalance = 0
  useEffect(() => {
    getBankAccountDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
    getBankDDL(`/hcm/HCMDDL/GetBankDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifyData : initData}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {editLoading && <Loading />}
          <IForm
            customTitle={
              actionType === "view" ? "View Cash Margin" : "Edit Cash Margin"
            }
            getProps={setObjprops}
            isDisabled={actionType === "view" ? true : false}
          >
            <div className="bank-guarantee-entry">
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.cashMarginCode}
                    label="Cash Margin Code"
                    name="cashMarginCode"
                    type="text"
                    disabled={true}
                    onChange={(e) => {
                      setFieldValue("cashMarginCode", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="cashMarginType"
                    options={[
                      { value: 1, label: "Cash Refund" },
                      { value: 2, label: "Cash Payment" },
                    ]}
                    value={values?.cashMarginType || ""}
                    label="Cash Margin Type"
                    onChange={(valueOption) => {
                      setFieldValue("cashMarginType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isSearchable={true}
                    options={bankAccountDDL || []}
                    name="bankAccountNo"
                    placeholder="Bank Account No"
                    value={values?.bankAccountNo || ""}
                    onChange={(valueOption) => {
                      setFieldValue("bankAccountNo", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="refType"
                    options={[]}
                    value={values?.refType}
                    label="Ref Type"
                    onChange={(valueOption) => {
                      setFieldValue("refType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.refNo}
                    label="Ref No"
                    name="refNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("refNo", e.target.value);
                    }}
                    disabled={actionType === "view" ? true : false}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankDDL || []}
                    value={values?.bankName}
                    label="Bank"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("bankName", valueOption);
                      } else {
                        setFieldValue("bank", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.principleAmount}
                    label="Principal Amount"
                    name="principleAmount"
                    type="number"
                    disabled={true}
                    onChange={(e) => {
                      setFieldValue("principleAmount", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.marginPercent}
                    label="Margin Percent"
                    name="marginPercent"
                    type="number"
                    disabled={true}
                    onChange={(e) => {
                      setFieldValue("marginPercent", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.marginAmount}
                    label="Margin Amount"
                    name="marginAmount"
                    type="number"
                    disabled={true}
                    onChange={(e) => {
                      setFieldValue("marginAmount", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.maturityDate}
                    label="Maturity Date"
                    name="maturityDate"
                    type="date"
                    disabled={true}
                    onChange={(e) => {
                      setFieldValue("maturityDate", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-6">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    disabled={true}
                    type="text"
                    onChange={(e) => {
                      setFieldValue("narration", e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Row Add Section */}
              {actionType === "edit" && (
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Deposit" },
                        { value: 2, label: "Adjustment" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.amount}
                      label="Amount"
                      name="amount"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setFieldValue("amount", e.target.value);
                        } else {
                          setFieldValue("amount", "");
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-6">
                    <InputField
                      value={values?.rowNarration}
                      label="Narration"
                      name="rowNarration"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("rowNarration", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        rowDataSetter(values);
                      }}
                      className="btn btn-primary mt-5"
                      disabled={
                        !values?.date || !values?.type || !values?.amount
                      }
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Row Add Section Table */}
              <CashMarginTable
                rowData={rowData}
                deleteHandler={deleteHandler}
                actionType={actionType}
              />
            </div>
            <Form>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

const CashMarginTable = ({ rowData, deleteHandler, actionType }) => {
  let numBalance = 0;
  return (
    <>
      {" "}
      <div className="table-responsive">
        <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              <th>Date</th>
              <th>Narration</th>
              <th>Deposite</th>
              <th>Adjustment</th>
              <th>Balance</th>
              {actionType === "edit" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              numBalance += item?.numTransactionAmount;
              return (
                <tr key={index}>
                  <td>{_dateFormatter(item?.dteTransactionDate)}</td>
                  <td>{item?.strNarration}</td>
                  <td>
                    {item?.numDepositeAmount !== 0
                      ? item?.numDepositeAmount
                      : ""}
                  </td>
                  <td>
                    {item?.numAdjustmentAmount !== 0
                      ? item?.numAdjustmentAmount
                      : ""}
                  </td>
                  <td>{numBalance}</td>

                  {actionType === "edit" && (
                    <td style={{ width: "80px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        {item?.intRowId === 0 && (
                          <span>
                            <IDelete
                              remover={(idx) => {
                                deleteHandler(idx);
                              }}
                              id={index}
                            />
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
