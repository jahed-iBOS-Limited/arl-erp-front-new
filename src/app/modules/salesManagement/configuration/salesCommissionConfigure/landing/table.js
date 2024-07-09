import React from "react";
import IEdit from "../../../../_helper/_helperIcons/_edit";

const SalesCommissionConfigureLandingTable = ({ obj }) => {
  const { gridData, values, setOpen, setSingleData } = obj;

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>SL</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
              {[17, 18, 25, 27].includes(values?.commissionType?.value) && (
                <>
                  {" "}
                  <th>1-99%</th>
                  <th>100-999%</th>
                  <th> {">"}999% </th>
                </>
              )}
              <th>Insert By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  <td className="text-right">{item?.bpcommissionRate}</td>
                  <td className="text-right">{item?.bacommissionRate}</td>
                  <td className="text-right">{item?.cpcommissionRate}</td>

                  {[17, 18, 25, 27].includes(values?.commissionType?.value) && (
                    <>
                      <td className="text-right">
                        {item?.firstSlabCommissionRate}
                      </td>
                      <td className="text-right">
                        {item?.secondSlabCommissionRate}
                      </td>
                      <td className="text-right">
                        {item?.thirdSlabCommissionRate}
                      </td>
                    </>
                  )}
                  <td className="text-right">{item?.actionName}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-around">
                      <span>
                        <IEdit
                          onClick={() => {
                            setSingleData(item);
                            setOpen(true);
                          }}
                        ></IEdit>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesCommissionConfigureLandingTable;
