import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
  checkUpdateDeletePermission,
  deleteTheVehicleLog,
  getOwnVehicleNo,
  getVehicleLogBookLanding,
} from '../helper';
import IConfirmModal from '../../../../_helper/_confirmModal';
import ICustomCard from '../../../../_helper/_customCard';
import Loading from '../../../../_helper/_loading';
import VehicleLogTable from './vehicleLogTable';
import VehicleLogLandingForm from './form';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import VehicleLogBook from '../view/addEditForm';
import VehicleEditForm from '../Form/formForEdit';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import VehicleProblemTable from './vehicleProblemTable';
import VehicleTripTargetTable from './tripTargetTable';

const initData = {
  vehicleNo: '',
  shipPoint: '',
  travelDateFrom: _todayDate(),
  travelDateTo: _todayDate(),
  entryBy: 'own',
};

const VehicleLogLanding = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // state
  const [vehicleNoList, setVehicleNoList] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [, getRowData, loader] = useAxiosGet();

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  const [permitted, setPermitted] = useState(false);

  // Redux store data
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // get initial data
  useEffect(() => {
    getOwnVehicleNo(employeeId, setVehicleNoList);
    checkUpdateDeletePermission(userId, setPermitted, setLoading);
  }, [accId, buId, userId, employeeId]);

  const getGridData = (values, pageNo, pageSize) => {
    const typeId = values?.type?.value;

    const vehicleProblemUrl = `/tms/Vehicle/GetVechicleProblemInfo?businessUnitId=${buId}&shipPointId=${
      values?.shipPoint?.value || 0
    }&vehicleId=${
      values?.vehicleNo?.value || 0
    }&pageNo=${pageNo}&pageSize=${pageSize}`;

    const tripTargetUrl = `/tms/Vehicle/GetVehicleTripTarget?businessUnitId=${buId}&shipPointId=${
      values?.shipPoint?.value
    }&vehicleId=${values?.vehicleNo?.value || 0}&yearId=${
      values?.year?.value
    }&monthId=${values?.month?.value}&pageNo=${pageNo}&pageSize=${pageSize}`;

    const URL =
      typeId === 2 ? vehicleProblemUrl : typeId === 3 ? tripTargetUrl : '';

    if (typeId === 1) {
      getVehicleLogBookLanding(
        values?.travelDateFrom,
        values?.travelDateTo,
        accId,
        buId,
        pageNo,
        pageSize,
        values?.vehicleNo?.value,
        setRowData,
        setLoading
      );
    } else if ([2, 3].includes(typeId)) {
      getRowData(URL, (resData) => {
        if (!resData?.data?.length) {
          toast.warn('Data not found');
          setRowData({});
        } else {
          setRowData(resData);
        }
      });
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const deleteVehicleLog = (id, values) => {
    const payload = [
      {
        vehicleLogId: id,
        userId: userId,
        permissionFor: 3,
        accountId: accId,
        businessUnitId: buId,
      },
    ];

    const confirmationObj = {
      title: 'Delete Vehicle Log',
      message: 'Are you sure you want to delete this vehicle log?',
      yesAlertFunc: () => {
        deleteTheVehicleLog(payload, setLoading, () => {
          getGridData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmationObj);
  };

  const isLoading = loader || loading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue }) => (
        <>
          {isLoading && <Loading />}
          <ICustomCard
            title="Vehicle Log Book for (Credit)"
            createHandler={() => {
              if (values?.type) {
                if (values?.type?.value === 2) {
                  history.push({
                    pathname:
                      '/transport-management/routecostmanagement/routestandardcost/vehicleProblem',
                  });
                } else if (values?.type?.value === 3) {
                  history.push({
                    pathname:
                      '/transport-management/routecostmanagement/routestandardcost/tripTargetEntry',
                    state: {
                      values,
                    },
                  });
                } else if (values?.vehicleNo?.value) {
                  history.push({
                    pathname:
                      '/transport-management/routecostmanagement/routestandardcost/create',
                    state: {
                      values,
                    },
                  });
                } else {
                  toast.warn('Please select vehicle no');
                }
              } else {
                toast.warn('Please Select a Type');
              }
            }}
          >
            <VehicleLogLandingForm
              obj={{
                setVehicleNoList,
                vehicleNoList,
                setFieldValue,
                getGridData,
                setRowData,
                employeeId,
                pageSize,
                pageNo,
                values,
                accId,
                buId,
              }}
            />

            {/* Vehicle Log Table */}
            {[1].includes(values?.type?.value) && (
              <VehicleLogTable
                obj={{
                  setId,
                  values,
                  rowData,
                  setOpen,
                  permitted,
                  setShowModal,
                  setSingleItem,
                  deleteVehicleLog,
                }}
              />
            )}

            {/* Vehicle Problem Table */}
            {[2].includes(values?.type?.value) && (
              <VehicleProblemTable obj={{ rowData }} />
            )}
            {[3].includes(values?.type?.value) && (
              <VehicleTripTargetTable obj={{ rowData, buId, values }} />
            )}

            {/* Pagination section for both table */}
            {rowData?.data?.length > 0 && (
              <PaginationTable
                count={rowData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
            {/* View Modal */}
            <IViewModal show={showModal} onHide={() => setShowModal(false)}>
              <VehicleLogBook id={id} />
            </IViewModal>

            {/* Edit Modal */}
            <IViewModal show={open} onHide={() => setOpen(false)}>
              <VehicleEditForm
                singleItem={singleItem}
                setOpen={setOpen}
                getGridData={getGridData}
                value={values}
                pageNo={pageNo}
                pageSize={pageSize}
              />
            </IViewModal>
          </ICustomCard>
        </>
      )}
    </Formik>
  );
};

export default VehicleLogLanding;
