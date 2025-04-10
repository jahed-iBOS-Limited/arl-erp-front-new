import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Form, Formik } from 'formik';
import { DropzoneDialogBase } from 'react-mui-dropzone';
import React, { useEffect, useMemo, useState } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { _monthFirstDate } from '../../../../_helper/_monthFirstDate';
import { _todayDate } from '../../../../_helper/_todayDate';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { SetFinancialsInventoryJournalAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import {
  getDepreciationGenLedgerList,
  getDepreciationJournal,
  getInventoryJournal,
  getInventoryJournalGenLedger,
  getOrCreateSalaryJournal,
  getReconcilationJournelData,
  getSbuDDL,
  getType,
  getYearClosing,
  postDepreciationJournal,
  postInventoryJournal,
  saveYearClosing,
} from '../helper';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from './../../../../../../_metronic/_partials/controls';
import NewSelect from './../../../../_helper/_select';
import CreateBaddebt from './baddebtInterest/createBaddebt';
import ViewBaddebt from './baddebtInterest/viewBaddebt';
import COGSTable from './cogsTable';
import DepreciationTable from './depreciationTable';
import CreateSalaryJournalTable from './salaryJournal/createJournal';
import ViewSalaryJournalTable from './salaryJournal/viewJournal';
import YearClosingTable from './yearClosingTable';

// Validation schema
const validationSchema = Yup.object().shape({});

function getMonthFirstLastDate(fromDate) {
  const date = new Date(fromDate);
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    firstDate: _dateFormatter(firstDate),
    lastDate: _dateFormatter(lastDate),
  };
}

