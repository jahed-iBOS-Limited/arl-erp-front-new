import React from "react";

export default function PartnerBasicInfo({ basicInfo }) {
  return (
    <div class="border p-8 m-2">
      <h5>Partner Basic Info</h5>
      <hr />
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
            Business Partner Name
          </label>
          <div>{basicInfo?.businessPartnerName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
            Partner Type
          </label>
          <div>{basicInfo?.businessPartnerTypeName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >Partner Address</label>
          <div>{basicInfo?.businessPartnerAddress}</div>
        </div>
      </div>
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          Proprietor Name
          </label>
          <div>{basicInfo?.propitor}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          Contact Number (Propretor)
          </label>
          <div>{basicInfo?.contactNumber}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >Contact (Person)</label>
          <div>{basicInfo?.contactPerson}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >Contact Number(Person)</label>
          <div>{basicInfo?.contactNumber2}</div>
        </div>
      </div>
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          Bin (Optional)
          </label>
          <div>{basicInfo?.bin}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          Email
          </label>
          <div>{basicInfo?.email}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >license Number</label>
          <div>{basicInfo?.licenseNo}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >State Division (Optional)</label>
          <div>{basicInfo?.divisionName}</div>
        </div>
      </div>
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          City District(Optional)
          </label>
          <div>{basicInfo?.districtName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }} >
          Police Station (Optional)
          </label>
          <div>{basicInfo?.upazilaName}</div>
        </div>
      </div>
    </div>
  );
}
