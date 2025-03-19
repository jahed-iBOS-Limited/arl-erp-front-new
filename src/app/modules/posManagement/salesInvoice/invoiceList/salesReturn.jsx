import React, { useState } from "react";
import InputField from './../../../_helper/_inputField';
import { getSalesInvoiceByVoucherCode } from "../helper"
import { useSelector, shallowEqual } from 'react-redux';

export default function SalesReturn({ 
  rowDto, 
  setVoucherCode, 
  values, 
  updateSalesReturnQty,
  setSingleData,
  setSalesReturnDto
}) {
  const [voucher, setVoucher] = useState("")
  
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const updateReturnQty=(value, index)=>{
    const data=rowDto
    data[index].returnQuantity = parseInt(value);
    setSalesReturnDto(data)
  }


  return (
    <>
      <div className="row global-form" 
        style={{ width:'100%', padding:"0px 0px 8px 0px", marginBottom:"0px"}}
      >
        <div className="col-lg-3">
          <label>Sales Voucher Code</label>
          <InputField
            value={values?.salesVoucherCode}
            name="salesVoucherCode"
            placeholder="Search....."
            onChange={(e)=>setVoucher(e.target.value)}
            type="text"
          />
        </div>

        <div className="col-lg-2">
          <button
            className="btn btn-primary mt-5"
            type="button"
            onClick={() => {
              setVoucherCode(voucher)
              getSalesInvoiceByVoucherCode(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                voucher, 
                setSingleData, 
                setSalesReturnDto
              )
            }}
          >
            View
          </button>
        </div>
      </div>
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Name</th>
            <th>UOM</th>
            <th>Quantity</th>
            <th style={{ width: "120px" }}>Return Qty</th>
            <th>Rate</th>
            <th>VAT</th>
            <th>Discount</th>
            <th>Sub Total</th>
            <th style={{ width: "70px" }}>Action</th>
          </tr>
        </thead>
        <tbody className="itemList">
          {rowDto?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="text-left">{item?.itemName}</td>
              <td>{item?.uomName}</td>
              <td>{item?.quantity}</td>
              <td className="text-center">
                <input
                  style={{ width: "100%", borderRadius: "5px" }}
                  key={index}
                  type="number"
                  name="quantity"
                  defaultValue={item?.returnQuantity}
                  onChange={(e) => {
                    if(e.target.value>=0){
                      updateReturnQty(e.target.value, index)
                    }
                  }}
                />
              </td>
              <td className="text-center">{item?.rate}</td>
              <td className="text-center">{item?.vat}</td>
              <td className="text-center">
                {item?.totalDiscountValue}
              </td>
              <td className="text-right">
                {item?.quantity * item?.rate -
                  item?.totalDiscountValue}
              </td>
              <td className="text-center">
                <button
                  type="button"
                  className="btn btn-outline-dark pointer"
                  style={{ padding: "1px 10px", fontSize: "11px" }}
                  onClick={() =>{
                    updateSalesReturnQty(item);
                  }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>  
  );
}
