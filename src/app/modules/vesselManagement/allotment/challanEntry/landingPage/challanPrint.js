import React, { useRef } from "react";
import "./challanStyle.css";
// import logo from "../../../../_helper/images/MTS.png";
import { useReactToPrint } from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { shallowEqual, useSelector } from "react-redux";
// import { ToWords } from "to-words";

const ChallanPrint = ({ challanInfo }) => {

  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const printRef = useRef();

  // const toWords = new ToWords({
  //   localeCode: "en-BD",
  //   converterOptions: {
  //     currency: true,
  //     ignoreDecimal: false,
  //     ignoreZeroCurrency: false,
  //     doNotAddOnly: false,
  //   },
  // });

  const items = challanInfo?.objectRowList
    ?.map((item) => item?.itemName)
    ?.join(", ");

  const printHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Challan Copy",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  const totalWeight = challanInfo?.objectRowList?.reduce(
    (a, b) => (a += b?.quantityTon),
    0
  );

  return (
    <>
      <div className="text-right">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => printHandler()}
        >
          Print
        </button>
      </div>

      <div className="challan_print_wrapper" ref={printRef}>
        {/* <div className="text-center">
          <h1>
            <b>চালান/DO</b>
          </h1>
        </div> */}
        <div className="text-center">
          <h1
            style={{
              fontWeight: "500",
              fontFamily: "impact",
              fontSize: "60px",
            }}
          >
            {selectedBusinessUnit?.label}
          </h1>
          <h2><b>A sister concern of Akij Resources</b></h2>
          {/* <img
            style={{ height: "60px", margin: "5px auto 15px auto" }}
            src={logo}
            alt="logo"
          /> */}
        </div>
        <section>
          <div className="flex">
            <div>
              <p>
                {challanInfo?.businessUnitAddress} <br />
                phone: 08000555777
                <br />
                E-mail: info@thesuccessors.com
                <br />
                DO: {challanInfo?.deliveryCode}
              </p>
            </div>
            <div>
              <p>জরুরী প্রয়োজনে</p>
              <div className="flex">
                <p>মোবাইল : </p>
                <p> 01707-851505</p>
              </div>
            </div>
          </div>
        </section>
        <br />
        <section>
          <div className="flex">
            <div style={{ verticalAlign: "center" }}>
              <p>চালান নং- {challanInfo?.salesOrderCode}</p>
            </div>
            <div>
              মাদার ভেসেল: {challanInfo?.motherVesselName} <br />
              বরাদ্দ পত্র নং- {challanInfo?.program}
            </div>
            <div>
              তাং {_dateFormatter(challanInfo?.deliveryDate)}
              <br />
              লট নং {challanInfo?.lcNumber}
            </div>
          </div>
        </section>

        <section>
          <div style={{ borderBottom: "1.5px solid black" }}>
            <div className="flex mb-5">
              <div className="width_50 pr-5">
                <p>প্রেরকঃ M/S The Successors</p>
                <p>লোডিং পয়েন্ট : {challanInfo?.shipPointName}</p>
                <p>ট্রাক/বাস মালিকের নাম : {challanInfo?.supplierName}</p>
                <p>ঠিকানা : </p>
                <p>মোবাইল নং : </p>
                {/* <p>গাড়ীর ব্লু-বুক নং : ....................................</p>
                <p>মোট ভাড়া : {challanInfo?.totalLogsticFare}</p>
                <p>অগ্রিম প্রদান : {challanInfo?.advanceLogisticeFare}</p>
                <p>বকেয়া ভাড়া : {challanInfo?.dueFare}</p>
                <p>
                  কথায় :
                  {toWords.convert(challanInfo?.totalLogsticFare?.toFixed(0))}
                </p> */}
                <p>
                  চালানে উল্লেখিত সঠিক ওজনের মাল নিজ দায়িত্বে নির্দিষ্ট গন্তব্যে
                  পৌঁছানোর নিমিত্তে বুঝিয়া পাইয়া নিম্নে স্বাক্ষর করিলাম।
                </p>
                <br />
                <p>চালকের স্বাক্ষর : ......................................</p>
                <p>তাং : ...............................................</p>
                <br />
              </div>
              <div className="width_50 pl-5">
                <p>প্রাপকঃ : {challanInfo?.soldToPartnerName}</p>
                <p>গুদামের নাম : {challanInfo?.shipToPartnerName}</p>
                <p>ট্রাক/বার্জ নং : {challanInfo?.vehicleRegNo}</p>
                <p>চালক/মাষ্টারের নাম : {challanInfo?.driverName}</p>
                <p>লাইসেন্স নং : .......................................</p>
                <p>ঠিকানা: {challanInfo?.address}</p>
                <p>মোবাইল নং : {challanInfo?.driverPhone}</p>
                <p>মালের বিবরণ : {items}</p>
                <p>মালের প্রকৃত পরিমান : {totalWeight} টন</p>
                <p>সর্বমোট বস্তা : {challanInfo?.totalDeliveryQuantity}</p>
                <p>খালি বস্তার পরিমান : {challanInfo?.emptyBag}</p>
                <br />
                <p>প্রতিনিধির স্বাক্ষর : ...................................</p>
                <p>নাম : .............................................</p>
                <p>তাং : .............................................</p>
                <br />
              </div>
            </div>
          </div>
        </section>

        <section>
          <br />
          <div className="text-center">
            <h1>
              <b>প্রাপ্তি স্বীকার অংশ</b>
            </h1>
            <h5>উক্ত চালানে উল্লেখিত সার ভাল অবস্থায় বুঝিয়া পাইলাম। </h5>
          </div>
        </section>
        <br />
        <br />
        <br />
        <br />
        <div className="signature_wrapper">
          <div className="first signature bold">
            <p>গুদাম রক্ষকের সীল/স্বাক্ষর </p>
          </div>
          <div className="first signature bold">
            <p>কর্মকর্তার সীল/স্বাক্ষর </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallanPrint;
