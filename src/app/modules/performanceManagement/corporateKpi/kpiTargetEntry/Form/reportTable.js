import React from "react";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";

export default function KpiReportTable({ report }) {
  return (
    <div className="individual-kpi-table">
      <PmsCommonTable
        ths={[
          { name: "BSC" },
          { name: "Objective" },
          { name: "KPI" },
          { name: "SRF" },
          { name: "Target" },
          { name: "Achievement" },
          { name: "Progress" },
          { name: "Action", style: { width: "50px" } },
        ]}
      >
        {report?.infoList?.map((itm, indx) => (
          <>
            {itm.dynamicList.map((item, index) => (
              <tr>
                {index === 0 && (
                  <td
                    className={`bsc bsc${indx}`}
                    rowspan={itm.dynamicList.length}
                  >
                    <div>{itm?.bsc}</div>
                  </td>
                )}
                {item?.isParent && (
                  <td className="obj" rowspan={item?.numberOfChild}>
                    {" "}
                    {item?.parentName}{" "}
                  </td>
                )}
                <td> {item?.label} </td>
                <td> {item?.strFrequency} </td>
                <td> {item?.numTarget} </td>
                <td> {item?.numAchivement} </td>
                <td>
                  {indx !== report?.infoList.length - 1 && (
                    <div className="text-right">
                      {item?.progress}%{" "}
                      <i
                        className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                      ></i>
                    </div>
                  )}
                </td>

                <td className="text-center">
                  {indx !== report?.infoList.length - 1 && (
                    <span
                      onClick={() =>
                        //  doesn't work this way
                        // history.push(
                        //   `/performance-management/individualEdit/individualTarget/edit/${row.kpiId}`
                        // )
                        (window.location.href = `/performance-management/corporate-kpi/target/edit/${item.kpiId}`)
                      }
                      style={{ width: "50px" }}
                    >
                      <IEdit />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </>
        ))}
      </PmsCommonTable>
    </div>
  );
}
