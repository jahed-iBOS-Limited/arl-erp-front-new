import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import IViewModal from "../../../../_helper/_viewModal";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
export default function ViewForm({ id, show, onHide }) {
  const { state: headerData } = useLocation();
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    if (id) {
      getAdjustmentJournalById(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const getAdjustmentJournalById = async (id) => {
    try {
      const res = await Axios.get(
        `/fino/CommonFino/GetJournalView?JournalId=${id}&AccountingJournalTypeId=${headerData?.accountingJournalTypeId}`
      );
      if (res && res.data) {
        setRowDto(res?.data);
      }
    } catch (error) {
     
    }
  };

  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={rowDto && false}
        title={
          headerData?.accountingJournalTypeId === 4
            ? "Bank Receipts"
            : headerData?.accountingJournalTypeId === 5
            ? "Bank Payments"
            : "Bank Transfer"
        }
        style={{ fontSize: "1.2rem !important" }}
      >
        <div>
          {rowDto?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-1 bj-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>GL Name</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Narration</th>
                </tr>
              </thead>
              <tbody>
                {rowDto.map((itm, idx) => {
                  return (
                    <tr key={itm?.generalLedgerId}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="text-left pl-2">
                          {`${itm?.generalLedgerName} [${itm?.generalLedgerCode}]`}
                        </div>
                      </td>

                      <td>
                        <div className="text-right pr-2">
                          {itm.debit ? _formatMoney(Math.abs(itm?.debit)) : ""}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {itm.credit
                            ? _formatMoney(Math.abs(itm?.credit))
                            : ""}
                        </div>
                      </td>

                      <td>
                        <div className="text-left pl-2">{itm?.narration}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          ) : (
            ""
          )}
        </div>
      </IViewModal>
    </div>
  );
}
