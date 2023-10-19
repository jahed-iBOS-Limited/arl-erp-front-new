import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";
import { useHistory } from "react-router-dom";

const LandingTable = ({ obj }) => {
  const {
    gridData,
    employeeDDL,
    complainStatus,
    assignToAndStatusHandler,
  } = obj;
  const history = useHistory();

  return (
    <>
      {gridData?.data?.length > 0 && (
        <table className='table table-striped table-bordered global-table'>
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Ticket No</th>
              <th>Ticket Type</th>
              <th>Customer</th>
              <th>Complain By</th>
              <th>Assign To</th>
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
                <td>{item?.customerName}</td>
                <td>{item?.complainByName || "N/A"}</td>

                <td>
                  <NewSelect
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
                  />
                </td>
                <td>
                  <NewSelect
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
                    isDisabled={item?.statusId === 4}
                  />
                </td>

                <td>
                  <div className='d-flex justify-content-around'>
                    {item?.statusId !== 4 && (
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
      )}
    </>
  );
};

export default LandingTable;
