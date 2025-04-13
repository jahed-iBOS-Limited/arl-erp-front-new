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
const initialValues = {
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().endOf('month').format('YYYY-MM-DD'),
  chaType: {
    value: 1,
    label: 'Export',
  },
};
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required'),
  chaType: Yup.object().shape({
    value: Yup.string().required('CHA Type is required'),
    label: Yup.string().required('CHA Type is required'),
  }),
});
export default function CHABusinessReport() {
  const [acLedgerforPaymentReport, getACLedgerforPaymentReport, isLoading] =
    useAxiosGet();

  const saveHandler = (values) => {
    commonGetApi(values);
  };

  const commonGetApi = (values) => {
    const startDate = moment(values?.fromDate).format('YYYY-MM-DD');
    const endDate = moment(values?.toDate).format('YYYY-MM-DD');
    const query = `fromDate=${startDate}&toDate=${endDate}`;
    getACLedgerforPaymentReport(
      `${imarineBaseUrl}/domain/CHAShipment/GetChaBusinessReport?tradeTypeId=${values?.chaType?.value}&${query}`
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
  return (
    <>
      {isLoading && <Loading />}
      <ICustomCard
        title="CHA Business Report"
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="chaType"
                      options={[
                        {
                          value: 1,
                          label: 'Export',
                        },
                        {
                          value: 2,
                          label: 'Import',
                        },
                      ]}
                      value={values?.chaType || ''}
                      label="CHA Type"
                      onChange={(valueOption) => {
                        setFieldValue('chaType', valueOption);
                      }}
                      placeholder="CHA Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-sm-3 ">
                    <InputField
                      value={values?.fromDate}
                      label={'From Date'}
                      name="fromDate"
                      type="date"
                      onChange={(e) =>
                        setFieldValue('fromDate', e.target.value)
                      }
                    />
                  </div>
                  <div className="col-sm-3 ">
                    <InputField
                      value={values?.toDate}
                      label={'To Date'}
                      name="toDate"
                      type="date"
                      onChange={(e) => setFieldValue('toDate', e.target.value)}
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
                      <h1>Akij Logistics Ltd.</h1>
                      <h6>CHA Business Report</h6>
                      <p>
                        <b>
                          {values?.chaType?.label
                            ? `CHA Type: ${values?.chaType?.label}`
                            : ''}
                        </b>
                      </p>
                    </div>
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Job No.</th>
                          <th>HBL/HAWB</th>
                          <th>Transport Mode</th>
                          <th>Customer</th>
                          <th>Shipper</th>
                          <th>Consignee</th>
                          <th>FFW</th>
                          <th>FCL/LCL</th>
                          <th>Port of Delivery</th>
                          <th>CS/Sales PIC</th>
                          <th>Commodity</th>
                          <th>Copy Doc RCV</th>
                          <th>Invoice Value</th>
                          <th>Com. Invoice No</th>
                          <th>Invoice Date</th>
                          <th>LC Date</th>
                          <th>LC No</th>
                          <th>Quantity</th>
                          <th>Bill of /E</th>
                          <th>Bill of /E Date</th>
                          <th>Gross Weight</th>
                          <th>CBM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {acLedgerforPaymentReport?.length > 0 &&
                          acLedgerforPaymentReport?.map((item, i) => {
                            return (
                              <tr key={i + 1}>
                                <td className="text-center">{i + 1}</td>
                                <td className="">{item?.jobNo}</td>
                                <td className="">{item?.hblno}</td>
                                <td className="">{item?.modeOfTransport}</td>
                                <td className="">{item?.customer}</td>
                                <td className="">{item?.shipper}</td>
                                <td className="">{item?.consignee}</td>
                                <td className="">{item?.ffw}</td>
                                <td className="">{item?.fclLcl}</td>
                                <td className="">{item?.portOfDelivery}</td>
                                <td className="">{item?.cssalesPic}</td>
                                <td className="">{item?.commodity}</td>
                                <td className="">
                                  {item?.copyDocRcv &&
                                    moment(item?.copyDocRcv).format(
                                      'YYYY-MM-DD'
                                    )}
                                </td>
                                <td className="">{item?.invoiceValue}</td>
                                <td className="">{item?.comInvoiceNo}</td>
                                <td className="text-center">
                                  {moment(item?.invoiceDate).format(
                                    'YYYY-MM-DD'
                                  )}
                                </td>
                                <td className="text-center">
                                  {item?.lcDate
                                    ? moment(item?.lcDate).format('YYYY-MM-DD')
                                    : ''}
                                </td>
                                <td className="">{item?.lcNo}</td>
                                <td className="text-right">{item?.quantity}</td>
                                <td className="">{item?.billOfEntry}</td>
                                <td className="text-center">
                                  {item?.billOfEntryDate &&
                                    moment(item?.billOfEntryDate).format(
                                      'YYYY-MM-DD'
                                    )}
                                </td>
                                <td className="text-right">
                                  {item?.grossWeight}
                                </td>
                                <td className="text-right">{item?.cbm}</td>
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
