import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useReactToPrint } from "react-to-print";
import ISpinner from "../../../../_helper/_spinner";
import PrintViewSixPointThree from "../../createSales/printView";
import { GetTaxSalesInvoiceListApi } from "../helper";
import printIcon from "./../../../../_helper/images/print-icon.png";
function ModalDateRangeModal({ values }) {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetTaxSalesInvoiceListApi(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      {loading && <ISpinner isShow={loading} />}
      <>
        {gridData?.length > 0 && (
          <>
            <div className="d-flex justify-content-end align-items-center">
              <b className="pr-5">Total Count: {gridData?.length}</b>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "5px 11px" }}
                onClick={handlePrint}
              >
                <img
                  src={printIcon}
                  alt="print-icon"
                  style={{ width: "15px" }}
                />
                Print
              </button>
            </div>
            <div ref={componentRef}>
              <style type="text/css">
                {`@media print {
  .page-break-salesInvoice {
    page-break-after: always;
  }
}`}
              </style>
              {gridData?.map((item, index) => {
                return (
                  <>
                    <PrintViewSixPointThree
                      salesInvoicePrintStatus={item?.objHeader?.isPrint}
                      singleData={item}
                    />
                    <div class="page-break-salesInvoice"></div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </>
    </>
  );
}

export default ModalDateRangeModal;
