import React, { useState } from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "./../../../_helper/_loading";
import IView from "./../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import CommercialInvoiceReport from "./ReportModal/reportModal";
import PaginationTable from "../../../_helper/_tablePagination";
import { useHistory } from "react-router-dom";

const SalesInvoiceGridData = ({
  rowDto,
  loading,
  setLoading,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  values,
}) => {
  const [isModalShow, setModalShow] = useState(false);

  const history = useHistory();

  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table table-font-size-sm">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>SL</th>
                <th style={{ width: "80px" }}>Inv No</th>
                <th style={{ width: "80px" }}>Inv Date</th>
                <th style={{ width: "100px" }}>DO No</th>
                <th style={{ width: "100px" }}>Purchase Order No</th>
                <th style={{ width: "80px" }}>Total Amount</th>
                <th style={{ width: "80px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td className="text-center"> {tableData?.sl} </td>
                  <td className="text-center"> {tableData?.invoiceCode} </td>
                  <td className="text-center">
                    {_dateFormatter(tableData?.invoiceDate)}
                  </td>
                  <td className="text-center"> {tableData?.doNo} </td>
                  <td className="text-center">{tableData?.purchaseOrderNo}</td>
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
          </div>
        </div>
        {rowDto?.data?.length > 0 && (
          <PaginationTable
            count={rowDto?.totalCount}
            //   setPositionHandler={setPositionHandler}
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
