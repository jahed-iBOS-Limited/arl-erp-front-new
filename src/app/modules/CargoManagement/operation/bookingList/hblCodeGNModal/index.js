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
  marks: `<p>Style No.</p>
  <p>Short Name Size</p>
  <p>Colour/Aty</p>
  <p>Qty Per Carton</p>`,
  chargeableRate: '',
  weightChargePrepaid: `<p>As Agreed</p>`,
  weightChargeCollect: '<p>As Agreed</p>',
  valuationChargePrepaid: '<p>As Agreed</p>',
  valuationChargeCollect: '<p>As Agreed</p>',
  taxCollect: '<p>As Agreed</p>',
  taxPrepaid: '<p>As Agreed</p>',
  totOtherChargesDagentPrepaid: '<p>As Agreed</p>',
  totOtherChargesDagentCollect: '<p>As Agreed</p>',
  totOtherChargesDcarrierPrepaid: '<p>As Agreed</p>',
  totOtherChargesDcarrierCollect: '<p>As Agreed</p>',
  totOtherChargesDcarrierPrepaid2: '<p>As Agreed</p>',
  totOtherChargesDcarrierCollect2: '<p>As Agreed</p>',
};
function HBLCodeGNModal({ CB, rowClickData, isEPBInvoice }) {
  const [isWaiting, setIsWaiting] = useState(true);
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [isInvoiceValueChange, setIsInvoiceValueChange] = React.useState(false);
  const [intialHtmlContent, setIntialHtmlContent] = useState({});
  const [htmlContent, setHtmlContent] = useState({});
  const [
    ,
    SaveWayBillReportData,
    SaveWayBillReportDataLoading,
  ] = useAxiosPost();
  const saveHandler = (values) => {
    let payload = {
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
      marks: '',
      isActive: true,
      createdAt: new Date(),
    };

    if (rowClickData?.modeOfTransport !== 'Air') {
      payload = {
        ...payload,
        marks: htmlContent?.marks || '',
      };
    }
    if (rowClickData?.modeOfTransport === 'Air') {
      payload = {
        ...payload,
        chargeableRate: htmlContent?.chargeableRate || '',
        weightChargePrepaid: htmlContent?.weightChargePrepaid || '',
        weightChargeCollect: htmlContent?.weightChargeCollect || '',
        valuationChargePrepaid: htmlContent?.valuationChargePrepaid || '',
        valuationChargeCollect: htmlContent?.valuationChargeCollect || '',
        taxPrepaid: htmlContent?.taxPrepaid || '',
        taxCollect: htmlContent?.taxCollect || '',
        totOtherChargesDagentPrepaid:
          htmlContent?.totOtherChargesDagentPrepaid || '',
        totOtherChargesDagentCollect:
          htmlContent?.totOtherChargesDagentCollect || '',
        totOtherChargesDcarrierPrepaid:
          htmlContent?.totOtherChargesDcarrierPrepaid || '',
        totOtherChargesDcarrierCollect:
          htmlContent?.totOtherChargesDcarrierCollect || '',
        totOtherChargesDcarrierPrepaid2:
          htmlContent?.totOtherChargesDcarrierPrepaid2 || '',
        totOtherChargesDcarrierCollect2:
          htmlContent?.totOtherChargesDcarrierCollect2 || '',
        totalPrepaid: htmlContent?.totalPrepaid || '',
        totalCollect: htmlContent?.totalCollect || '',
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
          const obj = {
            marks: resData?.saveWaybillData?.marks || initObj.marks || '',
          };
          setIntialHtmlContent({
            obj,
          });
          setHtmlContent({
            obj,
          });
        }

        if (rowClickData?.modeOfTransport === 'Air') {
          const isPrepaid = ['cif', 'cpt', 'cfr'].includes(resData?.incoterms);
          const isCollect = !['cif', 'cpt', 'cfr'].includes(resData?.incoterms);
          const obj2 = {
            hawbNumber:
              resData?.saveWaybillData?.hawbNumber || initObj.hawbNumber || '',
            chargeableRate:
              resData?.saveWaybillData?.chargeableRate ||
              initObj.chargeableRate ||
              '',
            weightChargePrepaid: isPrepaid
              ? resData?.saveWaybillData?.weightChargePrepaid ||
                initObj.weightChargePrepaid ||
                ''
              : '',
            weightChargeCollect: isCollect
              ? resData?.saveWaybillData?.weightChargeCollect ||
                initObj.weightChargeCollect ||
                ''
              : '',
            valuationChargePrepaid: isPrepaid
              ? resData?.saveWaybillData?.valuationChargePrepaid ||
                initObj.valuationChargePrepaid ||
                ''
              : '',
            valuationChargeCollect: isCollect
              ? resData?.saveWaybillData?.valuationChargeCollect ||
                initObj.valuationChargeCollect ||
                ''
              : '',
            taxPrepaid: isPrepaid
              ? resData?.saveWaybillData?.taxPrepaid || initObj.taxPrepaid || ''
              : '',
            taxCollect: isCollect
              ? resData?.saveWaybillData?.taxCollect || initObj.taxCollect || ''
              : '',
            totOtherChargesDagentPrepaid: isPrepaid
              ? resData?.saveWaybillData?.totOtherChargesDagentPrepaid ||
                initObj.totOtherChargesDagentPrepaid ||
                ''
              : '',
            totOtherChargesDagentCollect: isCollect
              ? resData?.saveWaybillData?.totOtherChargesDagentCollect ||
                initObj.totOtherChargesDagentCollect ||
                ''
              : '',
            totOtherChargesDcarrierPrepaid: isPrepaid
              ? resData?.saveWaybillData?.totOtherChargesDcarrierPrepaid ||
                initObj.totOtherChargesDcarrierPrepaid ||
                ''
              : '',
            totOtherChargesDcarrierCollect: isCollect
              ? resData?.saveWaybillData?.totOtherChargesDcarrierCollect ||
                initObj.totOtherChargesDcarrierCollect ||
                ''
              : '',
            totOtherChargesDcarrierPrepaid2: isPrepaid
              ? resData?.saveWaybillData?.totOtherChargesDcarrierPrepaid2 ||
                initObj.totOtherChargesDcarrierPrepaid2 ||
                ''
              : '',
            totOtherChargesDcarrierCollect2: isCollect
              ? resData?.saveWaybillData?.totOtherChargesDcarrierCollect2 ||
                initObj.totOtherChargesDcarrierCollect2 ||
                ''
              : '',
            totalPrepaid: isPrepaid
              ? resData?.saveWaybillData?.totalPrepaid ||
                initObj.totalPrepaid ||
                ''
              : '',
            totalCollect: isCollect
              ? resData?.saveWaybillData?.totalCollect ||
                initObj.totalCollect ||
                ''
              : '',
          };
          setIntialHtmlContent(obj2);
          setHtmlContent(obj2);
        }
        setIsWaiting(false);
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

  useEffect(() => {}, []);
  const changeHandelar = ({ key, value }) => {
    if (isWaiting) return;
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
                  htmlContent={htmlContent}
                  changeHandelar={changeHandelar}
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
