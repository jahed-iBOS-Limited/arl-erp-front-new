import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import * as Yup from 'yup';
import {
  _dateFormatter,
  _dateFormatterTwo,
} from '../../../../_helper/_dateFormate';
import { _firstDateofMonth } from '../../../../_helper/_firstDateOfCurrentMonth';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import ICustomTable from '../../../_chartinghelper/_customTable';
import { _todayDate } from '../../../_chartinghelper/_todayDate';
import FormikInput from '../../../_chartinghelper/common/formikInput';
import Loading from '../../../_chartinghelper/loading/_loading';
import { CreateJournalVoucher, getDieselStatementTwo, months } from '../helper';

const headers = [
  { name: 'Date' },
  { name: 'Lighter Vessel Name' },
  { name: 'JV Code' },
  { name: 'Voyage No' },
  { name: 'Unit' },
  { name: 'Qty' },
  { name: 'Rate' },
  { name: 'Amount(Tk.)' },
];

const validationSchema = Yup.object().shape({
  narration: Yup.string().required('Narration is required'),
});

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
};

export default function DieselStatementTwo() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grandTotalAmount, setGrandTotalAmount] = useState(0);
  const [grandTotalQty, setGrandTotalQty] = useState(0);
  const printRef = useRef();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values) => {
    getDieselStatementTwo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading,
      setGrandTotalAmount,
      setGrandTotalQty
    );
  };

  useEffect(() => {
    getGridData(initData);
  }, [profileData, selectedBusinessUnit]);

  // let grandTotalAmount = 0;
  // let grandTotalQty = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          CreateJournalVoucher(
            'diesel',
            profileData?.accountId,
            selectedBusinessUnit?.value,
            new Date(values?.date).getMonth(),
            new Date(values?.date).getFullYear(),
            values?.narration,
            profileData?.userId,
            setLoading,
            () => resetForm(initData),
            values
          );
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <FormikInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                        getGridData({ ...values, fromDate: e?.target?.value });
                      }}
                      max={values?.toDate}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('toDate', e.target.value);
                        getGridData({ ...values, toDate: e?.target?.value });
                      }}
                      min={values?.fromDate}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-6 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Diesel Statement (for supplier)"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        '@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}'
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2"
                        >
                          <i
                            className="mr-1 fa fa-print pointer"
                            aria-hidden="true"
                          ></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                </div>
              </div>
              <div ref={printRef}>
                <div className="text-center" style={{ margin: '15px 0' }}>
                  <h4>
                    Diesel Received Statement from Akij Cement Company Ltd
                    <br />
                    From {_dateFormatterTwo(values?.fromDate)} To{' '}
                    {_dateFormatterTwo(values?.toDate)}
                    {/* For the month of{" "}
                    {months[new Date(values?.date).getMonth()] +
                      "-" +
                      new Date(values?.date)?.getFullYear()} */}
                    <br />
                    Akij Shipping Line Ltd <br />
                    198,Gulshan Link Road, Tejgaon-1208{' '}
                  </h4>
                </div>
                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none" style={{ textAlign: 'center' }}>
                    <h4>
                      Diesel Received Statement from Akij Cement Company Ltd
                      <br />
                      For the month of{' '}
                      {months[new Date(values?.date).getMonth()] +
                        '-' +
                        new Date(values?.date)?.getFullYear()}
                      <br />
                      Akij Shipping Line Ltd <br />
                      198,Gulshan Link Road, Tejgaon-1208{' '}
                    </h4>
                  </div>
                  {gridData?.map((item, index) => {
                    return item?.map((e, i) => {
                      return (
                        <>
                          <tr key={i}>
                            <td>{_dateFormatter(e?.date)}</td>
                            <td className="text-left">
                              {e?.lighterVesselName}
                            </td>
                            <td>{e?.dieselExpJvCode}</td>
                            <td>{e?.tripNo}</td>
                            <td>{'Ltr'}</td>
                            <td className="text-right">
                              {_formatMoney(e?.qty, 0)}
                            </td>
                            <td className="text-right">{e?.rate}</td>
                            <td className="text-right">
                              {_formatMoney(e?.amount)}
                            </td>
                          </tr>
                          {item?.length - 1 === i && (
                            <tr
                              style={{
                                fontWeight: 'bold',
                                // background: "#eff6ff",
                              }}
                            >
                              <td colSpan={5} className="text-right">
                                Total
                              </td>
                              <td className="text-right">
                                {' '}
                                {_formatMoney(
                                  item?.reduce((a, b) => {
                                    return a + b.qty;
                                  }, 0),
                                  0
                                )}{' '}
                              </td>
                              <td></td>
                              <td className="text-right">
                                {' '}
                                {_formatMoney(
                                  item?.reduce((a, b) => {
                                    return a + b.amount;
                                  }, 0)
                                )}{' '}
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    });
                  })}
                  {gridData?.length > 0 && (
                    <tr style={{ fontWeight: 'bold' }}>
                      <td className="text-right" colSpan="5">
                        Grand Total
                      </td>
                      <td className="text-right">
                        {_formatMoney(grandTotalQty || 0, 0)}
                      </td>
                      <td></td>
                      <td className="text-right">
                        {_formatMoney(grandTotalAmount || 0)}
                      </td>
                    </tr>
                  )}
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
