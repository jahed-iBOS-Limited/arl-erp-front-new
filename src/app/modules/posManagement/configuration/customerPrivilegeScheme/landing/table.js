import React, { useState } from "react";
import IView from "./../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IViewModal from "./../../../../_helper/_viewModal";
import { offerBasedOnDDL, customersPurchaseTypeDDL } from "../helper";
import CustomerPrivilegeSchemeView from "./../view/index";
import IActiveInActiveIcon from "./../../../../_helper/_helperIcons/_activeInActiveIcon";

function GridTable({ rowDto, values, acitveOnclickFunc }) {
  const [isShowModal, setisShowModal] = useState(false);
  const [rowClickData, setRowClickData] = useState("");
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Scheme Name</th>
            <th>Condition Type</th>
            <th>Item/Item Group</th>
            <th>Customer/Customer Group</th>
            <th>Scheme Start Date</th>
            <th>Scheme End Date</th>
            <th>Offer Based On</th>
            <th>Customers Purchase Type</th>
            <th style={{ width: "125px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.data?.length >= 0 &&
            rowDto?.data?.map((item, idx) => (
              <tr key={item?.sl}>
                <td>{idx + 1}</td>
                <td>{item?.nameOfScheme}</td>
                <td>{item?.conditionTypeName}</td>
                <td>{item?.itemOrItemGroupName}</td>
                <td>{item?.customerOrCustomerGroupName}</td>
                <td>{_dateFormatter(item?.startDate)}</td>
                <td>{_dateFormatter(item?.endDate)}</td>
                <td>
                  {offerBasedOnDDL().find(
                    (itm) => itm.value === item?.offerBasedOnId
                  )?.label || ""}
                </td>
                <td>
                  {customersPurchaseTypeDDL().find(
                    (itm) => itm.value === item?.customersPurchaseTypeId
                  )?.label || ""}
                </td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      onClick={() => {
                        setisShowModal(true);
                        setRowClickData(item);
                      }}
                    >
                      <IView />
                    </span>
                    {/* <button
                      type="button"
                      className="btn btn-primary ml-3"
                      onClick={() => {
                        acitveOnclickFunc({ ...item,...values,  });
                      }}
                      style={{
                        padding: "1px 5px",
                        fontSize: "12px",
                      }}
                    >
                      {values?.status?.value ? "In-Active" : "Active"}
                    </button> */}
                    <span
                      className="ml-2 pointer"
                      onClick={() => {
                        acitveOnclickFunc({ ...item, ...values });
                      }}
                    >
                      <IActiveInActiveIcon
                        iconTyee={values?.status?.value ? "inActive" : ""}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <IViewModal
        show={isShowModal}
        onHide={() => setisShowModal(false)}
        title={"Customers Privilege Scheme View"}
      >
        <CustomerPrivilegeSchemeView rowClickData={rowClickData} />
      </IViewModal>
    </div>
  );
}
export default GridTable;
