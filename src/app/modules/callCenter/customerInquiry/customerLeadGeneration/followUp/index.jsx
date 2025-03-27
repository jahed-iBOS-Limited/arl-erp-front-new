import React from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { Tab, Tabs } from "react-bootstrap";
import HistoryTab from "./HistoryTab";
import CallTab from "./CallTab";
import EmailTab from "./EmailTab";
import MeetingTab from "./MeetingTab";

export default function FollowUp() {
  let history = useHistory();
  const { id } = useParams();
  const [data, GetCustomerLeadById, isLoadingCustomerLeadById] = useAxiosGet();

  React.useEffect(() => {
    if (id) {
      GetCustomerLeadById(
        `/oms/SalesQuotation/GetCustomerAcquisitionById?customerAcquisitionId=${id}`
      );
    }

  }, [id]);
  return (
    <ICustomCard
      title="Follow Up"
      backHandler={() => {
        history.goBack();
      }}
    >
      {isLoadingCustomerLeadById && <Loading />}
      <div style={{ display: "grid", gap: "10px", paddingTop: "10px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "10px",
            border: "1px solid #ECF0F3",
            borderRadius: "5px",
          }}
        >
          <div>
            <b>Name:</b> {data?.customerName}
          </div>
          <div>
            <b>Email:</b> {data?.customerEmail}
          </div>
          <div>
            <b>Phone:</b> {data?.customerPhone}
          </div>
          <div>
            <b>Zone:</b> {data?.transportZoneName}
          </div>
          <div>
            <b>Ship To Partner:</b> {data?.shipToPartnerName}
          </div>
          <div>
            <b>Address:</b> {data?.shipToPartnerAddress}
          </div>
          <div>
            <b>Total Item:</b> {data?.totalItem}
          </div>
          <div>
            <b>Total Quantity:</b> {data?.totalQuantity}
          </div>
          <div>
            <b>Current Stage:</b> {data?.currentStage}
          </div>
          <div>
            <b>Status:</b> {data?.isRejected ? "Rejected" : "Active"}
          </div>
        </div>
        <div>
          <Tabs
            defaultActiveKey="history"
            // id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab unmountOnExit eventKey="history" title="History">
              <HistoryTab id={id} />
            </Tab>
            <Tab unmountOnExit eventKey="call" title="Call">
              <CallTab data={data} />
            </Tab>
            <Tab unmountOnExit eventKey="email" title="Email">
              <EmailTab data={data} />
            </Tab>
            <Tab unmountOnExit eventKey="meeting" title="Meeting ">
              <MeetingTab data={data} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </ICustomCard>
  );
}

// {
//     "customerAcquisitionId": 7,
//     "customerName": "Md Abdul Kader",
//     "customerEmail": "kader@ibos.io",
//     "customerPhone": "01700000000",
//     "storied": "Poultry",
//     "projectStatusId": 144,
//     "projectStatusName": "Planning/Initiation",
//     "divisionId": 1,
//     "divisionName": "Barishal",
//     "districtId": 2,
//     "districtName": "Barguna",
//     "transportZoneId": 0,
//     "transportZoneName": null,
//     "shipToPartnerId": null,
//     "shipToPartnerName": "Shop 001",
//     "shipToPartnerAddress": null,
//     "businessPartnerId": 0,
//     "businessPartnerName": "",
//     "referenceId": 323775,
//     "referenceName": "Md Humaun Kabir [ACCL-1429]",
//     "deliveryAddress": "Lalmatia mohammad pur",
//     "referralSource": "Facebook",
//     "currentStage": "Suspect",
//     "totalItem": 2,
//     "totalQuantity": 3.00,
//     "isSuspect": true,
//     "isProspect": false,
//     "isLead": false,
//     "isCustomer": false,
//     "isClient": false,
//     "isRejected": true,
//     "territoryId": 25107,
//     "territoryName": "Dinajpur",
//     "areaId": 25092,
//     "areaName": "Dinajpur-1",
//     "regionId": 25067,
//     "regionName": "Dinajpur",
//     "shipPointId": 550,
//     "shipPointName": "AAFL Jhenaidah Warehouse",
//     "currentBrandId": 164,
//     "currentBrandName": "C.P. Bangladesh Co. Ltd.",
//     "actionBy": 521235,
//     "actionByName": "Md. Monirul Islam ",
//     "updatedBy": 521235,
//     "updatedByName": "Md. Monirul Islam ",
//     "rowList": [
//         {
//             "rowId": 7,
//             "customerAcquisitionId": 7,
//             "itemId": 184363,
//             "itemName": "Unusable Iron Scrap",
//             "itemCode": "14412152",
//             "uomId": 55,
//             "uomName": "",
//             "isActive": false,
//             "quantity": 1.00
//         },
//         {
//             "rowId": 8,
//             "customerAcquisitionId": 7,
//             "itemId": 192065,
//             "itemName": "Pre-Starter (Pabda/Gushla/Sing/Magur/Shoal) (503) 25 Kg",
//             "itemCode": "14412306",
//             "uomId": 132,
//             "uomName": "",
//             "isActive": false,
//             "quantity": 2.00
//         }
//     ]
// }
