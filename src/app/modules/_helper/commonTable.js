import React from "react";

export default function CommonTable({
  headersData,
  isScrollable,
  tableStyles,
  trStyles,
  columnSticky,
  children
}) {
  const tableHeader =
    headersData?.length > 0 &&
    headersData?.map((item, index) => {
        let element;
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            element = item?.title;
        } else {
            element= item;
        }
     
      return (
        !item?.isHidden && (
            <th  style={item?.style && item?.style} className={`${item?.className ||""}`} key={index}>
          {element}
        </th>
        ) 
      );
    });
  return (
    <div className={`${isScrollable && "loan-scrollable-table"}`}>
      <div
        style={tableStyles}
        className={`${isScrollable && "scroll-table _table table-responsive"}`}
      >
        <table
          className={`table table-striped table-bordered bj-table bj-table-landing ${
            isScrollable && !columnSticky
              ? "one-column-sticky"
              : isScrollable && columnSticky === 2
              ? "two-column-sticky"
              : isScrollable && columnSticky === 3
              ? "three-column-sticky"
              : ""
          }`}
        >
          <thead>
            <tr style={trStyles}>{tableHeader}</tr>
          </thead>
          {children}
        </table>
      </div>
    </div>
  );
}
