import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
// import { _todayDate } from "../../../../_helper/_todayDate";
import { useSelector, shallowEqual } from "react-redux";
import ILoader from "../../../../_helper/loader/_loader";
// import numberWithCommas from "./../../../../_helper/_numberWithCommas";
// import { convertNumberToWords } from "./../../../../_helper/_convertMoneyToWord";
import { getBankAccount,getInstrumentDDL,getSBUList } from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import "./style.css";
// import ExcelTable from "./excelTable";
import {
  // adviceTypeDDL,
  // initData,
  // voucherPostingDDL,
  // adviceDDL,
  // mandatoryDDL,
} from "./utils";
import TableData from "./TableData";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InputFields from "./InputFields";
import { _todayDate } from "../../../../_helper/_todayDate";

const BankAdvice = () => {

  const [adviceTypeDDL,setAdviceTypeDDL] = useState([])
  const {financialsBankadvice} = useSelector(state=>state.localStorage)

  const initData = {
    dateTime: financialsBankadvice?.dateTime||_todayDate(),
    businessUnit: financialsBankadvice?.businessUnit || "",
    bankAccountNo: financialsBankadvice?.bankAccountNo || "",
    adviceType: financialsBankadvice?.adviceType || "",
    mandatory: financialsBankadvice?.mandatory || "",
    advice: "",
    voucherPosting: financialsBankadvice?.voucherPosting || "",
    sbuUnit: financialsBankadvice?.sbuUnit || "",
  };
  const printRef = useRef();
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [adviceReportData, setAdviceReportData] = useState([]);
  const [sbuList, setSbuList] = useState([]);
  // const [totalAmount, seTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankAccount(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccountDDL
    );
    getSBUList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuList
    )
  }, [profileData, selectedBusinessUnit]);
  useEffect(() => {
    getInstrumentDDL(setAdviceTypeDDL)
  }, []);

  // let netTotal = 0;

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Bank Advice"}>
          <CardHeaderToolbar>
            {/* <ReactToPrint
              trigger={() => (
                <button
                  className="btn btn-primary"
                  style={{ padding: "4px", lineHeight: "5px" }}
                >
                  <img
                    style={{ width: "25px", paddingRight: "5px" }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
              pageStyle={pageStyle}
            /> */}
            {/* <button
              className="btn btn-primary"
              style={{ margin: "0 5px", padding: "8px" }}
            >
              Email
            </button>
            <button className="btn btn-primary" style={{ padding: "8px" }}>
              Voucher Print
            </button> */}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <Formik
              enableReinitialize={true}
              initialValues={initData}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <>
                  <Form className="form form-label-right">
                    <InputFields
                      obj={{
                        values,
                        bankAccountDDL,
                        setFieldValue,
                        errors,
                        touched,
                        profileData,
                        selectedBusinessUnit,
                        setLoading,
                        setAdviceReportData,
                        adviceReportData,
                        adviceTypeDDL,
                        sbuList
                      }}
                    />
                    {/* <div className="mt-1">
                      {adviceReportData?.length > 0 && (
                        <ReactHTMLTableToExcel
                          id="test-table-xls-button"
                          className="download-table-xls-button btn btn-primary"
                          table="table-to-xlsx"
                          filename={
                            values?.advice?.info === "others"
                              ? `BEFTN Salary Payment iBOS (AKIJ) TK_${totalAmount}`
                              : `Online Salary Payment iBOS (AKIJ) TK_${totalAmount}`
                          }
                          sheet={
                            values?.advice?.info === "others"
                              ? "BEFTN SALARY"
                              : "Online Salary"
                          }
                          buttonText="Export Excel"
                        />
                      )}
                    </div> */}
                    <div>
                      {loading && <ILoader />}

                      {/* {values?.adviceType?.label === "Salary" && (
                        
                      )} */}
                      <div ref={printRef}>
                        <TableData 
                            adviceReportData={adviceReportData}  
                            setAdviceReportData={setAdviceReportData}
                        />
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default BankAdvice;
