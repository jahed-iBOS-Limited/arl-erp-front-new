import React, { useState, useRef, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ButtonStyleOne from '../../../_helper/button/ButtonStyleOne';
import Loading from '../../../_helper/_loading';
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../_metronic/_partials/controls';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import ReactToPrint from 'react-to-print';
import { _formatMoney } from '../../../_helper/_formatMoney';
import { Formik, Form } from 'formik';
import { _todayDate } from '../../../_helper/_todayDate';
import InputField from '../../../_helper/_inputField';
// import NewSelect from "../../../_helper/_select";
import IViewModal from '../../../_helper/_viewModal';
import { CashJournalReportView } from '../../financial/accountJournal/report/cashJournalReportView';
import { BankJournalReportView } from '../../financial/accountJournal/report/bankJournalReportView';
import { AdjustmentJournalReportView } from '../../financial/accountJournal/report/adjustmentJournalReportView';

import html2pdf from 'html2pdf.js';
import {
  getPartnerBook,
  partnerGeneralLedgerList,
} from '../../../_helper/_commonApi';

const PartnerModal = ({ tableItem, landingValues }) => {
  const initData = {
    fromDate: landingValues?.fromDate || _todayDate(),
    toDate: landingValues?.toDate || _todayDate(),
  };
  const [rowDto, setRowDto] = useState([]);
  const [, setGlDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickRowData, setClickRowData] = useState('');
  const [modelShow, setModelShow] = useState(false);
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    if (tableItem && landingValues) {
      getPartnerBook(
        selectedBusinessUnit?.value,
        tableItem?.intPartnerId,
        landingValues?.partnerType?.value,
        _todayDate(),
        _todayDate(),
        setLoading,
        setRowDto
      );
    }
  }, [tableItem, landingValues, selectedBusinessUnit]);

  useEffect(() => {
    if (selectedBusinessUnit && landingValues) {
      partnerGeneralLedgerList(
        selectedBusinessUnit?.value,
        landingValues?.partnerType?.value,
        setGlDDL
      );
    }
  }, [selectedBusinessUnit, landingValues]);

  const pdfExport = (fileName) => {
    var element = document.getElementById('pdf-section');
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'px', hotfixes: ['px_scaling'], orientation: 'landscape' },
    };
    html2pdf().set(opt).from(element).save();
  };
  const printRef = useRef();
  const colorLinkStyle = {
    borderBottom: '1px solid blue',
    cursor: 'pointer',
    color: 'blue',
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Register Details">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-2">
                      <InputField
                        label="From Date"
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                          // localStorage.setItem("accountReportRegisterFromDate", e.target.value)
                          // dispatch(SetFinancialManagementReportRegisterAction({
                          //   ...values,
                          //   fromDate:e.target.value
                          // }))
                          setRowDto([]);
                        }}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        label="To Date"
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                          // localStorage.setItem("accountReportRegisterToDate", e.target.value)
                          // dispatch(SetFinancialManagementReportRegisterAction({
                          //   ...values,
                          //   toDate:e.target.value
                          // }))
                          setRowDto([]);
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="gl"
                        options={glDDL || []}
                        value={values?.gl}
                        label="Select GL"
                        onChange={(valueOption) => {
                          setFieldValue("gl", valueOption);
                        }}
                        placeholder="Select GL"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-4">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getPartnerBook(
                            selectedBusinessUnit?.value,
                            tableItem?.intPartnerId,
                            landingValues?.partnerType?.value,
                            values?.fromDate,
                            values?.toDate,
                            setLoading,
                            setRowDto
                          );
                        }}
                        style={{ marginTop: '19px' }}
                      />

                      <button
                        style={{ marginTop: '18px' }}
                        className="btn btn-primary ml-2"
                        type="button"
                        onClick={(e) => pdfExport('Bank Book')}
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
                            className="btn btn-primary ml-2"
                            style={{ marginTop: '18px' }}
                          >
                            <i
                              class="fa fa-print pointer"
                              aria-hidden="true"
                            ></i>
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <div
                      id="pdf-section"
                      componentRef={printRef}
                      ref={printRef}
                    >
                      <div className="text-center">
                        <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
                        <h6
                          style={{
                            borderBottom: '2px solid #ccc',
                            paddingBottom: '10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                          {selectedBusinessUnit?.address}
                        </h6>
                        <h3 className="m-0">
                          {landingValues?.partnerType?.label} Ledger
                        </h3>
                        <p className="m-0">
                          <strong className="mr-5">
                            {tableItem?.strPartnerName}
                          </strong>
                        </p>
                        {/* <div className="row justify-content-center">
                    <strong className="mr-5">From: {values?.fromDate}</strong>
                    <strong>To: {values?.toDate}</strong>
                  </div> */}
                      </div>

                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th style={{ width: '30px' }}> SL </th>
                              <th style={{ width: '60px' }}> Date </th>
                              <th style={{ width: '100px' }}> Code </th>
                              <th style={{ width: '62px' }}> Account Name </th>
                              <th style={{ width: '250px' }}> Description </th>
                              <th style={{ width: '80px' }}> Debit </th>
                              <th style={{ width: '80px' }}> Credit </th>
                              <th style={{ width: '80px' }}> Balance </th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  {_dateFormatter(item?.strBankJournalDate)}
                                </td>
                                <td>
                                  <spn
                                    style={
                                      item.journalTypeId === 0
                                        ? {}
                                        : colorLinkStyle
                                    }
                                    onClick={() => {
                                      if (item.journalTypeId === 0) return;
                                      setClickRowData(item);
                                      setModelShow(true);
                                    }}
                                  >
                                    {item?.strGeneralLedgerCode}
                                  </spn>
                                </td>
                                <td>{item?.strGeneralLedgerName}</td>
                                <td>{item?.strNarration}</td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Math.abs(item?.numDebit)?.toFixed(2)
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Math.abs(item?.numCredit)?.toFixed()
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    Number(item?.numBalance)?.toFixed(2)
                                  )}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="text-right" colSpan="5">
                                Total
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  Math.abs(
                                    rowDto?.reduce(
                                      (a, b) => a + Number(b?.numDebit),
                                      0
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  Math.abs(
                                    rowDto?.reduce(
                                      (a, b) => a + Number(b?.numCredit),
                                      0
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  (
                                    Math.abs(
                                      rowDto?.reduce(
                                        (a, b) => a + Number(b?.numDebit),
                                        0
                                      )
                                    ) -
                                    Math.abs(
                                      rowDto?.reduce(
                                        (a, b) => a + Number(b?.numCredit),
                                        0
                                      )
                                    )
                                  )?.toFixed(2)
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <IViewModal
                    show={modelShow}
                    onHide={() => setModelShow(false)}
                  >
                    {[1, 2, 3, 4, 5, 6].includes(
                      clickRowData?.journalTypeId
                    ) ? (
                      <>
                        {[1, 2, 3].includes(clickRowData?.journalTypeId) && (
                          <CashJournalReportView
                            journalCode={clickRowData?.strAccountingJournalCode}
                            headerData={{
                              accountingJournalTypeId:
                                clickRowData?.journalTypeId,
                            }}
                            clickRowData={clickRowData}
                          />
                        )}
                        {[4, 5, 6].includes(clickRowData?.journalTypeId) && (
                          <BankJournalReportView
                            journalCode={clickRowData?.strAccountingJournalCode}
                            headerData={{
                              accountingJournalTypeId:
                                clickRowData?.journalTypeId,
                            }}
                            clickRowData={clickRowData}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <AdjustmentJournalReportView
                          journalCode={clickRowData?.strAccountingJournalCode}
                          clickRowData={clickRowData}
                        />
                      </>
                    )}
                  </IViewModal>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerModal;
