import React, { useEffect, useState, useRef } from "react";
import Loading from "../../../../_helper/_loading";
import { getCustomRTGSById } from "../helper";
import { moneyInWord } from "../../../../_helper/_convertMoneyToWord";
import { shallowEqual, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import "./viewModal.scss";
import moment from "moment";

function ViewModal({ clickViewData }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState("");

  useEffect(() => {
    if (clickViewData?.customRtgsId) {
      getCustomRTGSById(clickViewData?.customRtgsId, setLoading, (resData) => {
        setSingleData(resData);
      });
    }
  }, [clickViewData]);

  useEffect(() => {
    const rtgsAmount = singleData?.objRow?.reduce(
      (acc, curr) => acc + (+curr.rtgsAmount || 0),
      0
    );
    setTotal(rtgsAmount);
  }, [singleData]);

  useEffect(() => {
    if (total) {
      moneyInWord(total, setTotalInWords);
    }
  }, [total]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Customs-RTGS",
    pageStyle: `
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        border: 1px solid black !important; // Add this 
     
      }
      @page {
        size: portrait !important;
        margin: 50px !important;
      }
    }
  `,
  });

  return (
    <div>
      {loading && <Loading />}
      <div
        style={{
          textAlign: "right",
        }}
      >
        <button
          type="button"
          className="btn btn-primary px-3 py-2"
          onClick={handlePrint}
        >
          <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
          Print
        </button>
      </div>
      <div className="customsRTGSprintView" ref={componentRef}>
        <div
          style={{
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          <h2>{selectedBusinessUnit?.label}</h2>
          <p>{selectedBusinessUnit?.address}</p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "70px",
          }}
        >
          <p>
            <b>{singleData?.senderBankName}</b>
          </p>
          <p>{singleData?.senderBranchName} Branch</p>
        </div>

        <div>
          <h6
            style={{
              textAlign: "center",
              background: "#ecf0f3",
              padding: "5px",
            }}
          >
            Application Form for RTGS Customs Duty Payment
          </h6>
          <p
            style={{
              textAlign: "right",
            }}
          >
            <span>Date: {moment().format("LL")}</span>
          </p>
        </div>

        <div className="applicaitonTopInfo">
          <p>Mutharam</p>
          <p>Assalamu Alaikum</p>
          <p>
            Please remit the amount as per following particulars by dediting our
            account mentioned below
          </p>
        </div>

        <div className="bankInfo">
          <div className="react-bootstrap-table table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th> Particulars </th>
                  <th>Sender Information</th>
                  <th>Beneficiary Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> Name</td>
                  <td>
                    <b>{singleData?.senderName}</b>
                  </td>
                  <td>{singleData?.beneficiaryName}</td>
                </tr>
                <tr>
                  <td> Bank</td>
                  <td>{singleData?.senderBankName}</td>
                  <td>{singleData?.beneficiaryBankName}</td>
                </tr>
                <tr>
                  <td> Branch</td>
                  <td>{singleData?.senderBranchName}</td>
                  <td>{singleData?.beneficiaryBranchName}</td>
                </tr>
                <tr>
                  <td> Routing No</td>
                  <td>{singleData?.senderRoutingNo}</td>
                  <td>{singleData?.beneficiaryRoutingNo}</td>
                </tr>
                <tr>
                  <td> Account No</td>
                  <td>
                    <b>{singleData?.senderAccountNo}</b>
                  </td>
                  <td>
                    <b>{singleData?.beneficiaryAccountNo}</b>
                  </td>
                </tr>
                <tr>
                  <td> Address</td>
                  <td>{singleData?.senderAddress}</td>
                  <td>{singleData?.beneficiaryBankEmail}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="customInfo"
          style={{
            marginTop: "20px",
          }}
        >
          <div className="react-bootstrap-table table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th> SL No </th>
                  <th>Custom Office code</th>
                  <th>Registration Year</th>
                  <th>Registration(BE) No</th>
                  <th>Declarant Code</th>
                  <th>Mobile No</th>
                  <th>RTGS Amount</th>
                </tr>
              </thead>
              <tbody>
                {singleData?.objRow?.map((item, index) => (
                  <tr key={index}>
                    <td> {index + 1}</td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item?.customOfficeCode}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item?.registrationYear}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item?.registrationNo}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item?.declarantCode}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item?.mobileNo}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                      }}
                    >
                      BDT: {item?.rtgsAmount}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan="5" className="borderBottomNone"></td>
                  <td>
                    <b>Total RTGS Amount</b>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                    }}
                  >
                    BDT {total}
                  </td>
                </tr>
                <tr
                  style={{
                    height: "25px",
                  }}
                >
                  <td colSpan="5" className="borderTopNone"></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2">
                    <b>Total RTGS Amount</b>
                  </td>
                  <td>
                    <b>Commission</b>
                  </td>
                  <td>
                    <b>VAT</b>
                  </td>
                  <td colSpan="2">
                    <b>Total Taka</b>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <b>{total}</b>
                  </td>
                  <td></td>
                  <td></td>
                  <td colSpan="2">{total}</td>
                </tr>
                <tr>
                  <td></td>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <b>Amount in word</b>
                  </td>
                  <td colSpan="4">
                    <b>{totalInWords}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            marginBottom: "90px",
            marginTop: "50px",
          }}
        >
          <p>Yours Faithfully</p>
          <p>For, {selectedBusinessUnit?.label}</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "30px",
            marginBottom: "20px",
          }}
        >
          <p>
            <b>Authorized Signature</b>
          </p>
          <p>
            <b>Authorized Signature</b>
          </p>
        </div>
        <div>
          <p>
            <b>A/C No-{singleData?.senderAccountNo}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
