import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";

export default function KpiReportTable({
  deleteIndividualKPIById,
  values,
  report,
}) {
  let copyKPI = null;
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 287) {
      copyKPI = userRole[i];
    }
  }

  return (
    <div className="individual-kpi-table mt-5">
      <PmsCommonTable
        ths={[
          { name: "BSC" },
          { name: "Objective" },
          { name: "KPI" },
          { name: "SRF" },
          { name: "Weight" },
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
                      onClick={() => {
                        if (copyKPI?.isClose) {
                          deleteIndividualKPIById(item?.kpiId, values);
                        } else {
                          toast.warning("You don't have access");
                        }
                      }}
                      style={{ width: "50px" }}
                    >
                      <IDelete />
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
