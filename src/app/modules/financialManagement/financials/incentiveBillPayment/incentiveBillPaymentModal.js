import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
import { getInstrumentDDL } from "./helper";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import * as Yup from "yup";

const initData = {
  sbu: "",
  date: _todayDate(),
  bankAccountNo: "",
  instrumentType: "",
  advice: "",
};

const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  date: Yup.string().required("Date is required"),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required("Bank Account No is required"),
    value: Yup.string().required("Bank Account No is required"),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required("Instrument Type is required"),
    value: Yup.string().required("Instrument Type is required"),
  }),
  advice: Yup.object().shape({
    label: Yup.string().required("Advice is required"),
    value: Yup.string().required("Advice is required"),
  }),
});

export default function IncentiveBillPaymentModal({
  landingtableData,
  landingValues,
  getData,
  setOpenModal,
}) {
  const [objProps, setObjprops] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [instrumentDDL, setInstrumentDDL] = useState([]);
  const [sbuDDL, getSbuDDL, sbuDDLloader] = useAxiosGet();
  const [
    bankAccountDDL,
    getBankAccountDDL,
    bankAccountDDLloader,
  ] = useAxiosGet();
  const [
    adviceDDL,
    getAdviceDDL,
    loadingOnGetAdviceDDL,
    setAdviceDDL,
  ] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  useEffect(() => {
    getSbuDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`
    );
    getBankAccountDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
    getInstrumentDDL(setInstrumentDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    if (!values?.sbu?.value) {
      toast.warn("Please select SBU");
    }
    if (!values?.bankAccountNo?.value) {
      toast.warn("Please select Bank Account No");
    }
    if (!values?.instrumentType?.value) {
      toast.warn("Please select Instrument Type");
    }
    if (!values?.advice?.value) {
      toast.warn("Please select Advice");
    }
    if (!values?.date) {
      toast.warn("Please select Date");
    }
    const selectedMonths = landingtableData
      .filter((data) => data?.isChecked === true)
      .map((data) => data?.intMonthId)
      .join(",");

    saveData(
      `/fino/Report/GetEmployeeIncnetiveBP?businessUnitId=${selectedBusinessUnit?.value}&sbuId=${values?.sbu?.value}&bankId=${values?.bankAccountNo?.bankId}&bankName=${values?.bankAccountNo?.bankName}&bankBranchId=${values?.bankAccountNo?.bankBranch_Id}&bankBranchName=${values?.bankAccountNo?.bankBranchName}&bankAccountId=${values?.bankAccountNo?.value}&bankAccountNumber=${values?.bankAccountNo?.bankAccNo}&yearId=${landingValues?.year?.value}&monthIdList=${selectedMonths}&VoucehrDate=${values?.date}`,
      null,
      () => {
        cb();
        setOpenModal(false);
        getData(landingValues?.year?.value);
      },
      true
    );
  };

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
          {(sbuDDLloader ||
            bankAccountDDLloader ||
            loadingOnGetAdviceDDL ||
            saveDataLoader) && <Loading />}
          <IForm
            isHiddenBack={true}
            isHiddenReset={true}
            title=""
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    label="SBU"
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    placeholder="SBU"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Date</label>
                  <InputField
                    value={values?.date}
                    name="date"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    isSearchable={true}
                    options={bankAccountDDL || []}
                    name="bankAccountNo"
                    placeholder="Bank Account No"
                    value={values?.bankAccountNo || ""}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("bankAccountNo", valueOption);
                        getAdviceDDL(
                          `/costmgmt/BankAccount/GetAdviceFormatByBankId?bankId=${valueOption?.bankId}`
                        );
                      } else {
                        setFieldValue("bankAccountNo", "");
                        setFieldValue("advice", "");
                        setAdviceDDL([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    isSearchable={true}
                    options={instrumentDDL || []}
                    name="instrumentType"
                    placeholder="Instrument Type"
                    value={values?.instrumentType}
                    onChange={(valueOption) => {
                      setFieldValue("instrumentType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    isSearchable={true}
                    options={adviceDDL || []}
                    name="advice"
                    placeholder="Advice"
                    value={values?.advice || ""}
                    onChange={(valueOption) => {
                      setFieldValue("advice", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
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
}
