/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import Loading from "../../../../_helper/_loading";
import { getEmployeeAttendenceDetailsInOutReport } from "../helper";

const ViewModal = ({ values, currentRow }) => {
  const [isLoading, setLoading] = useState(false);

  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getEmployeeAttendenceDetailsInOutReport(
      1,
      values?.employee?.value,
      currentRow?.Attendance,
      currentRow?.Attendance,
      setRowDto,
      setLoading
    );
  }, []);

  return (
    <div>
      {isLoading && <Loading />}
      <div>
        <b>Name : {values?.employee?.label}</b>
      </div>
      <ICustomTable ths={["Time", "In/Out"]}>
        {rowDto?.map((item, index) => (
          <tr key={index}>
            <td>{item?.InTime}</td>
            <td>{item?.Remarks}</td>
          </tr>
        ))}
      </ICustomTable>
    </div>
  );
};

export default ViewModal;
