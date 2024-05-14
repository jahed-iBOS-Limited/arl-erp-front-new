/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form as FormikForm } from "formik";
import ReactToPrint from "react-to-print";
import Loading from "./../../../../_helper/loader/_loader";
import { getReportForInvReq, getReportForInvReqInternal, getReportForInvReqW2w } from "../../../../inventoryManagement/warehouseManagement/invTransaction/helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomCard from "../../../../_helper/_customCard";
import iMarineIcon from "../../../../_helper/images/imageakijpoly.png";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../../../../inventoryManagement/warehouseManagement/invTransaction/attachmentView/viewForm";

let imageObj = {
  8: iMarineIcon,
};

export function FairPriceReportViewTableRow({ Invid, grId, itemInfo, purchaseOrder }) {
  const [loading, setLoading] = useState(false);
  const [itemReqReport, setiIemReqReport] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [poData, setPOData] = useState(false);

  const {selectedBusinessUnit} = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (+grId === 4) {
      getReportForInvReqW2w(Invid, setiIemReqReport);
    } else if (+grId === 9) {
      getReportForInvReqInternal(Invid, setiIemReqReport);
    } else {
      getReportForInvReq(Invid, selectedBusinessUnit?.value, setiIemReqReport);
    }

  }, [Invid, grId, selectedBusinessUnit]);

  const printRef = useRef();

  let totalAmount = itemReqReport?.objRow?.reduce((total, data) => total + Math.abs(data?.monTransactionValue), 0)

  console.log(purchaseOrder)

  return (
    <>
      <ICustomCard
        title=''
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle='@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className='btn btn-primary'>
                  {/* <img
                            style={{ width: "25px", paddingRight: "5px" }}
                            src={printIcon}
                            alt="print-icon"
                          /> */}
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
            <ReactToPrint
              pageStyle='@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }'
              trigger={() => (
                <button className='btn btn-primary ml-2'>PDF</button>
              )}
              content={() => printRef.current}
            />
            <ReactHTMLTableToExcel
              id='test-table-xls-button'
              className='download-table-xls-button btn btn-primary ml-2'
              table='table-to-xlsx'
              filename='tablexls'
              sheet='tablexls'
              buttonText='Excel'
            />
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting, resetForm }) => { }}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              {loading && <Loading />}
              <FormikForm>
                <div className=''>
                  <div ref={printRef} className='print_wrapper'>
                    <div className='m-3'>
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <div className='d-flex justify-content-center align-items-center'>
                            {selectedBusinessUnit.value === 8 && (
                              <img
                                style={{ width: "150px", height: "100px" }}
                                class=''
                                src={imageObj[selectedBusinessUnit?.value]}
                                alt='img'
                              />
                            )}
                            {/* imageObj[selectedBusinessUnit?.value] */}
                          </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-center mt-2'>
                          <h3>
                            {
                              itemReqReport?.objHeader
                                ?.businessUnitName
                            }
                          </h3>
                          <h6>
                            {
                              itemReqReport?.objHeader
                                ?.businessUnitAddress
                            }
                          </h6>
                          <h4>Inventory Transaction</h4>
                        </div>
                        <div></div>
                      </div>
                      <div className='my-3'>
                        Challan No:
                        {/* Transaction Code: */}
                        <span className='font-weight-bold mr-2 ml-1'>
                          {
                            itemReqReport?.objHeader
                              ?.inventoryTransactionCode
                          }
                        </span>{" "}
                        GRn Date:
                        <span className='font-weight-bold mr-2 ml-1'>
                          {
                            _dateFormatter(itemReqReport?.objHeader
                              ?.transectionDate)
                          }
                        </span>{" "}
                        Transaction Group Name:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          Inventory
                        </sapn>

                        {/* Transaction Type Name:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {itemReqReport?.objHeader
                            ?.transactionTypeName}
                        </sapn>
                        Reference Type Name:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {itemReqReport?.objHeader
                            ?.referenceTypeName}
                        </sapn> */}
                      </div>
                      <div className='my-3'>
                        Reference Code:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {purchaseOrder?.purchaseOrderCode ? purchaseOrder?.purchaseOrderCode : "NA"}
                        </sapn>
                        Business Partner Name:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {purchaseOrder?.supplierName ? purchaseOrder?.supplierName : "NA"}
                        </sapn>
                      </div>
                      <div className='my-3'>
                        Comments:
                        <sapn className='font-weight-bold mr-2 ml-1'>
                          {itemReqReport?.objHeader
                            ?.comments ? itemReqReport?.objHeader
                            ?.comments : "NA"}
                        </sapn>
                        <>
                          Attachment
                          <sapn className="font-weight-bold mr-2 ml-1">
                            <IView
                              title="Attachment"
                              clickHandler={() => {
                                setPOData({
                                  inventoryTransactionId:
                                    itemReqReport?.objHeader
                                      ?.inventoryTransactionId,
                                      inventoryTransactionCode : itemReqReport?.objHeader
                                      ?.inventoryTransactionCode
                                });
                                setIsShowModal(true)
                              }}
                            />
                          </sapn>
                        </>
                        <div className="text-right">
                          <b>Total Amount : </b> {((+itemReqReport?.objHeader
                              ?.vatAmount || 0) + (+totalAmount || 0)).toFixed(4)}
                        </div>
                      </div>
                      <div className="table-responsive">
                      <table
                        className='table table-striped table-bordered global-table'
                        id='table-to-xlsx'
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Uom</th>
                            <th>Location</th>
                            <th>Bin Number</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>

                          {itemInfo?.map(
                            (data, i) => (
                              <tr>
                                <td className='text-center'>{i + 1}</td>
                                <td>{data?.itemCode}</td>
                                <td>{data?.itemName}</td>
                                <td>{data?.uoMName}</td>
                                <td
                                  style={{ width: "150px" }}
                                >{data?.inventoryLocationName}</td>
                                <td
                                  style={{ width: "150px" }}
                                >{data?.binNumber}</td>
                                <td className='text-right'>
                                  {data?.itemQuantity}
                                </td>
                              </tr>
                            )
                          )}
                          {/* <tr>
                            <td colspan="6" className="font-weight-bold">
                              Total
                            </td>
                            <td className='text-right'>
                              {totalAmount?.toFixed(4)}
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                      </div>
                      <div className='mt-3'>
                        <div className='d-flex'>
                          <p>Request By:</p>
                          <p className='font-weight-bold ml-2'>
                            {
                              itemReqReport?.objHeader
                                ?.actionByNameDesignationDept
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                  <IViewModal
                      title="Attachment"
                      show={isShowModal}
                      onHide={() => setIsShowModal(false)}
                    >
                      <ViewForm
                        poData={poData}
                        setIsShowModal={setIsShowModal}
                      />
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
