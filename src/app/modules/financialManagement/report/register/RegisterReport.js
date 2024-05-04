/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ICustomTable from '../../../_helper/_customTable';
import { _firstDateofMonth } from '../../../_helper/_firstDateOfCurrentMonth';
import InfoCircle from '../../../_helper/_helperIcons/_infoCircle';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import ButtonStyleOne from '../../../_helper/button/ButtonStyleOne';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from './../../../../../_metronic/_partials/controls';
import { _formatMoney } from './../../../_helper/_formatMoney';
import NewSelect from './../../../_helper/_select';
import GeneralLedgerTable from './GeneralLedgerTable';
import RegisterDetailsModal from './RegisterDetailsModal';
import {
  getGeneralLedgerDDL,
  getRegisterReportAction,
  getSbuDDLAction,
} from './helper';
// import { useHistory } from "react-router-dom";
import moment from 'moment';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { setRegisterReportAction } from '../../../_helper/reduxForLocalStorage/Actions';
import { PartnerLedger } from '../../../procurement/reports/partnerLedger';
import PartnerModal from './partnerDetailsModal/partnerModal';
import SubScheduleRDLCReport from './registerReports/SubSheduleRDLCReport';

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: '',
  generalLedger: '',
  profitCenter: '',
};
export function RegisterReport({
  registerTypeId,
  partnerTypeId,
  partnerTypeName,
  title,
}) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const { registerReport } = useSelector(
    (state) => state?.localStorage,
    shallowEqual,
  );
  // const history = useHistory();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalLedger, setGeneralLedger] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tableItem, setTableItem] = useState('');
  const [partnerLedgerModalStatus, setPartnerLedgerModalStatus] = useState(
    false,
  );
  const [partnerLedgerModalData, setPartnerLedgerModalData] = useState(null);
  const [isDetailsReport, setIsDetailsReport] = useState(false);

  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();

  // useEffect(() => {
  //   getGeneralLedgerDDL(setLoading, setGeneralLedger);
  // }, []);

  useEffect(() => {
    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL,
    );

    if (registerReport?.sbu?.value) {
      getRegisterReportAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        registerReport,
        setRowDto,
        setLoading,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const ths = ['SL', 'Partner', 'Partner Code', 'Debit', 'Credit', 'Action'];
  const thsTwo = [
    'SL',
    'Bank Account Name',
    'Bank Account No',
    'Bank Name',
    'Bank Branch',
    'Openning',
    'Debit',
    'Credit',
    'Action',
  ];

  let totalAmount = 0;

  useEffect(() => {
    getGeneralLedgerDDL(setLoading, setGeneralLedger);
    // if (registerTypeId === 5) {
    //   getGeneralLedgerDDL(setLoading, setGeneralLedger);
    // }
    dispatch(setRegisterReportAction(initData));
  }, []);

  const getThRow = (values) => {
    if (registerTypeId === 7) {
      return [
        'SL',
        'Partner',
        'Partner Code ex',
        'Opening',
        'Debit',
        'Credit',
        'Ledger Balance',
        'Action',
      ];
    } else if (registerTypeId !== 6 && registerTypeId) {
      return ths;
    } else {
      return thsTwo;
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...registerReport }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={title}>
                <CardHeaderToolbar>
                  {rowDto?.length ? (
                    <ReactHtmlTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary m-0 mx-2 py-2 px-2"
                      table="table-to-xlsx"
                      filename="Partner Register Report"
                      sheet="Partner Register Report"
                      buttonText="Export Excel"
                    />
                  ) : null}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-md-3 col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue('sbu', valueOption);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {[5, 7].includes(registerTypeId) && (
                      <div className="col-md-3 col-lg-2">
                        <InputField
                          value={values?.fromDate}
                          label="From date"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('fromDate', e?.target?.value);
                            setRowDto([]);
                            setIsDetailsReport(false);
                          }}
                          resetFieldValue={() => {
                            setFieldValue('fromDate', '');
                          }}
                        />
                      </div>
                    )}
                    {[5, 6, 7].includes(registerTypeId) && (
                      <div className="col-md-3 col-lg-2">
                        <InputField
                          value={values?.toDate}
                          label={
                            [5, 7].includes(registerTypeId)
                              ? 'To Date'
                              : 'Upto Date'
                          }
                          name="toDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('toDate', e?.target?.value);
                            setRowDto([]);
                            setIsDetailsReport(false);
                          }}
                        />
                      </div>
                    )}

                    {registerTypeId === 5 && (
                      <div className="col-md-3 col-lg-2">
                        <NewSelect
                          name="generalLedger"
                          options={generalLedger}
                          value={values?.generalLedger}
                          label="General Ledger"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue('generalLedger', valueOption);

                            (valueOption?.id === 3 || valueOption?.id === 4) &&
                              getProfitCenterDDL(
                                `/fino/CostSheet/ProfitCenterDDL?BUId=${selectedBusinessUnit?.value}`,
                                (data) => {
                                  data.unshift({ value: 0, label: 'All' });
                                  setProfitCenterDDL(data);
                                },
                              );
                            setIsDetailsReport(false);
                          }}
                          placeholder="General Ledger"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    {values?.generalLedger?.id === 3 ||
                    values?.generalLedger?.id === 4 ? (
                      <div className="col-md-3 col-lg-2">
                        <NewSelect
                          name="profitCenter"
                          options={profitCenterDDL}
                          value={values?.profitCenter}
                          label="Profit Center"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue('profitCenter', valueOption);
                            setIsDetailsReport(false);
                          }}
                          placeholder="Profit Center"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : null}

                    <div className="col-md-3 col-lg-2">
                      <div className="d-flex align-items-center flex align-items-end justify-content-between">
                        <ButtonStyleOne
                          label="Summary"
                          onClick={() => {
                            setIsDetailsReport(false);
                            if (!values?.sbu?.value)
                              return toast.warn('Please select SBU');
                            if (
                              registerTypeId === 5 &&
                              !values?.generalLedger?.value
                            ) {
                              return toast.warn('Please select General Ledger');
                            }
                            if (
                              (values?.generalLedger?.id === 3 ||
                                values?.generalLedger?.id === 4) &&
                              !values?.profitCenter
                            ) {
                              return toast.warn('Please select Profit Center');
                            }
                            getRegisterReportAction(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values,
                              setRowDto,
                              setLoading,
                              registerTypeId,
                              partnerTypeId,
                            );
                            dispatch(setRegisterReportAction(values));
                          }}
                          style={{ marginTop: '19px' }}
                        />
                        {registerTypeId === 5 ? (
                          <ButtonStyleOne
                            type="button"
                            label="Details"
                            onClick={() => {
                              if (!values?.generalLedger?.value)
                                return toast.warn(
                                  'Please select a general Ledger',
                                );
                              setRowDto([]);
                              setIsDetailsReport(true);
                            }}
                            style={{ marginTop: '19px' }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {rowDto?.length > 0 && !values?.generalLedger?.value && (
                    <ICustomTable
                      ths={getThRow(values)}
                      className="table-font-size-sm"
                      id="table-to-xlsx"
                    >
                      {rowDto?.map((item, index) => {
                        totalAmount += +item?.numLedgerBalance
                          ? +item?.numLedgerBalance || 0
                          : item?.numBalance || 0;

                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            {registerTypeId === 7 ? (
                              <>
                                <td>{item?.strPartnerName}</td>
                                <td>{item?.strPartnerCode}</td>
                                <td>{_formatMoney(item?.numOppening)}</td>
                                <td>{_formatMoney(item?.numDebit)}</td>
                                <td>{_formatMoney(item?.numCredit)}</td>
                                <td>{_formatMoney(item?.numLedgerBalance)}</td>
                                <td className="text-center">
                                  <InfoCircle
                                    clickHandler={() => {
                                      setTableItem(item);
                                      setIsShowModal(true);
                                    }}
                                    classes="text-primary"
                                  />
                                </td>
                              </>
                            ) : registerTypeId !== 6 && registerTypeId ? (
                              <>
                                <td>{item?.strPartnerName}</td>
                                <td>{item?.strPartnerCode}</td>
                                <td className="text-right">
                                  {item?.numLedgerBalance >= 0
                                    ? _formatMoney(
                                        item?.numLedgerBalance?.toFixed(2),
                                      )
                                    : '-'}
                                </td>
                                <td className="text-right">
                                  {item?.numLedgerBalance < 0
                                    ? _formatMoney(
                                        Math.abs(
                                          item?.numLedgerBalance,
                                        )?.toFixed(2),
                                      )
                                    : '-'}
                                </td>
                                <td className="text-center">
                                  <InfoCircle
                                    clickHandler={() => {
                                      if (
                                        registerTypeId === 1 ||
                                        registerTypeId === 2 ||
                                        registerTypeId === 4
                                      ) {
                                        setPartnerLedgerModalStatus(true);
                                        setPartnerLedgerModalData({
                                          sbu: values?.sbu,
                                          supplierName: {
                                            value: item?.intPartnerId,
                                            label: item?.strPartnerName,
                                          },
                                          isDisabled: false,
                                        });
                                        // history.push({
                                        //   pathname: `/mngProcurement/report/partnerLedger`,
                                        //   state: {
                                        //     sbu: values?.sbu,
                                        //     supplierName: {
                                        //       value: item?.intPartnerId,
                                        //       label: item?.strPartnerName,
                                        //     },
                                        //     isDisabled: true,
                                        //   },
                                        // });
                                      }
                                    }}
                                    classes="text-primary"
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item?.strBankAccountName}</td>
                                <td>&nbsp;{item?.strBankAccountNo}</td>
                                <td>{item?.strBankName}</td>
                                <td>{item?.strBankBranchName}</td>
                                <td className="text-right">
                                  {item?.numBalance >= 0
                                    ? _formatMoney(
                                        item?.numOppening?.toFixed(2),
                                      )
                                    : '-'}
                                </td>
                                <td className="text-right">
                                  {item?.numBalance >= 0
                                    ? _formatMoney(item?.numBalance?.toFixed(2))
                                    : '-'}
                                </td>
                                <td className="text-right">
                                  {item?.numBalance < 0
                                    ? _formatMoney(item?.numBalance?.toFixed(2))
                                    : '-'}
                                </td>
                                <td className="text-center">
                                  <InfoCircle
                                    clickHandler={() => {
                                      setTableItem(item);
                                      setIsShowModal(true);
                                    }}
                                    classes="text-primary"
                                  />
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      {registerTypeId === 7 ? (
                        <tr>
                          {/* remove total row ...order by hussain vai */}
                          {/* <td colSpan="3" className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numOppening,
                                    0,
                                  )
                                  .toFixed(2),
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numDebit,
                                    0,
                                  )
                                  .toFixed(2),
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numCredit,
                                    0,
                                  )
                                  .toFixed(2),
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                          </td>
                          <td></td> */}
                        </tr>
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              registerTypeId !== 6 && registerTypeId ? 3 : 6
                            }
                          >
                            <b>Total</b>
                          </td>

                          {totalAmount < 0 && <td></td>}
                          <td className="text-right">
                            <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                          </td>
                          {/* {totalAmount >= 0 && <td></td>} */}
                          {totalAmount >= 0 && registerTypeId && <td></td>}
                          {registerTypeId !== 7 && <td></td>}
                        </tr>
                      )}
                      {/* <tr>
                        <td
                          colSpan={
                            registerTypeId !== 6 &&
                              registerTypeId
                              ? 3
                              : 5
                          }
                        >
                          <b>Total</b>
                        </td>

                        {totalAmount < 0 && <td></td>}
                        <td className="text-right">
                          <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                        </td>
                        {totalAmount >= 0 && registerTypeId && (
                          <td></td>
                        )}
                        {registerTypeId !== 7 && <td></td>}
                      </tr> */}
                      <tr>
                        <td
                          className="text-center d-none"
                          colSpan={4}
                        >{`System Generated Report - ${moment().format(
                          'LLLL',
                        )}`}</td>
                      </tr>
                    </ICustomTable>
                  )}
                  {rowDto?.length > 0 && values?.generalLedger?.value && (
                    <GeneralLedgerTable
                      rowDto={rowDto}
                      landingValues={values}
                    />
                  )}
                  <IViewModal
                    title=""
                    show={isShowModal}
                    onHide={() => setIsShowModal(false)}
                  >
                    {registerTypeId === 6 && (
                      <RegisterDetailsModal
                        tableItem={tableItem}
                        landingValues={values}
                      />
                    )}
                    {registerTypeId === 7 && (
                      <PartnerModal
                        tableItem={tableItem}
                        landingValues={values}
                        partnerTypeId={partnerTypeId}
                        partnerTypeName={partnerTypeName}
                      />
                    )}
                  </IViewModal>
                  <IViewModal
                    title=""
                    show={partnerLedgerModalStatus}
                    onHide={() => setPartnerLedgerModalStatus(false)}
                  >
                    <PartnerLedger modalData={partnerLedgerModalData} />
                  </IViewModal>
                </Form>
                {isDetailsReport && registerTypeId === 5 ? (
                  <SubScheduleRDLCReport
                    values={values}
                    selectedBusinessUnit={selectedBusinessUnit}
                  />
                ) : null}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
