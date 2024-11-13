import { EyeOutlined } from '@ant-design/icons';
import { IconButton } from '@material-ui/core';
import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
// import Details from '../../operation/bookingList/bookingDetails';
import ShippingExpenseIncomeDetails from './shippingExpenseIncomeDetails';

const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required'),
});
export default function ExpenseReport() {
  const [isModalShowObj, setIsModalShowObj] = React.useState({});
  const [rowClickData, setRowClickData] = React.useState({});
  const [data, getShippingExpenseIncomeReportData, isLoading] = useAxiosGet();

  const saveHandler = (values) => {
    const startDate = moment(values?.fromDate).format('YYYY-MM-DD');
    const endDate = moment(values?.toDate).format('YYYY-MM-DD');
    const query = `fromDate=${startDate}&toDate=${endDate}`;
    getShippingExpenseIncomeReportData(
      `${imarineBaseUrl}/domain/ShippingService/ShippingExpenseIncomeReport?${query}`,
    );
  };
  return (
    <>
      {isLoading && <Loading />}
      <ICustomCard title="Shipping Income and Expense Report">
        <Formik
          enableReinitialize={true}
          initialValues={{
            fromDate: '',
            toDate: '',
          }}
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
                      value={values?.date}
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
                      value={values?.date}
                      label={'To Date'}
                      name="toDate"
                      type="date"
                      onChange={(e) => setFieldValue('toDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  {/* Search */}
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
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
                  <th
                    style={{
                      minWidth: '150px',
                    }}
                  >
                    Booking Request Id
                  </th>
                  <th
                    style={{
                      minWidth: '100px',
                    }}
                  >
                    Charge Amount
                  </th>
                  <th
                    style={{
                      minWidth: '100px',
                    }}
                  >
                    Actual Expense
                  </th>
                  <th
                    style={{
                      minWidth: '100px',
                    }}
                  >
                    Gross Profit/Loss
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 &&
                  data?.map((item, i) => (
                    <tr key={i + 1}>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-left">{item?.bookingRequestId}</td>
                      <td className="text-right">{item?.chargeAmount}</td>
                      <td className="text-right">{item?.actualExpense}</td>
                      <td
                        className="text-right"
                        style={{
                          ...(item?.chargeAmount - item?.actualExpense < 0 && {
                            color: 'red',
                          }),
                        }}
                      >
                        {item?.chargeAmount - item?.actualExpense}
                      </td>
                      <td className="text-center">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setRowClickData(item);
                            setIsModalShowObj({
                              ...isModalShowObj,
                              isViewDetails: true,
                            });
                          }}
                        >
                          <EyeOutlined />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </ICustomCard>
      {isModalShowObj?.isViewDetails && (
        <>
          <IViewModal
            title="Details"
            show={isModalShowObj?.isViewDetails}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isViewDetails: false,
              });
            }}
          >
            {/* <Details rowClickData={rowClickData} /> */}
            <ShippingExpenseIncomeDetails
              bookingId={rowClickData?.bookingRequestId}
            />
          </IViewModal>
        </>
      )}
    </>
  );
}
