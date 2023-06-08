/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// import IEdit from "../../../_chartinghelper/icons/_edit";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import IViewModal from "../../../_chartinghelper/_viewModal";
import ConsigneeForm from "../Form/addEditForm";
import { getConsigneeList } from "../helper";

const headers = [
  { name: "SL" },
  { name: "Code" },
  { name: "Consignee Name" },
  { name: "Mobile No" },
  { name: "Email" },
  { name: "Address" },
  { name: "License Number" },
  // { name: "Actions" },
];

export default function ConsigneeTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [open, setOpen] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const viewHandler = (PageNo, PageSize) => {
    getConsigneeList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      PageNo,
      PageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    viewHandler(pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize) => {
    viewHandler(pageNo, pageSize);
  };

  return (
    <>
      {loading && <Loading />}
      <form className="marine-form-card">
        <div className="marine-form-card-heading">
          <p>Consignee</p>
          <div>
            {/* <button
              type="button"
              className={"btn btn-primary px-3 py-2"}
              onClick={() => {
                setSingleData({});
                setOpen(true);
              }}
              disabled={false}
            >
              + Create
            </button> */}
          </div>
        </div>
        <ICustomTable ths={headers}>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className="text-center" style={{ width: "40px" }}>
                {index + 1}
              </td>
              <td>{item?.businessPartnerCode}</td>
              <td>{item?.businessPartnerName}</td>
              <td>{item?.contactNumber}</td>
              <td>{item?.email}</td>
              <td>{item?.businessPartnerAddress}</td>
              <td>{item?.licenseNo}</td>
              {/* <td className="text-center" style={{ width: "130px" }}>
                <IEdit
                  clickHandler={() => {
                    setSingleData(item);
                    setOpen(true);
                  }}
                />
              </td> */}
            </tr>
          ))}
        </ICustomTable>

        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </form>
      <IViewModal show={open} onHide={() => setOpen(false)}>
        <ConsigneeForm
          singleData={singleData}
          setOpen={setOpen}
          viewHandler={viewHandler}
        />
      </IViewModal>
    </>
  );
}
