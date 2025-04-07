import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import { _formatMoney } from '../../../_helper/_formatMoney';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
const initData = {};
export default function StatisticalDetails({ formValues }) {
  const { businessUnit, fromDate, todate, profitCenter } = formValues;
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  useEffect(() => {
    if (businessUnit && fromDate && todate && profitCenter) {
      getRowData(
        `/fino/Report/IncomeStatementVertualCalculation?intAccountId=${profileData?.accountId}&intBusinessUnitId=${businessUnit?.value}&intProfitCenterId=${profitCenter?.value}&dteFromDate=${fromDate}&dteToDate=${todate}&intType=1`
      );
      // intType=1 as per ziaul bhai's suggestion
    }
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
                            width: '120px',
                          }}
                        >
                          General Ledger Code
                        </th>
                        <th>General Ledger Name</th>
                        <th>Type</th>
                        <th
                          style={{
                            width: '120px',
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
