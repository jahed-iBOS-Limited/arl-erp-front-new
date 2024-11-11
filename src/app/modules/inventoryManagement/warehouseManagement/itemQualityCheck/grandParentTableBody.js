import React, { useState } from "react";
import { toast } from "react-toastify";
import IAdd from "../../../_helper/_helperIcons/_add";
import IDelete from "../../../_helper/_helperIcons/_delete";
import NewIcon from "../../../_helper/_helperIcons/newIcon";
import IViewModal from "../../../_helper/_viewModal";
import CommentModal from "./commentModal";
import HeaderTable from "./headerTable";

export default function GrandParentTableBody({
  grandParentIndex,
  grandParentItem,
  handleGetEntryCode,
  handleGateEntryHandler,
  handleQcQtyBeg,
  handleQcQty,
  handleAdd,
  handleStatus,
  handleHeaderRowDelete,
  handleWarehouseComment,
  handleBagWeightDeductionQty,
}) {
  const [isShowModal, setShowModal] = useState(false);
  return (
    <tbody>
      <tr>
        <td className="text-center">
          <span
            onClick={() => {
              if (!grandParentItem?.vehicleNo) {
                toast.warn("Input Gate Entry First");
                return;
              }
              handleAdd(grandParentIndex, grandParentItem);
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
              handleGateEntryHandler(
                grandParentItem?.entryCode,
                grandParentItem?.itemId
              );
            }}
          />
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? grandParentItem?.vehicleNo : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? grandParentItem?.netWeight : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.bagWeightDeductQuantity
            ? grandParentItem?.netWeightWithoutBag
            : ""}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? (
            <input
              style={{ maxWidth: "30px" }}
              value={grandParentItem?.qcQtyBeg || ""}
              min={0}
              name="qcQtyBeg"
              type="number"
              onChange={(e) => {
                handleQcQtyBeg(e, grandParentIndex);
              }}
            />
          ) : (
            ""
          )}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? (
            <input
              style={{ maxWidth: "50px" }}
              value={grandParentItem?.qcQty || ""}
              min={0}
              name="qcQty"
              type="number"
              onChange={(e) => {
                handleQcQty(e, grandParentIndex);
              }}
            />
          ) : (
            0 || ""
          )}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? grandParentItem?.totalQcQty : 0 || ""}
        </td>
        <td className="text-center">
          {grandParentItem?.entryCode ? grandParentItem?.deductionQuantity : 0}
        </td>
        <td className="text-center">
          {grandParentItem?.entryCode
            ? grandParentItem?.unloadDeductionQuantity
            : 0}
        </td>
        <td>
          {grandParentItem?.vehicleNo ? (
            <input
              style={{ maxWidth: "50px" }}
              value={grandParentItem?.bagWeightDeductQuantity || ""}
              // disabled={true}
              min={0}
              name="bagWeightDeductQuantity"
              type="number"
              onChange={(e) => {
                if (+e.target.value < 0)
                  return toast.warn("Bag	Weight Cann't be Negative");
                handleBagWeightDeductionQty(e, grandParentIndex);
              }}
            />
          ) : (
            ""
          )}
        </td>
        <td className="text-center">
          {grandParentItem?.entryCode ? grandParentItem?.actualQuantity : 0}
        </td>
        <td className="text-center">
          {grandParentItem?.vehicleNo ? (
            <select
              value={grandParentItem?.status}
              onChange={(e) => handleStatus(e, grandParentIndex)}
            >
              <option value={true}>Receive</option>
              <option value={false}>Reject</option>
            </select>
          ) : (
            ""
          )}
        </td>
        <td
          style={{ gap: "5px", border: "none", marginTop: "5px" }}
          className="text-center d-flex"
        >
          <span onClick={() => handleHeaderRowDelete(grandParentIndex)}>
            <IDelete />
          </span>
          <span onClick={() => setShowModal(true)}>
            <NewIcon iconName={"fa fa-commenting"} />
          </span>
        </td>
      </tr>
      {grandParentItem?.headersList?.length > 0 && (
        <tr>
          <td colSpan={19}>
            <HeaderTable
              parentData={grandParentItem?.headersList}
              grandParentIndex={grandParentIndex}
            />
          </td>
        </tr>
      )}
      {isShowModal && (
        <IViewModal show={isShowModal} onHide={() => setShowModal(false)}>
          <CommentModal
            item={grandParentItem}
            parentIndex={grandParentIndex}
            handleWarehouseComment={handleWarehouseComment}
          />
        </IViewModal>
      )}
    </tbody>
  );
}
