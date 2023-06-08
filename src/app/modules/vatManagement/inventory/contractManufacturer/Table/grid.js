import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import { getContractManufactureById_api } from "../helper";
import ReportBody from "../landing/reportBody";
import Loading from "./../../../../_helper/_loading";

const GridData = ({
  history,
  rowDto,
  loading,
  values,
  gridDataFunc,
  pageSize,
  pageNo,
  setRowDto,
}) => {
  const [modalShow, setModelShow] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [tableRowData, setTableRowData] = useState("");
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          {/* <PaginationSearch
            placeholder=""
            paginationSearchHandler={paginationSearchHandler}
          /> */}
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>SL</th>
                <th style={{ width: "100px" }}>Supplier Name</th>
                <th style={{ width: "50px" }}>Transaction Date</th>
                <th style={{ width: "20px" }}>Quantity</th>
                <th style={{ width: "20px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td> {index + 1} </td>
                  <td>
                    {" "}
                    {tableData.supplierName ||
                      tableData?.soldtoPartnerName}{" "}
                  </td>
                  <td className="text-center">
                    {" "}
                    {_dateFormatter(
                      tableData.purchaseDateTime || tableData?.deliveryDateTime
                    )}{" "}
                  </td>
                  <td className="text-center">
                    {" "}
                    {_fixedPointVat(tableData.quantity, 3)}{" "}
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span className="view">
                        <IView
                          clickHandler={() => {
                            setModelShow(true);
                            setTableRowData(tableData);
                            getContractManufactureById_api(
                              tableData.taxPurchaseId || tableData?.taxSalesId,
                              tableData?.typeId,
                              setSingleData
                            );
                          }}
                        />
                      </span>
                      {!tableData?.isPrinteed && (
                        <span
                          className="edit"
                          onClick={() => {
                            history.push({
                              pathname: `/mngVat/inventory/conmanufacturer/edit/${tableData.taxPurchaseId ||
                                tableData?.taxSalesId}`,
                              state: { ...tableData, ...values },
                            });
                          }}
                        >
                          <IEdit />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <IViewModal
        show={modalShow}
        onHide={() => {
          gridDataFunc(
            values?.branch?.value,
            values?.fromDate,
            values?.toDate,
            pageNo,
            pageSize,
            values?.type?.value,
            setRowDto
          );
          setModelShow(false);
          setSingleData([]);
        }}
        title={"View Contact Manufacturing"}
        btnText="Close"
      >
        <ReportBody singleData={singleData} tableRowData={tableRowData} />
      </IViewModal>
    </>
  );
};

export default withRouter(GridData);
