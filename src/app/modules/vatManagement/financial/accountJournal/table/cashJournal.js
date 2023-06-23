import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import IView from '../../../../_helper/_helperIcons/_view';
import IViewModal from '../../../../_helper/_viewModal';
import { CashJournalReportView } from '../report/cashJournalReportView';

export default function CashJournalTable({
   rowData,
   values,
   updatePopUp,
   singleCheckBoxHandler,
   setAllSelectHandler,
   reversePopUp
}) {
   const headers = [
      'SL',
      'Journal Date',
      'Journal Code',
      // "Receive From",
      'Amount',
      'Narration',
      'Action',
   ];
   const history = useHistory();

   const [open, setOpen] = useState(false);
   const [row, setRow] = useState({});

   return (
      <div>
         <table
            className={
               'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
            }
         >
            <thead>
               <tr>
                  <th className="text-center" style={{ width: '20px' }}>
                     <input
                        type="checkbox"
                        id="parent"
                        onChange={event => {
                           setAllSelectHandler(event.target.checked);
                        }}
                     />
                  </th>
                  {headers.map((th, index) => {
                     return <th key={index}> {th} </th>;
                  })}
               </tr>
            </thead>
            {rowData?.map((item, index) => {
               return (
                  <tr key={index}>
                     <td className="text-center">
                        <input
                           id="isSelect"
                           type="checkbox"
                           value={item?.isSelect}
                           checked={item?.isSelect}
                           onChange={e => {
                              singleCheckBoxHandler(e.target.checked, index);
                           }}
                        />
                     </td>
                     <td style={{ width: '40px' }} className="text-center">
                        {index + 1}
                     </td>
                     <td style={{ width: '100px' }}>
                        {_dateFormatter(item?.dteTransaction)}
                     </td>
                     <td>{item?.strAccountingJournalCode}</td>
                     {/* <td>{item?.nameFor}</td> */}
                     <td className="text-right">
                        {_formatMoney(Math.abs(item?.numAmount), 0)}
                     </td>
                     <td>{item?.strNarration}</td>
                     <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                           <IView
                              clickHandler={() => {
                                 setRow(item);
                                 setOpen(true);
                              }}
                           />
                           <span
                              className="edit ml-3"
                              onClick={() => {
                                 history.push(
                                    `/mngVat/tax-financial/account-journalCreate/cashJournalEdit/${item?.strAccountingJournalCode}`,
                                    {
                                       accountingJournalTypeId:
                                          values?.journalType?.value,
                                    }
                                 );
                              }}
                           >
                              <IEdit />
                           </span>
                           <span
                              className="edit ml-3"
                              onClick={() =>
                                 updatePopUp(
                                    values,
                                    item?.strAccountingJournalCode
                                 )
                              }
                           >
                              <IDelete />
                           </span>
                           <OverlayTrigger
                              overlay={<Tooltip id="reverse-icon">{ "Reverse"}</Tooltip>}
                           >
                              <span className='pointer ml-3'>
                                <i
                                  onClick={() => {
                                    reversePopUp(
                                      values,
                                      item?.strAccountingJournalCode
                                    );
                                  }}
                                  className="fa fa-undo text-success"
                                  aria-hidden="true"
                                ></i>
                              </span>
                         </OverlayTrigger>
                        </div>
                     </td>
                  </tr>
               );
            })}
         </table>
         <IViewModal show={open} onHide={() => setOpen(false)}>
            <CashJournalReportView
               journalCode={row?.strAccountingJournalCode}
               headerData={{
                  accountingJournalTypeId: values?.journalType?.value,
               }}
               clickRowData={{journalTypeId : row?.intAccountingJournalTypeId, strAccountingJournalCode : row?.strAccountingJournalCode}}
            />
         </IViewModal>
      </div>
   );
}
