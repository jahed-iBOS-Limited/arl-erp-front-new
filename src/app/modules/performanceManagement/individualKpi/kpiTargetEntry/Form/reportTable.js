import React from "react";
import "antd/dist/antd.css";
import { useSelector, shallowEqual } from "react-redux";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";

export default function KpiReportTable({
  deleteIndividualKPIById,
  values,
  report,
}) {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);
  let indKpiTarget = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 161) {
      indKpiTarget = userRole[i];
    }
  }

  return (
    <PmsCommonTable
      ths={[
        { name: "BSC" },
        { name: "Objective" },
        { name: "KPI" },
        { name: "SRF" },
        { name: "Weight" },
        { name: "Benchmark" },
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
              <td> {item?.numWeight} </td>
              <td> {item?.benchmark} </td>
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

              <td>
                {indx !== report?.infoList.length - 1 && (
                  <div className="d-flex justify-content-around">
                    <span
                      onClick={() =>
                        //  doesn't work this way
                        // history.push(
                        //   `/performance-management/individualEdit/individualTarget/edit/${row.kpiId}`
                        // )
                        (window.location.href = `/performance-management/individualEdit/individualTarget/edit/${item.kpiId}`)
                      }
                    >
                      <IEdit />
                    </span>
                    <span
                      onClick={() => {
                        if (indKpiTarget?.isClose) {
                          deleteIndividualKPIById(item?.kpiId, values);
                        } else {
                          toast.warning("You don't have access");
                        }
                      }}
                    >
                      <IDelete />
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </>
      ))}
    </PmsCommonTable>
  );
}
