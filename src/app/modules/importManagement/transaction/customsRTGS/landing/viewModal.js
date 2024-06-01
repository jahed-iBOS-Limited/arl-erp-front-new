import React, { useEffect, useState } from "react";
import Loading from "../../../../_helper/_loading";
import { getCustomRTGSById } from "../helper";
import { shallowEqual, useSelector } from "react-redux";

// {
//     "sl": 0,
//     "customRtgsId": 1,
//     "businessUnitId": 4,
//     "businessUnitName": "string",
//     "businessUnitAddress": "string",
//     "senderName": "Test",
//     "senderBankId": 1,
//     "senderBankName": "Test",
//     "senderBranchId": 1,
//     "senderBranchName": "Test",
//     "senderRoutingNo": "123654",
//     "senderAccountNo": "110552200",
//     "senderAddress": "Test",
//     "beneficiaryName": "Test",
//     "beneficiaryBankId": 2,
//     "beneficiaryBankName": "Test",
//     "beneficiaryBranchId": 2,
//     "beneficiaryBranchName": "Test",
//     "beneficiaryRoutingNo": "4569",
//     "beneficiaryAccountNo": "44455566998",
//     "beneficiaryBankEmail": "test@gmail.com",
//     "purchaseOrderId": 1,
//     "purchaseOrderNo": "PO-012",
//     "shipmentId": 1,
//     "shipmentNo": "SHP-0123",
//     "rtgsdate": "2024-06-01T13:14:24.56",
//     "objRow": [
//       {
//         "rowId": 3,
//         "customRtgsId": 1,
//         "customOfficeCode": "Test-01",
//         "registrationYear": 2024,
//         "registrationNo": "012",
//         "declarantCode": "Test-236",
//         "mobileNo": "01236",
//         "rtgsAmount": 100
//       },
//       {
//         "rowId": 4,
//         "customRtgsId": 1,
//         "customOfficeCode": "Test-01",
//         "registrationYear": 2024,
//         "registrationNo": "012",
//         "declarantCode": "Test-236",
//         "mobileNo": "01236",
//         "rtgsAmount": 100
//       }
//     ]
//   }

function ViewModal({ clickViewData }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clickViewData?.customRtgsId) {
      getCustomRTGSById(clickViewData?.customRtgsId, setLoading, (resData) => {
        setSingleData(resData);
      });
    }
  }, [clickViewData]);
  return (
    <div>
      {loading && <Loading />}

      <div className="printView">
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          <h2>{selectedBusinessUnit?.label}</h2>
          <p>{selectedBusinessUnit?.address}</p>
        </div>

        <div>
          <p>
            <b>{singleData?.senderBankName}</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
