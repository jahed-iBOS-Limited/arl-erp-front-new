import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import NewSelect from '../../../_helper/_select';

const initialValues = {
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().endOf('month').format('YYYY-MM-DD'),
  chaType: {
    value: 0,
    label: 'All',
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
export default function CHAReport() {
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
      `${imarineBaseUrl}/domain/CHAShipment/GetACLedgerforPaymentReport?modeOfTransportId=${values?.chaType?.value}&${query}&pageNo=1&pageSize=10000`,
    );
  };

  useEffect(() => {
    commonGetApi(initialValues);

  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <ICustomCard title="CHA Report">
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
                          value: 0,
                          label: 'All',
                        },
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
              </Form>
            </>
          )}
        </Formik>
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Indentor</th>
                  <th>Payment Received Date</th>
                  <th>Job No. / Job No.</th>
                  <th>Name of the Customer</th>
                  <th>LC / Sales Contract No.</th>
                  <th>IOU Amount</th>
                  <th>Collection Amount</th>
                  <th>Payment Amount</th>
                </tr>
              </thead>
              <tbody>
                {acLedgerforPaymentReport?.data?.length > 0 &&
                  acLedgerforPaymentReport?.data?.map((item, i) => {
                    const chaIouInvoice = item?.chaIouInvoice
                      ? JSON.parse(item?.chaIouInvoice)
                      : {};
                    const totalAmount = chaIouInvoice?.totalAmount || 0;

                    return (
                      <tr key={i + 1}>
                        <td className="text-center">{i + 1}</td>
                        <td>{chaIouInvoice?.cashReceivedBy}</td>
                        <td>
                          {moment(item?.serverDateTime).format('YYYY-MM-DD')}
                        </td>
                        <td>{item?.chabookingCode}</td>
                        <td>{item?.customerName}</td>
                        <td>{item?.lcNo}</td>
                        <td>{totalAmount}</td>
                        <td>{item?.collectionAmount}</td>
                        <td>{item?.paymentAmount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </ICustomCard>
    </>
  );
}
