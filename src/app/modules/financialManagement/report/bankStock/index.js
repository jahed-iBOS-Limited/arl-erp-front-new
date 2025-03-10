import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import { getLastDateOfMonth } from './helper';
import PrintView from './printView';
import './style.scss';
import { commonGetLetterHead } from '../../../_helper/letterHead/commonGetLetterHead';
const initData = {};
export default function BankStock() {
  const { businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [reportData, getReportData, loader, setReportData] = useAxiosGet();
  const [totalAmount, getTotalAmount] = useAxiosGet();
  const saveHandler = (values, cb) => {};

  const printRef = useRef();

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      '@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}',
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
          {loader && <Loading />}
          <IForm title="Bank Stock" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue('businessUnit', valueOption || '');
                        setReportData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Month-Year</label>
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      placeholder="From Date"
                      type="month"
                      onChange={(e) => {
                        setFieldValue('monthYear', e?.target?.value);
                        setReportData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        getReportData(
                          `/fino/BankLetter/GetBankStockReport?businessUnitId=${
                            values?.businessUnit?.value
                          }&dteDate=${getLastDateOfMonth(
                            values?.monthYear?.split('-')[1],
                          )}`,
                        );
                        getTotalAmount(
                          `/fino/BankLetter/GetReceableAmount?businessUnitId=${
                            values?.businessUnit?.value
                          }&dteDate=${getLastDateOfMonth(
                            values?.monthYear?.split('-')[1],
                          )}`,
                        );
                      }}
                      type="button"
                      className="btn  btn-primary mt-5"
                    >
                      View
                    </button>
                  </div>
                </div>
                {reportData?.length > 0 && (
                  <div className="text-right mt-3 mr-5">
                    <button
                      onClick={() => {
                        handleInvoicePrint();
                      }}
                      className="btn btn-primary"
                    >
                      Print
                    </button>
                  </div>
                )}
                <div ref={printRef} id="bank-stock-print-wrapper">
                  <div style={{ margin: '-13px 50px 51px 50px' }}>
                    <div
                      className="invoice-header"
                      style={{
                        backgroundImage: `url(${commonGetLetterHead({
                          buId: values?.businessUnit?.value,
                        })})`,
                        backgroundRepeat: 'no-repeat',
                        height: '150px',
                        backgroundPosition: 'left 10px',
                        backgroundSize: 'cover',
                        position: 'fixed',
                        width: '100%',
                        top: '-50px',
                      }}
                    ></div>
                    <div
                      className="invoice-footer"
                      style={{
                        backgroundImage: `url(${commonGetLetterHead({
                          buId: values?.businessUnit?.value,
                        })})`,
                        backgroundRepeat: 'no-repeat',
                        height: '100px',
                        backgroundPosition: 'left bottom',
                        backgroundSize: 'cover',
                        bottom: '-0px',
                        position: 'fixed',
                        width: '100%',
                      }}
                    ></div>
                    <table>
                      <thead>
                        <tr>
                          <td
                            style={{
                              border: 'none',
                            }}
                          >
                            {/* place holder for the fixed-position header */}
                            <div
                              id="theadHeight"
                              // style={{
                              //   height: "110px",
                              // }}
                            ></div>
                          </td>
                        </tr>
                      </thead>
                      {/* CONTENT GOES HERE */}
                      <tbody>
                        <div style={{ marginTop: '40px' }}>
                          {reportData?.length > 0 && (
                            <PrintView
                              reportData={reportData}
                              values={values}
                              totalAmount={totalAmount}
                            />
                          )}
                        </div>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              border: 'none',
                            }}
                          >
                            {/* place holder for the fixed-position footer */}
                            <div
                              id="tfootHeight"
                              // style={{
                              //   height: "150px",
                              // }}
                            ></div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
