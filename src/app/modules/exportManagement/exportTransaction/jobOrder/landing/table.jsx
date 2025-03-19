import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import JobOrderView from "../../salesOrder/jobOrderView";

export const JobOrderLandingTable = ({ obj }) => {
  const {
    values,
    pageNo,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    setPositionHandler,
    paginationSearchHandler,
  } = obj;
  const history = useHistory();
  const [jobOrderViewModal, setJobOrderViewModal] = useState(false);
  const [salesQuotationId, setSalesQuotationId] = useState(null);

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mt-2">
            <PaginationSearch
              placeholder="Search by Quotation No or Party Name"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
            />
          </div>
        </div>
        <div className="col-lg-12">
         <div className="table-responsive">
         <table className="table table-striped table-bordered global-table sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "35px" }}>SL</th>
                <th style={{ width: "90px" }}>Quotation No</th>
                <th style={{ width: "90px" }}>Quotation Date</th>
                <th style={{ width: "90px" }}>Quotation closed Date</th>
                <th>Sales Organization</th>
                <th>Channel</th>
                <th>Party Name</th>
                <th style={{ width: "75px" }}>Total Qty</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.length > 0 &&
                rowData?.map((singleData, index) => (
                  <tr key={index}>
                    <td className="text-center"> {singleData.sl} </td>
                    <td>
                      <span className="pl-2">{singleData.quotationCode} </span>
                    </td>
                    <td className="text-center">
                      {_dateFormatter(singleData.quotationDate)}
                    </td>
                    <td className="text-center">
                      {_dateFormatter(singleData.quotationEndDate)}
                    </td>
                    <td> {singleData.salesOrganizationName} </td>
                    <td> {singleData.distributionChannelName} </td>
                    <td> {singleData.soldToPartnerName} </td>
                    <td className="text-right">
                      {" "}
                      {singleData.totalQuotationQty}{" "}
                    </td>
                    <td style={{ width: "50px" }}>
                      <div className="d-flex justify-content-around">
                        <span className="Job Order Entry">
                          <IEdit
                            title="Job Order Entry"
                            onClick={() => {
                              history.push({
                                pathname: `/managementExport/exptransaction/salesorder/jobOrder/${singleData?.quotationId}`,
                                state: singleData,
                              });
                            }}
                          />
                        </span>
                        <span className="view">
                          <IView
                            title={"View Job Order"}
                            clickHandler={() => {
                              setSalesQuotationId(singleData?.quotationId);
                              setJobOrderViewModal(true);
                            }}
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
         </div>

          <IViewModal
            title="View Job Order"
            show={jobOrderViewModal}
            onHide={() => {
              setJobOrderViewModal(false);
              setSalesQuotationId(null);
            }}
          >
            <JobOrderView salesQuotationId={salesQuotationId} />
          </IViewModal>
        </div>
        {rowData?.length > 0 && (
          <PaginationTable
            count={rowData?.length}
            setPositionHandler={setPositionHandler}
            paginationState={{
              pageNo,
              setPageNo,
              pageSize,
              setPageSize,
            }}
            values={values}
          />
        )}
      </div>
    </>
  );
};
