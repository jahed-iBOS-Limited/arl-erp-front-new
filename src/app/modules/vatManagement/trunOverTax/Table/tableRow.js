import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getGridData, getSalesInvoiceById } from "../helper";
import { SearchForm } from "./form";
import SalesInvoiceModel from "../viewModal";
import { GetTaxSalesInvoicePrintStatus_api } from "./../helper";
import Loading from "../../../_helper/_loading";
import ICustomCard from "../../../_helper/_customCard";
import { setSalesLanding_Action } from "../../../_helper/reduxForLocalStorage/Actions";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [salesInvoicePrintStatus, setSalesInvoicePrintStatus] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [salesTableRowDto, setSalesTableRowDto] = useState("");
  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Turnover Tax">
        <SearchForm
          setGridData={setGridData}
          setLoading={setLoading}
          onSubmit={(values) => {
            dispatch(setSalesLanding_Action(values));
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values.taxBranch.value,
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading
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
                  {gridData?.map((item, index) => (
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ICustomCard>

      <SalesInvoiceModel
        show={modelShow}
        onHide={() => {
          setSingleData({});
          setModelShow(false);
          setSalesInvoicePrintStatus(false);
        }}
        rowDto={singleData.objList || []}
        singleData={singleData}
        salesInvoicePrintStatus={salesInvoicePrintStatus}
        salesTableRowDto={salesTableRowDto}
        setSalesInvoicePrintStatus={setSalesInvoicePrintStatus}
        loading={loading}
      />
    </>
  );
}
