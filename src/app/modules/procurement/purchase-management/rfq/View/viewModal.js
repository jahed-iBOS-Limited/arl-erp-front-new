import React, { useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ICustomTable from "../../../../_helper/_customTable";
import { getDataById } from "../_redux/Actions";

let ths = [
  "SL",
  "Item Code",
  "Item Name",
  "UoM",
  "Purchase Description",
  "Reference No.",
  "Ref. Qty.",
  "RFQ Qty.",
];

let thsTwo = ["RFQ Date", "Validity", "Currency"];

let thsThree = [
  "SL",
  "Supplier Name",
  "Address",
  "Email",
  "Contact Number",
  "Action",
];

export default function ViewForm({ id, show, onHide }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();

  // get single data from store
  const singleData = useSelector((state) => {
    return state?.rfq?.singleData[0];
  }, shallowEqual);

  // users selected ddl
  const usersDDL = useSelector((state) => {
    return state.rfq.userSelectedDDLData;
  }, shallowEqual);

  useEffect(() => {
    if (id && selectedBusinessUnit.value && profileData.accountId) {
      dispatch(getDataById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, id, usersDDL]);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={singleData?.objHeader?.requestForQuotationCode || "Modal"}
        isShow={singleData && false}
      >
        {/* Modal Header */}
        <ICustomTable ths={thsTwo}>
          <tr>
            <td> {singleData?.objHeader?.dteRfqdate} </td>
            <td> {singleData?.objHeader?.validTillDate} </td>
            <td> {singleData?.objHeader?.currencyCode} </td>
          </tr>
        </ICustomTable>

        {/* Modal Grid */}
        <ICustomTable ths={ths}>
          {singleData?.objRow?.map((td, index) => {
            return (
              <tr>
                <td> {index + 1} </td>
                <td> {td?.itemCode} </td>
                <td> {td?.itemName} </td>
                <td> {td?.uoMname} </td>
                <td> {td?.description} </td>
                <td> {td?.referenceId} </td>
                <td> {td?.referenceQuantity} </td>
                <td> {td?.reqquantity} </td>
              </tr>
            );
          })}
        </ICustomTable>
        {/* Modal third section */}
        <h3 style={{ fontSize: "1.35rem" }}>
          Add Supplier For Send REQ/RFI/RFP
        </h3>
        <ICustomTable ths={thsThree}>
          {singleData?.objSuplier?.map((td, index) => {
            return (
              <tr>
                <td> {index + 1} </td>
                <td> {td?.businessPartnerName} </td>
                <td> {td?.businessPartnerAddress} </td>
                <td> {td?.email} </td>
                <td> {td?.contactNumber} </td>
                <td className="text-center">
                  <button className="btn btn-primary">Send Email</button>
                </td>
              </tr>
            );
          })}
        </ICustomTable>
      </IViewModal>
    </div>
  );
}
