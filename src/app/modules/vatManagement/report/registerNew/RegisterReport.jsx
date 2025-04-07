import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ButtonStyleOne from '../../../_helper/button/ButtonStyleOne';
import ICustomTable from '../../../_helper/_customTable';
import InfoCircle from '../../../_helper/_helperIcons/_infoCircle';
import Loading from '../../../_helper/_loading';
import IViewModal from '../../../_helper/_viewModal';
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from './../../../../../_metronic/_partials/controls';
import NewSelect from './../../../_helper/_select';
import {
  getGeneralLedgerDDL,
  getRegisterReportAction,
  getSbuDDLAction,
} from './helper';
import RegisterDetailsModal from './RegisterDetailsModal';
import { _formatMoney } from './../../../_helper/_formatMoney';
import GeneralLedgerTable from './GeneralLedgerTable';
import InputField from '../../../_helper/_inputField';
import { _todayDate } from '../../../_helper/_todayDate';
import { _firstDateofMonth } from '../../../_helper/_firstDateOfCurrentMonth';
// import { useHistory } from "react-router-dom";
import { setRegisterReportAction } from '../../../_helper/reduxForLocalStorage/Actions';
import { PartnerLedger } from '../../../procurement/reports/partnerLedger';
import PartnerModal from './partnerModal';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

// {businessPartnerTypeId: 1, businessPartnerTypeName: "Supplier"}
// {businessPartnerTypeId: 2, businessPartnerTypeName: "Customer"}
// {businessPartnerTypeId: 4, businessPartnerTypeName: "Investment Partner"}
// { value: 3, label: "Employee" }

// { value: 5, label: "Sub Schedule" },
// { value: 6, label: "Cash at Bank" },
//     { value: 7, label: "Partner" },

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: '',
  generalLedger: '',
};
export function RegisterReport({
  registerTypeId,
  partnerTypeId,
  partnerTypeName,
  title,
}) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const { registerReport } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );
  // const history = useHistory();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalLedger, setGeneralLedger] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tableItem, setTableItem] = useState('');
  const [partnerLedgerModalStatus, setPartnerLedgerModalStatus] =
    useState(false);
  const [partnerLedgerModalData, setPartnerLedgerModalData] = useState(null);

  useEffect(() => {
    getGeneralLedgerDDL(setLoading, setGeneralLedger);
  }, []);

  useEffect(() => {
    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );

    if (registerReport?.sbu?.value) {
      getRegisterReportAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        registerReport,
        setRowDto,
        setLoading
      );
    }
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
    if (registerTypeId === 5) {
      getGeneralLedgerDDL(setLoading, setGeneralLedger);
    }
    dispatch(setRegisterReportAction(initData));
  }, []);

  const getThRow = (values) => {
    if (registerTypeId === 7) {
      return [
        'SL',
        'Partner',
        'Partner Code',
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
                  {rowDto?.length > 0 && registerTypeId === 7 && (
                    <ReactHtmlTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary m-0 mx-2 py-2 px-2"
                      table="table-to-xlsx"
                      filename="Partner Register Report"
                      sheet="Partner Register Report"
                      buttonText="Export Excel"
                    />
                  )}
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
                          }}
                          placeholder="General Ledger"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          if (!values?.sbu?.value)
                            return toast.warn('Please select SBU');
                          if (
                            registerTypeId === 5 &&
                            !values?.generalLedger?.value
                          ) {
                            return toast.warn('Please select General Ledger');
                          }
                          getRegisterReportAction(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values,
                            setRowDto,
                            setLoading,
                            registerTypeId,
                            partnerTypeId
                          );
                          dispatch(setRegisterReportAction(values));
                        }}
                        style={{ marginTop: '19px' }}
                      />
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
                                        item?.numLedgerBalance?.toFixed(2)
                                      )
                                    : '-'}
                                </td>
                                <td className="text-right">
                                  {item?.numLedgerBalance < 0
                                    ? _formatMoney(
                                        Math.abs(
                                          item?.numLedgerBalance
                                        )?.toFixed(2)
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
                                <td>{item?.strBankAccountNo}</td>
                                <td>{item?.strBankName}</td>
                                <td>{item?.strBankBranchName}</td>
                                <td className="text-right">
                                  {item?.numBalance >= 0
                                    ? _formatMoney(
                                        item?.numOppening?.toFixed(2)
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
                          <td colSpan="3" className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numOppening,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numDebit,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numCredit,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                          </td>
                          <td></td>
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
