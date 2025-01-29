/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const ActionsColumnFormatter = (
  cellContent,
  row,
  rowIndex,
  { openEditUserPage, openViewPage }
) => (

  // <>
  //   <OverlayTrigger
  //     overlay={<Tooltip userId="products-edit-tooltip">Edit User </Tooltip>}
  //   >
  //     <a
  //       className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
       
  //       onClick={() =>openEditUserPage(row.userId)}
  //     >
  //        {/* openEditUserPage(  row.userId) */}
  //       <span className="svg-icon svg-icon-md svg-icon-primary">
  //         <SVG
  //           src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
  //         />
          
  //       </span>
  //     </a>
  //   </OverlayTrigger>

     <> 
    {/* </> */}
    <OverlayTrigger
      overlay={<Tooltip userId="products-view-tooltip">View User</Tooltip>}
    >
      <a
        className="view-icon"
        onClick={() => openViewPage(row.userId)}
      >
        <span className="svg-icon svg-icon-md svg-icon-success">
            <i className="view_fa fa fa-eye view_fa" aria-hidden="true"></i>
          </span>
        </a>
    </OverlayTrigger>
  </>
);
