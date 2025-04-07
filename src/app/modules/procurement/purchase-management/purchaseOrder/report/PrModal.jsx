import { Form as FormikForm, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import * as Yup from 'yup';
import ICustomCard from '../../../../_helper/_customCard';
import iMarineIcon from '../../../../_helper/images/imageakijpoly.png';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IViewModal from '../../../../_helper/_viewModal';
import Loading from '../../../../_helper/loader/_loader';
import { APIUrl } from '../../../../../../App';
import './salaryAdvice.css';
import ViewForm from './viewForm2';
import { getReportListPurchaseReq } from './prModalHelper';

let imageObj = {
  8: iMarineIcon,
};

const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, dont change existing props name
export function PrModal({ prId }) {
  const [loading, setLoading] = useState(false);
  const [purchaseReport, setPurchaseReport] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getReportListPurchaseReq(
      prId,
      selectedBusinessUnit?.value,
      setPurchaseReport
    );
  }, [prId, selectedBusinessUnit]);

  const printRef = useRef();
  const history = useHistory();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in  !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
              content={() => printRef.current}
            />
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => (
                <button className="btn btn-primary ml-2">PDF</button>
              )}
              content={() => printRef.current}
            />
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary ml-2"
              table="table-to-xlsx"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Excel"
            />
            <button
              type="button"
              onClick={() => {
                setIsShowModal(true);
                setSubject(
                  `Purchase Request No: ${purchaseReport?.getPurchaseRequestPrintHeader?.indendedNO}`
                );
                setMessage(`Dear
                        A Purchase request has been sent from  Purchase Request No: ${purchaseReport?.getPurchaseRequestPrintHeader?.indendedNO}
                        Please take the necessary action`);
              }}
              className="btn btn-primary back-btn ml-2"
            >
              Mail
            </button>
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className="">
                  <div ref={printRef} className="print_wrapper">
                    <div className="m-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex justify-content-center align-items-center">
                            <div
                              style={{
                                position: 'absolute',
                                left: '40px',
                              }}
                            >
                              <img
                                style={{ width: '80px' }}
                                src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-2">
                          <h3>
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.businessUnitName
                            }
                          </h3>
                          <h6>
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.businessUnitAddress
                            }
                          </h6>
                          <h4>Purchase Request</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className="my-3 d-flex justify-content-between">
                        <div>
                          Request Code:
                          <span className="font-weight-bold mr-2">
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.indendedNO
                            }
                          </span>{' '}
                          Purchase Request Type:
                          <span className="font-weight-bold mr-2">
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.indentType
                            }
                          </span>
                          Status:
                          <span className="font-weight-bold mr-2">
                            {purchaseReport?.getPurchaseRequestPrintHeader
                              ?.isApproved
                              ? 'Approved'
                              : 'Pending'}
                          </span>
                          <div>
                            Purpose:
                            <span className="font-weight-bold mr-2">
                              {
                                purchaseReport?.getPurchaseRequestPrintHeader
                                  ?.purpose
                              }
                            </span>
                          </div>
                        </div>
                        <div>
                          <div>
                            Request Date:
                            <span className="font-weight-bold mr-2">
                              {_dateFormatter(
                                purchaseReport?.getPurchaseRequestPrintHeader
                                  ?.indentDate
                              )}
                            </span>
                          </div>
                          <div>
                            Required Date:
                            <sapn className="font-weight-bold mr-2">
                              {_dateFormatter(
                                purchaseReport?.getPurchaseRequestPrintHeader
                                  ?.requiredDate
                              )}
                            </sapn>
                          </div>
                        </div>
                      </div>
                      <table
                        className="table table-striped table-bordered global-table"
                        id="table-to-xlsx"
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th style={{ width: '260px' }}>
                              Purchase Description
                            </th>
                            <th>Uom</th>
                            <th>Quantity</th>
                            <th>Current Stock</th>
                            <th>Last Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseReport?.getPurchaseRequestPrintRow?.map(
                            (data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td>{data?.itemCode}</td>
                                <td>{data?.itemName}</td>
                                <td>{data?.remarks}</td>
                                <td>{data?.uoMname}</td>
                                <td className="text-right">
                                  {data?.numRequestQuantity}
                                </td>
                                <td className="text-right">
                                  {data?.currentStock}
                                </td>
                                <td className="text-right">
                                  {data?.lastPrice}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="mt-3">
                        <div className="d-flex">
                          <p>Request By:</p>
                          <p className="font-weight-bold ml-2">
                            {
                              purchaseReport?.getPurchaseRequestPrintHeader
                                ?.indentByName
                            }
                            {purchaseReport?.getPurchaseRequestPrintHeader
                              ?.dateTime && (
                              <>
                                {' '}
                                [
                                {_dateFormatter(
                                  purchaseReport?.getPurchaseRequestPrintHeader
                                    ?.dateTime
                                )}{' '}
                                {purchaseReport?.getPurchaseRequestPrintHeader?.dateTime
                                  .split('T')[1]
                                  .slice(0, 5)}{' '}
                                {+purchaseReport?.getPurchaseRequestPrintHeader?.dateTime
                                  .split('T')[1]
                                  .slice(0, 2) <= 12
                                  ? 'AM'
                                  : 'PM'}
                                ]{' '}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p>
                          Approved By:{' '}
                          <span className="font-weight-bold">
                            {' '}
                            Approve By Sequence{' '}
                            {purchaseReport?.getPurchaseRequestPrintHeader
                              ?.approvedDateTime && (
                              <>
                                {' '}
                                [
                                {_dateFormatter(
                                  purchaseReport?.getPurchaseRequestPrintHeader
                                    ?.approvedDateTime
                                )}
                                {purchaseReport?.getPurchaseRequestPrintHeader?.approvedDateTime
                                  .split('T')[1]
                                  .slice(0, 5) + 6}
                                {+purchaseReport?.getPurchaseRequestPrintHeader?.approvedDateTime
                                  .split('T')[1]
                                  .slice(0, 2) <= 12
                                  ? 'AM'
                                  : 'PM'}
                                ]{' '}
                              </>
                            )}
                          </span>{' '}
                        </p>

                        <table
                          className="table global-table"
                          id="table-to-xlsx"
                          style={{ margintop: '-10px !important' }}
                        >
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>User Name</th>
                              <th>Group Name</th>
                              <th>Any User</th>
                              <th>Sequence ID</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {purchaseReport?.objEmpListDTO?.map((data, i) => (
                              <tr>
                                <td className="text-center">{i + 1}</td>
                                <td>{data?.userNameDesignationName}</td>
                                <td>{data?.groupName}</td>
                                <td className="text-center">{data?.anyUser}</td>
                                <td className="text-center">
                                  {data?.sequenceId}
                                </td>
                                <td>
                                  {data?.isApprove ? 'Approved' : 'Pending'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div>
                    <IViewModal
                      title="Send Email"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      {/* <ViewForm
                        subject={subject}
                        setSubject={setSubject}
                        message={message}
                        setMessage={setMessage}
                      /> */}
                    </IViewModal>
                  </div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
