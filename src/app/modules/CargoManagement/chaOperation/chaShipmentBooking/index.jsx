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
import { useState } from 'react';
import PaginationTable from '../../../_helper/_tablePagination';
import IViewModal from '../../../_helper/_viewModal';
import ViewInfo from './viewInfo';

const validationSchema = Yup.object().shape({});

export default function ChaShipmentBooking() {
  const [
    chaShipmentBooking,
    getyChaShipmentBooking,
    chaShipmentBookingLoading,
  ] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [viewModal, setViewModal] = useState(false);
  const [clickRowDto, setClickRowDto] = useState({});
  let history = useHistory();
  const formikRef = React.useRef(null);
  const saveHandler = (values, cb) => {};

  const commonGetData = (search, pageNo, pageSize) => {
    getyChaShipmentBooking(
      `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingLanding?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}`,
    );
  };

  useEffect(() => {
    commonGetData('', pageNo, pageSize);

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
                      {chaShipmentBooking?.data?.map((item, index) => {
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
                                  <span
                                    onClick={() => {
                                      setViewModal(true);
                                      setClickRowDto(item);
                                    }}
                                  >
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

                {chaShipmentBooking?.data?.length > 0 && (
                  <PaginationTable
                    count={chaShipmentBooking?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGetData('', pageNo, pageSize);
                    }}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}

                {viewModal && (
                  <IViewModal
                    show={viewModal}
                    onHide={() => {
                      setViewModal(false);
                    }}
                    title={'View Information'}
                  >
                    <ViewInfo clickRowDto={clickRowDto} />
                  </IViewModal>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
