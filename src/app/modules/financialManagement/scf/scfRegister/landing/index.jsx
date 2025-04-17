import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IClose from '../../../../_helper/_helperIcons/_close';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import InfoCircle from '../../../../_helper/_helperIcons/_infoCircle';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { generateJsonToExcel } from '../../../../_helper/excel/jsonToExcel';
import ICon from '../../../../chartering/_chartinghelper/icons/_icon';
import {
  createLoanRegister,
  getAttachments,
  getLoanRegisterLanding,
} from '../helper';
import AttachmentUploadForm from '../others/attachmentUpload';
import PdfRenderGenertor from '../others/PdfRender';

const initData = {
  bank: { label: 'ALL', value: 0 },
  status: { value: 2, label: 'Incomplete' },
  loanType: '',
  loanClass: '',
  businessUnit: { value: 0, label: 'All' },
  applicationType: { label: 'ALL', value: 0 },
  dateFilter: '',
  fromDate: '',
  toDate: '',
};

const SCFRegisterLandingPage = () => {
  // hooks
  const history = useHistory();
  const printRef = useRef();
  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  // api action
  const [bankDDL, getBankDDL, getBankDDLLoading] = useAxiosGet();
  const [businessUnitDDL, getBusinessUnitDDL, getBusinessUnitDDLLoading] =
    useAxiosGet();
  const [scfInfoData, getSCFInfoData, getSCFInfoDataLoading] = useAxiosGet();
  const [, postCloseLoanRegister, closeLoanRegisterLoader] = useAxiosPost();

  // state
  const [loading, setLoading] = useState(false);
  const [loanRegisterData, setLoanRegisterData] = useState([]);
  // state modal
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showScfInfoModal, setShowSCFInfoModal] = useState(false);
  const [showSCFPrintModal, setShowSCFPrintModal] = useState(false);

  // others
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(200);
  const [fdrNo, setFdrNo] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [, setIsPrinting] = useState(false);

  // sorting state for each column
  const [openDateOrder, setOpenDateOrder] = useState('asc'); // 'asc' or 'desc'
  const [maturityDateOrder, setMaturityDateOrder] = useState('asc'); // 'asc' or 'desc'
  // State to hold the sorted data
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (loanRegisterData?.data) {
      setSortedData(loanRegisterData?.data);
    }
  }, [loanRegisterData]);

  useEffect(() => {
    getBankDDL(`/hcm/HCMDDL/GetBankDDL`);
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    );
  }, []);

  useEffect(() => {
    if (singleItem?.intBankLetterTemplateId === 1) {
      setShowSCFPrintModal(true);
    } else if (singleItem?.intBankLetterTemplateId) {
      handleInvoicePrint();
      setShowSCFPrintModal(false);
    }
  }, [singleItem]);

  useEffect(() => {
    getLoanRegisterLanding(
      profileData?.accountId,
      buId === 136 ? 0 : buId,
      0,
      2,
      pageNo,
      pageSize,
      setLoanRegisterData,
      setLoading,
      0
    );
  }, []);

  // function
  // handle sort
  const handleSort = (column) => {
    const dataToSort = [...sortedData];
    let order, dateField;

    // Set sorting parameters based on the column
    if (column === 'openDate') {
      order = openDateOrder;
      dateField = 'dteStartDate';
      setOpenDateOrder(order === 'asc' ? 'desc' : 'asc');
    } else if (column === 'maturityDate') {
      order = maturityDateOrder;
      dateField = 'dteMaturityDate';
      setMaturityDateOrder(order === 'asc' ? 'desc' : 'asc');
    }

    // Sort the data
    dataToSort.sort((a, b) => {
      const dateA = new Date(a[dateField]);
      const dateB = new Date(b[dateField]);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedData(dataToSort);
  };

  // save
  const saveHandler = async (values, cb) => {
    // setLoading(true);
  };

  //set position handler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLoanRegisterLanding(
      profileData?.accountId,
      values?.businessUnit?.value >= 0 ? values?.businessUnit?.value : buId,
      values?.bank?.value,
      values?.status?.value,
      pageNo,
      pageSize,
      setLoanRegisterData,
      setLoading,
      values?.applicationType?.value || 0
    );
  };

  // invoice print
  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      '@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}',
    onAfterPrint: () => {
      setIsPrinting(false);
      setLoading(false);
    },
  });

  // handle print
  const handlePrintClick = ({ item }) => {
    setSingleItem(item);
  };

  const confirm = (item, values) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: 'You want to confirm this loan?',
      yesAlertFunc: async () => {
        const cb = () => {
          getLoanRegisterLanding(
            profileData?.accountId,
            item?.intBusinessUnitId,
            values?.bank?.value,
            values?.status?.value,
            pageNo,
            pageSize,
            setLoanRegisterData,
            setLoading,
            values?.applicationType?.value || 0
          );
        };
        createLoanRegister(
          profileData?.accountId,
          item?.intBusinessUnitId,
          item?.strLoanAccountName,
          item?.intBankId,
          item?.intBankAccountId,
          item?.intLoanFacilityId,
          item?.dteStartDate || 0,
          item?.intTenureDays || 0,
          item?.numPrinciple || 0,
          item?.numInterestRate || 0,
          item?.disbursementPurposeId || 0,
          item?.disbursementPurposeId || '',
          profileData?.userId,
          setLoading,
          cb,
          true,
          item?.intLoanAccountId
        );
      },
      noAlertFunc: () => {
        '';
      },
    };
    IConfirmModal(confirmObject);
  };

  // generate excel
  const generateExcel = (values) => {
    const header = [
      {
        text: 'SL',
        textFormat: 'number',
        alignment: 'center:middle',
        key: 'sl',
        width: 50,
      },
      {
        text: 'Status',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'status',
        width: 120,
      },
      {
        text: 'SBU',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'sbuName',
        width: 250,
      },
      {
        text: 'Bank',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strBankName',
        width: 250,
      },
      {
        text: 'Facility',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'facilityName',
        width: 180,
      },
      {
        text: 'Loan A/c no.',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'strLoanAccountName',
        width: 180,
      },
      {
        text: 'Tenor',
        textFormat: 'number',
        alignment: 'center:middle',
        key: 'intTenureDays',
        width: 100,
      },
      {
        text: 'Open Date',
        textFormat: 'date',
        alignment: 'center:middle',
        key: 'dteStartDate',
        width: 150,
      },
      {
        text: 'Maturity Date',
        textFormat: 'date',
        alignment: 'center:middle',
        key: 'dteMaturityDate',
        width: 150,
      },
      {
        text: 'Principal Balance',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'principalBalance',
        width: 180,
      },
      {
        text: 'Disbursed Amount',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'numPrinciple',
        width: 180,
      },
      {
        text: 'Int. Rate (p.a.)',
        textFormat: 'percentage',
        alignment: 'center:middle',
        key: 'numInterestRate',
        width: 140,
      },
      {
        text: 'Disbursement Purpose',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'disbursementPurposeName',
        width: 200,
      },
      {
        text: 'Remarks',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'loanRemarks',
        width: 250,
      },
      {
        text: 'Profit Center',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'profitCenter',
        width: 120,
      },
      {
        text: 'Interest Amount',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'numInterest',
        width: 150,
      },
      {
        text: 'Total Payable',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'numTotalPayable',
        width: 150,
      },
      {
        text: 'Paid Principal',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'numPaid',
        width: 150,
      },
      {
        text: 'Paid Interest',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'interestAmount',
        width: 150,
      },
      {
        text: 'Paid Excise Duty',
        textFormat: 'money',
        alignment: 'center:middle',
        key: 'numExciseDuty',
        width: 150,
      },
      {
        text: 'Loan Class',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'loanClassName',
        width: 120,
      },
      {
        text: 'Loan Type',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'loanTypeName',
        width: 120,
      },
      {
        text: 'BR Number',
        textFormat: 'text',
        alignment: 'center:middle',
        key: 'brCode',
        width: 200,
      },
    ];
    getLoanRegisterLanding(
      profileData?.accountId,
      buId === 136
        ? values?.businessUnit?.value >= 0
          ? values?.businessUnit?.value
          : buId
        : buId,
      values?.bank?.value,
      values?.status?.value,
      pageNo,
      100000, //pageSize
      (data) => {
        let excelData = data?.data;
        const _data = excelData?.map((item, index) => ({
          sl: index + 1,
          status: item?.isLoanApproved ? 'Approved' : 'Pending',
          sbuName: item?.sbuName || '',
          strBankName: item?.strBankName || '',
          facilityName: item?.facilityName || '',
          strLoanAccountName: item?.strLoanAccountName || '',
          intTenureDays: item?.intTenureDays || 0,
          dteStartDate: _dateFormatter(item?.dteStartDate) || '',
          dteMaturityDate: _dateFormatter(item?.dteMaturityDate) || '',
          principalBalance:
            item?.numPrinciple - item?.numPaid >= 0
              ? item?.numPrinciple - item?.numPaid
              : 0,
          numPrinciple: item?.numPrinciple || 0,
          numInterestRate: item?.numInterestRate || 0,
          disbursementPurposeName: item?.disbursementPurposeName || '',
          loanRemarks: item?.loanRemarks || '',
          profitCenter: '', // Adjust if applicable
          numInterest: item?.numInterest || 0,
          numTotalPayable: item?.numTotalPayable || 0,
          numPaid: item?.numPaid || 0,
          interestAmount: item?.interestAmount || 0,
          numExciseDuty: item?.numExciseDuty || 0,
          loanClassName: item?.loanClassName || '',
          loanTypeName: item?.loanTypeName || '',
          brCode: item?.brCode || '',
        }));
        generateJsonToExcel(header, _data, 'Loan Register');
      },
      setLoading,
      values?.applicationType?.value || 0,
      values?.fromDate,
      values?.toDate,
      values?.dateFilter?.value
    );
  };

  // calculation
  const totalPrincipleAmount = useMemo(
    () =>
      loanRegisterData?.data?.reduce(
        (a, c) =>
          a +
          (c?.numPrinciple - c?.numPaid >= 0
            ? c?.numPrinciple - c?.numPaid
            : 0),
        0
      ),
    [loanRegisterData]
  );
  const totalDisbursedAmount = useMemo(
    () =>
      loanRegisterData?.data?.reduce(
        (a, c) => a + (c?.numPrinciple < 0 ? 0 : c?.numPrinciple),
        0
      ),
    [loanRegisterData]
  );
  const totalInterestAmount = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numInterest, 0),
    [loanRegisterData]
  );
  const totalPayable = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numTotalPayable, 0),
    [loanRegisterData]
  );
  const totalPaidPrincipal = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numPaid, 0),
    [loanRegisterData]
  );
  const totalPaidInterest = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.interestAmount, 0),
    [loanRegisterData]
  );

  // is loan register not empty
  const isLoanRegisterNotEmpty = loanRegisterData?.data?.length > 0;

  // is loading
  const isLoading =
    getBankDDLLoading || getBusinessUnitDDLLoading || getSCFInfoDataLoading;

  return (
    <>
      {(loading || closeLoanRegisterLoader || isLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {});
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'SCF Register'}>
                <CardHeaderToolbar>
                  {isLoanRegisterNotEmpty ? (
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => generateExcel(values)}
                      style={{ padding: '6px 5px' }}
                      disabled={!isLoanRegisterNotEmpty}
                    >
                      Export Excel
                    </button>
                  ) : (
                    <></>
                  )}
                  <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/scf/scfregister/create`,
                        state: values,
                      });
                    }}
                  >
                    Create SCF Register
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
                    {buId === 136 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessUnit"
                          options={
                            [{ value: 0, label: 'All' }, ...businessUnitDDL] ||
                            []
                          }
                          value={values?.businessUnit}
                          label="Business Unit"
                          onChange={(valueOption) => {
                            setFieldValue('businessUnit', valueOption);
                            setLoanRegisterData([]);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankDDL}
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setFieldValue('bank', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Bank"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: 0, label: 'All' },
                          { value: 1, label: 'Complete' },
                          { value: 2, label: 'Incomplete' },
                        ]}
                        value={values?.status}
                        onChange={(valueOption) => {
                          setFieldValue('status', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Status"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="applicationType"
                        options={[
                          { value: 0, label: 'All' },
                          { value: 1, label: 'Pending' },
                          { value: 2, label: 'Approved' },
                        ]}
                        value={values?.applicationType}
                        onChange={(valueOption) => {
                          setFieldValue('applicationType', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Application Type"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="dateFilter"
                        options={[
                          { value: 'Opening Date', label: 'Opening Date' },
                          { value: 'Maturity Date', label: 'Maturity Date' },
                        ]}
                        value={values?.dateFilter}
                        onChange={(valueOption) => {
                          setFieldValue('dateFilter', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Date Filter"
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        label="From Date"
                        placeholder="From date"
                        type="date"
                        disabled={!values?.dateFilter?.value}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        label="To Date"
                        disabled={!values?.dateFilter?.value}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="col-lg-1">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={(e) => {
                          getLoanRegisterLanding(
                            profileData?.accountId,
                            buId === 136
                              ? values?.businessUnit?.value >= 0
                                ? values?.businessUnit?.value
                                : buId
                              : buId,
                            values?.bank?.value,
                            values?.status?.value,
                            pageNo,
                            pageSize,
                            setLoanRegisterData,
                            setLoading,
                            values?.applicationType?.value || 0,
                            values?.fromDate,
                            values?.toDate,
                            values?.dateFilter?.value
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {buId === 136 && (
                      <div className="col-lg-1">
                        <button
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={(e) => {
                            history.push(
                              '/financial-management/scf/scfregister/autojournalllog'
                            );
                          }}
                        >
                          Log
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-12 common-scrollable-table four-column-sticky">
                      <div
                        className="scroll-table _table overflow-auto"
                        style={{ height: '700px' }}
                      >
                        <table
                          id="table-to-xlsx"
                          className="table table-striped table-bordered global-table table-header-sticky"
                        >
                          <thead className="bg-secondary">
                            <tr>
                              <th>SL</th>
                              <th style={{ minWidth: '100px' }}>Status</th>
                              {[136].includes(buId) && <th>SBU</th>}
                              <th>Bank</th>
                              <th style={{ minWidth: '100px' }}>Facility</th>
                              <th style={{ minWidth: '120px' }}>
                                Loan A/c no.
                              </th>
                              <th style={{ minWidth: '50px' }}>Tenor</th>
                              <th
                                style={{ minWidth: '90px', cursor: 'pointer' }}
                                onClick={() => handleSort('openDate')}
                              >
                                Open Date {openDateOrder === 'asc' ? '▲' : '▼'}
                              </th>
                              <th
                                style={{ minWidth: '90px', cursor: 'pointer' }}
                                onClick={() => handleSort('maturityDate')}
                              >
                                Maturity Date{' '}
                                {maturityDateOrder === 'asc' ? '▲' : '▼'}
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Principal Balance
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Disbursed Amount
                              </th>
                              <th style={{ minWidth: '50px' }}>
                                Int.Rate (p.a.)
                              </th>
                              <th style={{ minWidth: '120px' }}>
                                Disbursement Purpose
                              </th>
                              <th style={{ minWidth: '120px' }}>Remarks</th>
                              <th style={{ minWidth: '50px' }}>
                                Profit Center
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Interest Amount
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Total Payable
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Paid Principal
                              </th>
                              <th style={{ minWidth: '100px' }}>
                                Paid Interest
                              </th>
                              <th style={{ minWidth: '50px' }}>
                                Paid Excise Duty
                              </th>
                              <th style={{ minWidth: '70px' }}>Loan Class</th>
                              <th style={{ minWidth: '70px' }}>Loan Type</th>
                              <th>Disbursement Voucher No</th>

                              <th style={{ minWidth: '200px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.isLoanApproved
                                    ? 'Approved'
                                    : 'Pending'}
                                </td>
                                {[136].includes(buId) && (
                                  <td className="text-">{item?.sbuName}</td>
                                )}
                                <td className="text-">{item?.strBankName}</td>
                                <td className="text-">
                                  {item?.facilityName}{' '}
                                  <span className="facility-icon">
                                    <InfoCircle
                                      clickHandler={() => {
                                        getSCFInfoData(
                                          `/fino/FundManagement/GetLoanRegisterHistory?loanAccountId=${item?.intLoanAccountId}&journalCode=${item?.brCode}`
                                        );
                                        setShowSCFInfoModal(true);
                                      }}
                                      classes="text-primary"
                                    />
                                  </span>
                                </td>
                                <td className="text-">
                                  {item?.strLoanAccountName}
                                </td>
                                <td className="text-">{item?.intTenureDays}</td>
                                <td className="text-">
                                  {_dateFormatter(item?.dteStartDate)}
                                </td>
                                <td className="text-">
                                  {_dateFormatter(item?.dteMaturityDate)}
                                </td>
                                <td className="text-right">
                                  {item?.numPrinciple - item?.numPaid >= 0
                                    ? _formatMoney(
                                        item?.numPrinciple - item?.numPaid
                                      )
                                    : 0}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    item?.numPrinciple < 0
                                      ? 0
                                      : item?.numPrinciple
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numInterestRate)}%
                                </td>
                                <td className="text-">
                                  {item?.disbursementPurposeName}
                                </td>
                                <td className="text-">{item?.loanRemarks}</td>
                                <td className="text-"></td>
                                <td className="text-right">
                                  {_formatMoney(item?.numInterest)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numTotalPayable)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numPaid)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.interestAmount)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numExciseDuty)}
                                </td>

                                <td className="text-">{item?.loanClassName}</td>
                                <td className="text-">{item?.loanTypeName}</td>
                                <td className="text-">{item?.brCode}</td>

                                <td className="text-center">
                                  <div className="d-flex justify-content-around">
                                    <span>
                                      <ICon
                                        title="Attach or View your documents"
                                        onClick={() => {
                                          setFdrNo(item?.strLoanAccountName);
                                          getAttachments(
                                            item?.intBusinessUnitId,
                                            2,
                                            item?.strLoanAccountName,
                                            setAttachments,
                                            setLoading,
                                            () => {
                                              setShowAttachmentModal(true);
                                            }
                                          );
                                        }}
                                      >
                                        <i class="fas fa-paperclip"></i>
                                      </ICon>
                                    </span>
                                    <span
                                      className="text-primary "
                                      style={{
                                        marginLeft: '4px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => {
                                        if (
                                          item?.numPrinciple - item?.numPaid <=
                                          0
                                        ) {
                                          toast.warn('You have already repaid');
                                          return;
                                        } else {
                                          history.push({
                                            pathname: `/financial-management/scf/scfregister/repay/${item?.intLoanAccountId}`,
                                            state: {
                                              bankId: item?.intBankId,
                                              principal:
                                                item?.numPrinciple -
                                                item?.numPaid,
                                              bu: values?.businessUnit?.value,
                                              strLoanAccountName:
                                                item?.strLoanAccountName,
                                            },
                                          });
                                        }
                                      }}
                                    >
                                      Repay
                                    </span>
                                    <span
                                      className="text-primary "
                                      style={{
                                        marginLeft: '4px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => {
                                        if (
                                          item?.numPrinciple - item?.numPaid <
                                          1
                                        ) {
                                          toast.warn(
                                            "You can't renew this loan"
                                          );
                                          return;
                                        } else {
                                          history.push({
                                            pathname: `/financial-management/scf/scfregister/renew/${item?.intLoanAccountId}`,
                                            state: item,
                                          });
                                        }
                                      }}
                                    >
                                      Renew
                                    </span>
                                    {!item?.isLoanApproved ? (
                                      <span
                                        className="text-primary "
                                        style={{
                                          marginLeft: '4px',
                                          marginRight: '4px',
                                          cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                          if (
                                            item?.numPrinciple === 0 &&
                                            item?.intTenureDays > 0
                                          ) {
                                            toast.warn(
                                              'Principal should be greater than 0'
                                            );
                                            return;
                                          } else if (
                                            item?.numPrinciple > 0 &&
                                            item?.intTenureDays === 0
                                          ) {
                                            toast.warn(
                                              'Tenure Days should be greater than 0'
                                            );
                                            return;
                                          } else if (
                                            item?.numPrinciple === 0 &&
                                            item?.intTenureDays === 0
                                          ) {
                                            toast.warn(
                                              'Principal & Tenure Days should be greater than 0'
                                            );
                                            return;
                                          } else {
                                            confirm(item, values);
                                          }
                                        }}
                                      >
                                        Confirm
                                      </span>
                                    ) : null}

                                    <span style={{ marginRight: '4px' }}>
                                      <ICon
                                        title={'Print'}
                                        onClick={() => {
                                          setShowSCFPrintModal(true);
                                          handlePrintClick({ item });
                                        }}
                                      >
                                        <i class="fas fa-print"></i>
                                      </ICon>
                                    </span>

                                    <span
                                      onClick={() =>
                                        history.push({
                                          pathname: `/financial-management/scf/scfregister/edit/${item?.intLoanAccountId}`,
                                          state: item,
                                        })
                                      }
                                    >
                                      <IEdit />
                                    </span>

                                    {/* for close */}
                                    {item?.numPaid === 0 ? (
                                      <span
                                        className="text-primary "
                                        style={{
                                          marginLeft: '4px',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <IClose
                                          closer={() => {
                                            postCloseLoanRegister(
                                              `/fino/FundManagement/CancelLoanRegister?businessUnitId=${item?.intBusinessUnitId}&loanAccountId=${item?.intLoanAccountId}&actionBy=${profileData?.userId}`,
                                              null,
                                              () => {
                                                getLoanRegisterLanding(
                                                  profileData?.accountId,
                                                  values?.businessUnit?.value >=
                                                    0
                                                    ? values?.businessUnit
                                                        ?.value
                                                    : buId,
                                                  values?.bank?.value,
                                                  values?.status?.value,
                                                  pageNo,
                                                  pageSize,
                                                  setLoanRegisterData,
                                                  setLoading,
                                                  values?.applicationType
                                                    ?.value || 0
                                                );
                                              }
                                            );
                                          }}
                                          title="Cancel Loan Register"
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}

                            <tr>
                              <td></td>
                              <td className="text-center">Total</td>
                              {[136].includes(buId) && <td></td>}
                              <td colSpan={6}></td>

                              <td className="text-right">
                                <b> {_formatMoney(totalPrincipleAmount)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalDisbursedAmount)}</b>
                              </td>
                              <td colSpan={4}></td>

                              <td className="text-right">
                                <b> {_formatMoney(totalInterestAmount)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPayable)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPaidPrincipal)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPaidInterest)}</b>
                              </td>
                              <td colSpan={5}></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Form>

                {loanRegisterData?.data?.length > 0 && (
                  <PaginationTable
                    count={loanRegisterData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </CardBody>
            </Card>

            <IViewModal
              show={showAttachmentModal}
              onHide={() => setShowAttachmentModal(false)}
            >
              <AttachmentUploadForm
                typeId={2}
                setShow={setShowAttachmentModal}
                fdrNo={fdrNo}
                attachments={attachments}
              />
            </IViewModal>

            {showScfInfoModal && !getSCFInfoDataLoading && (
              <IViewModal
                show={showScfInfoModal}
                onHide={() => setShowSCFInfoModal(false)}
              >
                <div
                  style={{
                    textAlign: 'center',
                    margin: '20px 0',
                  }}
                >
                  <h3>Created By: {scfInfoData?.createdBy}</h3>
                  <h4>
                    Confirmation Date:{' '}
                    {scfInfoData?.confirmedAt
                      ? moment(scfInfoData?.confirmedAt)?.format('ll')
                      : ''}
                  </h4>
                  {scfInfoData?.history?.length > 0 && (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Loan Account ID</th>
                          <th>Transaction Date</th>
                          <th>Amount</th>
                          <th>Narration</th>
                          <th>Journal Code</th>
                          <th>Created By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scfInfoData?.history?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.loanAccountId}</td>
                            <td>
                              {new Date(
                                item?.transactionDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{item?.amount}</td>
                            <td>{item?.narration}</td>
                            <td>{item?.journalCode}</td>
                            <td>{item?.createdBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </IViewModal>
            )}
          </div>
        )}
      </Formik>

      <IViewModal
        title={'Print Template'}
        loanInfoModal={showSCFPrintModal}
        onHide={() => {
          setShowSCFPrintModal(false);
        }}
      >
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              margin: '20px;',
            }}
          >
            <button
              style={{ cursor: 'pointer' }}
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleInvoicePrint();
                setShowSCFPrintModal(false);
              }}
            >
              Print
            </button>
          </div>

          <div>
            <div style={{ margin: '-13px 0 51px 0' }}>
              {/* {singleItem && ( */}
              <PdfRenderGenertor printRef={printRef} singleItem={singleItem} />
              {/* )} */}
            </div>
          </div>
        </>
      </IViewModal>
    </>
  );
};

export default SCFRegisterLandingPage;
