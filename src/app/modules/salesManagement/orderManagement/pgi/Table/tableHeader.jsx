/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ITable } from "../../../../_helper/_table";
import { getIsPGICheck_Action, saveShipmentId_action } from "../_redux/Actions";
import TableRow from "./tableRow";

const initialData = {
  pgiShippoint: "",
};

const initData = {
  itemCheck: false,
};
export function PGITable() {
  const [rowDto, setRowDto] = useState([]);

  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  // get info to Check PGI exists or not
  const IsPGICheck = useSelector((state) => {
    return state.pgi?.IsPGICheck;
  }, shallowEqual);

  // get PGI list  from store
  const gridData = useSelector((state) => {
    return state.pgi?.gridData;
  }, shallowEqual);

  //Dispatch Get emplist action for get emplist ddl
  //Dispatch PGI check action for enabling create PGI button
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getIsPGICheck_Action(profileData.accountId, selectedBusinessUnit.value)
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: false,
    }));

    setRowDto(modifyGridData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const savePgiData = (id) => {
    dispatch(saveShipmentId_action({ data: id }));
  };

  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
  };

  return (
    <div className="pgi_table">
      <ITable
        table
        link="/sales-management/ordermanagement/pgi/add"
        title="PGI"
      >
        <TableRow
          gridData={rowDto}
          savePgiData={savePgiData}
          IsPGICheck={IsPGICheck}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          shippointDDL={shippointDDL}
          initData={initData}
          initialData={initialData}
          itemSlectedHandler={itemSlectedHandler}
          allGridCheck={allGridCheck}
        />
      </ITable>
    </div>
  );
}
