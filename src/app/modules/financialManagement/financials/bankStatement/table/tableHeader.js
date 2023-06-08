/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  getBankAccountNoDDL,
  savebankStatement,
  uploadBankStatement,
} from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import { getBankAccountOtherInfoDDL } from "./../helper";
import ICustomTable from "./../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import * as Yup from "yup";
import { ExcelRenderer } from "react-excel-renderer";
import { SetFinancialsBankStatementUploadAction } from "../../../../_helper/reduxForLocalStorage/Actions";

const header = [
  "SL",
  "Tr Date",
  "Particulers",
  "Insurence No",
  "Credit Amount",
  "Debit Amount",
  "Balance",
];

// Validation schema
const validationSchema = Yup.object().shape({});
const BankStatement = () => {
  const { financialsBankStatementUpload } = useSelector(
    (state) => state?.localStorage
  );

  const dispatch = useDispatch();

  const initData = {
    lastCollected: financialsBankStatementUpload?.lastCollected || "",
    bankAccountNo: financialsBankStatementUpload?.bankAccountNo || "",
    runningBalance: financialsBankStatementUpload?.runningBalance || "",
    openingDate: financialsBankStatementUpload?.openingDate || "",
    openingBalance: financialsBankStatementUpload?.openingBalance || "",
  };

  // ref
  // eslint-disable-next-line no-unused-vars
  const printRef = useRef();
  const [open, setOpen] = useState(false);

  // states
  const [fileObject, setFileObject] = useState("");
  // const hiddenFileInput = React.useRef(null);
  const [isUpload, setIsUpload] = useState(false);
  const [bankAccountNoDDL, setBankAccountNoDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [bankAccountOthetInfoNoDDL, setBankAccountOtherInfoNoDDL] = useState(
    []
  );
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  //storingData
  const [fileData, setFileData] = useState([]);
  const [filteredFileData, setFilteredFileData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (fileObject[0]?.file) {
      ExcelRenderer(fileObject[0]?.file, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          console.log(resp.rows, "response");
          const modifyData = resp.rows?.slice(1)?.map((itm, index) => ({
            //extract date-code to date from excel have used this formula
            trDate: new Date((itm[0] - (25567 + 2)) * 86400 * 1000) || "",
            // trDate: itm[0] || "",
            particulars: itm[1] || "",
            instrumentNo: itm[2] || "",
            debit: itm[3] || "",
            credit: itm[4] || "",
            balance: itm[5] || "",
          }));
          setFileData(modifyData);
        }
      });
    }
  }, [fileObject[0]?.file]);

  useEffect(() => {
    if (fileData) {
      const filterArr = fileData.filter((itm) => itm.trDate !== "Invalid Date");
      setFilteredFileData(filterArr);
    }
  }, [fileData]);
  console.log(filteredFileData, "filteredFileData");

  // const handleClick = (event) => {
  //   hiddenFileInput.current.click();
  // };

  //oldCode for another package
  // const fileUpload = async (file) => {
  //   console.log("file", file)
  //   const data = await excelFileToArray(file);
  //   console.log("data",data);
  //   setFileData(data);
  // };

  useEffect(() => {
    getBankAccountNoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccountNoDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    setLoading(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      savebankStatement(
        values?.bankAccountNo?.value,
        profileData?.userId,
        cb,
        setLoading,
        setIsUpload
      );
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setFileData([]);
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Bank Statement Upload"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        isSearchable={true}
                        options={bankAccountNoDDL || []}
                        name="accountNo"
                        placeholder="Account No"
                        value={values?.bankAccountNo || ""}
                        onChange={(valueOption) => {
                          setFieldValue("bankAccountNo", valueOption);
                          getBankAccountOtherInfoDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setBankAccountOtherInfoNoDDL,
                            setFieldValue
                          );
                          dispatch(
                            SetFinancialsBankStatementUploadAction({
                              ...values,
                              bankAccountNo: valueOption,
                            })
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>
                        {values?.openingDate
                          ? "Last Collected"
                          : "Opening Date"}
                      </label>
                      <InputField
                        value={values?.lastCollected || ""}
                        name="lastCollected"
                        placeholder="Date"
                        type="date"
                        onChange={e=>{
                          dispatch(SetFinancialsBankStatementUploadAction({
                            ...values,
                            lastCollected:e?.target?.value
                          }))
                        }}
                        disabled={values?.openingDate}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>
                        {values?.openingBalance
                          ? "Running Balance"
                          : "Opening Balance"}
                      </label>
                      <InputField
                        value={values?.runningBalance || ""}
                        name="runningBalance"
                        placeholder="Running Balance"
                        type="number"
                        onChange={e=>{
                          dispatch(SetFinancialsBankStatementUploadAction({
                            ...values,
                            runningBalance:e?.target?.value
                          }))
                        }}
                        disabled={values?.openingBalance}
                      />
                    </div>

                    <div className="col-lg-2">
                      <button
                        style={{ marginTop: "23px" }}
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Upload
                      </button>
                      {/* <label>Upload File</label>
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setFileObject(e.target.files[0])}
                      // ref={hiddenFileInput}
                      // style={{ display: "none" }}
                      /> */}
                    </div>
                    {/* <div className="col-lg-1 mt-3">
                      <button
                        disabled={
                          !values?.bankAccountNo ||
                          !values?.lastCollected ||
                          !values?.runningBalance
                        }
                        type="button"
                        className="btn btn-primary mt-3"
                        style={{
                          borderColor: "none",
                          // height: "30px"
                        }}
                        onClick={() => {
                          setIsUpload(true);
                          uploadBankStatement(
                            profileData,
                            values,
                            filteredFileData,
                            setLoading,
                          );

                        }}
                      >
                        Upload
                      </button>
                    </div> */}
                  </div>
                  <div>
                    <ICustomTable ths={header} className="table-font-size-sm">
                      {isUpload &&
                        filteredFileData
                          .filter(
                            (data) =>
                              _dateFormatter(data?.trDate) !== "NaN-NaN-NaN"
                          )
                          .map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  {item?.trDate
                                    ? _dateFormatter(item?.trDate)
                                    : "-"}
                                </td>
                                <td>
                                  {item?.particulars ? item?.particulars : "-"}
                                </td>
                                <td>
                                  {item?.instrumentNo
                                    ? item?.instrumentNo
                                    : "-"}
                                </td>
                                <td className="text-right">
                                  {item?.credit ? item?.credit : "-"}
                                </td>
                                <td className="text-right">
                                  {item?.debit ? item?.debit : "-"}
                                </td>
                                <td className="text-right">
                                  {item?.balance ? item?.balance : "-"}
                                </td>
                              </tr>
                            );
                          })}
                    </ICustomTable>
                  </div>

                  <>
                    <DropzoneDialogBase
                      filesLimit={1}
                      acceptedFiles={[".xlsx", ".xls"]}
                      fileObjects={fileObject}
                      cancelButtonText={"cancel"}
                      submitButtonText={"submit"}
                      maxFileSize={100000000000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObject(newFileObjs);
                      }}
                      // onDelete={(deleteFileObj) => {
                      //   const newData = fileObject.filter(
                      //     (item) => item.file.name !== deleteFileObj.file.name
                      //   );
                      //   setFileObject(newData);
                      // }}
                      onClose={() => setOpen(false)}
                      onSave={() => {
                        setOpen(false);
                        setIsUpload(true);
                        uploadBankStatement(
                          profileData,
                          values,
                          filteredFileData,
                          setLoading,
                          setFileObject
                        );
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default BankStatement;
