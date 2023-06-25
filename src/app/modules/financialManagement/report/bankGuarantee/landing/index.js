import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import BankGuaranteeTable from "./bankGuaranteeTable";
import DepositRegisterTable from "./depositRegisterTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
const initData = {
  type: { value: 1, label: "Bank Guarantee" },
};
export default function BankGuaranteeLanding() {
  const history = useHistory();
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {loading && <Loading />}
          <IForm
            title="BANK GUARANTEE"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/financial-management/banking/BankGuarantee/create/${values?.type?.value}`
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="Type"
                    options={[
                      { value: 1, label: "Bank Guarantee" },
                      { value: 2, label: "Deposit Register" },
                    ]}
                    value={values?.type}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setRowData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div>
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.type}
                    onClick={() => {
                      getRowData(
                        `/fino/CommonFino/GetBankGuaranteeSecurityRegister?businessUnitId=4&type=${values?.type?.label}`
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {[1].includes(values?.type?.value) ? (
                  <BankGuaranteeTable rowData={rowData} />
                ) : (
                  <DepositRegisterTable rowData={rowData} />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
