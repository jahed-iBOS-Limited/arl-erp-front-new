import React, { useState } from "react";
import ICustomTable from "../../../_helper/_customTable";
// import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InfoCircle from "../../../_helper/_helperIcons/_infoCircle";
import IViewModal from "../../../_helper/_viewModal";
import SubScheduleModal from "./subScheduleModal";
import moment from "moment";

const GeneralLedgerTable = ({ rowDto,landingValues }) => {
  const ths = [
    "Sl",
    "Transaction Name",
    "Code",
    "Openning",
    "Debit",
    "Credit",
    "Balance",
    "Action",
  ];
  let totalBalance = 0;
  const [tableItem, setTableItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div>
      <ICustomTable ths={ths}  id="table-to-xlsx">
        {rowDto?.map((item, index) => {
          totalBalance += +item?.numAmount;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.strSubGlName}</td>
              <td>{item?.strSubGlCode}</td>
              <td className="text-right">
                {_formatMoney(item?.numOppening?.toFixed(2))}
              </td>
              <td className="text-right">
                {_formatMoney(item?.numDebit?.toFixed(2))}
              </td>
              <td className="text-right">
                {_formatMoney(item?.numCredit?.toFixed(2))}
              </td>
              <td className="text-right">
                {_formatMoney(item?.numAmount?.toFixed(2))}
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
          <td colSpan="3" className="text-right">
            <b>Total</b>
          </td>
          <td className="text-right">
            <b>{_formatMoney(rowDto?.reduce((acc, item) => acc + item?.numOppening, 0).toFixed(2))}</b>
          </td>
          <td className="text-right">
            <b>{_formatMoney(rowDto?.reduce((acc, item) => acc + item?.numDebit, 0).toFixed(2))}</b>
          </td>
          <td className="text-right">
            <b>{_formatMoney(rowDto?.reduce((acc, item) => acc + item?.numCredit, 0).toFixed(2))}</b>
          </td>
          <td className="text-right">
          <b>{_formatMoney(totalBalance)}</b>
          </td>
          <td></td>
        </tr>
        <tr>
          <td
            className="text-center d-none"
            colSpan={4}
            >{`System Generated Report - ${moment().format('LLLL')}`}</td>
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
