import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Form } from "formik";
import { getSalesInvoiceLandingData } from "../helper"
import IViewModal from '../../../_helper/_viewModal';


export default function Invoice({show, onHide, shippointDDL, gridData, setGridData}) {
  
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  //setPositionHandler
  // eslint-disable-next-line no-unused-vars
  const setPositionHandler = (pageNo, pageSize, values) => {
    getSalesInvoiceLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      pageNo,
      pageSize,
      values?.counter?.value,
      values?.fromDate,
      values?.toDate
    )
  };

  return (
    <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="Invoice List"
        style={{ fontSize: "1.2rem !important" }}
    >
     
      <>
        <Form>
          <div className="row">
          <div className="col-md-3 total-bill-info-container" style={{margin:'auto'}}>
              <div className="total-bill-info">
                <div className="bill-info">
                  <h6>Total Bill</h6>
                  <h5>{"1200"}</h5>
                </div>
                  <div className="bill-info">
                    <h6>Cash Receive</h6>
                    <h5>
                        {"500"}
                    </h5>
                  </div>
                  <>
                    {/* <div className="bill-info">
                      <Select
                        placeholder="Select Bank Name"
                        value={values?.bankName}
                        onChange={(obj) => {
                          setFieldValue("bankName", obj);
                        }}
                        styles={customStyles}
                        isSearchable={true}
                        options={bankNameDDL}
                      />
                    </div> */}
                  </>
                  <>
                    {/* <div className="bill-info">
                      <Select
                        placeholder="Select Bank Name"
                        value={values?.bankName}
                        onChange={(obj) => {
                          setFieldValue("bankName", obj);
                        }}
                        styles={customStyles}
                        isSearchable={true}
                        options={bankNameDDL}
                      />
                    </div> */}
                    {
                      <>
                        <div className="bill-info">
                          <h6>Card Number</h6>
                          <h5>
                            {"500"}
                          </h5>
                        </div>
                        <div className="bill-info">
                          <h6>Credit Amount</h6>
                          <h5>
                           {"500"}
                          </h5>
                        </div>
                      </>
                    }
                  </>
                <div className="bill-info">
                  <h6>VAT</h6>
                  <h5>15%</h5>
                </div>
                <div className="bill-info">
                  <h6>VAT AMOUNT</h6>
                  <h5>150</h5>
                </div>
                <div className="bill-info">
                  <h6>Total Discount</h6>
                  <h5>
                    {"345"}
                  </h5>
                </div>
                <div className="bill-info">
                  <h6>Net Total</h6>
                  {/* <h5>{parseFloat(total+(values?.shippingCharge?values?.shippingCharge:0)+(total*(15/100))-(values?.discountValueOnTotal?values?.discountValueOnTotal:0)).toFixed(2)}</h5> */}
                </div>
                {/* <div className="bill-info">
                  <h6>Balance Return</h6>
                  <h5>{parseFloat(total+(total*(15/100)))+(values?.shippingCharge?values?.shippingCharge:0)-(values?.cashAmount?values?.cashAmount:0).toFixed(2)}</h5>
                </div> */}
                <div className="shipping-charge">
                  <div>
                    <input 
                      type="checkbox" 
                      name="shipping-charge" 
                      id="shipping-charge"
                      selected="true" 
                    />
                    <label for="shipping-charge">Shipping Charge</label>
                  </div>
                    <h5>
                      347765
                    </h5>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </>
    </IViewModal>
  );
}
