import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import { _formatMoney } from '../../../_helper/_formatMoney';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { SetReportIncomestatementAction } from '../../../_helper/reduxForLocalStorage/Actions';
import { getProfitCenterDDL } from '../profitCenterReport/Form/helper';
import {
  getBusinessDDLByED,
  getEnterpriseDivisionDDL,
  getIncomeStatement_api,
} from './helper';
import printIcon from '../../../../modules/_helper/images/print-icon.png';
import IViewModal from '../../../_helper/_viewModal';
import GeneralLedgerTaxModalForIncomeStatement from './generalLedgerTaxModal';
import GeneralLedgerModalForIncomeStatement from '../incomestatement/generalLedgerModal';
import { fromDateFromApiNew } from '../../../_helper/_formDateFromApi';
import { _dateFormatter } from '../../../_helper/_dateFormate';

const initDataFuction = (reportIncomestatement) => {
  const initData = {
    id: undefined,
    fromDate: '',
    todate: _todayDate(),
    lastPeriodFrom: _todayDate(),
    lastPeriodTo: _todayDate(),
    enterpriseDivision: reportIncomestatement?.enterpriseDivision || '',
    subDivision: reportIncomestatement?.subDivision || '',
    SBU: reportIncomestatement?.SBU || '',
    profitCenter: reportIncomestatement?.profitCenter || '',
    businessUnit: reportIncomestatement?.businessUnit || '',
    conversionRate: reportIncomestatement?.conversionRate || 1,
    reportType: reportIncomestatement?.reportType || {
      value: 1,
      label: 'Statistical',
    },
  };

  return initData;
};

import html2pdf from 'html2pdf.js';

