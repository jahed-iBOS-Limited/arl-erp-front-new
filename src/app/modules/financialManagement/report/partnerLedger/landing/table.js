import React, { useState } from "react";
// import { PartnerLedger } from "../../../../procurement/reports/partnerLedger";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import IViewModal from "../../../../_helper/_viewModal";
import PartnerInfo from "../modal/partnerInfo";

const Table = ({ rowDto, values }) => {
  const [show, setShow] = useState(false);
  const [tableItem, setTableItem] = useState({});
  const headers = ["SL", "Partner", "Partner Code", "Ledger Balance", "Action"];

  let totalAmount = 0;
  return (
    <div>
      {rowDto?.length > 0 && (
        <ICustomTable ths={headers} className="table-font-size-sm">
          {rowDto?.map((item, index) => {
            totalAmount += item?.numLedgerBalance;
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <>
                  <td>{item?.strPartnerName}</td>
                  <td>{item?.strPartnerCode}</td>
                  <td className="text-right">
                    {_formatMoney(item?.numLedgerBalance)}
                  </td>
                  <td className="text-center">
                    <InfoCircle
                      clickHandler={() => {
                        setTableItem(item);
                        setShow(true);
                      }}
                      classes="text-primary"
                    />
                  </td>
                </>
              </tr>
            );
          })}
          <tr>
            <td colSpan={3} className="text-right">
              <b>Total</b>
            </td>

            <td className="text-right">
              <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
            </td>

            <td></td>
          </tr>
        </ICustomTable>
      )}

      <IViewModal show={show} onHide={() => setShow(false)}>
        <PartnerInfo values={values} tableItem={tableItem} />
      </IViewModal>
    </div>
  );
};

export default Table;
