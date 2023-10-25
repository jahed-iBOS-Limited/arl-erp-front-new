import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";

const LandingTable = ({ obj }) => {
  const {
    gridData,
    loadUserList,
    complainStatus,
    assignToAndStatusHandler,
  } = obj;
  const history = useHistory();

  return (
    <>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Ticket No</th>
            <th>Category</th>
            <th>Issue Title</th>
            <th>Customer</th>
            <th>Complain By</th>
            <th style={{
              width: '170px'
            }}>Assign To</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{_dateFormatter(item?.requestDateTime)}</td>
              <td>{item?.complainNo}</td>
              <td>{item?.complainCategoryName}</td>
              <td>{item?.issueTitle}</td>
              <td>{item?.customerName}</td>
              <td>{item?.strComplainByEmployee || "N/A"}</td>

              <td>
                <SearchAsyncSelect
                  selectedValue={
                    item?.assignTo
                      ? { value: item?.assignTo, label: item?.assignToName }
                      : ""
                  }
                  isSearchIcon={true}
                  handleChange={(valueOption) => {
                    if (valueOption?.value) {
                      assignToAndStatusHandler({
                        ...item,
                        assignTo: valueOption?.value,
                        assignToName: valueOption?.label,
                      });
                    }
                  }}
                  loadOptions={loadUserList}
                  isDisabled={item?.status === "Done"}
                />
                {/* <NewSelect
                  isClearable={false}
                  name='assignTo'
                  options={employeeDDL || []}
                  value={
                    item?.assignTo
                      ? { value: item?.assignTo, label: item?.assignToName }
                      : ""
                  }
                  onChange={(valueOption) => {
                    if (valueOption?.value) {
                      assignToAndStatusHandler({
                        ...item,
                        assignTo: valueOption?.value,
                        assignToName: valueOption?.label,
                      });
                    }
                  }}
                  isDisabled={item?.statusId === 4}
                /> */}
              </td>
              <td>
                <NewSelect
                  isClearable={false}
                  name='status'
                  options={complainStatus || []}
                  value={
                    item?.status
                      ? { value: item?.statusId, label: item?.status }
                      : ""
                  }
                  onChange={(valueOption) => {
                    if (valueOption?.value) {
                      assignToAndStatusHandler({
                        ...item,
                        statusId: valueOption?.value,
                        status: valueOption?.label,
                      });
                    }
                  }}
                  isDisabled={item?.status === "Done"}
                />
              </td>

              <td>
                <div className='d-flex justify-content-around'>
                  {item?.status !== "Done" && (
                    <span
                      onClick={() => {
                        history.push(
                          `/sales-management/ordermanagement/Complain/edit/${item?.complainId}`
                        );
                      }}
                    >
                      <IEdit />
                    </span>
                  )}

                  <span
                    onClick={() => {
                      history.push(
                        `/sales-management/ordermanagement/Complain/view/${item?.complainId}`
                      );
                    }}
                  >
                    <IView />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LandingTable;
