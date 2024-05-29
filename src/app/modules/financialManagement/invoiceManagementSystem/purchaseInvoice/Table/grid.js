import React from "react";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
//import IEdit from "./../../../../_helper/_helperIcons/_edit";
import IView from "./../../../../_helper/_helperIcons/_view";
import Loading from "./../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import IClose from "../../../../_helper/_helperIcons/_close";
// import IConfirmModal from "./../../../../_helper/_confirmModal";
// import { postCancelInvoiceAction } from "../helper";

const GridData = ({
  rowDto,
  values,
  loading,
  setPositionHandler,
  paginationState,
  cb,
}) => {
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  let history = useHistory();

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // approveSubmitlHandler btn submit handler
  // const approveSubmitlHandler = (invoiceId) => {
  //   let confirmObject = {
  //     title: "Are you sure?",
  //     message: `Do you want to Inactive this Invoice`,
  //     yesAlertFunc: () => {
  //       postCancelInvoiceAction(invoiceId).then(()=>cb())
  //     },
  //     noAlertFunc: () => { },
  //   };
  //   IConfirmModal(confirmObject);
  // };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal my-2">
        <div className="col-lg-12">
          <PaginationSearch
            placeholder="Bill or PO No. Search"
            paginationSearchHandler={paginationSearchHandler}
          />
        </div>
        <div className="col-lg-12">
          {/* {rowDto?.length > 0 && ( */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>SL</th>
                  <th style={{ width: "30px" }}>Invoice Code</th>
                  <th style={{ width: "30px" }}>Invoice Date</th>
                  <th style={{ width: "30px" }}>Bill No</th>
                  <th style={{ width: "30px" }}>Bill Date</th>
                  <th style={{ width: "30px" }}>Invoice Amount</th>
                  <th style={{ width: "30px" }}>Payment Due Date</th>
                  <th style={{ width: "30px" }}>PO No</th>
                  <th style={{ width: "30px" }}>Supplier</th>
                  <th style={{ width: "30px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.data?.length > 0 &&
                  rowDto?.data?.map((item, index) => (
                    <tr>
                      <td> {item.sl}</td>
                      <td>
                        <div className="pl-2">{item?.supplierInvoiceCode}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {item?.transactionDate
                            ? _dateFormatter(item?.transactionDate)
                            : "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.billNumber}</div>
                      </td>
                      <td>
                        {" "}
                        <div className="text-right pr-2">
                          {item?.billDate
                            ? _dateFormatter(item?.billDate)
                            : "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item.grossInvoiceAmount}</div>
                      </td>
                      <td>
                        {" "}
                        <div className="text-right pr-2">
                          {item?.paymentDueDate
                            ? _dateFormatter(item?.paymentDueDate)
                            : "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.purchaseOrderNo}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item.businessPartneName}</div>
                      </td>
                      <td className="text-center">
                        {" "}
                        <div className="d-flex justify-content-center">
                          {/* <span
                        onClick={() =>
                          history.push({
                            pathname: `/financial-management/invoicemanagement-system/purchaseinvoice/edit/${item?.supplierInvoiceId}`,
                            state: {
                              selectSBU: values.sbu,
                              selectpurchaseOrg: values.purchaseOrg,
                              selectplant: values.plant,
                              selectwarehouse: values.warehouse,
                            },
                          })
                        }
                        className="mr-2"
                      >
                        <IEdit />
                      </span> */}
                          {/* <span className="mr-2">
                        <IClose
                          title="In Active"
                          closer={() => approveSubmitlHandler(item?.supplierInvoiceId)}
                        />
                      </span> */}
                          <span>
                            <IView
                              clickHandler={() =>
                                history.push({
                                  pathname: `/financial-management/invoicemanagement-system/purchaseinvoice/view/${item?.supplierInvoiceId}`,
                                  state: {
                                    selectSBU: values.sbu,
                                    selectpurchaseOrg: values.purchaseOrg,
                                    selectplant: values.plant,
                                    selectwarehouse: values.warehouse,
                                  },
                                })
                              }
                              classes="display-5"
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
          {/* )} */}
        </div>
      </div>
      {/* Table End */}
    </>
  );
};

export default withRouter(GridData);
