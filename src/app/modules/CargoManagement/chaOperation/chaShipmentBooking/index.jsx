import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ICustomCard from '../../../_helper/_customCard';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../_helper/_loading';
import IView from '../../../_helper/_helperIcons/_view';
import IEdit from '../../../_helper/_helperIcons/_edit';
import { imarineBaseUrl } from '../../../../App';
import { _dateFormatter } from '../../../_helper/_dateFormate';

const validationSchema = Yup.object().shape({});

export default function ChaShipmentBooking() {
  const [
    chaShipmentBooking,
    getyChaShipmentBooking,
    chaShipmentBookingLoading,
  ] = useAxiosGet();
  // const [pageNo, setPageNo] = useState(0);
  // const [pageSize, setPageSize] = useState(15);
  let history = useHistory();
  const formikRef = React.useRef(null);
  const saveHandler = (values, cb) => {};

  useEffect(() => {
    getyChaShipmentBooking(
      `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingLanding`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ICustomCard
      title="CHA Shipment Booking List"
      createHandler={() => {
        history.push(
          '/cargoManagement/cha-operation/cha-shipment-booking/create',
        );
      }}
      backHandler={() => {
        history.goBack();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {chaShipmentBookingLoading && <Loading />}
            <Form className="form form-label-right">
              <div>
                <div className="form-group row global-form">
                  {/* form fields here */}
                </div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>HBL/HAWB</th>
                        <th>MBL/MAWB</th>
                        <th>Mode of Transport</th>
                        <th>Carrier</th>
                        <th>Customer</th>
                        <th>Com. Invoice No</th>
                        <th>Invoice Date</th>
                        <th>Net Weight</th>
                        <th>Gross Weight</th>
                        <th>Volumetric Weight</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chaShipmentBooking?.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td rowSpan={item?.rowData?.length}>
                                {' '}
                                {index + 1}
                              </td>
                              <td>{item?.hblNo}</td>
                              <td>{item?.mblNo}</td>
                              <td>{item?.modeOfTransportName}</td>
                              <td>{item?.carrierName}</td>
                              <td>{item?.customerName}</td>
                              <td>{item?.commercialInvoiceNo}</td>
                              <td>
                                {item?.invoiceDate
                                  ? _dateFormatter(item?.invoiceDate)
                                  : ''}
                              </td>
                              <td>{item?.netWeight}</td>
                              <td>{item?.grossWeight}</td>
                              <td>{item?.volumetricWeight}</td>
                              <td>
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IView />
                                  </span>
                                  <span
                                    onClick={() => {
                                      history.push(
                                        `/cargoManagement/cha-operation/cha-shipment-booking/edit/${item?.chabookingId}`,
                                      );
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </>
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
  );
}
