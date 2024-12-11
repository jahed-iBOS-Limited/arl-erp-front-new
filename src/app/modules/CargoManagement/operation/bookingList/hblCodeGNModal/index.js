import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { HBLFormatInvoice } from '../HBLFormat';
import HAWBFormat from '../HBLFormat/HAWBFormat';
import './style.css';
const validationSchema = Yup.object().shape({
  // date: Yup.date().required("Date is required"),
});
const initObj = {
  marksAndNumbersContainerSealNumbers: `<p>Style No.</p>
  <p>Short Name Size</p>
  <p>Colour/Aty</p>
  <p>Qty Per Carton</p>`,
};
function HBLCodeGNModal({ CB, rowClickData, isEPBInvoice }) {
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [isInvoiceValueChange, setIsInvoiceValueChange] = React.useState(false);
  const [intialHtmlContent, setIntialHtmlContent] = useState(
    JSON.parse(JSON.stringify(initObj)),
  );
  const [htmlContent, setHtmlContent] = useState(
    JSON.parse(JSON.stringify(initObj)),
  );
  const [
    ,
    SaveWayBillReportData,
    SaveWayBillReportDataLoading,
  ] = useAxiosPost();
  const saveHandler = (values) => {
    let payload = undefined;
    if (rowClickData?.modeOfTransport !== 'Air') {
      payload = {
        waybillId: 0,
        bookingId: bookingRequestId,
        hawbNumber: '',
        chargeableRate: '',
        weightChargePrepaid: '',
        weightChargeCollect: '',
        valuationChargePrepaid: '',
        valuationChargeCollect: '',
        taxPrepaid: '',
        taxCollect: '',
        totOtherChargesDagentPrepaid: '',
        totOtherChargesDagentCollect: '',
        totOtherChargesDcarrierPrepaid: '',
        totOtherChargesDcarrierCollect: '',
        totalPrepaid: '',
        totalCollect: '',
        marks: htmlContent?.marksAndNumbersContainerSealNumbers || '',
        isActive: true,
        createdAt: new Date(),
      };
    }
    SaveWayBillReportData(
      `${imarineBaseUrl}/domain/ShippingService/SaveWayBillReportData`,
      payload,
      () => {
        CB();
        commonGetByIdHandler();
        setIsInvoiceValueChange(false);
      },
    );
  };

  const commonGetByIdHandler = () => {
    setShipBookingRequestGetById(
      `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
      (resData) => {
        if (rowClickData?.modeOfTransport !== 'Air') {
          setIntialHtmlContent({
            marksAndNumbersContainerSealNumbers:
              resData?.saveWaybillData?.marks,
          });
          setHtmlContent({
            marksAndNumbersContainerSealNumbers:
              resData?.saveWaybillData?.marks,
          });
        }
      },
    );
  };
  useEffect(() => {
    if (bookingRequestId) {
      commonGetByIdHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  const bookingData = shipBookingRequestGetById || {};

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `HBL-${bookingData?.hblnumber || ''}`,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;

        }
        @page {
          size: portrait !important;
          margin: 50px 30px 30px 30px !important;
        }
      }
    `,
  });
  const changeHandelar = ({ key, value }) => {
    const updateHtml = {
      ...htmlContent,
      [key]: value,
    };
    setHtmlContent(updateHtml);
    const intialHtmlContentJson = JSON.stringify(intialHtmlContent || {});
    const htmlContentJson = JSON.stringify(updateHtml || {});
    if (intialHtmlContentJson !== htmlContentJson) {
      setIsInvoiceValueChange(true);
    } else {
      setIsInvoiceValueChange(false);
    }
  };

  return (
    <div className="hblCodeGNModal">
      {(SaveWayBillReportDataLoading || shipBookingRequestLoading) && (
        <Loading />
      )}
      <Formik
        enableReinitialize={true}
        initialValues={{
          date: '',
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
                  {isInvoiceValueChange ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          saveHandler();
                        }}
                      >
                        save
                      </button>
                    </>
                  ) : (
                    <>
                      {' '}
                      <button
                        onClick={handlePrint}
                        type="button"
                        className="btn btn-primary px-3 py-2"
                      >
                        <i
                          className="mr-1 fa fa-print pointer"
                          aria-hidden="true"
                        ></i>
                        Print
                      </button>
                    </>
                  )}
                </div>
              </div>
              {rowClickData?.modeOfTransport === 'Air' && (
                <HAWBFormat
                  bookingData={bookingData}
                  componentRef={componentRef}
                  isEPBInvoice={isEPBInvoice}
                />
              )}

              {rowClickData?.modeOfTransport !== 'Air' && (
                <HBLFormatInvoice
                  componentRef={componentRef}
                  bookingData={bookingData}
                  htmlContent={htmlContent}
                  changeHandelar={changeHandelar}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default HBLCodeGNModal;
