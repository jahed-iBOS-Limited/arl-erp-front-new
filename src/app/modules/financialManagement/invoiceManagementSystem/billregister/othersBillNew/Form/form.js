import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DropzoneDialogBase } from "material-ui-dropzone";

import InputField from "../../../../../_helper/_inputField";

import NewSelect from "../../../../../_helper/_select";

import {
  getBankDDL,
  getBranchDDL,
  getExpenseBusinessTransactionList,
} from "../helper";
import ICustomTable from "../../../../../_helper/_customTable";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import { excelFileToArray } from "../../../../../_helper/excel/excelToArray";

const validationSchema = Yup.object().shape({
  // payeeName: Yup.string().required("Payee Name is required"),
  // billName: Yup.object().required("Bill Name is required"),
  // bankName: Yup.object().when("paymentType", (paymentType, Schema) => {
  //   if (paymentType?.value === 1) {
  //     console.log(paymentType);
  //     return Schema.required("bankName is required");
  //   }
  // }),
  // businessTransaction: Yup.object().required(
  //   "Business Transaction is required"
  // ),
  // branchName: Yup.object().when("paymentType", (paymentType, Schema) => {
  //   if (paymentType?.value === 1) return Schema.required("Branch is required");
  // }),
  // bankAccountingNo: Yup.string().when("paymentType", (paymentType, Schema) => {
  //   if (paymentType?.value === 1)
  //     return Schema.required("Accounting No is required");
  // }),
  // amount: Yup.number().required("Amount is  Required"),
  // billRegisterDate: Yup.date().required("Bill Register Date is  Required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setFileObjects,
  fileObjects,
  profileData,
  selectedBusinessUnit,
  isModalOpen,
  setModalOpenState,
  rowData,
  setDataToRow,
  removeDataFromRow,
  setExcelDataToRowDto,
  setDisabled,
  setRowData,
  isDisabled,
}) {
  // const location = useLocation();

  // const [billNameDDL] = useState([
  //   {
  //     value: 1,
  //     label: "Others",
  //   },
  // ]);
  // const [bankAccDDL, setBankAccDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);
  const [businessTransactionDDL, setBusinessTransactionDDL] = useState([]);
  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFiles, setExcelFiles] = useState([]);

  const ths = [
    "SL",
    "Payee Name",
    "Bank Name",
    "Branch Name",
    "Account No",
    "Routing No",
    "Amount",
    "Remarks",
    "Action",
  ];

  // useEffect(() => {
  //   if (profileData && selectedBusinessUnit)
  //     getBankAccountDDL(
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       setBankAccDDL
  //     );
  // }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getBankDDL(setBankDDL);
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit)
      getExpenseBusinessTransactionList(
        selectedBusinessUnit?.value,
        setBusinessTransactionDDL
      );
  }, [selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
            setFileObjects([]);
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
          dirty,
          setFieldTouched,
        }) => (
          <>
            {console.log(errors)}
            <Form className="form form-label-right">
              <div className="row global-form">
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
                <div className="col-lg-3">
                  <InputField
                    value={values?.payeeName}
                    label="Payee Name"
                    name="payeeName"
                    placeholder="Payee Name"
                  />
                  {/* <label>Payee Name</label>
                  <SearchAsyncSelect
                    selectedValue={values.payeeName}
                    handleChange={(valueOption) => {
                      setFieldValue("payeeName", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${location?.state?.sbu?.value}`
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                    disabled={true}
                    isDisabled={false}
                  />
                  <FormikError
                    errors={errors}
                    name="payeeName"
                    touched={touched}
                  /> */}
                </div>
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="billName"
                    options={billNameDDL || []}
                    value={values?.billName}
                    label="Bill Name"
                    onChange={(valueOption) => {
                      setFieldValue("billName", valueOption);
                    }}
                    placeholder="Bill Name"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankDDL || []}
                    value={values?.bankName}
                    label="Bank Name"
                    onChange={(valueOption) => {
                      setBranchDDL([]);
                      setFieldValue("bankName", valueOption);
                      getBranchDDL(valueOption?.value, setBranchDDL);
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

                {/* <div className="col-lg-3">
                  <NewSelect
                    name="bankAcc"
                    options={bankAccDDL || []}
                    value={values?.bankAcc}
                    label="Bank Acc"
                    onChange={(valueOption) => {
                      setFieldValue("bankAcc", valueOption);
                    }}
                    placeholder="Bank Acc"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    placeholder="Remarks"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.billID}
                    label="Bill ID"
                    name="billID"
                    placeholder="Bill ID"
                    type="number"
                  />
                </div> */}

                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    placeholder="Amount"
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

                <div className="col-lg-12 align-self-end text-right mt-3">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => {
                      setModalOpenState(true);
                    }}
                  >
                    Attachment
                  </button>
                  <button
                    className="btn btn-primary ml-3"
                    type="button"
                    onClick={(e) => {
                      setDataToRow(values, () => {
                        const copyValues = values;
                        resetForm({
                          ...initData,
                          // businessTransaction: copyValues?.businessTransaction,
                        });
                        setFieldValue(
                          "businessTransaction",
                          copyValues?.businessTransaction
                        );
                      });
                    }}
                    disabled={
                      !values?.payeeName ||
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
                    className="btn btn-primary ml-3"
                    type="button"
                    onClick={(e) => {
                      if (!values?.businessTransaction)
                        return toast.warn(
                          "Please select business transaction first"
                        );
                      setExcelModalOpen(true);
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <ICustomTable ths={ths}>
                    {rowData?.map((itm, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{itm?.payeeName}</td>
                          <td> {itm?.bankName}</td>
                          <td> {itm?.branchName}</td>
                          <td> {itm?.bankAccountNumber}</td>
                          <td> {itm?.routingNumber}</td>
                          <td className="text-right">{itm?.amount}</td>
                          <td className="text-right">{itm?.remarks}</td>
                          <td className="text-center">
                            <span onClick={() => removeDataFromRow(index)}>
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
                type="button"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={handleSubmit}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
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
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={[
                  ".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                ]}
                fileObjects={excelFiles}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={100000000000000}
                open={isExcelModalOpen}
                onAdd={(newFileObjs) => {
                  setExcelFiles([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = excelFiles.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setExcelFiles(newData);
                }}
                onClose={() => setExcelModalOpen(false)}
                onSave={async () => {
                  setExcelModalOpen(false);
                  setDisabled(true);
                  const data = await excelFileToArray(
                    excelFiles[0].file,
                    setDisabled
                  );
                  setExcelFiles([]);
                  setExcelDataToRowDto(data, values, setDisabled);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
