import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _formatMoney } from '../../../_helper/_formatMoney';
import { fromDateFromApiNew } from '../../../_helper/_formDateFromApi';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import ButtonStyleOne from '../../../_helper/button/ButtonStyleOne';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import { SetFinancialManagementReportCashFlowStatementAction } from '../../../_helper/reduxForLocalStorage/Actions';
import {
  getBusinessDDLByED,
  getEnterpriseDivisionDDL,
} from '../incomestatement/helper';
import { getCashFlowStatement } from './helper';

const initDataFuction = (financialManagementReportCashFlowStatement) => {
  const initData = {
    enterpriseDivision:
      financialManagementReportCashFlowStatement?.enterpriseDivision || '',
    businessUnit:
      financialManagementReportCashFlowStatement?.businessUnit || '',
    convertionRate:
      financialManagementReportCashFlowStatement?.convertionRate || 1,
    fromDate: '',
    toDate: _todayDate(),
  };

  return initData;
};
export function CashFlowStatement() {
  const {
    authData: {
      profileData: { accountId, accountName },
      selectedBusinessUnit,
    },
    localStorage: {
      registerReport,
      financialManagementReportCashFlowStatement,
    },
  } = useSelector((store) => store, shallowEqual);
  const dispatch = useDispatch();

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enterpriseDivisionDDL, setEnterpriseDivisionDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const formikRef = React.useRef(null);

  useEffect(() => {
    fromDateFromApiNew(selectedBusinessUnit?.value, (date) => {
      if (formikRef.current) {
        const apiFormDate = date ? _dateFormatter(date) : '';
        const modifyInitData = initDataFuction(
          financialManagementReportCashFlowStatement,
        );
        formikRef.current.setValues({
          ...modifyInitData,
          ...registerReport,
          fromDate: apiFormDate,
        });
      }
    });
    getEnterpriseDivisionDDL(accountId, (enterpriseDivisionData) => {
      setEnterpriseDivisionDDL(enterpriseDivisionData);
      let initData = initDataFuction(
        financialManagementReportCashFlowStatement,
      );
      let initialEntepriceDivision = initData?.enterpriseDivision;
      if (!initData?.enterpriseDivision) {
        initialEntepriceDivision = enterpriseDivisionData?.[0];
        dispatch(
          SetFinancialManagementReportCashFlowStatementAction({
            ...initData,
            enterpriseDivision: enterpriseDivisionData?.[0] || '',
            businessUnit: '',
          }),
        );
      }
      if (initialEntepriceDivision) {
        getBusinessDDLByED(
          accountId,
          initialEntepriceDivision?.value,
          (businessUnitDDLData) => {
            setBusinessUnitDDL(businessUnitDDLData);
            if (!initData?.businessUnit) {
              dispatch(
                SetFinancialManagementReportCashFlowStatementAction({
                  ...initData,
                  businessUnit: businessUnitDDLData?.[0] || '',
                }),
              );
            }
          },
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const printRef = useRef();

  const [showRDLC, setShowRDLC] = useState(false);
  const groupId = '218e3d7e-f3ea-4f66-8150-bb16eb6fc606';
  const reportId = 'ed848d77-22ce-4690-be11-cb39ce5f332f';
  const parameterValues = (values) => {
    const agingParameters = [
      { name: 'ConvertionRate', value: `${values?.convertionRate}` },
      { name: 'fdate', value: `${values?.fromDate}` },
      { name: 'tdate', value: `${values?.toDate}` },
    ];
    return agingParameters;
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} innerRef={formikRef}>
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Cash Flow Statement">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form align-items-end">
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setShowRDLC(false);
                          setRowDto([]);
                          setFieldValue('enterpriseDivision', valueOption);
                          setFieldValue('businessUnit', '');
                          if (valueOption?.value) {
                            getBusinessDDLByED(
                              accountId,
                              valueOption?.value,
                              setBusinessUnitDDL,
                            );
                          }
                        }}
                        placeholder="Enterprise Division"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setShowRDLC(false);
                          setRowDto([]);
                          setFieldValue('businessUnit', valueOption);
                        }}
                        placeholder="Business Unit"
                        isDisabled={!values?.enterpriseDivision}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Conversion Rate</label>
                      <InputField
                        value={values?.convertionRate}
                        name="convertionRate"
                        placeholder="Convertion Rate"
                        type="number"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue('convertionRate', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue('fromDate', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          setShowRDLC(false);
                          setFieldValue('toDate', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="View"
                        disabled={
                          !values?.enterpriseDivision ||
                          !values?.businessUnit ||
                          !values?.fromDate ||
                          !values?.toDate ||
                          values?.convertionRate < 1
                        }
                        onClick={() => {
                          dispatch(
                            SetFinancialManagementReportCashFlowStatementAction(
                              {
                                ...values,
                              },
                            ),
                          );
                          setShowRDLC(false);
                          getCashFlowStatement(
                            values?.businessUnit?.value,
                            0,
                            values?.fromDate,
                            values?.toDate,
                            setRowDto,
                            setLoading,
                            values?.enterpriseDivision,
                            values?.convertionRate,
                          );
                        }}
                        style={{ marginTop: '19px' }}
                      />
                    </div>
                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="Details"
                        disabled={
                          !values?.enterpriseDivision ||
                          !values?.businessUnit ||
                          !values?.fromDate ||
                          !values?.toDate ||
                          values?.convertionRate < 1
                        }
                        onClick={() => {
                          setShowRDLC(true);
                        }}
                        style={{ marginTop: '19px' }}
                      />
                    </div>
                    <div className="col-auto">
                      {rowDto?.length > 0 && (
                        <ReactToPrint
                          pageStyle={
                            '@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}'
                          }
                          trigger={() => (
                            <button
                              type="button"
                              className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                            >
                              Print
                            </button>
                          )}
                          content={() => printRef.current}
                        />
                      )}
                    </div>
                  </div>
                  {showRDLC ? (
                    <div>
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
                    </div>
                  ) : (
                    <>
                      {rowDto?.length > 0 && (
                        <div
                          className="d-flex flex-column align-items-center"
                          ref={printRef}
                        >
                          <div className="text-center">
                            <h2 className="mb-0" style={{ fontWeight: 'bold' }}>
                              {values?.businessUnit?.value > 0
                                ? values?.businessUnit?.label
                                : accountName}
                            </h2>
                            <h4 className="text-primary">
                              Cash Flow Statement
                            </h4>
                            <p className="mt-4" style={{ fontWeight: 'bold' }}>
                              {`For the period of: ${_dateFormatter(
                                values?.fromDate,
                              )}  to  ${_dateFormatter(values?.toDate)}`}{' '}
                            </p>
                          </div>

                          <table
                            style={{ width: '75%' }}
                            className="cashFlowStatement"
                          >
                            <tr>
                              <td className="pr-5 text-right">
                                Opening Cash & Cash Equivalent
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  textAlign: 'center',
                                }}
                              >
                                {_formatMoney(rowDto[0]['numPlannedOpening'])}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  textAlign: 'center',
                                }}
                              >
                                {_formatMoney(rowDto[0]['numOpening'])}
                              </td>
                              <td
                                style={{
                                  border: '1px solid black',
                                  textAlign: 'center',
                                }}
                              >
                                {_formatMoney(
                                  rowDto[0]['numPlannedOpening'] -
                                    rowDto[0]['numOpening'],
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td style={{ height: '15px' }}></td>
                              <td
                                className="text-center"
                                style={{ height: '15px' }}
                              >
                                Budget
                              </td>
                              <td
                                className="text-center"
                                style={{ height: '15px' }}
                              >
                                Actual
                              </td>
                              <td
                                className="text-center"
                                style={{ height: '15px' }}
                              >
                                Variance
                              </td>
                            </tr>
                            {rowDto?.map((item, index) => {
                              switch (item.intFSId) {
                                case 9999:
                                  return (
                                    <tr style={{ background: '#e6ecff' }}>
                                      <td colSpan="4">{item?.strName}</td>
                                    </tr>
                                  );
                                case 0:
                                  if (item.strName.startsWith('Net')) {
                                    return (
                                      <tr style={{ background: '#f0f0f5' }}>
                                        <td>{item?.strName}</td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(item?.numPlannedAmount)}
                                        </td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(item?.numAmount)}
                                        </td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(
                                            item?.numPlannedAmount -
                                              item?.numAmount,
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  } else if (index === rowDto.length - 1) {
                                    return (
                                      <tr style={{ background: '#e6ecff' }}>
                                        <td>{item?.strName}</td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(item?.numPlannedAmount)}
                                        </td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(item?.numAmount)}
                                        </td>
                                        <td
                                          className="text-right"
                                          style={{ width: '120px' }}
                                        >
                                          {_formatMoney(
                                            item?.numPlannedAmount -
                                              item?.numAmount,
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                  return (
                                    <tr>
                                      <td colSpan="4">{item?.strName}</td>
                                    </tr>
                                  );
                                case null:
                                  return (
                                    <tr>
                                      <td
                                        colSpan="4"
                                        style={{ height: '15px' }}
                                      ></td>
                                    </tr>
                                  );

                                default:
                                  return (
                                    <tr>
                                      <td
                                        style={{
                                          padding: '0 0 0 5px',
                                          fontWeight: 'normal',
                                        }}
                                      >
                                        {item?.strName}
                                      </td>
                                      <td
                                        className="pr-1"
                                        style={{
                                          border: '1px solid black',
                                          textAlign: 'right',
                                          width: '120px',
                                          padding: '0',
                                          fontWeight: 'normal',
                                        }}
                                      >
                                        {_formatMoney(item?.numPlannedAmount)}
                                      </td>
                                      <td
                                        className="pr-1"
                                        style={{
                                          border: '1px solid black',
                                          textAlign: 'right',
                                          width: '120px',
                                          padding: '0',
                                          fontWeight: 'normal',
                                        }}
                                      >
                                        {_formatMoney(item?.numAmount)}
                                      </td>
                                      <td
                                        className="pr-1"
                                        style={{
                                          border: '1px solid black',
                                          textAlign: 'right',
                                          width: '120px',
                                          padding: '0',
                                          fontWeight: 'normal',
                                        }}
                                      >
                                        {_formatMoney(
                                          item?.numPlannedAmount -
                                            item?.numAmount,
                                        )}
                                      </td>
                                    </tr>
                                  );
                              }
                            })}
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
