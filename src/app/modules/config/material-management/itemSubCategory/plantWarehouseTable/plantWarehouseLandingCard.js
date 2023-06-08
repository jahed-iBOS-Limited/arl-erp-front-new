import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { PlantWarehouseTable } from "./plantWarehouseTableCard";
import * as XLSX from "xlsx";

export function ItemSubCategoryLandingCard() {
  let history = useHistory();
  const [excelData, getExcelData] = useAxiosGet();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getExcelData(`/item/ItemSubCategory/GetItemSubCategoryByAccountIdUnitIdSearchPasignation?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&viewOrder=desc&PageNo=0&PageSize=2000`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exportDataInExcel = () => {
    const data = excelData?.data;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ItemSubCategory.xlsx");
  };
  return (
    <Card>
      <CardHeader title="Item Sub-Category">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary mr-1"
            onClick={() => { exportDataInExcel() }}
          >
            Export Excel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/material-management/item-sub-category/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PlantWarehouseTable />
      </CardBody>
    </Card>
  );
}
