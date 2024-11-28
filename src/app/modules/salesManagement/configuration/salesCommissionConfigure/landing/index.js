import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import SalesCommissionConfigureLandingForm from "./form";
import SalesCommissionConfigureLandingTable from "./table";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICard from "../../../../_helper/_card";
import PaginationTable from "../../../../_helper/_tablePagination";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import EditForm from "./editForm";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};

export default function SalesCommissionConfigure() {
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  const [open, setOpen] = useState(false);
  const [singleData, setSingleData] = useState({});

  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // selection state
  const [selectedRows, setSelectedRows] = useState([]);

  // Check if all rows are selected
  const isAllSelected =
    gridData?.data?.length > 0 &&
    gridData.data.every((row) =>
      selectedRows.some((selectedRow) => selectedRow.autoId === row.autoId)
    );

  // Check if at least one row is selected
  const isSomeSelected = selectedRows.length > 0 && !isAllSelected;

  // Handle "Select All" toggle
  const handleSelectAll = () => {
    if (gridData?.data) {
      if (isAllSelected) {
        setSelectedRows([]); // Deselect all
      } else {
        setSelectedRows([...gridData?.data]); // Select all
      }
    }
  };

  // Handle individual row toggle
  const handleSelectRow = (row) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.some(
        (selectedRow) => selectedRow.autoId === row.autoId
      );

      if (isSelected) {
        // Deselect the row
        return prevSelected.filter(
          (selectedRow) => selectedRow.autoId !== row.autoId
        );
      } else {
        // Select the row
        return [...prevSelected, row];
      }
    });
  };

  const dataSelection = {
    selectedRows,
    setSelectedRows,
    isAllSelected,
    isSomeSelected,
    handleSelectAll,
    handleSelectRow,
  };

  //setLandingData
  const getData = (_pageNo = 0, _pageSize = 15, values) => {
    const url = `/oms/CustomerSalesTarget/PartySalesCommissionConfigPagination?businessUnitId=${buId}&commissionTypeId=${
      values?.commissionType?.value
    }&channelId=${values?.channel?.value || 0}&regionId=${values?.region
      ?.value || 0}&areaId=${values?.area?.value ||
      0}&pageNo=${_pageNo}&pageSize=${_pageSize}&fromDate=${
      values?.fromDate
    }&toDate=${values?.toDate}&`;
    setSelectedRows([]);
    getGridData(url);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard
            title="Sales Commission Configuration"
            isCreteBtn={true}
            createHandler={() => {
              history.push(
                `/sales-management/configuration/salescommissionconfigure/entry`
              );
            }}
          >
            <SalesCommissionConfigureLandingForm
              obj={{
                values,
                setFieldValue,
                pageNo,
                pageSize,
                getData,
                setGridData,
              }}
            />
            <SalesCommissionConfigureLandingTable
              obj={{
                gridData,
                values,
                setOpen,
                setSingleData,
                getData,
                dataSelection,
              }}
            />
            {gridData?.data?.length > 0 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={getData}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
                values={values}
              />
            )}{" "}
            <IViewModal show={open} onHide={() => setOpen(false)}>
              <EditForm
                obj={{ setOpen, singleData, preValues: values, getData }}
              />
            </IViewModal>
          </ICard>
        )}
      </Formik>
    </>
  );
}
