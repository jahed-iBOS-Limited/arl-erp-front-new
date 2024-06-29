import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import { useHistory, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import Form from "./form";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";
const initData = {
  vesselType: "",
  vessel: "",
  date: _todayDate(),
  dueDate: "",
  vesselPosition: "",
  status: "",
  title: "",
  category: "",
  type: "",
  description: "",
  nc: false,
};
export default function CreateEditVesselAudit() {
  const { type, id } = useParams();

  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const location = useLocation();
  const { state } = location;
  const [rowDto, setRowDto] = useState([]);

  const [, getVesselAuditInspectionDetails, dettailLoader] = useAxiosGet();
  const [res, createAndEditVesselAuditInspection, loader] = useAxiosPost();
  useEffect(() => {
    if (id) {
      getVesselAuditInspectionDetails(
        `/hcm/VesselAuditInspection/GetVesselAuditInspectionDetails?auditInspectionId=${id}&typeId=0`,
        (data) => {
          const modifyData = data?.map((item) => {
            return {
              ...item,
              status: {
                value: item?.strStatus,
                label:
                  item?.strStatus === "pending"
                    ? "Pending"
                    : item?.strStatus === "open"
                    ? "Open"
                    : "Close",
              },
              dueDate: item?.dteDueDateTime,
              description: item?.strDescription,
              nc: item?.isNcChecked,
            };
          });
          setRowDto(modifyData);
        }
      );
    }
  }, []);
  /* Save Handler */
  const saveHandler = (payload) => {
    /* Create Part */

    createAndEditVesselAuditInspection(
      `/hcm/VesselAuditInspection/CreateAndEditVesselAuditInspection`,
      payload,
      () => {},
      true
    );
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <Form
        title={
          type === "view"
            ? "View Vessel Audit Inspection"
            : type === "edit"
            ? "Edit Vessel Audit Inspection"
            : "Create Vessel Audit Inspection"
        }
        initData={
          id
            ? {
                ...initData,
                vesselType: {
                  value: state?.strVesselType,
                  label:
                    state?.strVesselType === "LighterVessel"
                      ? "Lighter Vessel"
                      : "Mother Vessel",
                },
                vessel: {
                  value: state?.intVesselId,
                  label: state?.strVesselName,
                },
                date: _dateFormatter(state?.dteInspectionDate),
                vesselPosition: state?.strVesselPosition,
                title: state?.strTitle,
                category: {
                  value: state?.intCategoryId,
                  label: state?.strCategoryName,
                },
                type: { value: state?.intTypeId, label: state?.strTypeName },
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
        singleData={singleData}
        id={id}
        /* DDL */
        vesselDDL={[]}
        certificateTypeDDL={[]}
        setLoading={setLoading}
        rowDto={rowDto}
        setRowDto={setRowDto}
      />
    </>
  );
}
