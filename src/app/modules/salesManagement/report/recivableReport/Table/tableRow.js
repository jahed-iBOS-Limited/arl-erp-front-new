/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { getItemRequestGridData } from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";

export function TableRow(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);
  // from date state
  const [transactionDate, setTransactionDate] = useState(_todayDate());
  // to date state
  const [dueDate, setDueDate] = useState(_todayDate());
  const [loading, setLoading] = useState(false);
  //Get Api Data
  useEffect(() => {
    getItemRequestGridData(
      profileData.accountId,
      selectedBusinessUnit.value,
      transactionDate,
      dueDate,
      setGridData,
      setLoading
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext?.ids,
      setIds: uIContext?.setIds,
      queryParams: uIContext?.queryParams,
      setQueryParams: uIContext?.setQueryParams,
      openEditPage: uIContext?.openEditPage,
      openViewDialog: uIContext?.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "businessPartnerName",
      text: "Partner Name",
    },
    {
      dataField: "invoiceCode",
      text: "Invoice Code",
    },
    {
      dataField: "amount",
      text: "Amount",
      classes: "text-right",
    },
    {
      dataField: "clearedAmount",
      text: "Clear Amount",
      classes: "text-right",
    },
    {
      dataField: "adjustmentPendingAmount",
      text: "Pending Amount",
      classes: "text-right",
    },
  ];
  return (
    <>
      <ICustomCard title="Recivable Due Report">
        <div className="row my-3 global-form">
          <div className="col-lg-2">
            <div className="form-group">
              <label>Transaction Date</label>
              <input
                className="trans-date cj-landing-date"
                onChange={(e) => setTransactionDate(e.target.value)}
                type="date"
                value={transactionDate}
                name="transactionDate"
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Due Date</label>
              <input
                className="trans-date cj-landing-date"
                onChange={(e) => setDueDate(e.target.value)}
                type="date"
                value={dueDate}
                name="dueDate"
              />
            </div>
          </div>
          <div className="col-lg-2 mt-5">
            <button
              className="btn btn-primary"
              onClick={() =>
                getItemRequestGridData(
                  profileData.accountId,
                  selectedBusinessUnit.value,
                  transactionDate,
                  dueDate,
                  setGridData,
                  setLoading
                )
              }
            >
              View
            </button>
          </div>
        </div>
        {loading && <Loading />}
        <div
          style={{ lineHeight: "1rem" }}
          className="Recivable-Due-Report table table-striped table-bordered mt-3 bj-table bj-table-landing"
        >
          <BootstrapTable
            bootstrap4
            bordered={false}
            remote
            keyField="controllingUnitId"
            data={gridData || []}
            columns={columns}
          ></BootstrapTable>
        </div>
      </ICustomCard>
    </>
  );
}
