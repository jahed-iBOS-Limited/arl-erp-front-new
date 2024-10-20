import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import BookingDetailsInfo from "../bookingDetails/bookingDetailsInfo";
import "./style.css";
const validationSchema = Yup.object().shape({
  recvQuantity: Yup.number().required("Receive Quantity is required"),
  wareHouse: Yup.object().shape({
    value: Yup.string().required("Warehouse is required"),
    label: Yup.string().required("Warehouse is required"),
  }),
});
function ReceiveModal({ rowClickData, CB }) {
  const [
    warehouseDDL,
    getWarehouseDDL,
  ] = useAxiosGet();
  const [, getRecvQuantity, recvQuantityLoading] = useAxiosPut();
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
          const bookingData = data?.[0] || {};
          const packagingQuantity = bookingData?.rowsData?.reduce(
            (acc, item) => {
              return acc + (+item.packagingQuantity || 0);
            },
            0
          );

          if (formikRef.current) {
            formikRef.current.setFieldValue("recvQuantity", packagingQuantity);
          }
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const saveHandler = (values, resetForm) => {
    const paylaod = {
      updthd: {
        bookingId: bookingRequestId,
        warehouseId: values?.wareHouse?.value || 0,
        warehouseName: values?.wareHouse?.label || "",
      },
      updtrow: [
        {
          bookingId: bookingRequestId,
          bookingRowId: 0,
          receivedQuantity: values.recvQuantity || 0,
        },
      ],
    };
    getRecvQuantity(
      `${imarineBaseUrl}/domain/ShippingService/createReceiveProcess`,
      paylaod,
      () => {
        CB();
      }
    );
  };

  const bookingData = shipBookingRequestGetById?.[0] || {};

  useEffect(() => {
    getWarehouseDDL(
      `/wms/Warehouse/GetWarehouseFromPlantWarehouseDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="confirmModal">
      {(shipBookingRequestLoading || recvQuantityLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          recvQuantity: "",
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
                        setFieldValue("wareHouse", valueOption);
                      } else {
                        setFieldValue("wareHouse", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.recvQuantity}
                    label="Receive Quantity"
                    name="recvQuantity"
                    placeholder="Receive Quantity"
                  />
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
