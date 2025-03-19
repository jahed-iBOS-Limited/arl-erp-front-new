import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getBankAccount, getInstrumentDDL, getSBUList } from "../helper";
import InputFields from "./InputFields";
import "./style.css";
import TableData from "./TableData";

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
                      {loading && <Loading />}

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