const ReconciliationJournal = () => {
  const { financialsInventoryJournal } = useSelector(
    (state) => state?.localStorage
  );

  // get user profile data from store
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId },
  } = useSelector((state) => state.authData, shallowEqual);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [
    baddebtRowData,
    getBaddebtRowData,
    isGetBaddebtRowDataLoading,
    setBaddebtRowData,
  ] = useAxiosGet();

  const [
    incentiveProvisionData,
    getIncentiveProvisionData,
    getIncentiveProvisionDataLoading,
    setIncentiveProvisionData,
  ] = useAxiosGet();

  const [
    ,
    createIncentiveProvisionJounral,
    createIncentiveProvisionJounralLoading,
  ] = useAxiosPost();

  const handleGetBaddebtRowData = (values) => {
    const [year, month] = values?.monthYear?.split('-')?.map(Number) || [];
    let startDate;
    let endDate;
    let formattedStartDate;
    let formattedEndDate;
    if (year && month) {
      startDate = new Date(Date.UTC(year, month - 1, 1));
      endDate = new Date(Date.UTC(year, month, 0));
      formattedStartDate = startDate.toISOString().split('T')[0];
      formattedEndDate = endDate.toISOString().split('T')[0];
    }

    const api = ['Create']?.includes(values?.tableMode?.label)
      ? `/fino/Expense/GetMonthlyBaddebtAmount?businessUnitId=${buId}&dteFromDate=${formattedStartDate}&dteToDate=${formattedEndDate}`
      : ['View']?.includes(values?.tableMode?.label)
        ? `/fino/Expense/getBaddebitJournal?businessUnitId=${buId}`
        : '';

    getBaddebtRowData(api);
  };

  const dispatch = useDispatch();

  const getLastDateOfJuneOfCurrentYear = () => {
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), 6, 0);
    return _dateFormatter(lastDay);
  };

  const initData = {
    transactionDate:
      financialsInventoryJournal?.transactionDate || _todayDate(),
    fromDate: financialsInventoryJournal?.fromDate || _monthFirstDate(),
    toDate: financialsInventoryJournal?.toDate || _todayDate(),
    sbu: financialsInventoryJournal?.sbu || '',
    type: financialsInventoryJournal?.type || '',
    closingType: financialsInventoryJournal?.closingType || '',
    closingDate: getLastDateOfJuneOfCurrentYear(),
  };

  // ref

  const [open, setOpen] = useState(false);

  // states
  const [expanded, setExpanded] = useState(false);
  const [fileObject, setFileObject] = useState('');
  const [sbuDDL, setSbuDDL] = useState([]);
  const [typeDDL] = useState(getType(selectedBusinessUnit));

  const [loading, setLoading] = useState(false);
  //storingData
  const [jounalLedgerData, setJounalLedgerData] = useState([]);
  const [journalData, setJournalData] = useState([]);
  const [closingData, setClosingData] = useState([]);
  const [isDayBased, setIsDayBased] = useState(0);
  const [salaryJournal, setSalaryJournal] = useState([]);
  const [jvSalaryJournal, setJVSalaryJournal] = useState([]);

  // api action
  const [
    incomeTaxProvisionViewCreateData,
    incomeTaxProvisionViewCreate,
    incomeTaxProvisionViewCreateLoading,
    setIncomeTaxProvisionViewCreateData,
  ] = useAxiosPost();

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const setDataToRow = (values) => {
    if (values?.type?.value === 1) {
      getInventoryJournalGenLedger(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.fromDate,
        values?.toDate,
        setJounalLedgerData,
        setLoading
      );
    } else if (values?.type?.value === 2) {
      getDepreciationGenLedgerList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.transactionDate,
        setJounalLedgerData,
        setLoading
      );
      getDepreciationJournal(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.transactionDate,
        setJournalData,
        setLoading
      );
    } else if (values?.type?.value === 4) {
      // type 1 for view data
      getYearClosing(
        profileData?.userId,
        selectedBusinessUnit?.value,
        1,
        values?.closingDate,
        setClosingData,
        setLoading
      );
    } else if (values?.type?.value === 5) {
      handleGetBaddebtRowData(values);
    } else if (values?.type?.value === 6) {
      getOrCreateSalaryJournal({
        buId,
        accountId,
        values,
        setterFunction: setSalaryJournal,
        setLoading,
        type: 'get',
        setExpanded,
      });
      setJVSalaryJournal([]);
    } else if (values?.type?.value === 7) {
      const [year, month] = values?.monthYear?.split('-')?.map(Number) || [];

      getIncentiveProvisionData(
        `/fino/Report/GetIncentiveProvisionLanding?businessUnitId=${selectedBusinessUnit?.value}&monthId=${month}&yearId=${year}`
      );
    } else if (values?.type?.value === 3) {
      const [year, month] = values?.taxMonth?.split('-')?.map(Number) || [];
      let customDate;
      let formattedDate;
      if (year && month) {
        customDate = new Date(Date.UTC(year, month, 1));
        formattedDate = customDate.toISOString().split('T')[0];
      }

      // console.log(formattedDate);

      incomeTaxProvisionViewCreate(
        `/fino/AdjustmentJournal/IncomeTaxProvisionJV`,
        {
          partName: 'view',
          businessUnitId: selectedBusinessUnit?.value,
          date: formattedDate,
          actionBy: profileData?.userId,
        }
      );
    }
  };

  // console.log(incomeTaxProvisionViewCreateData);

  // handle collapse panel change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const detailsData = (values, isBaseTypeId) => {
    if (values?.type?.value === 1 && values?.transactionType?.value === 1) {
      getInventoryJournal(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.fromDate,
        values?.toDate,
        setJournalData,
        setLoading
      );
    }
    if (values?.type?.value === 1 && values?.transactionType?.value !== 1) {
      getReconcilationJournelData(
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.transactionType?.value,
        isBaseTypeId,
        setJournalData,
        setLoading
      );
    }
  };

  const saveHandler = async (values, cb) => {
    // setLoading(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (values?.type?.value === 1) {
        postInventoryJournal(
          values?.closingType?.value,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.sbu?.value,
          values?.fromDate,
          values?.toDate,
          profileData?.userId,
          setLoading,
          cb
        );
      } else if (values?.type?.value === 2) {
        postDepreciationJournal(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.sbu?.value,
          values?.transactionDate,
          profileData?.userId,
          setLoading,
          cb
        );
      }
      // else if (values?.type?.value === 4) {
      //   postClosingYearJournal(
      //     profileData?.accountId,
      //     selectedBusinessUnit?.value,
      //     values?.sbu?.value,
      //     values?.closingDate,
      //     profileData?.userId,
      //     setLoading,
      //     cb
      //   )
      // }
    } else {
      setLoading(false);
    }
  };

  const totalJournalAmount = useMemo(() => {
    if (jounalLedgerData?.length > 0) {
      return _formatMoney(
        jounalLedgerData?.reduce((acc, item) => (acc += item?.numAmount), 0)
      );
    } else {
      return 0;
    }
  }, [jounalLedgerData]);

  const totalIncentiveProvisionQty = useMemo(() => {
    if (incentiveProvisionData?.length > 0) {
      return incentiveProvisionData?.reduce(
        (acc, item) => (acc += item?.deliveryQty),
        0
      );
    } else return 0;
  }, [incentiveProvisionData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          if (
            values?.type?.value === 1 &&
            values?.closingType?.value === 2 &&
            getMonthFirstLastDate(values?.fromDate)?.firstDate ===
              values?.fromDate &&
            getMonthFirstLastDate(values?.fromDate)?.lastDate === values?.toDate
          ) {
            return toast.warn(
              "You can't create journal for continuous closing type, when you select full month. please change from date or to date"
            );
          }

          let confirmObject = {
            title: `${values?.type?.label} Journal`,
            message: `Are you sure want to create ${values?.type?.label} Journal?`,
            yesAlertFunc: async () => {
              saveHandler(values, (code) => {
                resetForm(initData);
                setJounalLedgerData([]);
                setJournalData([]);

                const nestedConfirmObject = {
                  title: `${values?.type?.label} Journal`,
                  message: `${values?.type?.label} Journal has been created successfully with code ${code}`,
                  buttons: [
                    {
                      label: 'OK',
                      onClick: () => {},
                    },
                  ],
                };
                IConfirmModal(nestedConfirmObject);
              });
            },
            noAlertFunc: () => {},
          };
          IConfirmModal(confirmObject);
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <div className="">
            {(loading ||
              isGetBaddebtRowDataLoading ||
              incomeTaxProvisionViewCreateLoading ||
              getIncentiveProvisionDataLoading ||
              createIncentiveProvisionJounralLoading) && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Month End Journal'}>
                <CardHeaderToolbar>
                  {/* Salary Journal */}
                  {values?.type?.value === 6 && (
                    <button
                      onClick={() =>
                        getOrCreateSalaryJournal({
                          buId,
                          accountId,
                          values,
                          setterFunction: setJVSalaryJournal,
                          setLoading,
                          type: 'create',
                          setExpanded,
                        })
                      }
                      className="btn btn-primary ml-2"
                      type="submit"
                    >
                      Create Journal
                    </button>
                  )}

                  {/* Incentive Provision */}
                  {values?.type?.value === 7 && (
                    <button
                      onClick={() => {
                        const [year, month] =
                          values?.monthYear?.split('-')?.map(Number) || [];
                        createIncentiveProvisionJounral(
                          `/fino/Report/GetIncentiveProvisionLanding?businessUnitId=${selectedBusinessUnit?.value}&yearId=${year}&monthId=${month}&totalValue=${totalIncentiveProvisionQty * values?.totalAmount}&actionBy=${profileData?.userId}`,
                          null,
                          (response) => {
                            // status code
                            // const statusCode = response?.[0]?.statusCode;
                            // const message = response?.[0]?.message;
                            // if (statusCode === 500 || statusCode !== 200) {
                            //   toast.warn(message);
                            // }
                            // if (statusCode === 200) {
                            //   toast.success(message);
                            // }
                          },
                          true
                        );
                      }}
                      className="btn btn-primary ml-2"
                      type="submit"
                      disabled={incentiveProvisionData.length < 1}
                    >
                      Create Journal
                    </button>
                  )}

                  {/* Income Tax Provision */}
                  {values?.type?.value === 3 && (
                    <button
                      onClick={() =>
                        incomeTaxProvisionViewCreate(
                          `/fino/AdjustmentJournal/IncomeTaxProvisionJV`,
                          {
                            partName: 'save',
                            businessUnitId: selectedBusinessUnit?.value,
                            date: values?.taxMonth,
                            actionBy: profileData?.userId,
                          },
                          (response) => {
                            // status code
                            const statusCode = response?.[0]?.statusCode;
                            const message = response?.[0]?.message;

                            if (statusCode === 500 || statusCode !== 200) {
                              toast.warn(message);
                            }
                            if (statusCode === 200) {
                              toast.success(message);
                            }
                          }
                        )
                      }
                      className="btn btn-primary ml-2"
                      type="submit"
                      disabled={incomeTaxProvisionViewCreateData.length < 1}
                    >
                      Create Journal
                    </button>
                  )}
                  {/* For Type 1 COGS */}
                  {values?.type?.value !== 4 &&
                    values?.type?.value !== 6 &&
                    values?.type?.value !== 7 &&
                    values?.type?.value !== 3 && (
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={
                          Math.abs(
                            Math.round(
                              jounalLedgerData?.reduce(
                                (acc, item) => acc + item.numAmount,
                                0
                              )
                            )
                          ) ||
                          jounalLedgerData?.length === 0 ||
                          (values?.type?.value === 1 && !values?.closingType)
                        }
                      >
                        Create Journal
                      </button>
                    )}
                  {values?.type?.value === 4 && (
                    <button
                      onClick={
                        // typeId 2 for save
                        () => {
                          saveYearClosing(
                            profileData?.userId,
                            selectedBusinessUnit?.value,
                            2,
                            values?.closingDate,
                            setLoading
                          );
                        }
                      }
                      className="btn btn-primary ml-2"
                      type="button"
                    >
                      Create Journal
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
                    {values?.type?.value === 1 && (
                      <div className="col-lg-12">
                        <p style={{ color: 'red' }}>
                          <b>
                            *When creating a journal for Monthly Closing Type,
                            you must select the first and last day of the month.
                            However, if you select the first day of the month
                            for continuous type, you cannot create the journal
                            by selecting the last day of that month.
                          </b>
                        </p>
                      </div>
                    )}
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue('sbu', valueOption);
                          dispatch(
                            SetFinancialsInventoryJournalAction({
                              ...values,
                              sbu: valueOption,
                            })
                          );
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="type"
                        options={typeDDL || []}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue('type', valueOption);
                          setJounalLedgerData([]);
                          setJournalData([]);
                          dispatch(
                            SetFinancialsInventoryJournalAction({
                              ...values,
                              type: valueOption,
                            })
                          );
                          if (values?.type?.value === 7) {
                            setIncentiveProvisionData([]);
                          }
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {[5].includes(values?.type.value) && (
                      <>
                        <div className="col-lg-2">
                          <NewSelect
                            name="tableMode"
                            options={[
                              { value: 1, label: 'Create' },
                              { value: 2, label: 'View' },
                            ]}
                            value={values?.tableMode}
                            label="Mode"
                            onChange={(valueOption) => {
                              setFieldValue('tableMode', valueOption);
                              setBaddebtRowData([]);
                              // dispatch(
                              //   SetFinancialsInventoryJournalAction({
                              //     ...values,
                              //     type: valueOption,
                              //   })
                              // );
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {['Create'].includes(values.tableMode?.label) && (
                          <div className="col-lg-3">
                            <label>Month-Year</label>
                            <InputField
                              value={values?.monthYear}
                              name="monthYear"
                              placeholder="From Date"
                              type="month"
                              onChange={(e) => {
                                setFieldValue('monthYear', e?.target?.value);
                              }}
                            />
                          </div>
                        )}
                        {/* <div className="col-lg-2">
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder="Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            name="toDate"
                            placeholder="Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            min={values?.fromDate}
                            // max={getMonthFirstLastDate(values?.fromDate)?.lastDate}
                          />
                        </div> */}
                      </>
                    )}
                    {values?.type?.value === 1 && (
                      <div className="col-lg-2">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('fromDate', e.target.value);
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                fromDate:
                                  values?.closingType?.value === 1
                                    ? getMonthFirstLastDate(e.target.value)
                                        ?.firstDate
                                    : e.target.value,
                                toDate: getMonthFirstLastDate(e.target.value)
                                  ?.lastDate,
                                closingType: values?.closingType,
                              })
                            );
                            setJounalLedgerData([]);
                            setJournalData([]);
                          }}
                          min={
                            values?.closingType?.value === 1
                              ? getMonthFirstLastDate(values?.fromDate)
                                  ?.firstDate
                              : ''
                          }
                          max={
                            values?.closingType?.value === 1
                              ? getMonthFirstLastDate(values?.fromDate)
                                  ?.lastDate
                              : ''
                          }
                        />
                      </div>
                    )}
                    {values?.type?.value === 1 && (
                      <div className="col-lg-2">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('toDate', e.target.value);
                            setFieldValue('closingType', '');
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                fromDate:
                                  values?.closingType?.value === 1
                                    ? getMonthFirstLastDate(values?.fromDate)
                                        ?.firstDate
                                    : values?.fromDate,
                                toDate:
                                  values?.closingType?.value === 1
                                    ? getMonthFirstLastDate(values?.fromDate)
                                        ?.lastDate
                                    : e.target.value,
                                closingType: values?.closingType,
                              })
                            );
                            setJounalLedgerData([]);
                            setJournalData([]);
                          }}
                          min={values?.fromDate}
                          max={
                            getMonthFirstLastDate(values?.fromDate)?.lastDate
                          }
                        />
                      </div>
                    )}
                    {values?.type?.value === 2 && (
                      <div className="col-lg-2">
                        <label>Transaction Date</label>
                        <InputField
                          value={values?.transactionDate}
                          name="transactionDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('transactionDate', e.target.value);
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                transactionDate: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    )}
                    {values?.type?.value === 4 && (
                      <InputField
                        value={values?.closingDate}
                        name="closingDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {}}
                        disabled={true}
                      />
                    )}
                    {[6, 7].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <label>Month-Year</label>
                        <InputField
                          value={values?.monthYear}
                          name="monthYear"
                          placeholder="From Date"
                          type="month"
                          onChange={(e) => {
                            setFieldValue('monthYear', e?.target?.value);
                            if (values?.type?.value === 7) {
                              setIncentiveProvisionData([]);
                            }
                          }}
                        />
                      </div>
                    )}
                    {[3].includes(values?.type?.value) && (
                      // <InputField
                      //   value={values?.date}
                      //   label="Date"
                      //   name="date"
                      //   placeholder="Date"
                      //   type="date"
                      //   onChange={(e) => {
                      //     setFieldValue("date", e.target.value);
                      //   }}
                      // />
                      <InputField
                        value={values?.taxMonth}
                        name="taxMonth"
                        label="Month"
                        placeholder="Select Month"
                        type="month"
                        onChange={(e) => {
                          setFieldValue('taxMonth', e?.target?.value);
                          setIncomeTaxProvisionViewCreateData([]);
                        }}
                      />
                    )}
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        disabled={(() => {
                          if ([5].includes(values.type?.value)) {
                            if (
                              ['Create'].includes(values.tableMode?.label) &&
                              values?.monthYear
                            ) {
                              return false;
                            } else if (
                              ['View'].includes(values.tableMode?.label)
                            ) {
                              return false;
                            } else return true;
                          }
                          if (values?.type?.value === 3 && !values?.taxMonth) {
                            return true;
                          } else {
                            return false;
                          }
                        })()}
                        onClick={(_) => {
                          setDataToRow(values);
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {/* new changes from miraj bhai */}
                    {values?.type?.value === 1 ? (
                      <div className="col-lg-2">
                        <NewSelect
                          name="closingType"
                          options={[
                            {
                              value: 1,
                              label: 'Monthly',
                            },
                            {
                              value: 2,
                              label: 'Continuous',
                            },
                          ]}
                          value={values?.closingType}
                          label="Closing Type"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue('closingType', valueOption);
                              dispatch(
                                SetFinancialsInventoryJournalAction({
                                  ...values,
                                  closingType: valueOption,
                                  fromDate:
                                    valueOption?.value === 1
                                      ? getMonthFirstLastDate(values?.fromDate)
                                          ?.firstDate
                                      : values?.fromDate,
                                  toDate:
                                    valueOption?.value === 1
                                      ? getMonthFirstLastDate(values?.fromDate)
                                          ?.lastDate
                                      : values?.toDate,
                                })
                              );
                              setJounalLedgerData([]);
                              setJournalData([]);
                            } else {
                              setFieldValue('closingType', '');
                            }
                          }}
                          placeholder="Closing Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : null}
                  </div>

                  {values?.type.value === 5 &&
                    ['Create']?.includes(values?.tableMode?.label) &&
                    baddebtRowData?.length > 0 && (
                      <CreateBaddebt tableData={baddebtRowData} />
                    )}

                  {values?.type.value === 5 &&
                    ['View']?.includes(values?.tableMode?.label) &&
                    baddebtRowData?.length > 0 && (
                      <ViewBaddebt tableData={baddebtRowData} />
                    )}

                  {/* Table Section Start */}
                  {values?.type?.value !== 4 && values?.type?.value !== 5 ? (
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          {jounalLedgerData?.length > 0 && (
                            <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
                              <thead className="bg-secondary">
                                <tr>
                                  <th>SL</th>
                                  <th>General Ledger Code</th>
                                  <th>General Ledger Name</th>
                                  <th>Narration</th>
                                  <th style={{ width: '100px' }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {jounalLedgerData?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-center">
                                      {item?.strGenLedgerCode}
                                    </td>
                                    <td className="text-center">
                                      {item?.strGenLedgerName}
                                    </td>
                                    <td className="text-right">
                                      {item?.strNarration}
                                    </td>
                                    <td className="text-right">
                                      {_formatMoney(item?.numAmount)}
                                    </td>
                                  </tr>
                                ))}
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-right font-weight-bold"
                                  >
                                    Total
                                  </td>
                                  <td className="text-right font-weight-bold">
                                    {totalJournalAmount}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  {values?.type?.value === 2 ? (
                    <div className="d-flex justify-content-end mt-2">
                      <ReactHtmlTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn btn-primary ml-2"
                        table={'depreciation'}
                        filename={'Depreciation'}
                        sheet="Sheet-1"
                        buttonText="Export Excel"
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  {values?.type?.value === 1 && jounalLedgerData?.length > 0 ? (
                    <>
                      <div className="row mt-3">
                        <div className="col-lg-3">
                          <NewSelect
                            name="transactionType"
                            options={[
                              { value: 1, label: 'Breakdown Of COGS' },
                              { value: 9, label: 'Issue for Cost Center' },
                              { value: 10, label: 'Issue For Maintenance' },
                              { value: 14, label: 'Issue For Shop Floor' },
                              { value: 12, label: 'Issue for Delivery' },
                              { value: 25, label: 'Inventory Adjustment' },
                              { value: 59, label: 'Receive from Shop Floor' },
                            ]}
                            value={values?.transactionType}
                            label="Transaction Type"
                            onChange={(valueOption) => {
                              setFieldValue('transactionType', valueOption);
                              // setJounalLedgerData([]);
                              setJournalData([]);
                            }}
                            placeholder="Transaction Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2 mt-5">
                          <button
                            className="btn btn-primary mr-2"
                            type="button"
                            onClick={() => {
                              detailsData(values, 0);
                              setIsDayBased(0);
                            }}
                          >
                            Summary
                          </button>
                        </div>
                        <div className="col-lg-2 mt-5">
                          <button
                            className="btn btn-primary mr-2"
                            type="button"
                            onClick={() => {
                              detailsData(values, 1);
                              setIsDayBased(1);
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {values?.type?.value === 1 && journalData?.length > 0 ? (
                    <>
                      <div className="text-center">
                        <h3 className="mt-2">
                          {values?.transactionType?.label || ''}
                        </h3>
                      </div>

                      <div className="d-flex justify-content-end mt-2">
                        <ReactHtmlTableToExcel
                          id="test-table-xls-button"
                          className="download-table-xls-button btn btn-primary ml-2"
                          table={'cogs'}
                          filename={
                            values?.transactionType?.label ||
                            'reconsilationJournel'
                          }
                          sheet="Sheet-1"
                          buttonText="Export Excel"
                        />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {values?.type?.value === 1 && jounalLedgerData?.length > 0 ? (
                    <COGSTable
                      journalData={journalData}
                      landingValues={values}
                      isDayBased={isDayBased}
                    />
                  ) : (
                    <></>
                  )}
                  {values?.type?.value === 2 ? (
                    <DepreciationTable journalData={journalData} />
                  ) : (
                    <></>
                  )}
                  {values?.type?.value === 4 ? (
                    <YearClosingTable closingData={closingData} />
                  ) : (
                    <></>
                  )}

                  {/* View Salary Journal */}
                  {values?.type?.value === 6 && salaryJournal?.length > 0 ? (
                    <Accordion
                      expanded={expanded === 1}
                      onChange={handleChange(1)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <h6>Salary Journal</h6>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ViewSalaryJournalTable salaryJournal={salaryJournal} />
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <></>
                  )}

                  {/* JV Report Salary Journal */}
                  {values?.type?.value === 6 && jvSalaryJournal?.length > 0 ? (
                    <Accordion
                      expanded={expanded === 2}
                      onChange={handleChange(2)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <h6>JV Report of Salary Journal</h6>
                      </AccordionSummary>
                      <AccordionDetails>
                        <CreateSalaryJournalTable
                          jvSalaryJournal={jvSalaryJournal}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <></>
                  )}

                  {/* Income Tax Provision Table */}
                  {incomeTaxProvisionViewCreateData.length > 0 &&
                  values?.type?.value === 3 ? (
                    <div className="table-responsive">
                      <table
                        id="table-to-xlsx"
                        className={
                          'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table'
                        }
                      >
                        <thead>
                          <tr className="cursor-pointer">
                            <th>SL</th>
                            <th>Profit Center Name</th>
                            <th>General Ledger Name</th>
                            <th>Sub Gl Name</th>
                            <th>Tax Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incomeTaxProvisionViewCreateData?.map(
                            (item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: '40px' }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.strProfitCenterName}</td>
                                  <td>{item?.strGeneralLedgerName}</td>
                                  <td>{item?.subGlName}</td>
                                  <td className="text-right">
                                    {item?.taxAmount}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <></>
                  )}

                  {/* Incentive Provision */}
                  {incentiveProvisionData?.length > 0 &&
                  [7].includes(values?.type?.value) ? (
                    <>
                      <div className="float-right my-2">
                        <InputField
                          value={values?.totalAmount}
                          name="totalAmount"
                          label="Total Amount"
                          type="number"
                          min={1}
                          onChange={(e) => {
                            setFieldValue('totalAmount', e?.target?.value);
                          }}
                        />
                      </div>
                      <section className="table-responsive">
                        <table
                          id="table-to-xlsx"
                          className={
                            'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table'
                          }
                        >
                          <thead>
                            <tr className="cursor-pointer">
                              <th>SL</th>
                              <th>Customer Name</th>
                              <th>Delivery Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {incentiveProvisionData?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: '40px' }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.customerName}</td>
                                  <td className="text-right">
                                    {item?.deliveryQty}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tr>
                            <td colSpan={2} className="text-center">
                              Total
                            </td>
                            <td className="text-right">
                              {totalIncentiveProvisionQty || 0}
                            </td>
                          </tr>
                        </table>
                      </section>
                    </>
                  ) : (
                    <></>
                  )}

                  <>
                    <DropzoneDialogBase
                      filesLimit={1}
                      acceptedFiles={['.xlsx', '.xls']}
                      fileObjects={fileObject}
                      cancelButtonText={'cancel'}
                      submitButtonText={'submit'}
                      maxFileSize={100000000000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObject(newFileObjs);
                      }}
                      onClose={() => setOpen(false)}
                      onSave={() => {}}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default ReconciliationJournal;
