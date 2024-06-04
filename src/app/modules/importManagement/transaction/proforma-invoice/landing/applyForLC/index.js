import React, { useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { getLetterHead } from "../../../../../financialManagement/report/bankLetter/helper";
import PrayerForIssuanceOfLC from "./prayerForIssuanceOfLC";
import "./style.scss";
import RequestForOriginalDocuments from "./requestForOriginalDocuments";
import RequestForIssuance from "./requestForIssuance";
import { UpdateLcApi } from "../../helper";
import Loading from "../../../../../_helper/_loading";

const PrayerForIssuance = ({ obj }) => {
  const [disabled, setDisabled] = React.useState(false);
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { values, buName, singleData } = obj;

  const printRef = useRef();

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `@media print {
        body {
            -webkit-print-color-adjust: exact;
            margin: 0mm;
        }
        @page {
            size: portrait ! important;
            margin: 15px 30px;
        }
    }`,
  });

  console.log(singleData, "singleData")
  return (
    <>
      {disabled && <Loading />}
      <div className="text-right">
        <button
          className="btn btn-primary px-3 py-2 mr-2"
          type="button"
          // onClick={() => {
          //   ExportPDF(`LC Application`, setLoading);
          // }}
          onClick={() => {
            handleInvoicePrint();
            const payload = {
              intLoCId: singleData?.lcId ||0,
              isBankInfoComplete: true,
              dteUpdateDate: new Date(),
              intUpdateDateBy: profileData?.userId,
            };
            UpdateLcApi(setDisabled,payload);
          }}
        >
          Export
        </button>
      </div>
      <div id="applyForLC" ref={printRef} contenteditable="true">
        <div
          className="invoice-header"
          style={{
            backgroundImage: `url(${getLetterHead({
              buId: selectedBusinessUnit?.value,
            })})`,
            backgroundRepeat: "no-repeat",
            height: "150px",
            backgroundPosition: "left 10px",
            backgroundSize: "cover",
            position: "fixed",
            width: "100%",
            top: "-30px",
            left: "-40px",
          }}
        ></div>
        <div
          className="invoice-footer"
          style={{
            backgroundImage: `url(${getLetterHead({
              buId: selectedBusinessUnit?.value,
            })})`,
            backgroundRepeat: "no-repeat",
            height: "100px",
            backgroundPosition: "left bottom",
            backgroundSize: "cover",
            bottom: "-0px",
            position: "fixed",
            width: "100%",
            left: "0px",
          }}
        ></div>

        {values?.applyType?.value === 1 && (
          <PrayerForIssuanceOfLC
            obj={{
              values,
              buName,
              singleData,
            }}
          />
        )}
        {values?.applyType?.value === 2 && (
          <RequestForOriginalDocuments
            obj={{
              values,
              buName,
              singleData,
            }}
          />
        )}
        {values?.applyType?.value === 3 && (
          <RequestForIssuance
            obj={{
              values,
              buName,
              singleData,
            }}
          />
        )}
      </div>
    </>
  );
};

export default PrayerForIssuance;
