import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _formatMoney } from "../../../../_helper/_formatMoney";
const initData = {};
export default function StatisticalDetails({ formValues }) {
  const {
    businessUnit,
    fromDate,
    todate,
    profitCenter,
    isForecast,
  } = formValues;
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  useEffect(() => {
    if (businessUnit && fromDate && todate && profitCenter) {
      getRowData(
        `/fino/Report/IncomeStatementVertualCalculation?intAccountId=${profileData?.accountId}&intBusinessUnitId=${businessUnit?.value}&intProfitCenterId=${profitCenter?.value}&dteFromDate=${fromDate}&dteToDate=${todate}&intType=1&isForecast=${isForecast?.value}`
      );
      // intType=1 as per ziaul bhai's suggestion
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {};

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
          {rowDataLoader && <Loading />}
          <IForm
            title="Statistical Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th
                          style={{
                            width: "120px",
                          }}
                        >
                          General Ledger Code
                        </th>
                        <th>General Ledger Name</th>
                        <th>Type</th>
                        <th
                          style={{
                            width: "120px",
                          }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strGeneralLedgerCode}
                            </td>
                            <td>{item?.strGeneralLedgerName}</td>
                            <td>{item?.strType}</td>
                            <td className="text-right">
                              {_formatMoney(item?.numAmount)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
