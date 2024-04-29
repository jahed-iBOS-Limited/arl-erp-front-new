import React, { useContext, useState } from "react";
import IAdd from "../../../_helper/_helperIcons/_add";
import IDelete from "../../../_helper/_helperIcons/_delete";
import NewIcon from "../../../_helper/_helperIcons/newIcon";
import CommonTable from "../../../_helper/commonTable";
import { parentTableHeader } from "./helper";
import ItemTable from "./itemTable";
import { QcManagementContext } from "./qcManagementContext";

export default function HeaderTable({ parentData, grandParentIndex }) {
  return (
    <CommonTable headersData={parentTableHeader}>
      {parentData?.map((parentItem, parentIndex) => {
        return (
          <TableTbody
            key={parentIndex}
            parentItem={parentItem}
            parentIndex={parentIndex}
            grandParentIndex={grandParentIndex}
          />
        );
      })}
    </CommonTable>
  );
}

function TableTbody({ parentItem, parentIndex, grandParentIndex }) {
  const [isOpen, setIsOpen] = useState();
  const {
    handleGetQCItemParameterConfig,
    handleQcQtyBegForParent,
    handleQcQtyForParent,
    handleUnloadDeductForParent,
    handleRemarksForParent,
    handleHeaderRowDeleteFromParent,
  } = useContext(QcManagementContext);
  return (
    <tbody>
      <tr>
        <td className="text-center">
          {isOpen ? (
            <span
              style={{ fontSize: "16px" }}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <NewIcon iconName={"fa fa-minus-square"} title={""} />
            </span>
          ) : (
            <span
              onClick={() => {
                setIsOpen(true);
                if (parentItem?.rowList?.length > 0) return;
                handleGetQCItemParameterConfig(
                  parentItem?.itemId,
                  grandParentIndex,
                  parentIndex
                );
              }}
            >
              <IAdd title="Add" />
            </span>
          )}
        </td>
        <td>{parentItem?.itemName}</td>
        <td>{parentItem?.uomName}</td>
        <td>
          <input
            value={parentItem?.qcQuantityBag || ""}
            name="qcQuantityBag"
            type="number"
            // style={{ maxWidth: "60px" }}
            onChange={(e) => {
              handleQcQtyBegForParent(e, grandParentIndex, parentIndex);
            }}
          />
        </td>
        <td>
          <input
            value={parentItem?.qcQuantity || ""}
            name="qcQuantity"
            type="number"
            disabled={true}
            // style={{ maxWidth: "50px" }}
            onChange={(e) => {
              handleQcQtyForParent(e, grandParentIndex, parentIndex);
            }}
          />
        </td>
        <td>{parentItem?.deductionPercentage}</td>
        <td>{parentItem?.deductionQuantity}</td>
        <td>
          <input
            value={parentItem?.unloadedDeductionQuantity||""}
            name="unloadedDeductionQuantity"
            type="number"
            // style={{ maxWidth: "50px" }}
            onChange={(e) => {
              handleUnloadDeductForParent(e, grandParentIndex, parentIndex);
            }}
          />
        </td>
        <td>{parentItem?.actualQuantity}</td>
        <td>
          <input
            value={parentItem?.remarks || ""}
            name="remarks"
            type="text"
            // style={{ maxWidth: "50px" }}
            onChange={(e) => {
              handleRemarksForParent(e, grandParentIndex, parentIndex);
            }}
          />
        </td>
        <td className="text-center">
          <span
            onClick={() =>
              handleHeaderRowDeleteFromParent(grandParentIndex, parentIndex)
            }
          >
            <IDelete />
          </span>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={15}>
            <ItemTable
              grandParentIndex={grandParentIndex}
              parentIndex={parentIndex}
              itemRows={parentItem?.rowList}
            />
          </td>
        </tr>
      )}
    </tbody>
  );
}
