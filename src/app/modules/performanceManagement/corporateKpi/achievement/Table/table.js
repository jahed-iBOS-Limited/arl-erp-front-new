import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getYearDDLAction } from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useState } from "react";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import "./table.css";
import { getCorporateDepertmentDDL } from "./../helper";
import { toast } from "react-toastify";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../View/mainForm.js";

export default function AchievementTable() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.corporatePerformanceChart.monthDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    monthDDL,
    // sbuDDL,
  } = storeData;

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const dispatch = useDispatch();
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [corporateDDL, setCorporateDDL] = useState([]);
  const [corporate, setCorporate] = useState({
    value: profileData?.departmentId,
    label: profileData?.departmentName,
  });

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      getCorporateDepertmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCorporateDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
    setYear({ value: yearDDL[0]?.value, label: yearDDL[0]?.label });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  const [report, setReport] = useState({});

  useEffect(() => {
    if (corporate?.value) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        corporate?.value,
        11,
        0,
        0,
        false,
        4
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, corporate]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let corKpiResult = null;
  let corKpiResultPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 277) {
      corKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 876) {
      corKpiResultPublic = userRole[i];
    }
  }

  return (
    <ICard title="CORPORATE KPI ACHIEVEMENT">
      <div className="form-group row sbu-kpi-achievement">
        <div className="col-lg">
          <label>Select Corporate</label>
          <Select
            onChange={(valueOption) => {
              setCorporate({
                value: valueOption?.value,
                label: valueOption?.label,
              });

              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                valueOption?.value,
                year?.value,
                from?.value,
                to?.value,
                false,
                4
              );
            }}
            isDisabled={!corKpiResultPublic?.isView}
            className="mb-3"
            value={corporate}
            styles={customStyles}
            label="Corporate"
            options={corporateDDL || []}
            name="corporate"
          />
        </div>
        <div className="col-lg">
          <label>Select Year</label>
          <Select
            onChange={(valueOption) => {
              setYear({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              dispatch(getMonthDDLAction(valueOption?.value));
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                corporate?.value,
                valueOption?.value,
                from?.value,
                to?.value,
                false,
                4
              );
            }}
            className="mb-3"
            value={year}
            styles={customStyles}
            label="Year"
            options={yearDDL || []}
            name="year"
          />
        </div>
        <div className="col-lg">
          <label>Select From Month</label>
          <Select
            onChange={(valueOption) => {
              setFrom({
                value: valueOption?.value,
                label: valueOption?.label,
              });

              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                corporate?.value,
                year?.value,
                valueOption?.value,
                to?.value,
                false,
                4
              );
            }}
            className="mb-3"
            value={from}
            styles={customStyles}
            label="From month"
            options={monthDDL || []}
            name="from"
            isDisabled={!year}
          />
        </div>

        <div className="col-lg">
          <label>Select To Month</label>
          <Select
            onChange={(valueOption) => {
              setTo({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                corporate?.value,
                year?.value,
                from?.value,
                valueOption?.value,
                false,
                4
              );
            }}
            className="mb-3"
            value={to}
            styles={customStyles}
            label="To month"
            options={monthDDL || []}
            name="to"
            isDisabled={!year}
          />
        </div>
      </div>
      <div className="achievement">
        <PmsCommonTable
          ths={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Weight" },
            { name: "Target" },
            { name: "Achievement" },
            { name: "Achievement (%)" },
            { name: "Progress" },
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
                  <td>
                    {indx !== report?.infoList.length - 1 && (
                      <OverlayTrigger
                        overlay={
                          <Tooltip className="mytooltip" id="info-tooltip">
                            <span>Achievement Entry</span>
                          </Tooltip>
                        }
                      >
                        <span
                          style={{
                            padding: "16px 16px",
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            if (corKpiResult?.isCreate) {
                              setCurrentItem({
                                kpiId: item.kpiId,
                                frId: item.intFrequency,
                                year: item?.intYearId,
                                enroll: corporate?.value,
                                selectedYear: year,
                                objective: item?.objective,
                                kpi: item?.kpi,
                                setReport,
                              });
                              setIsShowModal(true);
                            } else {
                              toast.warning("You don't have access'");
                            }
                          }}
                        >
                          {item?.numAchivement}
                        </span>
                      </OverlayTrigger>
                    )}
                  </td>
                  <td> {item?.progress} </td>
                  <td
                    className={
                      indx !== report?.infoList.length - 1
                        ? item?.progress >= 80
                          ? "green"
                          : item?.progress >= 60
                          ? "yellow"
                          : "red"
                        : ""
                    }
                  >
                    <div></div>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </PmsCommonTable>
      </div>
      <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
        <ViewForm currentItem={currentItem} />
      </IViewModal>
    </ICard>
  );
}
