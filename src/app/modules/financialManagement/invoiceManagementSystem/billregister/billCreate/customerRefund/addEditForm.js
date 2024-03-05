import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../../../App";
import ICustomTable from "../../../../../_helper/_customTable";
import IForm from "../../../../../_helper/_form";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { compressfile } from "../../../../../_helper/compressfile";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import {
  convertBalance,
  removeDataFromRow,
  rowDataHandler,
  tableHeader,
  uploadAtt,
} from "./helper";

const initData = {
  paymentType: "",
  customer: "",
  bankName: "",
  branchName: "",
  bankAccountingNo: "",
  remarks: "",
  amount: "",
  billRegisterDate: _todayDate(),
  businessTransaction: "",
  profitCenter: "",
};

export default function CustomerRefundCreateEditForm() {
  const [objProps, setObjprops] = useState({});
  const [customerDDL, getCustomerDDL] = useAxiosGet();
  const [bankDDL, getBankDDL, loadBankDDL, setBankDDL] = useAxiosGet();
  const [isDisabled, setDisabled] = useState(false);
  const [balance, getBalance] = useAxiosGet();
  const location = useLocation();
  const [
    branchDDL,
    getBranchDDL,
    branchDDLLoading,
    setBranchDDL,
  ] = useAxiosGet();
  const [
    businessTransactionDDL,
    getBusinessTransactionDDL,
    loadBusinessTransactionDDL,
    setBussinessTransactionDDL,
  ] = useAxiosGet();
  const [
    profitCenterList,
    getProfitCenterList,
    ,
    setProfitCenterList,
  ] = useAxiosGet();
  const [, customerRefundEntries, loadCustomerRefundEntries] = useAxiosPost();
  const [isModalOpen, setModalOpenState] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [rowData, setRowData] = useState([]);
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //   Effects
  useEffect(() => {
    getCustomerDDL(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    getBusinessTransactionDDL(
      `/fino/Expense/GetExpenseBusinessTransactionList?BusinessUnitId=${buId}`,
      (data) => {
        const result = data?.map((item) => ({
          ...item,
          value: item.businessTransactionId,
          label: item.businessTransactionName,
        }));
        setBussinessTransactionDDL(result);
      }
    );
    getBankDDL(
      `${APIUrl}/partner/BusinessPartnerBankInfo/GetBankInfo`,
      (data) => {
        const updatedValue = data?.map((item) => ({
          ...item,
          label: item?.bankName,
          value: item?.bankId,
        }));
        setBankDDL(updatedValue);
      }
    );
    getProfitCenterList(
      `fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`,
      (data) => {
        const result = data?.map((item) => ({
          ...item,
          value: item.profitCenterId,
          label: item.profitCenterName,
        }));
        setProfitCenterList(result);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    if (rowData?.length === 0) return toast.warn("At least one bill add");
    if (fileObjects.length < 1) return toast.warn("Please upload attachment");
    const payload = {
      head: rowData,
    };
    try {
      setDisabled(true);
      if (fileObjects?.length > 0) {
        const compressedFile = await compressfile(
          fileObjects?.map((f) => f.file)
        );
        const uploadedImage = await uploadAtt(compressedFile);
        payload["image"] = uploadedImage?.data?.map((item) => ({
          imageId: item?.id,
        }));
        setDisabled(false);
        customerRefundEntries(
          `/fino/OthersBillEntry/CustomerRefundEntries`,
          payload,
          () => {
            setRowData([])
            setFileObjects([])
          },
          true
        );
      }
    } catch (error) {
      toast.error(error?.message);
      setDisabled(false);
    }
  };


  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(branchDDLLoading || loadBankDDL || loadBusinessTransactionDDL||loadCustomerRefundEntries) && (
            <Loading />
          )}
          <IForm
            title="Create Customer Refund"
            getProps={setObjprops}
            isDisabled={isDisabled}
          >
            {isDisabled && <Loading />}
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    options={[
                      {
                        value: 1,
                        label: "Bank",
                      },
                      {
                        value: 2,
                        label: "Cheque",
                      },
                      {
                        value: 3,
                        label: "Cash",
                      },
                    ]}
                    value={values?.paymentType}
                    label="Payment Type"
                    onChange={(valueOption) => {
                      setFieldValue("paymentType", valueOption);
                    }}
                    placeholder="Payment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div style={{ position: "relative" }} className="col-lg-3 ">
                  <NewSelect
                    name="customer"
                    options={customerDDL}
                    value={values?.customer}
                    label={`Customer Name`}
                    isRequiredSymbol={true}
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                      setFieldValue("amount", "");
                      if (!valueOption) return;
                      getBalance(
                        `/fino/BankBranch/GetPartnerBook?BusinessUnitId=${buId}&PartnerId=${valueOption?.value}&PartnerType=2&FromDate=2024-03-03&ToDate=2024-03-03`
                      );
                    }}
                    placeholder="Customer Name"
                    errors={errors}
                    touched={touched}
                  />
                  {balance?.length > 0 && values?.customer ? (
                    <span
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "14px",
                        fontWeight: "bold",
                      }}
                      className={`ml-4 font-bold ${
                        balance[0]?.numBalance > 0 ? "text-danger" : "text-info"
                      }`}
                    >
                      {balance[0]?.numBalance > 0
                        ? `Due Balance:${balance[0]?.numBalance}`
                        : `Available Balance:${convertBalance(balance[0]?.numBalance)}`}
                    </span>
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankDDL || []}
                    value={values?.bankName}
                    label="Bank Name"
                    onChange={(valueOption) => {
                      setBranchDDL([]);
                      setFieldValue("bankName", valueOption);
                      getBranchDDL(
                        `${APIUrl}/partner/BusinessPartnerBankInfo/GetBranchDDLInfo?BankId=${valueOption?.value}`,
                        (data) => {
                          const updatedValue = data?.map((item) => ({
                            ...item,
                            label: item?.bankBranchName,
                            value: item?.bankBranchId,
                          }));
                          setBranchDDL(updatedValue);
                        }
                      );
                      setFieldValue("branchName", "");
                    }}
                    placeholder="Bank Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="branchName"
                    options={branchDDL || []}
                    value={values?.branchName}
                    label="Branch Name"
                    onChange={(valueOption) => {
                      setFieldValue("branchName", valueOption);
                    }}
                    placeholder="Branch Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={branchDDL.length === 0}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.bankAccountingNo}
                    label="Bank Account No"
                    name="bankAccountingNo"
                    placeholder="Bank Account No"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    placeholder="Remarks"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    min={0}
                    disabled={!values?.customer || convertBalance(balance[0]?.numBalance) <= 0}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.billRegisterDate}
                    label="Bill Register Date"
                    name="billRegisterDate"
                    type="date"
                    placeholder="Bill Register Date"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="businessTransaction"
                    options={businessTransactionDDL || []}
                    value={values?.businessTransaction}
                    label="Business Transaction"
                    onChange={(valueOption) => {
                      setFieldValue("businessTransaction", valueOption);
                    }}
                    placeholder="Business Transaction Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={rowData?.length}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterList || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 align-self-end  mt-3">
                  <button
                    className="btn btn-primary mr-3"
                    type="button"
                    onClick={() => {
                      if (
                        [3, 4]?.includes(
                          values?.businessTransaction?.accountGroupId
                        ) &&
                        !values?.profitCenter?.value
                      ) {
                        return toast.warn("Profit Center is required");
                      }
                      if (
                        values?.amount > convertBalance(balance[0]?.numBalance)
                      ) {
                        return toast.warn(`Balance must be at most ${convertBalance(balance[0]?.numBalance)}`);
                      }
                      if(values?.amount<=0){
                        return toast.warn("Balance must be more then 0")
                      }
                      rowDataHandler(
                        values,
                        rowData,
                        setRowData,
                        accId,
                        buId,
                        location,
                        userId,
                        () => {
                          const copyValues = { ...values };
                          resetForm({
                            ...initData,
                            // businessTransaction: copyValues?.businessTransaction,
                          });
                          setFieldValue(
                            "businessTransaction",
                            copyValues?.businessTransaction
                          );
                        }
                      );
                    }}
                    disabled={
                      !values?.customer ||
                      (values?.paymentType?.value === 1 &&
                        (!values?.bankName ||
                          !values?.branchName ||
                          !values?.bankAccountingNo)) ||
                      !values?.amount ||
                      !values?.billRegisterDate ||
                      !values?.businessTransaction
                    }
                  >
                    Add
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => {
                      setModalOpenState(true);
                    }}
                  >
                    Attachment
                  </button>
                </div>
              </div>
              {/* table */}
              <div className="row">
                <div className="col-12">
                  <table className=""></table>
                  <ICustomTable ths={tableHeader}>
                    {rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          {console.log("item", item)}
                          <td>{index + 1}</td>
                          <td> {item?.customerName}</td>
                          <td> {item?.bankName}</td>
                          <td> {item?.branchName}</td>
                          <td> {item?.bankAccountNumber}</td>
                          <td> {item?.routingNumber}</td>
                          <td className="text-right">{item?.amount}</td>
                          <td className="text-right">{item?.remarks}</td>
                          <td className="text-center">
                            <span
                              onClick={() =>
                                removeDataFromRow(index, rowData, setRowData)
                              }
                            >
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center font-weight-bolder"
                      >
                        Total
                      </td>
                      <td className="text-right font-weight-bolder">
                        {rowData?.reduce(
                          (acc, item) => acc + Number(item?.amount),
                          0
                        )}
                      </td>
                      <td className="text-center"></td>
                      <td className="text-center"></td>
                    </tr>
                  </ICustomTable>
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
              <DropzoneDialogBase
                filesLimit={5}
                acceptedFiles={["image/*"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={100000000000000}
                open={isModalOpen}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setModalOpenState(false)}
                onSave={() => {
                  setModalOpenState(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
