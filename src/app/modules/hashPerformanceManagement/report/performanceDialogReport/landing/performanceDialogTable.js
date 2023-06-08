import html2pdf from "html2pdf.js";
import React from "react";
import { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import JohariWindowPdfFile from "../../../performanceCoaching/actionPlanJohariWindow/JohariWindowPdfFile";
import GrowModelPdf from "../../../performanceCoaching/growModel/landing/pdfFile";
import PDFVIEW from "../../../performanceCoaching/johariWindow/landing/pdf";
import ActionPlanPdfFile from "../../../performancePlanning/ActionPlan/ActionPlanPdfFile";
import EisenHowerPdfFile from "../../../performancePlanning/eisenhowerMatrix/landing/pdfFile";
import { WorkPlanTable } from "../../../performancePlanning/workPlan/landing/WorkPlanTable";

const PerformanceDialogTable = ({ rowDto }) => {
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState(null);

  const pdfExport = (typeName) => {
    var element = document.getElementById("pdf-section");

    var opt = {
      margin: 20,
      filename: `${typeName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  console.log("sdfghjk", singleData)

  return (
    <div className="row cash_journal">
      <div className="col-lg-12 pr-0 pl-0">
        {rowDto?.length >= 0 && (
          <table
            id="table-to-xlsx"
            className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
          >
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Enroll</th>
                <th style={{ width: "90px" }}>Name</th>
                <th style={{ width: "90px" }}>Department</th>
                <th style={{ width: "90px" }}>Section</th>
                <th style={{ width: "90px" }}>Business Unit</th>
                <th style={{ width: "90px" }}>Report Type</th>
                <th style={{ width: "90px" }}>Year</th>
                <th style={{ width: "90px" }}>Quarter</th>
                <th style={{ width: "90px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item?.employeeId || "-"}</td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.employeeName || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.departmentName || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.sectionName || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.businessUnitName || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.reportTypename || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">{item?.year || "-"}</div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      {item?.quarter || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="px-1 text-center">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setShow(true);
                          setSingleData(item);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* modal */}
      <IViewModal show={show} onHide={() => setShow(false)}>
        <div>
          <div className="mt-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={(e) =>
                pdfExport(
                  singleData?.employeeName + "-" + singleData?.reportTypename
                )
              }
            >
              Export Pdf
            </button>
          </div>

          {/* pdf section */}

          <div id="pdf-section" className="px-5">
            {singleData?.reportTypename === "Grow Model" && (
              <GrowModelPdf 
              singleData={singleData?.growModel} 
              growRowData={singleData}
              />
            )}
            {singleData?.reportTypename === "Eisenhower Matrix" && (
              <EisenHowerPdfFile
                singleData={{
                  employeeFullName: singleData?.employeeName,
                  designationName: singleData?.sectionName,
                  doFirst: singleData?.eisenHower?.doFirst,
                  schedule: singleData?.eisenHower?.schedule,
                  delegate: singleData?.eisenHower?.delegate,
                  dontDo: singleData?.eisenHower?.dontDo,
                  header: singleData
                }}
              />
            )}
            {singleData?.reportTypename === "Work Plan" && (
              <WorkPlanTable
                planList={singleData}
                planListRow={singleData?.workPlan}
                userName={singleData?.employeeName}
                employeeId={singleData?.employeeId}
              />
            )}
            {singleData?.reportTypename === "Action Plan" && (
              <ActionPlanPdfFile
                pdfData={{
                  rowData: {
                    ...singleData,
                    row: singleData?.actionPlan,
                  },
                }}
              />
            )}
            {singleData?.reportTypename === "Johari Window" && (
              <PDFVIEW
              chipList={{
                blind: singleData?.johariWindow?.blind,
                hidden: singleData?.johariWindow?.hidden,
                open: singleData?.johariWindow?.open,
                unknown: singleData?.johariWindow?.unknown,
              }}
              rowData={singleData?.johariWindow}
              />
            )}
            {singleData?.reportTypename === "Action Plan Johari Window" && (
              <JohariWindowPdfFile
                pdfData={{
                  rowData: {
                    ...singleData,
                    row: singleData?.actionPlan,
                  },
                }}
              />
            )}
          </div>
        </div>
      </IViewModal>
    </div>
  );
};

export default PerformanceDialogTable;
