import React from "react";

export default function PartnerSalesInfo({ sales, shippintAddress }) {
  return (
    <div class="border p-5 m-2">
      <h3>Partner Sales Info</h3>
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Customer Type</label>
          <div>{sales?.customerType}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>sales Organization</label>
          <div>{sales?.salesOrganizationName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Distribution Channel</label>
          <div>{sales?.distributionChannelName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Sales Territory</label>
          <div>{sales?.distributionChannelCode}</div>
        </div>
      </div>
      <div class="row mt-6">
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Price Structure</label>
          <div>{sales?.priceStructureName}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Payment Mode</label>
          <div>{sales?.creditFacilityType}</div>
        </div>
        <div class="col-lg-3">
          <label style={{ fontWeight: "bold" }}>Exclusivity</label>
          <div>{sales?.isExclusive ? "Exclusive" : "Non-Exclusive"}</div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 mb-2 d-flex align-items-center">
          <label className="mt-1">
            <input
              disabled
              type="checkbox"
              name="isTaxOnDeliveryAmount"
              label="Tax On Delivery"
              style={{
                marginRight: "5px",
                position: "relative",
                top: "3px",
              }}
              checked={sales?.isTaxBasedOnDeliveryAmount}
            />
            <span>Tax On Delivery</span>
          </label>
        </div>
        <div className="col-lg-3 mb-2 d-flex align-items-center">
          <label className="mt-1">
            <input
              type="checkbox"
              disabled
              name="priceIncludingTax"
              label="Price Including Tax"
              style={{
                marginRight: "5px",
                position: "relative",
                top: "3px",
              }}
              checked={sales?.isBackCalculation}
            />
            <span>Price Including Tax</span>
          </label>
        </div>
        <div className="col-lg-3 mb-2 d-flex align-items-center">
          <label className="mt-1">
            <input
              type="checkbox"
              disabled
              name="isManualAuto"
              label="Is Manual Auto"
              style={{
                marginRight: "5px",
                position: "relative",
                top: "3px",
              }}
              checked={sales?.isManualAuto}
            />
            <span>Is Manual Auto</span>
          </label>
        </div>
      </div>

      <div className="row cash_journal bank-journal bank-journal-custom">
        <div className="col-lg-3 ">
          {sales?.shipoint?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Shipping Point</th>
                  </tr>
                </thead>
                <tbody>
                  {sales?.shipoint?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="pl-2">{item?.shipPointName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="col-lg-9 ">
          {shippintAddress?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Ship To Partner Name</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Transport Zone</th>
                    <th>Operational Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {shippintAddress?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="pl-2">{item?.partnerShippingName}</div>
                      </td>
                      <td>
                        <div className="pl-2">
                          {item?.partnerShippingAddress}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">
                          {item?.partnerShippingContact}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.transportZoneName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item?.setUpZoneName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
