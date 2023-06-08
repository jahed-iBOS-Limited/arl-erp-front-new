import React from "react";
import ICustomTable from "../../../_helper/_customTable";

const header = ["Month & Year", "Cash Pay", "Bank Pay", "Total Amount"];

const MonthWiseTable = ({ rowDto }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-8">
          <h6 style={{ marginBottom: 0, paddingTop: "30px" }}>Month Wise Donation Summery:</h6>
          <ICustomTable ths={header}>
            {
              rowDto?.length > 0 &&
              rowDto?.map((item, index) => (
                <tr className="text-center" key={index}>
                  <td className={index === rowDto.length - 1 ? "font-weight-bold" : ""}>{item?.strMonthYear}</td>
                  <td className={index === rowDto.length - 1 ? "font-weight-bold" : ""}>{item?.monCash}</td>
                  <td className={index === rowDto.length - 1 ? "font-weight-bold" : ""}>{item?.monOnline}</td>
                  <td className={index === rowDto.length - 1 ? "font-weight-bold" : ""}>{item?.monTotal}</td>
                </tr>
              ))
            }
          </ICustomTable>
        </div>
      </div>
    </>
  );
};

export default MonthWiseTable;
