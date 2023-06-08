import React from "react";
import TableGroup from "./tableGroup";
import TableWidthOutGroup from "./tableWidthOutGroup";

function InternalExpenseGrid({
  gridData,
  setGridData,
  allGridCheck,
  itemSlectedHandler,
  parentValues,
}) {
  return (
    <>
      {parentValues?.isGroup?.value === 2 ? (
        <TableGroup
          gridData={gridData}
          setGridData={setGridData}
          allGridCheck={allGridCheck}
          itemSlectedHandler={itemSlectedHandler}
          parentValues={parentValues}
  
        />
      ) : (
        <TableWidthOutGroup
          gridData={gridData}
          setGridData={setGridData}
          allGridCheck={allGridCheck}
          itemSlectedHandler={itemSlectedHandler}
          parentValues={parentValues}
        />
      )}
    </>
  );
}

export default InternalExpenseGrid;
