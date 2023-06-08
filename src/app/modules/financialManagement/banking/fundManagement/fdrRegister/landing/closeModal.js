import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { _todayDate } from "../../../../../_helper/_todayDate";

const initData = {
  bankAcc: "",
  closingDate: "",
  ait: "",
  exDuty: "",
  interest: "",
};

function FDRCloseModal({ singleData, getData, setOpenCloseModal }) {
  const [, saveData] = useAxiosPost();
  const [bankAccDDL, setBankAccDDL] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setBankAccDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"FDR Register"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <NewSelect
                        name="month"
                        options={bankAccDDL || []}
                        value={values?.bankAcc}
                        label="Select Bank Account"
                        onChange={(valueOption) => {
                          setFieldValue("bankAcc", valueOption);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="Closing Date"
                        value={values?.closingDate}
                        name="closingDate"
                        // min={_dateFormatter(singleData?.dteMaturityDate)}
                        max={_todayDate()}
                        type="date"
                        onChange={(e) => {
                          setFieldValue("closingDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="Interest"
                        value={values?.interest}
                        name="interest"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn("Interest can't less than zero");
                          setFieldValue("interest", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="AIT"
                        value={values?.ait}
                        name="ait"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn("AIT can't be less than zero");
                          setFieldValue("ait", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        label="Excise Duty"
                        value={values?.exDuty}
                        name="exDuty"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0)
                            return toast.warn(
                              "Excise Duty can't less than zero"
                            );
                          setFieldValue("exDuty", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-5"
                        disabled={
                          !values.bankAcc?.value ||
                          !values.closingDate ||
                          !values.ait ||
                          !values.exDuty ||
                          !values?.interest
                        }
                        onClick={() => {
                          IConfirmModal({
                            message: "Are you sure you want to close ?",
                            yesAlertFunc: () => {
                              saveData(
                                `/fino/FundManagement/FundFDRClose?intAccount=${profileData?.accountId}&intUnit=${selectedBusinessUnit?.value}&intFdrAccId=${singleData?.intFdrAccountId}&intBankAccId=${values?.bankAcc?.value}&dteCloseDate=${values?.closingDate}&numAit=${values?.ait}&numExDuty=${values?.exDuty}&numIntRate=${values?.interest}&intActionBy=${profileData?.userId}`,
                                null,
                                () => {
                                  setOpenCloseModal(false);
                                  getData();
                                },
                                true
                              );
                            },
                            noAlertFunc: () => {},
                          });
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default FDRCloseModal;
