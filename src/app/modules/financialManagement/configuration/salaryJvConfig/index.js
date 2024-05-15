import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
const initData = {};
export default function SalaryJvConfigLanding() {
  const [landingData, getLandingData, landingDataLoader] = useAxiosGet();
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  useEffect(() => {
    getLandingData(
      `/fino/AdjustmentJournal/GetAllDebitCreditGLConfig?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {landingDataLoader && <Loading />}
          <IForm
            title="Salary JV Configuration"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {landingData?.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-primary mr-1"
                      onClick={() => {
                        history.push({
                          pathname: `/financial-management/configuration/SalaryJVConfig/edit`,
                          state: { isEdit: true },
                        });
                      }}
                    >
                      Edit
                    </button>
                  )}

                  {landingData?.length < 1 && (
                    <button
                      type="button"
                      className="btn btn-primary ml-1"
                      onClick={() => {
                        history.push(
                          "/financial-management/configuration/SalaryJVConfig/create"
                        );
                      }}
                    >
                      Create
                    </button>
                  )}
                </div>
              );
            }}
          >
            <Form>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Cost Center Name</th>
                      <th>Cost Element Name</th>
                      <th>Profit Center Name</th>
                      <th>Salary Component</th>
                      <th>Debit Gl Name</th>
                      <th>Debit Business Transaction Name</th>
                      <th>CreditGlname</th>
                      <th>Credit Business Transaction Name</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingData?.length > 0 &&
                      landingData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.strCostCenterName}</td>
                            <td>{item?.strCostElementName}</td>
                            <td>{item?.strProfitCenterName}</td>
                            <td>{item?.strSalaryTableColumnNameForView}</td>
                            <td>{item?.strDebitGlname}</td>
                            <td>{item?.strDebitBusinessTransactionName}</td>
                            <td>{item?.strCreditGlname}</td>
                            <td>{item?.strCreditBusinessTransactionName}</td>
                            <td>{item?.strType}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
