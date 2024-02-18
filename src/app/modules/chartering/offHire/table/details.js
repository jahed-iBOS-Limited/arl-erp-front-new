/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useState } from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import Loading from "../../../_helper/_loading";
import ICustomTable from "../../_chartinghelper/_customTable";
import { ExportPDF } from "../../_chartinghelper/exportPdf";

const headers = [
  { name: "SL" },
  { name: "Off Hire" },
  { name: "Start Date-Time" },
  { name: "End Date-Time" },
  { name: "Off Hire Duration" },
  { name: "Duration Percentage" },
  { name: "Final Off Hire Duration" },
  { name: "C/V/E" },
  { name: "VLSFO" },
  { name: "LSMGO" },
  { name: "Remarks" },
  //   { name: "Off Hire Total Cost" },
  //   { name: "Actions" },
];

export default function OffHireDetails({ obj }) {
  const { gridData, singleItem } = obj;
   

  const [loading, setLoading] = useState(false);

  let totalFinalOffHireDuration = 0,
    totalCVE = 0,
    totalLSFOQty = 0,
    totalLSMGOQty = 0;

  return (
    <>
      {loading && <Loading />}
      <div className="text-right">
        <button
          className="btn btn-primary px-3 py-2 mr-2 text-right"
          onClick={() => {
            ExportPDF(
              `Off Hire Details - ${singleItem?.vesselName}, V${singleItem?.voyageNumber}`,
              setLoading
            );
          }}
        >
          Export PDF
        </button>
      </div>
      <div id="pdf-section">
        <div className="text-center">
          <h1>Off Hire Details</h1>
          <h3>{`${singleItem?.vesselName}, V${singleItem?.voyageNumber}`}</h3>
        </div>
        <ICustomTable ths={headers}>
          {gridData?.data?.map((item, index) => {
            totalFinalOffHireDuration += item?.offHireFinalDuration;
            totalCVE += item?.offHireCve;
            totalLSFOQty += item?.offHireLsfoqty;
            totalLSMGOQty += item?.offHireLsmgoqty;
            return (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>

                <td>{`Off Hire - ${index + 1}`}</td>
                <td>
                  {moment(item?.offHireStartDateTime).format(
                    "DD-MMM-yyyy, HH:mm"
                  )}
                </td>
                <td>
                  {moment(item?.offHireEndDateTime).format(
                    "DD-MMM-yyyy, HH:mm"
                  )}
                </td>
                <td className="text-center">{item?.offHireDuration}</td>
                <td className="text-center">{item?.durationPercentage}%</td>
                <td className="text-right">
                  {item?.offHireFinalDuration} DAYS
                </td>
                <td className="text-right">{item?.offHireCve}</td>
                <td className="text-right">{item?.offHireLsfoqty}</td>
                <td className="text-right">{item?.offHireLsmgoqty}</td>
                <td>{item?.offHireReason}</td>
                {/* <td className="text-right">
              {_formatMoney(item?.offHireCostAmount)}
            </td> */}
                {/* <td className="text-center">
                  <div className="d-flex justify-content-around">
                    {item?.isEditable && (
                      <IEdit
                        clickHandler={() => {
                          history.push(
                            `/chartering/offHire/edit/${item?.offHireId}`
                          );
                        }}
                      />
                    )}
                  </div>
                </td> */}
              </tr>
            );
          })}
          <tr style={{ fontWeight: "bold", textAlign: "right" }}>
            <td colSpan={6} className="text-right">
              <b>Total</b>
            </td>
            <td>{_fixedPoint(totalFinalOffHireDuration, true, 3)}DAYS</td>
            <td>{_fixedPoint(totalCVE, true, 3)}</td>
            <td>{_fixedPoint(totalLSFOQty, true, 3)}</td>
            <td>{_fixedPoint(totalLSMGOQty, true, 3)}</td>
            <td></td>
          </tr>
        </ICustomTable>
      </div>
    </>
  );
}
