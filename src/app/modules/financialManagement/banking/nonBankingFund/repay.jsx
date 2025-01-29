import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { useParams, useLocation } from "react-router-dom";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _todayDate } from "../../../_helper/_todayDate";
import { _formatMoney } from "../../../_helper/_formatMoney";

const initData = {
  transactionDate: _todayDate(),
  amount: "",
  bankAccountNo: "",
};

const validationSchema = Yup.object().shape({
  transactionDate: Yup.string().required("Transaction Date is required"),
  amount: Yup.number().required("Amount is required"),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required("Bank Account No is required"),
    value: Yup.string().required("Bank Account No is required"),
  }),
});

const Repay = () => {
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [
    bankAccountDDL,
    getbankAccountDDL,
    bankAccountDDLloader,
  ] = useAxiosGet();
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  const [, saveData, saveDataLaoder] = useAxiosPost();

  const getDataById = (id) => {
    getRowData(
      `/fino/FundManagement/GetNonBankingFundById?businessUnitId=${selectedBusinessUnit?.value}&id=${id}`
    );
  };

  const saveHandler = (values, cb) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Are you Sure to Repay ${+values?.amount} against security number ${
        location?.state?.securityNumber
      }`,
      yesAlertFunc: async () => {
        const payload = {
          rowId: 0,
          depositLoanId: +id,
          transactionDate: values?.transactionDate,
          amount: +values?.amount,
          bankAccountId: values?.bankAccountNo?.value,
          bankAccountNo: values?.bankAccountNo?.label,
          createdBy: profileData?.userId,
        };
        saveData(
          `/fino/FundManagement/RepayNonBankingFund`,
          payload,
          () => {
            cb && cb();
            getDataById(id);
          },
          true
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getbankAccountDDL(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}
    `);
    if (id) {
      getDataById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
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
          {(bankAccountDDLloader || rowDataLoader || saveDataLaoder) && (
            <Loading />
          )}
          <IForm customTitle="Repay Non Banking Fund" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionDate}
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("transactionDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("amount", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankAccountNo"
                    options={bankAccountDDL || []}
                    value={values?.bankAccountNo}
                    label="Bank Account No"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("bankAccountNo", valueOption);
                      } else {
                        setFieldValue("bankAccountNo", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <div className="form-group  global-form row mt-1">
                <div className="col-lg-3">
                  <b>Partner:</b> {location?.landinValues?.partner?.label || ""}
                </div>
                <div className="col-lg-3">
                  <b>Deposite Type:</b>{" "}
                  {location?.landinValues?.depositeType?.label || ""}
                </div>
                <div className="col-lg-3">
                  <b>Security Number:</b>{" "}
                  {location?.state?.securityNumber || ""}
                </div>
              </div>

              <div className="mt-2">
                <b>Previous Repay List</b>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Transaction Date</th>
                        <th>Acount No</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{_dateFormatter(item?.transactionDate)}</td>
                          <td>{item?.bankAccountNo}</td>
                          <td className="text-right">
                            {_formatMoney(item?.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3" className="text-right">
                          <b>Balance</b>
                        </td>
                        <td className="text-right">
                          <b>
                            {_formatMoney(
                              rowData?.reduce((acc, curr) => {
                                return acc + curr?.amount;
                              }, 0)
                            )}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

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
};

export default Repay;
