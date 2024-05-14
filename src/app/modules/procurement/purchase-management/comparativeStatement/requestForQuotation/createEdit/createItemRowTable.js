import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateDigit } from '../../../../../_helper/validateDigit';
import IDelete from '../../../../../_helper/_helperIcons/_delete';
import IView from '../../../../../_helper/_helperIcons/_view';
import { IInput } from '../../../../../_helper/_input';
import { getDownlloadFileView_Action } from '../../../../../_helper/_redux/Actions';
import { rowDtoDynamicHandler } from '../../../purchaseOrderShipping/utils';

const RowDtoTable = ({ rowDto, removeHandler, setRowDto }) => {
   const [orderQtyCheck, setOrderQtyCheck] = useState(false);
   const dispatch = useDispatch()

   const setAllOrderQty = orderQtyCheck => {
      // set every row orderQty = restofQty
      // we use rowDtoHandler because this function will set orderQty, and also calculate net amount
      rowDto.forEach((item, index) => {
         rowDtoDynamicHandler(
            'numRfqquantity',
            orderQtyCheck ? item?.numReferenceQuantity : 0,
            index,
            rowDto,
            setRowDto
         );
      });
   };

   const rowDtoHandler = (name, index, value) => {
      const obj =  [...rowDto] ;
      obj[index][name] = value;
      setRowDto([...obj]);
   };

   console.log(rowDto, 'rowDto')

   return (     
      <div>
         {rowDto?.length > 0 && (
            <>
            <div className="table-responsive">
               <table className="table table-striped table-bordered mt-3 global-table po-table">
                  <thead>
                     <tr>
                        <th style={{ fontSize: '10px' }}>SL</th>
                        <th style={{ width: '110px', fontSize: '10px' }}>
                           Ref No.
                        </th>
                        <th style={{ width: '100px', fontSize: '10px' }}>
                           Item Code
                        </th>
                        <th style={{ fontSize: '10px' }}>Item Name</th>
                        {rowDto[0]?.intItemCategoryId === 624 ? 
                        <>
                           <th style={{ fontSize: '10px' }}>Part No</th>
                           <th style={{ fontSize: '10px' }}>Drawing No</th>
                        </>
                        : null}
                        <th style={{ fontSize: '10px' }}>Remarks</th>
                        <th style={{ fontSize: '10px' }}>Item Type</th>
                        <th style={{ fontSize: '10px' }}>UOM</th>
                        <th style={{ fontSize: '10px' }}>Ref QTY</th>
                        <th
                           className="po_custom_width"
                           style={{ fontSize: '10px' }}
                        >
                           <input
                              style={{ transform: 'translateY(3px)' }}
                              type="checkbox"
                              defaultChecked={orderQtyCheck}
                              onChange={e => {
                                 setOrderQtyCheck(!orderQtyCheck);
                                 setAllOrderQty(!orderQtyCheck);
                              }}
                           />
                           RFQ Qty.
                        </th>
                        <th>PR Attach.</th>                        
                        <th style={{ fontSize: '10px' }}>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {rowDto?.map((item, index) => {
                        //getUomDDL(item?.item?.value);

                        return (
                           <tr key={index}>
                              <td className="text-center align-middle">
                                 {' '}
                                 {index + 1}{' '}
                              </td>
                              <td
                                 className="align-middle"
                                 style={{ fontSize: '10px' }}
                              >
                                 {item?.strPrreferenceCode || 'NA'}
                              </td>
                              <td
                                 className="align-middle"
                                 style={{ fontSize: '10px' }}
                              >
                                 {item?.strItemCode}
                              </td>
                              <td>{item?.strItemName}</td>
                              {item?.intItemCategoryId === 624 ? 
                              <>
                                 <td>{item?.strPartNo}</td>
                                 <td>{item?.strDrawingNo}</td>
                              </> : null
                              }
                              <td
                                 className="disabled-feedback disable-border"
                                 style={{ width: '200px' }}
                              >
                                 <IInput
                                    value={rowDto[index]?.strDescription || ''}
                                    name="strDescription"
                                    type="text"
                                    onChange={e => {
                                       rowDtoHandler(
                                          'strDescription',
                                          index,
                                          e.target.value
                                       );
                                    }}
                                 />
                              </td>
                              <td style={{ width: '150px' }}>
                                 {item?.strItemTypeName}
                              </td>
                              <td style={{ width: '100px' }}>
                                 {item?.strUoMname}
                              </td>

                              <td className="text-center align-middle">
                                 {item?.numReferenceQuantity || 0}
                              </td>
                              <td
                                 className="disabled-feedback disable-border"
                                 style={{ width: '100px' }}
                              >
                                 <IInput
                                    value={rowDto[index]?.numRfqquantity || 0}
                                    name="numRfqquantity"
                                    type="tel"
                                    min="0"
                                    required
                                    // max={item?.referenceNo && item?.restofQty}
                                    onChange={e => {
                                       let validNum = validateDigit(
                                          e.target.value
                                       );

                                       if (
                                          validNum > item?.restofQty &&
                                          item?.referenceNo
                                       ) {
                                          alert(`Maximum ${item?.restofQty}`);
                                          validNum = '';
                                       }
                                       rowDtoDynamicHandler(
                                          'numRfqquantity',
                                          validNum,
                                          index,
                                          rowDto,
                                          setRowDto
                                       );
                                    }}
                                 />
                              </td>
                               
                              <td className='text-center align-middle'>
                              {item?.strAttachment &&
                              <IView 
                                 clickHandler={ ()=>{
                                    dispatch(
                                       getDownlloadFileView_Action(
                                          item?.strAttachment
                                       )
                                    );
                                    // getAttachmentId(item?.strPrreferenceCode, item?.intItemId, setLoading,(attch)=>{
                                    //    dispatch(
                                    //       getDownlloadFileView_Action(
                                    //          attch?.strAttachment
                                    //       )
                                    //    );
                                    // })
                                 }}
                              /> 
                           } 
                           </td>                          
                              <td className="text-center align-middle">
                                 <IDelete
                                    remover={removeHandler}
                                    id={item?.intItemId}
                                 />
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
               </div>
            </>
         )}
      </div>
   );
};

export default RowDtoTable;
