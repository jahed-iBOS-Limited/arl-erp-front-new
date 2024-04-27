import React from "react";
import IAdd from "../../../_helper/_helperIcons/_add";
import HeaderTable from "./headerTable";

export default function GrandParentTableBody({
  grandParentIndex,
  grandParentItem,
  handleGetEntryCode,
  handleGateEntryHandler,
  handleQcQtyBeg,
  handleQcQty,
  handleAdd
}) {
  return (
    <tbody>
      <tr>
        <td className="text-center">
          <span
          onClick={()=>{
            handleAdd(grandParentIndex,grandParentItem)
          }}
          >
          <IAdd title="Add" />
          </span>
        </td>
        <td className="text-center">{grandParentIndex + 1}</td>
        <td className="text-center">{grandParentItem?.supplierName}</td>
        <td className="text-center">{grandParentItem?.address}</td>
        <td className="text-center">{grandParentItem?.itemName}</td>
        <td className="text-center">{grandParentItem?.uomName}</td>
        <td className="text-center">
          <input
            value={grandParentItem?.entryCode}
            name="entryCode"
            type="text"
            style={{ maxWidth: "80px" }}
            onChange={(e) => {
              handleGetEntryCode(e, grandParentIndex);
            }}
            onBlur={() => {
              handleGateEntryHandler(grandParentItem?.entryCode, grandParentItem?.itemId);
            }}
          />
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? grandParentItem?.netWeight : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? grandParentItem?.vehicleNo : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? (
          <input
          style={{ maxWidth: "50px" }}
          value={grandParentItem?.qcQtyBeg}
          name="qcQtyBeg"
          type="number"
            onChange={(e) => {
              handleQcQtyBeg(e,grandParentIndex);
            }}
        />
          ) : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo
            ? (
                <input
                style={{ maxWidth: "50px" }}
                value={grandParentItem?.qcQty}
                name="qcQty"
                type="number"
                  onChange={(e) => {
                    handleQcQty(e,grandParentIndex);
                  }}
              />
            )
            : 0 || ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo
            ? grandParentItem?.totalQcQty
            : 0 || ""}
        </td>
        <td className="text-center">
          {grandParentItem?.entryCode ? grandParentItem?.deductionQuantity : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.entryCode ? grandParentItem?.unloadTimeDeduct : ""}
        </td>
        <td className="text-center">
        {grandParentItem?.entryCode ? grandParentItem?.actualQty : ""}
        </td>
      </tr>
      {grandParentItem?.headersList?.length>0 && (
        <tr>
          <td colSpan={15}>
            <HeaderTable
              parentData={grandParentItem?.headersList}
              grandParentIndex={grandParentItem?.headersList} 
            //   actualValueHandler={actualValueHandler}
            //   handleManualDeduction={handleManualDeduction}
            //   handleRemarks={handleRemarks}
            //   handleRowItemDelete={handleRowItemDelete}
            //   totalSystemDeduction={totalSystemDeduction}
            />
          </td>
        </tr>
      )}
      {/* {isShowModal && (
        <IViewModal show={isShowModal} onHide={() => setShowModal(false)}>
          <CommentModal
            item={item}
            parentIndex={parentIndex}
            handleWarehouseComment={handleWarehouseComment}
          />
        </IViewModal>
      )} */}
    </tbody>
  );
}
