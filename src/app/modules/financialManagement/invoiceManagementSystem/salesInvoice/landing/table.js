import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useCementInvoicePrintHandler } from "../Form/formHandlerBluePill";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { cancelSalesInvoice, getInvoiceDataForPrint } from "../helper";
import IClose from "../../../../_helper/_helperIcons/_close";
import PaginationTable from "../../../../_helper/_tablePagination";
import InvoiceReceptForCement from "../invoiceCement/invoiceRecept";
import IViewModal from "../../../../_helper/_viewModal";
import CommercialInvoiceReport from "../ReportModal/reportModal";
import CancelModal from "./cancleModal";

const SalesInvoiceLandingTable = ({ obj }) => {
  const {
    buId,
    accId,
    rowDto,
    values,
    pageNo,
    loading,
    pageSize,
    setPageNo,
    permitted,
    setLoading,
    setPageSize,
    getGridData,
    setPositionHandler,
  } = obj;

  const [isModalShow, setModalShow] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const[isCancelModalShow, setIsCancelModalShow] = useState(false);
  const [singleRowItem, setSingleRowItem] = useState(null);

  const history = useHistory();

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered global-table table-font-size-sm">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>SL</th>
                {values?.status?.value === 1 && (
                  <>
                    {" "}
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                  </>
                )}
                {/* {values?.type?.value !== 2 && <th>Challan Date</th>}
                  {values?.type?.value !== 2 && <th>Challan No</th>} */}
                <th>Partner Name</th>
                {values?.status?.value === 1 && (
                  <>
                    {" "}
                    <th>Reference No </th>
                    <th>Project Location</th>
                  </>
                )}
                <th>Net Qty</th>
                <th>Invoice Amount</th>
                {values?.type?.value !== 2 && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td className="text-center"> {index + 1} </td>

                  {values?.status?.value === 1 && (
                    <>
                      {" "}
                      <td>{tableData?.strInvoiceNumber}</td>
                      <td>{_dateFormatter(tableData?.dteInvoiceDate)}</td>
                    </>
                  )}
                  {/* {values?.type?.value !== 2 && (
                      <td>{_dateFormatter(tableData?.dteChallanDate)}</td>
                    )}
                    {values?.type?.value !== 2 && (
                      <td>{tableData?.strDeliveryCode}</td>
                    )} */}
                  <td>{tableData?.strPartnerName}</td>
                  {values?.status?.value === 1 && (
                    <>
                      {" "}
                      <td>{tableData?.strRefference}</td>
                      <td>{tableData?.strProjectLocation}</td>
                    </>
                  )}
                  <td className="text-right">{tableData?.numQuantity}</td>
                  <td className="text-right">
                    {_fixedPoint(tableData?.invoiceAmount || 0)}
                  </td>
                  {values?.type?.value !== 2 && (
                    <td className="text-center">
                      {values?.status?.value === 1 ? (
                        <div className="d-flex justify-content-around">
                          <span>
                            <ICon
                              title={"Print Sales Invoice"}
                              onClick={() => {
                                if (
                                  values?.channel &&
                                  values?.channel?.value !== 0
                                ) {
                                  getInvoiceDataForPrint(
                                    tableData?.intUnitId,
                                    tableData?.strInvoiceNumber,
                                    tableData?.intPartnerId,
                                    setLoading,
                                    (resData) => {
                                      setInvoiceData(resData);
                                      handleInvoicePrintCement();
                                    }
                                  );
                                } else {
                                  toast.warn(
                                    "Please select a specific distribution channel."
                                  );
                                }
                              }}
                            >
                              <i class="fas fa-print"></i>
                            </ICon>
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              if (permitted) {
                                setIsCancelModalShow(true);
                                setSingleRowItem(tableData);
                              } else {
                                toast.warn(
                                  "Sorry, You are not permitted to cancel the sales invoice"
                                );
                              }
                            }}
                          >
                            <IClose title="Cancel Sales Invoice" />
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-info btn-sm"
                          onClick={() => {
                            history.push({
                              pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                              state: { ...values, ...tableData },
                            });
                          }}
                        >
                          Create
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{
                pageNo,
                setPageNo,
                pageSize,
                setPageSize,
              }}
              values={values}
              rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
            />
          )}
        </div>

        <InvoiceReceptForCement
          printRef={printRefCement}
          invoiceData={invoiceData}
          // channelId={46}
          channelId={values?.channel?.value}
        />

        <>
          <IViewModal
            show={isModalShow}
            onHide={() => {
              setModalShow(false);
            }}
          >
            <CommercialInvoiceReport setLoading={setLoading} />
          </IViewModal>
        </>
        <>
          <IViewModal
            show={isCancelModalShow}
            onHide={() => {
              setIsCancelModalShow(false);
            }}
          >
            <CancelModal parentValues={values} singleRowItem={singleRowItem} setSingleRowItem={setSingleRowItem} setIsCancelModalShow={setIsCancelModalShow} additionalInfo={{accId, buId, getGridData, pageNo, pageSize, setLoading}} />
          </IViewModal>
        </>
      </div>
    </>
  );
};

export default SalesInvoiceLandingTable;
