import React, { useState } from "react";
import ICustomTable from "../../../_helper/_customTable";
// import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InfoCircle from "../../../_helper/_helperIcons/_infoCircle";
import IViewModal from "../../../_helper/_viewModal";
import SubScheduleModal from "./subScheduleModal";

const GeneralLedgerTable = ({ rowDto,landingValues }) => {
  const ths = [
    "Sl",
    "Transaction Name",
    "Code",
    "Balance",
    "Action",
  ];
  let totalBalance = 0;
  const [tableItem, setTableItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div>
      <ICustomTable ths={ths}>
        {rowDto?.map((item, index) => {
          totalBalance += +item?.numAmount;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.strSubGlName}</td>
              <td>{item?.strSubGlCode}</td>
              <td className="text-right">
                {_formatMoney(item?.numAmount.toFixed(2))}
              </td>
              <td className="text-center">
                <InfoCircle
                  clickHandler={() => {
                    setTableItem(item);
                    setIsShowModal(true);
                  }}
                  classes="text-primary"
                />
              </td>
        
            </tr>
          );
        })}
        <tr>
          <td colspan="3">
            <b>Total</b>
          </td>
          <td className="text-right">
            <b>{_formatMoney(totalBalance)}</b>
          </td>
          <td></td>
        </tr>
      </ICustomTable>
      <IViewModal
        title=""
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <SubScheduleModal tableItem={tableItem} landingValues={landingValues} />
      </IViewModal>
    </div>
  );
};

export default GeneralLedgerTable;
