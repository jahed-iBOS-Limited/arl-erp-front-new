import React, { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getMeasuringScaleGridData } from "../_redux/Actions";

export function TableRow() {
  // storeData
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      gridData: state?.measuringScaleTwo?.gridData,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit, gridData } = storeData;

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getMeasuringScaleGridData(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // Table columns
  const columns = [
    {
      dataField: "sl",
      text: "SL",
      classes: "text-center",
    },
    {
      dataField: "scaleForName",
      text: "Scale For",
    },
    {
      dataField: "measuringScaleName",
      text: "Scale Name",
    },
    {
      dataField: "measuringScaleValue",
      text: "Value",
      classes: "text-center",
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
        keyField="measuringScaleId"
        data={gridData || []}
        columns={columns}
      ></BootstrapTable>
    </>
  );
}
