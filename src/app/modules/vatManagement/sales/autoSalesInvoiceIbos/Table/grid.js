import { debounce } from "lodash";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import PaginationSearch from "../../../../_helper/_search";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  GetTaxSalesInvoicePrintStatus_api,
  getSalesInvoiceById,
} from "../../createSales/helper";
import SalesInvoiceModel from "../../createSales/viewModal";
import IView from "./../../../../_helper/_helperIcons/_view";
import {
  AutoTaxCompleteApi,
  createAutoSalesInvoiceiBOSPrint_api
} from "./../helper";
const printBtnClick = debounce(
  ({
    printedObj,
    rowDto,
    tableData,
    profileData,
    selectedBusinessUnit,
    values,
    setTaxSalesInvoiceById,
    setModelShow,
    setRowDto,
    setLoading,
  }) => {
    setLoading(false);
    if (printedObj) {
      const modifyFilterRowDto = rowDto?.data?.filter(
        (itm) => itm?.deliveryId !== tableData?.deliveryId
      );
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessUnitName: selectedBusinessUnit?.label,
        taxBranchId: values?.branch?.value || 0,
        taxBranchName: values?.branch?.label || '',
        taxBranchAddress: values?.branch?.name || '',
        deliveryNo: tableData?.deliveryId || 0,
        deliveryAddress: tableData?.partnerName,
        vehicleNo: tableData?.vehicleNo || "",
        deliveryDate: _todayDate(),
        actionBy: profileData?.userId,
      };
      createAutoSalesInvoiceiBOSPrint_api(
        payload,
        setTaxSalesInvoiceById,
        setModelShow,
        modifyFilterRowDto,
        setRowDto,
        setLoading
      );
    }
  },
  1500
);
const GridData = ({
  rowDto,
  setRowDto,
  paginationSearchHandler,
  values,
  profileData,
  selectedBusinessUnit,
  commonGridFunc,
}) => {
  const [modelShow, setModelShow] = useState(false);
  const [taxSalesInvoiceById, setTaxSalesInvoiceById] = useState("");
  const [loading, setLoading] = useState(false);
  const [salesInvoicePrintStatus, setSalesInvoicePrintStatus] = useState(false);
  const [salesTableRowDto, setSalesTableRowDto] = useState("");
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <PaginationSearch
            placeholder="Invoice Search"
            paginationSearchHandler={paginationSearchHandler}
            values={values}
          />
          <div className="react-bootstrap-table table-responsive">
            {rowDto?.data?.length > 0 && (
              <table
                id="table-to-xlsx"
                className="table table-striped table-bordered global-table"
              >
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    {values?.status === "printed" ? (
                      <>
                        {" "}
                        <th style={{ width: "35px" }}> Reference No</th>
                      </>
                    ) : (
                      <></>
                    )}
                    {values?.status === "printed" ? (
                      <th style={{ width: "90px" }}>Invoice</th>
                    ) : (
                      <th style={{ width: "35px" }}>Delivery No</th>
                    )}
                    <th style={{ width: "100px" }}>Transfer Date</th>
                    {values?.status === "printed" ? (
                      <th style={{ width: "120px" }}>Transfer To</th>
                    ) : (
                      <th style={{ width: "130px" }}>Vehicle No</th>
                    )}
                    {values?.status === "unprinted" && (
                      <th style={{ width: "200px" }}>Delivery Address</th>
                    )}

                    <th style={{ width: "100px" }}>Quantity</th>
                    <th style={{ width: "100px" }}>Value</th>
                    <th style={{ width: "50px" }}>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.data?.map((tableData, index) => {
                    const duplicatedeliveryNumber = rowDto?.data?.filter(
                      (i) => i?.deliveryNumber === tableData?.deliveryNumber
                    );

                    return (
                      <tr
                        key={index}
                        style={{
                          background:
                            duplicatedeliveryNumber.length > 1 ? "red" : "",
                        }}
                      >
                        <td> {tableData?.sl} </td>
                        {values?.status === "printed" ? (
                          <>
                            <td> {tableData?.deliveryNumber}</td>
                          </>
                        ) : (
                          <></>
                        )}
                        <td>
                          {" "}
                          {tableData?.invoice || tableData?.deliveryCode}{" "}
                        </td>
                        <td className="text-center">
                          {values?.status === "printed"
                            ? _dateFormatter(tableData?.transferDate)
                            : _dateFormatter(tableData?.deliveryDate)}
                        </td>
                        <td>
                          {values?.status === "printed"
                            ? tableData?.transferTo
                            : tableData?.vehicleNo}
                        </td>
                        {values?.status === "unprinted" && (
                          <td>{tableData?.partnerName}</td>
                        )}

                        <td className="text-center">
                          {Number(
                            (
                              tableData?.quantity ||
                              tableData?.deliveryQuantity ||
                              0
                            ).toFixed(3)
                          )}
                        </td>
                        <td className="text-right">
                          {_formatMoney(tableData?.value?.toFixed(2))}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            {values?.status === "printed" ? (
                              <>
                                <IView
                                  clickHandler={() => {
                                    setSalesTableRowDto(tableData);
                                    getSalesInvoiceById(
                                      tableData?.salesId,
                                      setTaxSalesInvoiceById,
                                      setLoading
                                    );
                                    GetTaxSalesInvoicePrintStatus_api(
                                      tableData.salesId,
                                      setSalesInvoicePrintStatus
                                    );
                                    setModelShow(true);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (
                                      tableData?.deliveryId &&
                                      profileData?.accountId &&
                                      selectedBusinessUnit?.value
                                    ) {
                                      const printedObj = rowDto?.data?.filter(
                                        (itm) =>
                                          itm?.deliveryId ===
                                          tableData?.deliveryId
                                      );
                                      let confirmObject = {
                                        title: "Are you sure?",
                                        message: `Do you want to remove of ${printedObj[0]?.deliveryCode}?`,
                                        yesAlertFunc: () => {
                                          setLoading(true);
                                          printBtnClick({
                                            printedObj,
                                            rowDto,
                                            tableData,
                                            profileData,
                                            selectedBusinessUnit,
                                            values,
                                            setTaxSalesInvoiceById,
                                            setModelShow,
                                            setRowDto,
                                            setLoading,
                                          });
                                        },
                                        noAlertFunc: () => {},
                                      };
                                      IConfirmModal(confirmObject);
                                    }
                                  }}
                                >
                                  Printed
                                </button>
                                {[521215, 523988, 3959, 3958].includes(
                                  profileData?.userId
                                ) && (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      AutoTaxCompleteApi(
                                        tableData?.deliveryId,
                                        selectedBusinessUnit?.value,
                                        setLoading,
                                        () => {
                                          commonGridFunc(null, values);
                                        }
                                      );
                                    }}
                                  >
                                    Clear
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <SalesInvoiceModel
          show={modelShow}
          onHide={() => {
            setModelShow(false);
            setSalesInvoicePrintStatus(false);
          }}
          rowDto={taxSalesInvoiceById.objList || []}
          singleData={taxSalesInvoiceById}
          salesInvoicePrintStatus={salesInvoicePrintStatus}
          salesTableRowDto={salesTableRowDto}
          setSalesInvoicePrintStatus={setSalesInvoicePrintStatus}
          loading={loading}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </div>
    </>
  );
};

export default withRouter(GridData);
