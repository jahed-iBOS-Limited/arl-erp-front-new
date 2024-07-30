import React from "react";
//import logo1 from "../../../../logo/logo-1.jpg";
//import aponbazar from "../../../../logo/aponbazar.svg";

const SalesInvoicePrint = ({
  printRef,
  header,
  rowDto,
  profileData,
  counter
}) => {
  let totalQty = 0;
  let totalPrice = 0;
  let totalAmount = 0;
  return (
    <div className="invoice-container" ref={printRef}>
      {(rowDto?.length > 0 && header) &&
        <>
          <div className="invoice-header print-header">
            {/* <div style={{marginRight: "10px", marginTop: "-15px"}}>
              <img alt="" src={aponbazar} style={{ width: "100px" }} />
            </div> */}
            <div className="text-center">
              <h6>আকিজ ফেয়ার প্রাইস শপ</h6>
              <h6>{counter?.banglaAddress || ""}</h6>
            </div>
          </div>
          <div className="invoice-header text-center">
            <h6>ইনভয়েস নং : {header?.deliveryCode}</h6>
          </div>
          <div className="billing-info">
            <div className="bill-to">
              <p>
                শপ আইডি : {""} AEFPS
              </p>
            </div>
            <div class="bill-to">
              <p>
                বিক্রয় কর্মী : {profileData?.userName}
              </p>
            </div>
          </div>
          <div className="extra-info">
            <p>
              প্রিন্ট তারিখ ও সময় :{" "}
              {new Date().toLocaleString()}
            </p>
          </div>
          <div className="billing-info">
            <div className="bill-to">
              <p>
                ফ্যাক্টরী আইডি : AEFPS
              </p>
            </div>
            <div class="bill-to">
              <p>
                ক্রেতার মোঃ নং : {header?.partnerContactNo}
              </p>
            </div>
          </div>
          <div className="extra-info">
            <p>
              ক্রেতার নাম : {header?.soldToPartnerName}
            </p>
          </div>
          <div className="invioce-table">
            <table>
              <thead>
                <tr>
                  <th>পণ্য</th>
                  <th>পরিমান</th>
                  <th className="text-center">মূল্য</th>
                  <th className="text-right">মোট</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => {
                  totalQty += item?.quantity
                  totalPrice += item?.rate
                  totalAmount += item?.quantity * item?.rate
                  return (
                    <tr key={index}>
                      <td className="text-left">
                        <div className="table-item">
                          <p>{item?.itemName}</p>
                          <p>{item?.itemCode}</p>
                        </div>
                      </td>
                      <td className="text-center">{item?.quantity}</td>
                      <td className="text-center">{item?.rate}</td>
                      <td className="text-right">{(item?.quantity * item?.rate).toFixed(2)}</td>
                    </tr>
                  )
                })
                }
                <tr>
                  <td className="text-left">মোট টাকা</td>
                  <td className="text-center">{totalQty}</td>
                  <td className="text-center">{totalPrice.toFixed(2)}</td>
                  <td className="text-right">{totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="total-bottom">
            <div className="item-total-bottom discount">
              <span>নগদ প্রদান</span>
              <span>{header?.cashAmount}</span>
            </div>
            <div className="item-total-bottom vat">
              <span>বাকি</span>
              <span>{header?.creditAmount}</span>
            </div>
            <div className="item-total-bottom">
              <span>প্রদেয় টাকা</span>
              <span className="item-bold">{totalAmount.toFixed(2)}</span>
            </div>
            {/* <div className="item-total-bottom">
              <span>পে টাইপ</span>
              <span className="item-bold">Cash</span>
            </div> */}
            {/* <div className="item-total-bottom mb-1">
              <span>ব্যাংক চার্জ</span>
              <span className="item-bold">0</span>
            </div> */}
            <div className="item-total-bottom mb-1">
              <span>পরিশোধিত টাকা</span>
              <span className="item-bold">{totalAmount.toFixed(2)}</span>
            </div>
            <div className="condition-text text-center">
              মোট বাকি : {header?.dueAmount}
            </div>
            <div className="quote-text text-center">
              আকিজ ফেয়ার প্রাইস শপ এর সাথে থাকার জন্য ধন্যবাদ
            </div>

            <div className="w-25 pt-1 mt-10 signature-text">
              স্বাক্ষর
            </div>
          </div>

          <div className="invoice-footer text-center">
            {/* <p style={{ width: "55%" }}>Thank you for shopping with Us</p>
            <p style={{ width: "42%" }}>Visit Us: www.ibos.io</p> */}
            <p>System By : AKIJ iBOS Limited</p>
          </div>
        </>
      }
    </div>
  );
};

export default SalesInvoicePrint;
