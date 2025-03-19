import React from "react";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { inActiveKpiAction } from "./helper";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";

export default function KpiReportTable({ report }) {
  const inActiveConfirm = (id) => {
    let confirmObject = {
      title: "Are you sure to delete this?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        inActiveKpiAction(id);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

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

                <td>
                  {indx !== report?.infoList.length - 1 && (
                    <div className="d-flex justify-content-around">
                      <span>
                        <IDelete
                          remover={(id) => inActiveConfirm(id)}
                          id={item?.kpiId}
                        />
                      </span>
                      <span
                        onClick={() =>
                          //  doesn't work this way
                          // history.push(
                          //   `/performance-management/individualEdit/individualTarget/edit/${item.kpiId}`
                          // )
                          (window.location.href = `/performance-management/sbu-kpi/target/edit/${item.kpiId}`)
                        }
                      >
                        <IEdit />
                      </span>
                    </div>
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
