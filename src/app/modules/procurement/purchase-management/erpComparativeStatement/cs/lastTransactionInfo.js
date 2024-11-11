import React from "react";

const LastTransactionInfo = ({ data }) => {
  return (
    <div className="container my-3">
      <div className="card shadow-sm">
        <div className="card-header text-left bg-primary text-white py-2">
          <h5 className="mb-0">Last Transaction Info</h5>
        </div>
        <div className="card-body py-3 px-4">
          <div className="row">
            {/* Item Information */}
            <div className="col-md-6">
              <h6 className="text-primary">Item Information</h6>
              <table className="table table-sm table-borderless mb-3">
                <tbody>
                  <tr>
                    <th>Item ID:</th>
                    <td>{data.itemId}</td>
                  </tr>
                  <tr>
                    <th>Item Name:</th>
                    <td>{data.itemName}</td>
                  </tr>
                  <tr>
                    <th>Item Code:</th>
                    <td>{data.itemCode}</td>
                  </tr>
                  <tr>
                    <th>UoM ID:</th>
                    <td>{data.uoMid}</td>
                  </tr>
                  <tr>
                    <th>UoM Name:</th>
                    <td>{data.uoMname}</td>
                  </tr>
                  <tr>
                    <th>Item Type:</th>
                    <td>{data.itemTypeName}</td>
                  </tr>
                  <tr>
                    <th>Category:</th>
                    <td>{data.itemCategoryName}</td>
                  </tr>
                  <tr>
                    <th>Subcategory:</th>
                    <td>{data.itemSubCategoryName}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Order & Pricing */}
            <div className="col-md-6">
              <h6 className="text-primary">Order & Pricing</h6>
              <table className="table table-sm table-borderless mb-3">
                <tbody>
                  <tr>
                    <th>RFQ Quantity:</th>
                    <td>{data.rfqQuantity}</td>
                  </tr>
                  <tr>
                    <th>Order Quantity:</th>
                    <td>{data.orderQuantity}</td>
                  </tr>
                  <tr>
                    <th>Purchase Rate:</th>
                    <td>{data.purchaseRate}</td>
                  </tr>
                  <tr>
                    <th>Total Amount:</th>
                    <td>{data.totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="my-2" />

          <div className="row">
            {/* Business Partner Information */}
            <div className="col-md-12">
              <h6 className="text-primary">Business Partner</h6>
              <table className="table table-sm table-borderless">
                <tbody>
                  <tr>
                    <th>Partner ID:</th>
                    <td>{data.businessPartnerId}</td>
                  </tr>
                  <tr>
                    <th>Name:</th>
                    <td>{data.businessPartnerName}</td>
                  </tr>
                  <tr>
                    <th>Code:</th>
                    <td>{data.businessPartnerCode}</td>
                  </tr>
                  <tr>
                    <th>Address:</th>
                    <td>{data.businessPartnerAddress}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{data.email || "-"}</td>
                  </tr>
                  <tr>
                    <th>Contact:</th>
                    <td>{data.contactNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastTransactionInfo;
