/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import ViewForm from "./ViewForm";

import { fetchSingleData } from "../helper/Actions";

import { shallowEqual, useSelector } from "react-redux";

const headers = ["SL", "Grade Code", "Employee Grade", "Base Grade"];

const TBody = ({ tableData }) => {
  return (
    <>
      {tableData.length > 0 &&
        tableData.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{item?.empGradeCode}</td>
              <td style={{ textAlign: "center" }}>{item?.empGradeName}</td>
              <td style={{ textAlign: "center" }}>{item?.empBaseGrade}</td>
            </tr>
          );
        })}
    </>
  );
};

export function ViewTable() {
  const { posId, posGrpId } = useParams();
  const [tableData, setTabelData] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (posId && posGrpId) {
      fetchSingleData(profileData.accountId, posId, posGrpId, setTabelData);
    }
  }, []);

  return (
    <>
      <ViewForm tableData={tableData} />
      <ICustomTable ths={headers} children={<TBody tableData={tableData} />} />
    </>
  );
}