export default function IncomeStatementTaxLanding() {
  const {
    localStorage: { reportIncomestatement },
    authData: {
      profileData: { accountId, ...restProfileData },
      businessUnitList,
      selectedBusinessUnit,
    },
  } = useSelector((state) => state, shallowEqual);

  const dispatch = useDispatch();
  const [enterpriseDivisionDDL, setEnterpriseDivisionDDL] = useState([]);
  const [subDivisionDDL, getSubDivisionDDL, loadingOnGetSubDivisionDDL] =
    useAxiosGet([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const [incomeStatement, setIncomeStatement] = useState([]);
  const [loading, setLoading] = useState(false);
  const formikRef = React.useRef(null);

  // get user profile data from store

  useEffect(() => {
    fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
      if (formikRef.current) {
        const apiFormDate = date ? _dateFormatter(date) : '';
        const modifyInitData = initDataFuction(reportIncomestatement);
        formikRef.current.setValues({
          ...modifyInitData,
          fromDate: apiFormDate,
        });
      }
    });

    getEnterpriseDivisionDDL(accountId, setEnterpriseDivisionDDL);

  }, []);

  const pdfExport = (fileName) => {
    var element = document.getElementById('pdf-section');
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 5,
        dpi: 300,
        letterRendering: true,
        padding: '50px',
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      },
      jsPDF: { unit: 'px', hotfixes: ['px_scaling'], orientation: 'landscape' },
    };
    html2pdf().set(opt).from(element).save();
  };
  const printRef = useRef();

  const [showGeneralLedgerModal, setShowGeneralLedgerModal] = useState(false);
  const [showGeneralLedgerTaxModal, setShowGeneralLedgerTaxModal] =
    useState(false);
  const [incomeStatementRow, setIncomeStatementRow] = useState(null);

  const {

    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  //   const [showRDLC, // setShowRDLC] = useState(false);
  //   const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
  //   const reportId = "bbd2a18f-8600-4ed8-bb55-1948a80e1605";
  //   const parameterValues = (values) => {
  //     const agingParameters = [
  //       { name: "ConvertionRate", value: `${values?.conversionRate}` },
  //       { name: "fdate", value: `${values?.fromDate}` },
  //       { name: "tdate", value: `${values?.todate}` },
  //     ];
  //     return agingParameters;
  //   };
  return (
    <>
      {(loading || loadingOnGetSubDivisionDDL) && <Loading />}
      <Formik enableReinitialize={true} initialValues={{}} innerRef={formikRef}>
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Income Statement Tax Report'}>
                <CardHeaderToolbar>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary m-0 mx-2 py-2 px-2"
                    table="table-to-xlsx"
                    filename="Income Statement Report"
                    sheet="Income Statement Report"
                    buttonText="Export Excel"
                  />
                  <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={(e) => pdfExport('Income Statement Report')}
                  >
                    Export PDF
                  </button>
                  <ReactToPrint
                    pageStyle={
                      '@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}'
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                      >
                        <img
                          style={{ width: '20px', paddingRight: '5px' }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right incomestatementTable">
                  <div className="row global-form incomestatementTablePrint">
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue('enterpriseDivision', valueOption);
                          setFieldValue('subDivision', '');
                          setFieldValue('businessUnit', '');
                          setFieldValue('profitCenter', '');
                          // setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     enterpriseDivision: valueOption,
                          //     subDivision: "",
                          //     businessUnit: "",
                          //     profitCenter: "",
                          //   })
                          // );
                          if (valueOption?.value) {
                            getSubDivisionDDL(
                              `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${accountId}&BusinessUnitGroup=${valueOption?.label}`,
                            );
                          }
                        }}
                        placeholder="Enterprise Division"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          setFieldValue('subDivision', valueOption);
                          setFieldValue('businessUnit', '');
                          setFieldValue('profitCenter', '');
                          // setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     subDivision: valueOption,
                          //     businessUnit: "",
                          //     profitCenter: "",
                          //   })
                          // );

                          if (valueOption) {
                            getBusinessDDLByED(
                              accountId,
                              values?.enterpriseDivision?.value,
                              setBusinessUnitDDL,
                              valueOption,
                            );
                          }
                        }}
                        placeholder="Sub Division"
                        isDisabled={!values?.enterpriseDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue('businessUnit', valueOption);
                          setFieldValue('profitCenter', '');
                          // setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     businessUnit: valueOption,
                          //     profitCenter: "",
                          //   })
                          // );
                          if (valueOption?.value >= 0) {
                            getProfitCenterDDL(
                              valueOption?.value,
                              (profitCenterDDLData) => {
                                setFieldValue('businessUnit', valueOption);
                                setFieldValue(
                                  'profitCenter',
                                  profitCenterDDLData?.[0] || '',
                                );
                                setProfitCenterDDL(profitCenterDDLData);
                                // dispatch(
                                //   SetReportIncomestatementAction({
                                //     ...values,
                                //     businessUnit: valueOption,
                                //     profitCenter:
                                //       profitCenterDDLData?.[0] || "",
                                //   })
                                // );
                              },
                            );
                          }
                        }}
                        placeholder="Business Unit"
                        isDisabled={!values?.subDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        isDisabled={
                          values?.businessUnit?.value === 0 ||
                          !values?.businessUnit
                            ? true
                            : false
                        }
                        name="profitCenter"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        label="Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue('profitCenter', valueOption);
                          // setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     profitCenter: valueOption,
                          //   })
                          // );
                        }}
                        placeholder="Profit Center"
                      />
                    </div>
                    <div className="col-md-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          // setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     fromDate: e?.target?.value,
                          //   })
                          // );
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>To date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('todate', e.target.value);
                          // setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     todate: e?.target?.value,
                          //   })
                          // );
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.conversionRate}
                        name="conversionRate"
                        placeholder="Conversion Rate"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('conversionRate', e.target.value);
                          // setShowRDLC(false);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     conversionRate: e?.target?.value,
                          //   })
                          // );
                        }}
                        min={0}
                      />
                    </div>
                    <div className="col-md-2">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: 'Statistical' },
                          { value: 2, label: 'GL Based' },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue('reportType', valueOption);
                          // setShowRDLC(false);
                          setIncomeStatement([]);
                          // dispatch(
                          //   SetReportIncomestatementAction({
                          //     ...values,
                          //     reportType: valueOption,
                          //   })
                          // );
                        }}
                        placeholder="Report Type"
                      />
                    </div>
                    <div className="col-md-3 mt-5 pt-1 d-flex">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                            }),
                          );
                          // setShowRDLC(false);
                          getIncomeStatement_api(
                            values?.fromDate,
                            values?.todate,
                            values?.lastPeriodFrom,
                            values?.lastPeriodTo,
                            values?.businessUnit?.value,
                            0,
                            setIncomeStatement,
                            values?.profitCenter,
                            setLoading,
                            'IncomeStatement',
                            values?.enterpriseDivision?.value,
                            values?.conversionRate,
                            values?.subDivision,
                            values?.reportType?.value,
                          );
                        }}
                        disabled={
                          !values?.profitCenter ||
                          !values?.businessUnit ||
                          !values?.enterpriseDivision ||
                          !values?.conversionRate ||
                          values?.conversionRate <= 0 ||
                          !values?.reportType
                        }
                      >
                        Show
                      </button>
                      {/* <button
                        className="ml-3 btn btn-primary"
                        type="button"
                        onClick={() => {
                          // setShowRDLC(true);
                        }}
                        disabled={
                          !values?.profitCenter ||
                          !values?.businessUnit ||
                          !values?.enterpriseDivision ||
                          !values?.conversionRate ||
                          values?.conversionRate <= 0
                        }
                      >
                        Details
                      </button> */}
                    </div>
                  </div>

                  {/* {showRDLC ? (
                    <div>
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
                    </div>
                  ) : ( */}
                  <div className="row" id="pdf-section" ref={printRef}>
                    {incomeStatement.length > 0 && (
                      <div className="col-lg-12">
                        <div className="titleContent text-center">
                          <h3>
                            {values?.businessUnit?.value > 0
                              ? values?.businessUnit?.label
                              : restProfileData?.accountName}
                          </h3>
                          <h5>Comprehensive Income Statement</h5>
                          <p className="m-0">
                            <strong>
                              {`For the period from ${values?.fromDate} to ${values?.todate}`}
                            </strong>
                          </p>
                        </div>
                        <div className="print_wrapper">
                          <table
                            id="table-to-xlsx"
                            className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: '500px' }}>Particulars</th>
                                <th style={{ width: '200px' }}>Note SL</th>

                                <th
                                  style={{ width: '250px' }}
                                  className="incTableThPadding"
                                >
                                  <span>
                                    Tax Budget
                                    <br />
                                    {/* {`${values?.fromDate} to ${values?.todate}`} */}
                                  </span>
                                </th>
                                <th
                                  style={{ width: '250px' }}
                                  className="incTableThPadding"
                                >
                                  <span>
                                    Actual <br />
                                    {/* {`${values?.lastPeriodFrom} to ${values?.lastPeriodTo}`} */}
                                  </span>
                                </th>
                                <th
                                  style={{ width: '250px' }}
                                  className="incTableThPadding"
                                >
                                  <span>Actual Tax</span>
                                </th>
                                <th style={{ width: '250px' }}>Variance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {incomeStatement?.map((data, index) => (
                                <>
                                  <tr
                                    className={
                                      data?.intFSId === 0 ||
                                      data?.intFSId === 20
                                        ? 'font-weight-bold'
                                        : ''
                                    }
                                  >
                                    <td className="text-left">
                                      {data?.strFSComponentName}
                                    </td>
                                    <td></td>

                                    <td className="text-right">
                                      {_formatMoney(data?.monLastPeriodAmount)}
                                    </td>
                                    <td
                                      className="text-right pointer"
                                      style={{
                                        textDecoration:
                                          data?.intFSId === 0 ||
                                          data?.intFSId === 20
                                            ? ''
                                            : 'underline',
                                        color:
                                          data?.intFSId === 0 ||
                                          data?.intFSId === 20
                                            ? ''
                                            : 'blue',
                                      }}
                                    >
                                      <span
                                        onClick={() => {
                                          if (
                                            !(
                                              data?.intFSId === 0 ||
                                              data?.intFSId === 20
                                            )
                                          ) {
                                            setShowGeneralLedgerModal(true);
                                            setIncomeStatementRow(data);
                                          }
                                        }}
                                      >
                                        {' '}
                                        {_formatMoney(
                                          data?.monCurrentPeriodAmount,
                                        )}
                                      </span>
                                    </td>

                                    <td
                                      className="text-right pointer"
                                      style={{
                                        textDecoration:
                                          data?.intFSId === 0 ||
                                          data?.intFSId === 20
                                            ? ''
                                            : 'underline',
                                        color:
                                          data?.intFSId === 0 ||
                                          data?.intFSId === 20
                                            ? ''
                                            : 'blue',
                                      }}
                                    >
                                      <span
                                        onClick={() => {
                                          if (
                                            !(
                                              data?.intFSId === 0 ||
                                              data?.intFSId === 20
                                            )
                                          ) {
                                            setShowGeneralLedgerTaxModal(true);
                                            setIncomeStatementRow(data);
                                          }
                                        }}
                                      >
                                        {' '}
                                        {_formatMoney(
                                          data?.monCurrentPeriodAmountTax,
                                        )}
                                      </span>
                                    </td>

                                    {/* <td className="text-right">
                                          {_formatMoney(data?.monCurrentPeriodAmountTax)}
                                      </td> */}
                                    <td className="text-right">
                                      {/* {
                                        +data?.monCurrentPeriodAmount > 0 ?
                                      _formatMoney(+data?.monCurrentPeriodAmount - Math.abs(data?.monCurrentPeriodAmountTax))
                                       :  _formatMoney(+data?.monCurrentPeriodAmount + Math.abs(data?.monCurrentPeriodAmountTax))
                                    } */}

                                      {data?.monCurrentPeriodAmount < 0 &&
                                      data?.monCurrentPeriodAmountTax < 0
                                        ? data?.monCurrentPeriodAmount >
                                          data?.monCurrentPeriodAmountTax
                                          ? _formatMoney(
                                              Math.abs(
                                                data?.monCurrentPeriodAmount,
                                              ) -
                                                Math.abs(
                                                  data?.monCurrentPeriodAmountTax,
                                                ),
                                            )
                                          : _formatMoney(
                                              Math.abs(
                                                data?.monCurrentPeriodAmountTax,
                                              ) -
                                                Math.abs(
                                                  data?.monCurrentPeriodAmount,
                                                ),
                                            )
                                        : _formatMoney(
                                            +data?.monCurrentPeriodAmount -
                                              Math.abs(
                                                data?.monCurrentPeriodAmountTax,
                                              ),
                                          )}
                                    </td>
                                  </tr>
                                </>
                              ))}
                              <tr>
                                <td
                                  className="text-center d-none"
                                  colSpan={4}
                                >{`System Generated Report - ${moment().format(
                                  'LLLL',
                                )}`}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* )} */}
                </Form>
              </CardBody>
            </Card>
            <IViewModal
              show={showGeneralLedgerModal}
              onHide={() => {
                setShowGeneralLedgerModal(false);
                setIncomeStatementRow(null);
              }}
            >
              <GeneralLedgerModalForIncomeStatement
                values={values}
                businessUnitList={businessUnitList}
                incomeStatementRow={incomeStatementRow}
                profileData={{ ...restProfileData, accountId }}
              />
            </IViewModal>
            <IViewModal
              show={showGeneralLedgerTaxModal}
              onHide={() => {
                setShowGeneralLedgerTaxModal(false);
                setIncomeStatementRow(null);
              }}
            >
              <GeneralLedgerTaxModalForIncomeStatement
                values={values}
                businessUnitList={businessUnitList}
                incomeStatementRow={incomeStatementRow}
                profileData={{ ...restProfileData, accountId }}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
