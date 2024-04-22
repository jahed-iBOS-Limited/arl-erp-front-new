import React from "react";
import TextArea from "../../../_helper/TextArea";
export default function CommentModal({ item, parentIndex, handleWarehouseComment }) {
  return (
    <div className="form-group  global-form row">
    <div  className="col-lg-12">
      <span>Warehouse Comment</span>
      <TextArea
        value={item?.warehouseComment}
        label="Warehouse Comment"
        placeholder="Warehouse Comment"
        name="warehouseComment"
        row={4}
        onChange={(e) => {
          handleWarehouseComment(e.target.value, item, parentIndex);
        }}
      />
    </div>
  </div>
  );
}
