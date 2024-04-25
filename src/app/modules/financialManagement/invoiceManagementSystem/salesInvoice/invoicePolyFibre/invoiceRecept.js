import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ToWords } from "to-words";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import "./InvoiceRecept.css";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { polyFibreLetterhead } from "../base64Images/polyFibre";
// import background from "../../../../_helper/letterheadImages/poly_fibre_letterhead.jpg";

const InvoiceReceptForPolyFibre = ({ printRef, invoiceData }) => {
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  // get user data from store
  const {
    profileData: { employeeFullName: empName, designationName },
    selectedBusinessUnit: { label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  let totalQty = 0;
  let totalAmount = 0;
  let grandTotal = 0;
  let vatTotal = 0;

  return (
    <div
      id="print_invoice_wrapper_poly_fibre"
      ref={printRef}
      style={{
        backgroundImage: `url(${polyFibreLetterhead})`,
        backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        backgroundPosition: "50% 50%",
        backgroundSize: "cover",
        width: "100%",
        height: "100%",
      }}
    >
      {/* <div className="header">
        <img style={{ height: "70px" }} src={logo} alt="logo" />

        <div className="office_info ml-2">
          <p style={{ marginBottom: "0" }}>
            Akij Poly Fibre Industries Limited
          </p>
        </div>

        <p style={{ marginBottom: "0", fontSize: "18px" }}>
          Akij House, 198, Bir Uttam Mir Shawkat Sarak, Gulshan Link Road,
          Tejgaon I/A, Dhaka-1208 <br />
          Phone: 09613313131, 09604313131 Hotline: 16609 <br />
          <span style={{ letterSpacing: "-0.5px" }}>
            Factory: Nabiganj, Kadam Rasul, Narayangonj, Phone: 7661224, Fax:
            0088-9572292, E-mail: info@akij.net
          </span>
        </p>
      </div> */}
      <div style={{ margin: "0 50px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "10px",
            marginTop: "120px",
          }}
        >
          <i>
            <p
              style={{
                fontSize: "30px",
                textDecoration: "underLine",
                fontWeight: "bold",
              }}
            >
              Bill
              {/* {invoiceData[0]?.strInvoiceNo} */}
            </p>
          </i>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "18px",
          }}
        >
          <div>
            <p>
              <b>
                To, <br />
                {invoiceData[0]?.customerName} <br />
                {invoiceData[0]?.businessPartnerAddress}
              </b>
            </p>
            <br />
            <p>
              We do hearby submitting the bill for Bag supplied during the month
              of july, 2022, as per <br /> delivery statement enclosed, which
              may kindly by arrange for payment.
            </p>
            <br />
          </div>
          <div>
            <p>Bill No- {invoiceData[0]?.referance}</p>
            <p>Dated- {_dateFormatter(new Date())}</p>
          </div>
        </div>
        <div className="main_table">
          <table className="table">
            <thead>
              <tr>
                <th>SL</th>
                <th>PO NO</th>
                <th>Particulars</th>
                <th>Quantity (PCS)</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Value</th>
                <th>VAT</th>
                <th>Total Tk</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.map((item, index) => {
                totalQty += item.totalDeliveredQtyCFT;
                totalAmount += item?.totalAmount;
                grandTotal += item?.totalAmount + item?.vatTotal;
                vatTotal += item.vatTotal;

                return (
                  <tr key={`${index}${item?.poNumber}`}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.poNumber}</td>
                    <td>
                      {item?.strGoodsDescription || item?.goodsDescription}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalDeliveredQtyCFT, true)}
                    </td>
                    <td className="text-center">{item?.unit || "Pcs"}</td>
                    <td className="text-right">{item?.itemRate}</td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalAmount, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.vatTotal)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.totalAmount + item?.vatTotal)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                <td colSpan={3}>Grand Total</td>
                <td>{_fixedPoint(totalQty, true)}</td>
                <td colSpan={2}></td>
                <td>{_fixedPoint(totalAmount, true)}</td>
                <td>{_fixedPoint(vatTotal, true)}</td>
                <td>{_fixedPoint(grandTotal, true)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <p>In Words: {toWords.convert(grandTotal.toFixed(0))}</p>
        <div className="signature_wrapper">
          <div className="first signature bold">
            <p>{empName}</p>
          </div>
        </div>
        <p>{designationName}</p>
        <p>{buName}</p>
      </div>
    </div>
  );
};

export default InvoiceReceptForPolyFibre;
