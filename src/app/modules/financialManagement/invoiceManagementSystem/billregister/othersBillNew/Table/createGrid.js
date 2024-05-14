import React from "react";
import InputField from "../../../../_helper/_inputField";

import Loading from "../../../../_helper/_loading";

const CreateGrid = ({ rowDto, loading, values, grandTotal, setFieldValue }) => {
  const totalAmount = () => {
    return (
      grandTotal?.totalAmount +
      +values?.advancedPayment +
      +values?.discount +
      +values?.transportationCost
    );
  };

  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table table-font-size-sm">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>No</th>
                <th style={{ width: "80px" }}>Product Description</th>
                <th style={{ width: "80px" }}>Quantity (MT)</th>
                <th style={{ width: "100px" }}>Unit price(Tk.) </th>
                <th style={{ width: "100px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.length > 0 &&
                rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {tableData?.productDescription} </td>
                    <td className="text-center"> {tableData?.quantity} </td>
                    <td className="text-right"> {tableData?.unitPrice} </td>
                    <td className="text-right"> {tableData?.amount} </td>
                  </tr>
                ))}
              {rowDto?.length > 0 && (
                <>
                  <tr>
                    <td colSpan="2" className="text-right" style={{fontWeight: 600}}>
                      Total Sales
                    </td>
                    <td className="text-center" style={{fontWeight: 600}}>{grandTotal?.totalQuantity}</td>
                    <td></td>
                    <td className="text-right" style={{fontWeight: 600}}>{grandTotal?.totalAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td className="text-left" style={{fontWeight: 600}}>Transportation Cost</td>
                    <td></td>
                    <td>
                      <InputField
                        value={values?.transportationCost}
                        name="transportationCost"
                        placeholder="Transportation Cost"
                        type="number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td className="text-left" style={{fontWeight: 600}}>Discount</td>
                    <td></td>
                    <td>
                      <InputField
                        value={values?.discount}
                        name="discount"
                        placeholder="Discount"
                        type="number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td className="text-left" style={{fontWeight: 600}}>Advanced Payment</td>
                    <td></td>
                    <td>
                      <InputField
                        value={values?.advancedPayment}
                        name="advancedPayment"
                        placeholder="Advanced Payment"
                        onChange={(e)=>{
                          if(e.target.value < 0){
                            setFieldValue('advancedPayment', 0);
                          }
                          else{
                            setFieldValue('advancedPayment', e.target.value);
                          }
                        }}
                        type="number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td style={{fontWeight: 600}}>Total Amount</td>
                    <td></td>
                    <td className="text-right" style={{fontWeight: 600}}>{totalAmount()}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGrid;
