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
  shipmentType: null, // New field for Shipment Type
  concernSalesPerson: '',
  modeOfTransport: null,
};
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required'),
  shipmentType: Yup.object().nullable().required('Shipment Type is required'),
  modeOfTransport: Yup.object().nullable().required('Booking Type is required'),
});
export default function LiftingReport() {
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
    const SalesPerson = values?.concernSalesPerson?.value
      ? `&SalesPersonId=${values?.concernSalesPerson?.value}`
      : '';
    const query = `fromDate=${startDate}&toDate=${endDate}&tradeTypeId=${values?.shipmentType?.value}&modeOfTransPortId=${values?.modeOfTransport?.value}${SalesPerson}`;
    getACLedgerforPaymentReport(
      `${imarineBaseUrl}/domain/ShippingService/GetLiftingReport?${query}`
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
      { value: 0, label: 'All' },
      { value: 1, label: 'Air' },
      { value: 2, label: 'Sea' },
      { value: 3, label: 'Sea-Air' },
    ],
    2: [
      { value: 0, label: 'All' },
      { value: 1, label: 'Air' },
      { value: 2, label: 'Sea' },
      { value: 4, label: 'Land' },
    ],
  };

  const getTransportOptions = (shipmentType) =>
    transportOptions[shipmentType] || [];

  // SL.	SHIPMENT TYPE	Booking No	Shipper	MBL/MAWB	HAWB/HBL	Flight No/Voyage No	GSA	Destination	Sales person	ETD	Buying Rate	Selling Rate	Total CBM	TOTAL CTNs	Total Chargable weight (kgs)	Revenue (BDT)	Expense (BDT)	GP (BDT)
  return (
    <>
      {isLoading && <Loading />}
      <ICustomCard
        title="Lifting Report"
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

                  <div className="col-lg-3">
                    <label>Concern Sales Person</label>
                    <SearchAsyncSelect
                      selectedValue={values?.concernSalesPerson}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue('concernSalesPerson', valueOption);
                        setACLedgerforPaymentReport([]);
                      }}
                      loadOptions={loadEmp}
                      errors={errors}
                      touched={touched}
                    />
                    <FormikError
                      errors={errors}
                      name="concernSalesPerson"
                      touched={touched}
                    />
                  </div>
                  <div className="pt-4">
                    {/* Search */}
                    <button type="submit" className="btn btn-primary mt-2">
                      View
                    </button>
                  </div>
                </div>
                <div className="col-lg-12 p-0">
                  <div className="table-responsive" ref={printRef}>
                    <div className="text-center mb-3 d-none-print">
                      <h2>Akij Logistics Ltd.</h2>
                      <h6>Lifting Report Report</h6>
                      <p className="p-0 m-0">
                        {/* formdate to todate */}
                        {`From ${moment(values?.fromDate).format(
                          'YYYY-MM-DD'
                        )} to ${moment(values?.toDate).format('YYYY-MM-DD')}`}
                      </p>
                      <p className="p-0 m-0">{`Shipment Type: ${values?.shipmentType?.label}`}</p>
                      <p className="p-0 m-0">{`Booking Type: ${values?.modeOfTransport?.label}`}</p>
                      {values?.concernSalesPerson?.label && (
                        <p className="p-0 m-0">{`Concern Sales Person: ${values?.concernSalesPerson?.label}`}</p>
                      )}
                    </div>
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shipment Type</th>
                          <th>Booking No</th>
                          <th>Shipper</th>
                          <th>MBL/MAWB</th>
                          <th>HAWB/HBL</th>
                          <th>Flight No/Voyage No</th>
                          <th>GSA</th>
                          <th>Destination</th>
                          <th>Sales person</th>
                          <th>ETD</th>
                          <th>Buying Rate</th>
                          <th>Selling Rate</th>
                          <th>Total CBM</th>
                          <th>TOTAL CTNs</th>
                          <th>Total Chargable weight (kgs)</th>
                          <th>Revenue (BDT)</th>
                          <th>Expense (BDT)</th>
                          <th>GP (BDT)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acLedgerforPaymentReport?.length > 0 &&
                          acLedgerforPaymentReport?.map((item, i) => {
                            const receivable = +item?.grossRevenue || 0;
                            const payable = +item?.netConst || 0;
                            const qty = +item?.totalNumberOfPackages || 0;

                            const buyingRate = payable / qty;
                            const sellingRate = receivable / qty;

                            const totalGrossWeightKg =
                              +item?.totalGrossWeightKg || 0;
                            const totalVolumetricWeight =
                              +item?.totalVolumetricWeight || 0;

                            const chargableWeight =
                              totalGrossWeightKg > totalVolumetricWeight
                                ? totalGrossWeightKg
                                : totalVolumetricWeight;

                            return (
                              <tr key={i + 1}>
                                <td className="text-center">{i + 1}</td>
                                <td className="">{item?.tradeType}</td>
                                <td className="">{item?.requestCode}</td>
                                <td className="">{item?.shipperName}</td>
                                <td className="">{item?.masterBlCode}</td>
                                <td className="">{item?.hblnumber}</td>
                                <td className="">
                                  {item?.flightNumber?.join(', ')}
                                </td>
                                <td className="">{item?.gsa}</td>
                                <td className="">{item?.destination}</td>
                                <td className="">{item?.concernSalesPerson}</td>
                                <td className="text-center">
                                  {item?.etd &&
                                    moment(item?.etd).format('YYYY-MM-DD')}
                                </td>
                                <td className="text-right">
                                  {Number(buyingRate.toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number(sellingRate.toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {item?.totalVolumeCbm}
                                </td>
                                <td className="text-right">
                                  {item?.totalNumberOfPackages}
                                </td>
                                <td className="text-right">
                                  {chargableWeight}
                                </td>
                                <td className="text-right">
                                  {item?.grossRevenue}
                                </td>
                                <td className="text-right">{item?.netConst}</td>
                                <td className="text-right">
                                  {item?.grossRevenue - item?.netConst}
                                </td>
                              </tr>
                            );
                          })}
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
