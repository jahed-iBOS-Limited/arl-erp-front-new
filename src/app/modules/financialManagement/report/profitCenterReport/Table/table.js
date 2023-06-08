import React, { useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import IViewModal from "../../../../_helper/_viewModal";
import ProfitCenterView from "../view";

const Table = ({ rowDto, landingValues }) => {
  const headers = ["Profit Center", "Elements", "Amount", "Action"];
  // const totalAmount = (rowDto, type) => {
  //   let data = [...rowDto];
  //   let netAmount = 0;
  //   if (rowDto?.length > 0) {
  //     for (let i = 0; i < data.length; i++) {
  //       let element = data[i];
  //       if (element?.type?.toLowerCase() === type && element?.numAmount) {
  //         netAmount += element?.numAmount;
  //       } else if (
  //         element?.type?.toLowerCase() === type &&
  //         element?.numAmount
  //       ) {
  //         netAmount += element?.numAmount;
  //       }
  //     }
  //   }
  //   return netAmount ? netAmount : "";
  // };
  const revenueElementsList = rowDto?.filter((item) => item?.intId === 1);
  const costElementsList = rowDto?.filter((item) => item?.intId === 2);
  let TotalRevenue = revenueElementsList?.reduce((acc, curr) => acc + curr?.numAmount, 0);
  let TotalCost = costElementsList?.reduce((acc, curr) => acc + curr?.numAmount, 0);
  const [currentRowData, setCurrentRowData] = useState(false);
  return (
    <div>
      <ICustomTable ths={headers} id={"table-to-xlsx"}>
        {rowDto?.length > 0 &&
          revenueElementsList?.map((item, index) => (
            <tr key={index}>
              {/* <td className="text-center">{index + 1}</td> */}
              <td>{item?.strProfitCenter}</td>
              <td>{item?.strCostRevElement}</td>
              <td>{_formatMoney(item?.numAmount)}</td>
              <td className="text-center">
                <InfoCircle
                  clickHandler={() => {
                    setCurrentRowData(item);
                  }}
                  classes="text-primary"
                />
              </td>
            </tr>
          ))}
        {rowDto?.length > 0 && (
          <tr>
            <td></td>
            <td style={{ textAlign: "right" }}>
              <strong>Total Revenue</strong>
            </td>
            <td className="text-right">{_formatMoney(TotalRevenue)}</td>
            <td></td>
          </tr>
        )}
        {rowDto?.length > 0 &&
          costElementsList?.map((item, index) => (
            <tr key={index}>
              {/* <td className="text-center">{index + 1}</td> */}
              <td>{item?.strProfitCenter}</td>
              <td>{item?.strCostRevElement}</td>
              <td>{_formatMoney(item?.numAmount)}</td>
              <td className="text-center">
                <InfoCircle
                  clickHandler={() => {
                    setCurrentRowData(item);
                  }}
                  classes="text-primary"
                />
              </td>
            </tr>
          ))}
        {rowDto?.length > 0 && (
          <tr>
            <td></td>
            <td style={{ textAlign: "right" }}>
              <strong>Total Cost</strong>
            </td>
            <td className="text-right">{_formatMoney(TotalCost)}</td>
            <td></td>
          </tr>
        )}
        {rowDto?.length > 0 && (
          <tr>
            <td></td>
            <td style={{ textAlign: "right" }}>
              <strong>Net Profit</strong>
            </td>
            <td className="text-right">{_formatMoney(TotalRevenue - TotalCost)}</td>
            <td></td>
          </tr>
        )}
      </ICustomTable>
      <IViewModal title="" show={currentRowData} onHide={() => setCurrentRowData(false)}>
        <ProfitCenterView currentRowData={currentRowData} landingValues={landingValues} />
      </IViewModal>
    </div>
  );
};

export default Table;
