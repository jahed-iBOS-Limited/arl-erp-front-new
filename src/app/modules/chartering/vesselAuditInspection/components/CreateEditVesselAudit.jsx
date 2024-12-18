import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import Loading from '../../../_helper/_loading';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { _dateFormatter } from '../../_chartinghelper/_dateFormatter';
import Form from './form';
const initData = {
  vesselType: '',
  vessel: '',
  date: _todayDate(),
  dueDate: '',
  vesselPosition: '',
  status: '',
  title: '',
  category: '',
  type: '',
  description: '',
  nc: false,
};
export default function CreateEditVesselAudit() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [singleData] = useState({});
  const location = useLocation();
  const { state } = location;
  const [rowDto, setRowDto] = useState([]);

  const [, getVesselAuditInspectionDetails] = useAxiosGet();
  const [, createAndEditVesselAuditInspection, loader] = useAxiosPost();
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
                  item?.strStatus === 'pending'
                    ? 'Pending'
                    : item?.strStatus === 'open'
                    ? 'Open'
                    : 'Close',
              },
              dueDate: item?.dteDueDateTime,
              description: item?.strDescription,
              nc: item?.isNcChecked,
            };
          });
          setRowDto(modifyData);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Save Handler */
  const saveHandler = (payload) => {
    /* Create Part */

    createAndEditVesselAuditInspection(
      `/hcm/VesselAuditInspection/CreateAndEditVesselAuditInspection`,
      payload,
      () => {},
      true,
    );
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <Form
        title={
          type === 'view'
            ? 'View Vessel Audit Inspection'
            : type === 'edit'
            ? 'Edit Vessel Audit Inspection'
            : 'Create Vessel Audit Inspection'
        }
        initData={
          id
            ? {
                ...initData,
                vesselType: {
                  value: state?.strVesselType,
                  label:
                    state?.strVesselType === 'LighterVessel'
                      ? 'Lighter Vessel'
                      : 'Mother Vessel',
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
