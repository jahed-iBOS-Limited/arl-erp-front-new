import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import IClose from "../../../_helper/_helperIcons/_close";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import ICon from "../../../chartering/_chartinghelper/icons/_icon";
import IView from "./../../../_helper/_helperIcons/_view";
import Loading from "./../../../_helper/_loading";
import { useCementInvoicePrintHandler } from "./Form/formHandlerBluePill";
import CommercialInvoiceReport from "./ReportModal/reportModal";
import { cancelSalesInvoice, getInvoiceDataForPrint } from "./helper";
import InvoiceReceptForCement from "./invoiceCement/invoiceRecept";

const SalesInvoiceGridData = ({
  rowDto,
  loading,
  setLoading,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  values,
  accId,
  buId,
  setPositionHandler,
  getGridData,
}) => {
  const [isModalShow, setModalShow] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);

  const history = useHistory();

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          {[175, 186, 4, 94, 8, 138].includes(buId) ? (
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
                            {buId === 4 && (
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
                            )}
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                cancelSalesInvoice(
                                  accId,
                                  buId,
                                  tableData?.intSalesInvoiceId,
                                  setLoading,
                                  () => {
                                    getGridData(values, pageNo, pageSize);
                                  }
                                );
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
          ) : (
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "80px" }}>Inv No</th>
                  <th style={{ width: "80px" }}>Inv Date</th>
                  <th style={{ width: "100px" }}>DO No</th>
                  <th style={{ width: "100px" }}>Purchase Order No</th>
                  {/* <th>Invoice Amount</th> */}
                  <th style={{ width: "80px" }}>Total Amount</th>
                  <th style={{ width: "80px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.data?.map((tableData, index) => (
                  <tr key={index}>
                    <td className="text-center"> {tableData?.sl} </td>
                    <td> {tableData?.invoiceCode} </td>
                    <td>{_dateFormatter(tableData?.invoiceDate)}</td>
                    <td> {tableData?.doNo} </td>
                    <td>{tableData?.purchaseOrderNo}</td>
                    {/* <td  className="text-right">{_fixedPoint(tableData?.invoiceAmount || 0)}</td> */}
                    <td className="text-right"> {tableData?.totalAmount} </td>
                    <td className="text-center">
                      {/* <span > */}
                      <div className="d-flex justify-content-around align-items-center">
                        <IView
                          //classes="text-muted"
                          clickHandler={() => {
                            history.push({ invoiceId: tableData?.invoiceId });
                            setModalShow(true);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
      </div>
    </>
  );
};

export default SalesInvoiceGridData;
