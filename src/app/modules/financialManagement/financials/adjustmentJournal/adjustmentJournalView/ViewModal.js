/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Axios from "axios";
import IViewModal from "../../../../_helper/_viewModal";
export function ViewModal({ id, show, onHide }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (id) {
      getAdjustmentJournalById(id);
    }
  }, [id]);

  const getAdjustmentJournalById = async (id) => {
    try {
      const res = await Axios.get(
        `/fino/AdjustmentJournal/GetAdjustmentJournalById?adjustmentJournalId=${id}&accountingJournalTypeId=7`
      );
      if (res && res.data) {
        setRowDto(res?.data?.objRow);
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
        title={"Adjustment"}
        style={{ fontSize: "1.2rem !important" }}
      >
        <div>
          {rowDto.length > 0 ? (
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
                          {itm?.generalLedgerName}
                        </div>
                      </td>
                      {itm?.debitCredit === "Debit" ? (
                        <td>
                          <div className="text-right pr-2">
                            {Math.abs(itm?.amount)}
                          </div>
                        </td>
                      ) : (
                        <td>{""}</td>
                      )}
                      {itm?.debitCredit === "Credit" ? (
                        <td>
                          <div className="text-right pr-2">
                            {Math.abs(itm?.amount)}
                          </div>
                        </td>
                      ) : (
                        <td>{""}</td>
                      )}
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
