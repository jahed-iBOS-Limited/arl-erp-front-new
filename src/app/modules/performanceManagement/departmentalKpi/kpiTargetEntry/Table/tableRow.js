import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import { TableAction } from "../../../../_helper/columnFormatter";
import { getKpiTargetGridData } from "../../../_redux/Actions";

export function TableRow() {
  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const gridData = useSelector((state) => {
    return state.performanceMgt?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getKpiTargetGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          2
        )
      );
    }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext.ids,
      setIds: uIContext.setIds,
      queryParams: uIContext.queryParams,
      setQueryParams: uIContext.setQueryParams,
      openViewDialog: uIContext.openViewDialog,
      openChartPage: uIContext.openChartPage,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "depertmentName",
      text: "Department",
      classes: "pl-3"
    },
    {
      dataField: "yearName",
      text: "Year",
      classes: "pl-3"
    },
    {
      dataField: "countofKpi",
      text: "Number of KPI",
      classes: "text-center",
    },

    {
      dataField: "pmsId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openViewDialog: uIProps.openViewDialog,
        openChartPage: uIProps.openChartPage,
        key: "pmsId",
        yearId: "yearId",
        // we catch department id as empId, because previously we catch empId in columnFormatter,if we change empId, it will conflict in individual kpi,
        empId: "depertmentId",
        isView: 1,
        isEdit: 0,
        isChart: 1,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];

  return (
    <>
      <div className="kpi-landing">
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="pmsId"
        data={gridData || []}
        columns={columns}
      ></BootstrapTable>
      </div>
    </>
  );
}
