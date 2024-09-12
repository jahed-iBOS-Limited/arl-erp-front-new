import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import ILoader from "../../../../_helper/loader/_loader";
import { getBankAccount, getInstrumentDDL, getSBUList } from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import "./style.css";
import TableData from "./TableData";
import InputFields from "./InputFields";
import { _todayDate } from "../../../../_helper/_todayDate";

const BankAdvice = () => {
  const [adviceTypeDDL, setAdviceTypeDDL] = useState([]);
  const { financialsBankadvice } = useSelector((state) => state.localStorage);

  const initData = {
    dateTime: financialsBankadvice?.dateTime || _todayDate(),
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
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
  }, [profileData, selectedBusinessUnit]);
  useEffect(() => {
    getInstrumentDDL(setAdviceTypeDDL);
  }, []);

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Bank Advice"}>
          <CardHeaderToolbar></CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            <Formik enableReinitialize={true} initialValues={initData}>
              {({ values, errors, touched, setFieldValue }) => (
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
                        sbuList,
                      }}
                    />
                    <div>
                      {loading && <ILoader />}
                      <pre>{JSON.stringify(values, null, 2)}</pre>

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
