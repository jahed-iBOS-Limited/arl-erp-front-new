import React, { useState } from "react";
import IAdd from "../../../_helper/_helperIcons/_add";
import IDelete from "../../../_helper/_helperIcons/_delete";
import NewIcon from "../../../_helper/_helperIcons/newIcon";
import IViewModal from "../../../_helper/_viewModal";
import CommonTable from "../../../_helper/commonTable";
import CommentModal from "./commentModal";
import { headerTableHeaders } from "./helper";
import ItemTable from "./itemTable";

export default function HeaderTable({
  parentData,
  grandParentIndex,
  handleGetEntryCode,
  handleGateEntryHandler,
  handleUnloadDeduct,
  handleStatus,
  handleWarehouseComment,
  handleHeaderRowDelete,
  handleGetRow,
  actualValueHandler,
  handleManualDeduction,
  handleRemarks,
  handleRowItemDelete,
  totalSystemDeduction
}) {
  return (
    <CommonTable headersData={headerTableHeaders}>
      {parentData?.map((item, parentIndex) => {
        return (
          <TableTbody
            key={parentIndex}
            item={item}
            parentIndex={parentIndex}
            handleGetEntryCode={handleGetEntryCode}
            handleGateEntryHandler={handleGateEntryHandler}
            handleUnloadDeduct={handleUnloadDeduct}
            handleStatus={handleStatus}
            handleGetRow={handleGetRow}
            actualValueHandler={actualValueHandler}
            handleManualDeduction={handleManualDeduction}
            handleRemarks={handleRemarks}
            handleRowItemDelete={handleRowItemDelete}
            handleWarehouseComment={handleWarehouseComment}
            handleHeaderRowDelete={handleHeaderRowDelete}
            totalSystemDeduction={totalSystemDeduction}
          />
        );
      })}
    </CommonTable>
  );
}

function TableTbody({
  handleGetEntryCode,
  handleGateEntryHandler,
  handleUnloadDeduct,
  handleStatus,
  handleGetRow,
  handleHeaderRowDelete,
  item,
  parentIndex,
  actualValueHandler,
  handleManualDeduction,
  handleRemarks,
  handleRowItemDelete,
  handleWarehouseComment,
  totalSystemDeduction
}) {
  const [isOpen, setIsOpen] = useState();
  const [isShowModal, setShowModal] = useState(false);
  
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
                if (item?.rowList) return;
                handleGetRow(item?.itemId);
              }}
            >
              <IAdd title="Add" />
            </span>
          )}
        </td>
        <td className="text-center">{parentIndex + 1}</td>
        <td className="text-center">{item?.supplierName}</td>
        <td className="text-center">{item?.address}</td>
        <td className="text-center">{item?.itemName}</td>
        <td className="text-center">{item?.uomName}</td>
        <td className="text-center">
          <input
            value={item?.entryCode}
            name="entryCode"
            type="text"
            onChange={(e) => {
              handleGetEntryCode(e, item?.itemId);
            }}
            onBlur={() => {
              handleGateEntryHandler(item?.entryCode, item?.itemId);
            }}
          />
        </td>
        <td className="text-center">
          {item?.entryCode ? item?.vehicleNo : ""}
        </td>
        <td className="text-center">
          {item?.entryCode ? item?.netWeight : ""}
        </td>
        <td className="text-center">
          {item?.entryCode ? item?.deductionPercentage : 0 ||""}
        </td>
        <td className="text-center">
          {item?.entryCode ? item?.deductionQuantity : 0 || ""}
        </td>
        <td className="text-center">
          {item?.entryCode ? (
            <input
              style={{ maxWidth: "50px" }}
              value={item?.unloadDeduct}
              name="unloadDeduct"
              type="number"
              onChange={(e) => {
                handleUnloadDeduct(e,parentIndex);
              }}
            />
          ) : (
            ""
          )}
        </td>
        <td className="text-center">{item?.entryCode ? item?.actualQuantity: ""}</td>
        <td className="text-center">
          {item?.entryCode ? (
            <select
              value={item?.status}
              onChange={(e) => handleStatus(e, item?.itemId)}
            >
              <option value={true}>Receive</option>
              <option value={false}>Reject</option>
            </select>
          ) : (
            ""
          )}
        </td>
        <td style={{ gap: "5px",border:"none",marginTop:"5px" }} className="text-center d-flex">
          <span onClick={()=>handleHeaderRowDelete(parentIndex)}>
            <IDelete />
          </span>
          <span onClick={() => setShowModal(true)}>
            <NewIcon iconName={"fa fa-commenting"} />
          </span>
          {/* {item?.entryCode ? (
          <>
            
          </>
        ) : (
          ""
        )} */}
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={15}>
            <ItemTable
             parentIndex={parentIndex}
              itemRows={item?.rowList}
              actualValueHandler={actualValueHandler}
              handleManualDeduction={handleManualDeduction}
              handleRemarks={handleRemarks}
              handleRowItemDelete={handleRowItemDelete}
              totalSystemDeduction={totalSystemDeduction}
            />
          </td>
        </tr>
      )}
      {isShowModal && (
        <IViewModal show={isShowModal} onHide={() => setShowModal(false)}>
          <CommentModal
            item={item}
            parentIndex={parentIndex}
            handleWarehouseComment={handleWarehouseComment}
          />
        </IViewModal>
      )}
    </tbody>
  );
}
