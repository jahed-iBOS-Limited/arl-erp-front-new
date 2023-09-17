import React from "react";

export default function PartnerBankInfo({ bankInfo }) {
  return (
    <div class="border p-8 m-2">
      <h5>Partner Bank Info</h5>
      <hr />
      <div class="row mt-6">
        <div class="col">
          <label style={{ fontWeight: "bold" }}>
            Account Name
          </label>
          <div>{bankInfo?.bankAccountName}</div>
        </div>
        <div class="col">
            <label style={{ fontWeight: "bold" }}>
            Account No
          </label>
          <div>{bankInfo?.bankAccountNo}</div>
        </div>
        <div class="col">
            
            <label style={{ fontWeight: "bold" }}>
            Bank List
          </label>
          <div>{bankInfo?.bankBranchName}</div>
            </div>
        <div class="col">
           
            <label style={{ fontWeight: "bold" }}>
            Bank Branch
          </label>
          <div>{bankInfo?.bankBranchName}</div>
            </div>
        <div class="col">
           
            <label style={{ fontWeight: "bold" }}>
            Routing
          </label>
          <div>{bankInfo?.routingNo}</div>
            </div>
        <div></div>
      </div>
    </div>
  );
}
