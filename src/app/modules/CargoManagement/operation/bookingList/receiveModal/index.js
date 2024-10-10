import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import BookingDetailsInfo from "../bookingDetails/bookingDetailsInfo";
import "./style.css";
const validationSchema = Yup.object().shape({

});
function ReceiveModal({ rowClickData, CB }) {
  const [rowList, setRowList] = useState([]);
  const [, getRecvQuantity, recvQuantityLoading] = useAxiosPut();
  const bookingRequestId = rowClickData?.bookingRequestId;
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
          const bookingData = data?.[0] || {};
          setRowList(bookingData?.rowsData || []);
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, resetForm) => {

    const paylaod = {
      updthd: {
        bookingId: bookingRequestId
      },
      updtrow: rowList.map((item) => {
        return {
          bookingId: bookingRequestId,
          bookingRowId: item?.bookingRequestRowId || 0,
          receivedQuantity: item?.recvQuantity || 0,
        }
      })
    };
    getRecvQuantity(
      `${imarineBaseUrl}/domain/ShippingService/createReceiveProcess`,
      paylaod,
      () => {
        CB()
      }
    );
  };


  const bookingData = shipBookingRequestGetById?.[0] || {};
  return (
    <div className="confirmModal">
      {(shipBookingRequestLoading || recvQuantityLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          poNumber: "",
          countryofOrigin: "",
          pickupPlace: "",
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
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>

              <div className="col-lg-12">
                {" "}
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th className="p-0">SL</th>
                        <th className="p-0">Packaging Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowList?.map((item, index) => (
                        <tr key={index}>
                          <td> {index + 1} </td>

                          <td className="align-middle">
                            <InputField
                              value={item?.recvQuantity}
                              type="number"
                              onChange={(e) => {
                                const copyprvData = [...rowList];
                                copyprvData[index].recvQuantity = e.target.value;
                                setRowList(copyprvData);
                              }}
                              name="recvQuantity"
                              min="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
