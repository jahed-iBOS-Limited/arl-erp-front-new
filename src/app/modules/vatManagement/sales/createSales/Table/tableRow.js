import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getGridData, getSalesInvoiceById } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { SearchForm } from "./form";
import IView from "../../../../_helper/_helperIcons/_view";
import SalesInvoiceModel from "../viewModal";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { GetTaxSalesInvoicePrintStatus_api } from "./../helper";
import { setSalesLanding_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const history = useHistory();
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [salesInvoicePrintStatus, setSalesInvoicePrintStatus] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [salesTableRowDto, setSalesTableRowDto] = useState("");
  const [searchFormValues, setSearchFormValues] = useState("");
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const dispatch = useDispatch();
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    const { taxBranch, fromDate, toDate } = searchFormValues;
    getGridData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      taxBranch.value,
      fromDate,
      toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Sales Invoice (6.3)">
        <SearchForm
          setGridData={setGridData}
          setLoading={setLoading}
          setSearchFormValues={setSearchFormValues}
          onSubmit={(values) => {
            dispatch(setSalesLanding_Action(values));
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values.taxBranch.value,
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading,
              pageNo,
              pageSize
            );
          }}
        />

        {/* Table Start */}
        <div className="row cash_journal">
          <div className="col-lg-12">
            <div className="react-bootstrap-table table-responsive">
              <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th style={{ width: "100px" }}>Sales Inv No</th>
                    <th style={{ width: "127px" }}>Customer Name</th>
                    <th style={{ width: "500px" }}>Customer Addres</th>
                    <th style={{ width: "100px" }}>Delivery Date</th>
                    <th style={{ width: "100px" }}>Shipping No</th>
                    <th style={{ width: "100px" }}>Transaction Date</th>
                    <th style={{ width: "70px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>
                        <div className="pl-2">{item?.taxSalesCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.soldtoPartnerName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.shiptoPartnerAddress}</div>
                      </td>

                      <td>
                        <div className="text-center">
                          {_dateFormatter(item?.taxDeliveryDateTime)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">
                          <div className="pl-2">{item?.shiptoPartnerName}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div>{_dateFormatter(item?.deliveryDateTime)}</div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                setSalesTableRowDto(item);
                                getSalesInvoiceById(
                                  item?.taxSalesId,
                                  setSingleData,
                                  setLoading
                                );
                                GetTaxSalesInvoicePrintStatus_api(
                                  item?.taxSalesId,
                                  setSalesInvoicePrintStatus
                                );
                                setModelShow(true);
                              }}
                            />
                          </span>
                          <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/mngVat/sales/create/edit/${item?.taxSalesId}`
                              );
                            }}
                          >
                            <IEdit />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </ICustomCard>

      <SalesInvoiceModel
        show={modelShow}
        onHide={() => {
          setSingleData({});
          setModelShow(false);
          setSalesInvoicePrintStatus(false)
        }}
        singleData={singleData}
        salesInvoicePrintStatus={salesInvoicePrintStatus}
        salesTableRowDto={salesTableRowDto}
        setSalesInvoicePrintStatus={setSalesInvoicePrintStatus}
        loading={loading}
      />
    </>
  );
}
