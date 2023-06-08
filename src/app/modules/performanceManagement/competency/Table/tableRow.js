import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useUIContext } from "../../../_helper/uiContextHelper";
import { TableAction } from "../../../_helper/columnFormatter";
import { getCompetencyGridData } from "../_redux/Actions";

export function TableRow() {
  const dispatch = useDispatch();
  // storeData
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      gridData: state?.competencyTwo?.gridData,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, gridData } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getCompetencyGridData(profileData.accountId, selectedBusinessUnit.value)
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
      openEditPage: uIContext.openEditPage,
      openViewDialog: uIContext.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
    },
    {
      dataField: "competencyName",
      text: "Competency Name",
    },
    {
      dataField: "competencyDefination",
      text: "Competency  Definition",
    },

    {
      dataField: "competencyId",
      text: "Actions",
      formatter: TableAction,
      formatExtraData: {
        openEditPage: uIProps.openEditPage,
        openViewDialog: uIProps.openViewDialog,
        key: "competencyId",
        isView: true,
        isEdit: true,
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
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center"
        bootstrap4
        bordered={false}
        remote
        keyField="competencyId"
        data={gridData || []}
        columns={columns}
      ></BootstrapTable>
    </>
  );
}
