import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import NewSelect from '../../../_helper/_select';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { shallowEqual, useSelector } from 'react-redux';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import FormikError from '../../../_helper/_formikError';
import { _formatMoney } from '../../../_helper/_formatMoney';
const initialValues = {
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().endOf('month').format('YYYY-MM-DD'),
  shipmentType: null,
  modeOfTransport: null,
};
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required'),
  shipmentType: Yup.object().nullable().required('Shipment Type is required'),
  modeOfTransport: Yup.object().nullable().required('Booking Type is required'),
});
export default function PLReport() {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [
    acLedgerforPaymentReport,
    getACLedgerforPaymentReport,
    isLoading,
    setACLedgerforPaymentReport,
  ] = useAxiosGet();

  const saveHandler = (values) => {
    commonGetApi(values);
  };

  const commonGetApi = (values) => {
    const startDate = moment(values?.fromDate).format('YYYY-MM-DD');
    const endDate = moment(values?.toDate).format('YYYY-MM-DD');
    const query = `fromDate=${startDate}&toDate=${endDate}&tradeTypeId=${values?.shipmentType?.value}&modeOfTransPortId=${values?.modeOfTransport?.value}`;
    getACLedgerforPaymentReport(
      `${imarineBaseUrl}/domain/ShippingService/GetProfitLossReport?${query}`
    );
  };

  useEffect(() => {
    commonGetApi(initialValues);
  }, []);
  const printRef = useRef(null);
  const printHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'CHA Business Report',
    pageStyle: `@media print {
              body {
                -webkit-print-color-adjust: exact;
                margin: 0mm;
              }
              @page {
                size: A4 landscape !important;
              }
              table tr td,
              table tr th {
                font-size: 9px !important;
              }
            }`,
  });

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${
          profileData?.accountId
        }&BusinessUnitId=${225}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  const transportOptions = {
    1: [
      { value: 1, label: 'Air' },
      { value: 2, label: 'Sea' },
      { value: 3, label: 'Sea-Air' },
    ],
    2: [
      { value: 1, label: 'Air' },
      { value: 2, label: 'Sea' },
      { value: 4, label: 'Land' },
    ],
    3: [{ value: 6, label: 'Air Import' }],
  };

  const getTransportOptions = (shipmentType) =>
    transportOptions[shipmentType] || [];

  return (
    <>
      {isLoading && <Loading />}
      <ICustomCard
        title="P & L Report"
        renderProps={() => {
          return (
            <button
              onClick={printHandler}
              type="button"
              className="btn btn-primary px-3 py-2"
            >
              <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          );
        }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm();
            });
          }}
        >
          {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
            <>
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-sm-3 ">
                    <InputField
                      value={values?.fromDate}
                      label={'From Date'}
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                        setACLedgerforPaymentReport([]);
                      }}
                    />
                  </div>
                  <div className="col-sm-3 ">
                    <InputField
                      value={values?.toDate}
                      label={'To Date'}
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setACLedgerforPaymentReport([]);
                        setFieldValue('toDate', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-sm-3">
                    <NewSelect
                      name="shipmentType"
                      options={[
                        { value: 1, label: 'Export' },
                        { value: 2, label: 'Import' },
                        {
                          value: 3,
                          label: 'Air Ops',
                        },
                      ]}
                      value={values?.shipmentType}
                      label="Shipment Type"
                      onChange={(valueOption) => {
                        setFieldValue('shipmentType', valueOption);
                        setFieldValue('modeOfTransport', '');
                        setACLedgerforPaymentReport([]);
                      }}
                      placeholder="Select Shipment Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="modeOfTransport"
                      options={getTransportOptions(values?.shipmentType?.value)}
                      value={values?.modeOfTransport || ''}
                      label="Booking Type"
                      onChange={(valueOption) => {
                        setFieldValue('modeOfTransport', valueOption);
                        setACLedgerforPaymentReport([]);
                      }}
                      placeholder="Booking Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="pt-4 text-right col-lg-12">
                    {/* Search */}
                    <button type="submit" className="btn btn-primary mt-2">
                      View
                    </button>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="table-responsive" ref={printRef}>
                    <div className="text-center mb-3 d-none-print">
                      <h2>Akij Logistics Ltd.</h2>
                      <h6>P & L Report</h6>
                      <p className="p-0 m-0">
                        {/* formdate to todate */}
                        {`From ${moment(values?.fromDate).format(
                          'YYYY-MM-DD'
                        )} to ${moment(values?.toDate).format('YYYY-MM-DD')}`}
                      </p>
                      <p className="p-0 m-0">{`Shipment Type: ${values?.shipmentType?.label}`}</p>
                      <p className="p-0 m-0">{`Booking Type: ${values?.modeOfTransport?.label}`}</p>
                    </div>
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Booking No</th>
                          <th>Consignee</th>
                          <th>Agent</th>
                          <th>Shipment Date</th>
                          <th>HAWB/HBL NO</th>
                          <th>MAWB/MBL NO</th>
                          <th>POL</th>
                          <th>POD</th>
                          <th>Freight Payable in BDT</th>
                          <th>DO Cost</th>
                          <th>DO/HBL Charge</th>
                          <th>Commission</th>
                          <th>Freight Receivable in BDT</th>
                          <th>Gross Revenue</th>
                          <th>Net Income</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acLedgerforPaymentReport?.length > 0 &&
                          acLedgerforPaymentReport?.map((item, i) => (
                            <tr key={i + 1}>
                              <td className="text-center">{i + 1}</td>
                              <td>{item?.requestCode || ''}</td>
                              <td>{item?.consigneesName || ''}</td>
                              <td>{item?.freightAgentReference || ''}</td>
                              <td className="text-center">
                                {item?.shipmentDate &&
                                  moment(item?.shipmentDate).format(
                                    'YYYY-MM-DD'
                                  )}
                              </td>
                              <td>{item?.hblnumber || ''}</td>
                              <td>{item?.mblNo || ''}</td>
                              <td>{item?.portOfLoading || ''}</td>
                              <td>{item?.portOfDelivery || ''}</td>
                              <td className="text-right">
                                {item?.frieghtPayableBDT || ''}
                              </td>
                              <td className="text-right">
                                {item?.doCost || ''}
                              </td>
                              <td className="text-right">
                                {item?.dohblCharge || ''}
                              </td>
                              <td className="text-right">
                                {item?.commission || ''}
                              </td>
                              <td className="text-right">
                                {item?.frieghtRecivableBDT || ''}
                              </td>
                              <td className="text-right">
                                {item?.grossRevenue || ''}
                              </td>
                              <td className="text-right">
                                {item?.grossRevenue - item?.netCost}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
