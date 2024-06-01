import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { validateDigit } from '../../../../_helper/validateDigit';
import IView from '../../../../_helper/_helperIcons/_view';
import { IInput } from '../../../../_helper/_input';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { attachment_action } from './helper';

const QuotationCreateRowDtoTable = ({
   rowDto,
   setRowDto,
   values,
   getPercentageValue,
   subTotal,
}) => {
   const [myIndex, setMyIndex] = useState(null);
   const [, setLoading] = useState();

   const dispatch = useDispatch();
   const inputCVFile = useRef(null);
   // eslint-disable-next-line no-unused-vars
   const [attachmentFile, setAttachmentFile] = useState('');
   // const [attachmentFileName, setAttachmentFileName] = useState("");
   const onButtonCVClick = e => {
      e.stopPropagation();
      inputCVFile.current.click();
   };

   const rowDtoHandler = (name, index, value) => {
      const obj = { ...rowDto };
      const data = [...obj?.objRow];
      data[index][name] = value;
      setRowDto({ ...obj, objRow: data });
   };

   return (
      <div>
         {rowDto?.objRow?.length > 0 && (
            <>
            <div className="table-responsive">
               <table className="table table-striped table-bordered mt-3 global-table po-table">
                  <thead>
                     <tr>
                        <th style={{ fontSize: '10px' }}>SL</th>
                        <th style={{ width: '100px', fontSize: '10px' }}>
                           Item Code
                        </th>
                        <th style={{ fontSize: '10px' }}>Item Name</th>
                        {rowDto?.objRow[0]?.intItemCategoryId === 624 ? 
                        <>
                           <th style={{ fontSize: '10px' }}>Part No</th>
                           <th style={{ fontSize: '10px' }}>Drawing No</th>
                        </>:null}
                        <th style={{ fontSize: '10px' }}>Item Remarks</th>
                        <th style={{ fontSize: '10px' }}>UOM</th>
                        <th style={{ fontSize: '10px' }}>Quantity</th>
                        <th
                           className="po_custom_width"
                           style={{ fontSize: '10px' }}
                        >
                           Rate
                        </th>
                        <th
                           className="po_custom_width"
                           style={{ fontSize: '10px' }}
                        >
                           Amount
                        </th>
                        <th
                           className="po_custom_width"
                           style={{ fontSize: '10px' }}
                        >
                           Remarks
                        </th>
                        <th style={{ fontSize: '10px' }}>Attachment</th>
                     </tr>
                  </thead>
                  <tbody>
                     {rowDto?.objRow?.map((item, index) => {
                        //getUomDDL(item?.item?.value);

                        return (
                           <>
                              {(index === 0 || item.strShippingItemSubHead !== rowDto?.objRow[index - 1].strShippingItemSubHead) && item?.strShippingItemSubHead ? (
                                 <tr style={{background:'#ADD8E6', paddingTop: '5px', paddingBottom: '5px' }}>
                                     <td colSpan={rowDto?.objRow[0]?.intItemCategoryId[0]?.intItemCategoryId === 624 ? '12' : '10'}>
                                         <div style={{fontSize: '20'}} className="text-bold text-center">
                                             {item.strShippingItemSubHead}
                                         </div>
                                     </td>
                                 </tr>
                              ) : null}
                           <tr
                              key={index}
                              onClick={e => {
                                 setMyIndex(index);
                              }}
                           >
                              <td className="text-center align-middle">
                                 {index + 1}{' '}
                              </td>
                              <td
                                 className="align-middle"
                                 style={{ fontSize: '10px' }}
                              >
                                 {item?.strItemCode || 'NA'}
                              </td>
                              <td style={{ fontSize: '10px' }}>
                                 {item?.strItemName}
                              </td>
                              {item?.intItemCategoryId === 624 ? 
                              <>
                                 <td>{item?.strPartNo}</td>
                                 <td>{item?.strDrawingNo}</td>
                              </> : null}
                              <td>{item?.strDescription}</td>
                              <td>{item?.strUoMname}</td>
                              <td style={{ width: '100px' }}>
                                 {item?.numRfqquantity}
                              </td>
                              <td
                                 className="disabled-feedback disable-border"
                                 style={{ width: '100px' }}
                              >
                                 <IInput
                                    value={rowDto?.objRow[index]?.rate || 0}
                                    name="rate"
                                    type="tel"
                                    min="0"
                                    required
                                    // max={item?.referenceNo && item?.restofQty}
                                    onChange={e => {
                                       let validNum = validateDigit(
                                          e.target.value
                                       );
                                       rowDtoHandler('rate', index, validNum);
                                    }}
                                 />
                              </td>

                              <td className="text-right">
                                 {item?.numRfqquantity * item?.rate || 0}
                              </td>
                              <td
                                 className="disabled-feedback disable-border"
                                 style={{ width: '150px' }}
                              >
                                 <IInput
                                    value={rowDto?.objRow[index]?.remarks || ''}
                                    name="remarks"
                                    type="text"
                                    // max={item?.referenceNo && item?.restofQty}
                                    onChange={e => {
                                       // let validNum = validateDigit(e.target.value);
                                       rowDtoHandler(
                                          'remarks',
                                          index,
                                          e.target.value
                                       );
                                    }}
                                 />
                              </td>
                              <td>
                                 <div className="d-flex justify-content-around align-items-center">
                                    {/* {item.attachment ? ( */}
                                    <div
                                       className={'image-upload-box'}
                                       onClick={onButtonCVClick}
                                       style={{
                                          cursor: 'pointer',
                                          position: 'relative',
                                          height: '25px',
                                       }}
                                    >
                                       <input
                                          onChange={e => {
                                             // e.stopPropagation();
                                             if (e.target.files?.[0]) {
                                                attachment_action(
                                                   e.target.files,
                                                   setLoading
                                                )
                                                   .then(data => {
                                                      setAttachmentFile(
                                                         data?.[0]?.id
                                                      );
                                                      rowDtoHandler(
                                                         'strAttachment',
                                                         myIndex,
                                                         data?.[0]?.id
                                                      );
                                                   })
                                                   .catch(error => {
                                                      setAttachmentFile('');
                                                   });
                                             }
                                          }}
                                          type="file"
                                          ref={inputCVFile}
                                          id="file"
                                          style={{ display: 'none' }}
                                       />
                                       {/* {!item?.vesselAttachment &&  */}
                                       <div className="">
                                          <i
                                             class="fa fa-upload"
                                             aria-hidden="true"
                                             onClick={e => {
                                                setMyIndex(index);
                                             }}
                                          ></i>
                                       </div>
                                    </div>
                                    {item?.strAttachment && (
                                       <>
                                          <IView
                                             title={'Attachment'}
                                             classes={'text-primary'}
                                             clickHandler={() => {
                                                dispatch(
                                                   getDownlloadFileView_Action(
                                                      item?.strAttachment
                                                   )
                                                );
                                             }}
                                          />
                                       </>
                                    )}
                                 </div>
                              </td>
                           </tr>
                           </>
                           
                        );
                     })}

                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Sub Total
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {(subTotal || 0).toFixed(2)}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Discount
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {`${(getPercentageValue(
                              +values?.discountPercentage,
                              subTotal
                           )).toFixed(2)} (${values?.discountPercentage || 0}%)`}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Total After Discount
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {((subTotal || 0) -
                              (getPercentageValue(
                                 +values?.discountPercentage,
                                 subTotal
                              ) || 0)).toFixed(2)}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Transportation
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {+values?.transportCost || 0}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Other Cost
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {+values?.othersCost || 0}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                     <tr>
                        <td
                           colSpan={rowDto?.objRow[0]?.intItemCategoryId === 624 ? 9 : 7}
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           Grand Total
                        </td>
                        <td
                           className="text-right font-weight-bold "
                           style={{ fontSize: '12px' }}
                        >
                           {((subTotal || 0) -
                              (getPercentageValue(
                                 +values?.discountPercentage,
                                 subTotal
                              ) || 0) +
                              (+values?.transportCost || 0) +
                              (+values?.othersCost || 0)).toFixed(2)}
                        </td>
                        <td>{''}</td>
                        <td>{''}</td>
                     </tr>
                  </tbody>
               </table>
               </div>
            </>
         )}
      </div>
   );
};

export default QuotationCreateRowDtoTable;
