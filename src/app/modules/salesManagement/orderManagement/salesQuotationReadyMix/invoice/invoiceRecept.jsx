import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import "./InvoiceRecept.css";
import { _todayDate } from "../../../../_helper/_todayDate";
import moment from "moment";

const InvoiceRecept = ({ printRef, invoiceData, businessPartnerInfo }) => {
  const {
    selectedBusinessUnit,
    profileData: { employeeFullName, designationName },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <div className="print_invoice_wrapper" ref={printRef}>
      <div className="header">
        <div className="office_info">
          <p>Corporate Office :Akij House, 198, Bir Uttam Mir Shawkat Sarak</p>
          <p>
            (Gulshan-Tejgaon Link Road), Tejgaon I/A, Dhaka-1208, Phone :
            09613313131, 09604313131
          </p>
          <p>Email: info@akij.net, Website: www.akijcement.com</p>
          <p>Factory Location: Dhour, Narayanganj.</p>
        </div>
        <div className="logo">
          <img
            style={{ width: "255px", objectFit: "cover" }}
            src={`${window?.location?.origin}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
            alt=""
          />
        </div>
      </div>

      <div className="main_table">
        <div>
          <p>Date: {moment(_todayDate()).format("DD MMM YYYY")}</p>
          <div className="bold">
            <p>To</p>
            <p>Managing Director</p>
            <p>{businessPartnerInfo?.strBusinessPartnerName}</p>
            <p> {businessPartnerInfo?.strBusinessPartnerAddress} </p>
            {/* <p>Banani, Dhaka-1213</p> */}
          </div>

          <div className="bold my-3">
            Subject: Commercial offer for "Akij Brand" Ready Mix Concrete
            {/* for Your prestigious Dhanmondi project. */}
          </div>

          <div className="mb-3">
            <p>Dear Sir,</p>
            <p>
              We are very much pleased to revised offer your esteemed
              institution our "Akij Brand" Ready Mix Concrete. Within corporate
              package, please find below the best possible price from Akij
              Cement RMC.
            </p>
          </div>

          <div className="mb-3">
            <div className="border-btm d-flex justify-content-between">
              <p className="bold">Delivery Address:</p>
              <p className="bold">Delivery Form</p>
            </div>

            <div className="d-flex justify-content-between">
              <div>
                <p>{invoiceData[0]?.address}</p>
                <p>Distance: {invoiceData[0]?.distancekm}</p>
              </div>
              <div>
                {/* <p>Dhour Plant(Unit-1)</p> */}
                <p>{invoiceData[0]?.shipPointName}</p>
                <p>Capacity: 12MT/Hours (120 CUM plant)</p>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <p className="bold border-btm">Product Specification</p>

            <div>
              <p>
                <span class="bold">Uses of Cement : </span> Akij Cement (Fly ash
                free PCC and OPC)
                {/* Ordinary Portland Cement) */}
              </p>
              <p>
                <span class="bold">Coarse aggregate : </span>
                100% Boulder crushed Stone Chips from UAE (20 mm & 12mm Well
                downgraded, ASTM C33)
              </p>
              <p>
                <span class="bold">Fine aggregate : </span>
                The best quantity 100% Sylhet sand, 2.5 FM-2.9 FM.
              </p>
              <p>
                <span class="bold">Admixture/Retarder : </span>
                Rheobuild-623 (BASF)/Aaurmix 300 Fosroc
              </p>
              <p>
                <span class="bold">Water Proofing Chemical : </span>
                Conplast WL Xtra
              </p>
            </div>
          </div>
        </div>

        <p className="text-center bold mb-2">{"Commercial Offer"}</p>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Strength in PSI (28 Days Cylinder)</th>
                <th>Cement Type</th>
                <th>Payment Mode</th>
                <th>Including AIT</th>
                <th>Including VAT</th>
                <th>Rate/CFT(BDT)</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.map((item, index) => {
                return (
                  <tr>
                    <td className="text-left">{item?.itemName}</td>
                    <td className="text-center">
                      {/OPC/.test(item?.itemName)
                        ? "Akij Brand OPC"
                        : "Akij Brand PCC"}
                    </td>
                    <td className="text-center">{`${item?.paymentMode}`}</td>
                    <td className="text-center">
                      {item?.isAitinclude ? "Yes" : "No"}
                    </td>
                    <td className="text-center">
                      {item?.isIncludeVat ? "Yes" : "No"}
                    </td>
                    <td className="text-center">{item?.itemPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="note bold">
          <p>Note:</p>
          <ul>
            {/* <li>Rate is Including AIT & VAT (RMC not vat able item)</li> */}
            <li>
              BDT-141.26 per cum(4tk/Cft) will be added for water proofing
              chemical
            </li>
            <li>
              AIT Challan must be submitted to us within 15 days from delivery
              date
            </li>
            <li>
              Client will have to provide minimum 4/6/8/10 Nos bags cement for
              grouting purpose.
            </li>
          </ul>
        </div>

        <div className="my-2">
          <p className="bold border-btm">
            We will also provide you "Computerized Blending Sheet" with every
            mixture truck.
          </p>

          <p>
            <span>Concrete mixture truck : </span>
            we have 60 mixture truck (6 m3/2.11.89 & m3 / 282 & 10m3/ 353 cft
            capacity truck). Pumping facilities: We have 16(Sixteen) world class
            pumping machine, which capacity of lifting in up to 35th floor.
          </p>

          <p>
            <span>Laboratory Test Facility : </span>
            The sample will be taken at random jointly at site. As per the
            requirement of your company, periodic cylinder test can be performed
            in out own labratory compression machine, in front of your
            representative, which is free of cost. If any condition arises,
            Sample can be tested from BUET. (Testing Cost free more than 2500
            cft casting ans less than 2500 cft casting testing cost will bear by
            customer.) If 1st cylinder is Failed then 2nd set of cylinder will
            spend jointly. In-case of further failure we will arrange jointly
            Hammer or Core Cutting test. For final failure we will provide
            damarrage/ replace / repair or any solution taken by jointly
          </p>
        </div>

        {/* <div className="mb-4">
          <p>
            <span class="bold">Mode of Payment: </span>
            Payment made by local L/C in favor of "Akij Ready Mix Concrete
            Limited"
          </p>
        </div> */}

        <div className="mb-2">
          <p className="bold">Pumping Charge</p>
          <p>
            Pump shall be provided for quantities more than 1500 cft. It pumps
            is required for required for quantities less than 1500 cft,
            additional BDT. 7500 (L.S) to be paid by the client.
          </p>
        </div>

        <div className="mb-2">
          <p className="bold">Grouting: </p>
          <p>
            Client will have to provide minimum 4/6/8 Nos bags cement for
            grouting purpose
          </p>
        </div>

        <div className="mb-2">
          <p className="bold">Price Validity: </p>
          <p>
            The prices are valid for 30 days from the date of submission of
            quotation.
          </p>
        </div>

        <div className="mb-2">
          <p className="bold">Supply Validity: </p>
          <p>
            Supply validity at the above rates is for 30 days from te date of
            submission of quotation.
          </p>
          <p>
            Please accept the assurance of out hightest co-operation and we look
            forward to receiving your order at the earlist.
          </p>
        </div>
      </div>

      <p className="bold mt-2">Thanks & Best Regards,</p>

      <p className="bold mt-3"> {employeeFullName} </p>
      <p className="bold"> {designationName} </p>
    </div>
  );
};

export default InvoiceRecept;
