import React, { useState, useRef } from "react";
import ICard from "../../../../_helper/_card";
import { Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import { MinistryReport } from "./ministryReport/_index";
import { InternalReport } from "./internalReport/_index";
import { PurchaseAndSalesInfo } from "./powerBIReport/purchaseAndSalesInfo";

export default function FertilizerReportLanding() {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("ministry");

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Fertilizer Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          // isExcelBtn={tab === true }
          // excelFileNameWillbe="Fertilizers Report"
        >
          <div>
            {loading && <Loading />}
            <div className="mx-auto mt-2">
              <>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                  <li class="nav-item">
                    <span
                      class={`nav-link cursor-pointer ${
                        tab === "ministry" ? "active" : ""
                      }`}
                      id="ministry-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="ministry"
                      aria-selected="true"
                      onClick={() => {
                        setTab("ministry");
                      }}
                    >
                      Ministry Report
                    </span>
                  </li>
                  <li class="nav-item">
                    <span
                      class={`nav-link cursor-pointer ${
                        tab === "internal" ? "active" : ""
                      }`}
                      id="internal-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="internal"
                      aria-selected="false"
                      onClick={() => {
                        setTab("internal");
                      }}
                    >
                      Internal Report
                    </span>
                  </li>
                  <li class="nav-item">
                    <span
                      class={`nav-link cursor-pointer ${
                        tab === "salesInfo" ? "active" : ""
                      }`}
                      id="salesInfo-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="salesInfo"
                      aria-selected="false"
                      onClick={() => {
                        setTab("salesInfo");
                      }}
                    >
                      Purchase & Sales Info
                    </span>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div
                    class={`tab-pane fade ${
                      tab === "ministry" ? "show active" : ""
                    }`}
                    id="ministry"
                    role="tabpanel"
                    aria-labelledby="ministry-tab"
                  >
                    <MinistryReport
                      loading={loading}
                      setLoading={setLoading}
                      printRef={tab === "ministry" ? printRef : null}
                    />
                  </div>
                  <div
                    class={`tab-pane fade ${
                      tab === "internal" ? "show active" : ""
                    }`}
                    id="internal"
                    role="tabpanel"
                    aria-labelledby="internal-tab"
                  >
                    <InternalReport
                      loading={loading}
                      setLoading={setLoading}
                      printRef={tab === "internal" ? printRef : null}
                    />
                  </div>
                  <div
                    class={`tab-pane fade ${
                      tab === "salesInfo" ? "show active" : ""
                    }`}
                    id="salesInfo"
                    role="tabpanel"
                    aria-labelledby="salesInfo-tab"
                  >
                    <PurchaseAndSalesInfo/>
                  </div>
                </div>
              </>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
