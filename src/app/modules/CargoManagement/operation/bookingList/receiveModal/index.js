import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
import BookingDetailsInfo from '../bookingDetails/bookingDetailsInfo';
import './style.css';
const validationSchema = Yup.object().shape({
  // recvQuantity: Yup.number().required("Receive Quantity is required"),
  wareHouse: Yup.object().shape({
    value: Yup.string().required('Warehouse is required'),
    label: Yup.string().required('Warehouse is required'),
  }),
  receivedDate: Yup.date().required('Received Date is required'),
});
function ReceiveModal({ rowClickData, CB }) {
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [, getRecvQuantity, recvQuantityLoading] = useAxiosPut();
  const [rowsData, setRowsData] = React.useState([]);
  const bookingRequestId = rowClickData?.bookingRequestId;
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const formikRef = React.useRef(null);
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (data) => {
          const bookingData = data || {};
          setRowsData(
            bookingData?.rowsData?.map((itm) => {
              return {
                ...itm,
                recvQuantity: itm?.totalNumberOfPackages || 0,
              };
            }) || [],
          );

          if (formikRef.current) {
            formikRef.current.setFieldValue(
              'wareHouse',
              bookingData?.warehouseId
                ? {
                    value: bookingData?.warehouseId,
                    label: bookingData?.warehouseName,
                  }
                : '',
            );
          }
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, resetForm) => {
    const paylaod = {
      updthd: {
        bookingId: bookingRequestId,
        warehouseId: values?.wareHouse?.value || 0,
        warehouseName: values?.wareHouse?.label || '',
        receivedDate: values?.receivedDate || '',
      },
      updtrow: rowsData.map((itm) => {
        return {
          bookingId: bookingRequestId,
          bookingRowId: itm?.bookingRequestRowId || 0,
          receivedQuantity: itm?.recvQuantity || 0,
        };
      }),
    };
    getRecvQuantity(
      `${imarineBaseUrl}/domain/ShippingService/createReceiveProcess`,
      paylaod,
      () => {
        CB();
      },
    );
  };

  const bookingData = shipBookingRequestGetById || {};

  useEffect(() => {
    getWarehouseDDL(
      `/wms/Warehouse/GetWarehouseFromPlantWarehouseDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="confirmModal">
      {(shipBookingRequestLoading || recvQuantityLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          receivedDate: '',
          wareHouse: '',
        }}
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
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                <div className="col-lg-3">
                  <NewSelect
                    name="wareHouse"
                    options={[...warehouseDDL]}
                    value={values?.wareHouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('wareHouse', valueOption);
                      } else {
                        setFieldValue('wareHouse', '');
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.receivedDate}
                    label="Received Date"
                    name="receivedDate"
                    placeholder="Received Date"
                    type="date"
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Cargo Type</th>
                      <th>HS Code</th>
                      <th>Number of Packages/Units/Carton</th>
                      <th>Receive Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowsData?.map((doc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{doc?.typeOfCargo}</td>
                        <td>{doc?.hsCode}</td>
                        <td>{doc?.totalNumberOfPackages}</td>
                        <td>
                          <InputField
                            value={rowsData[index]?.recvQuantity}
                            name={`rowsData[${index}].recvQuantity`}
                            required
                            // max={rowsData[index]?.loadingQuantity || 0}
                            type="number"
                            min={0}
                            placeholder="Receive Quantity"
                            onChange={(e) => {
                              const value = e.target.value;
                              setRowsData((prev) => {
                                const newArr = [...prev];
                                newArr[index] = {
                                  ...newArr[index],
                                  recvQuantity: value,
                                };
                                return newArr;
                              });
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <BookingDetailsInfo bookingData={bookingData} />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ReceiveModal;
