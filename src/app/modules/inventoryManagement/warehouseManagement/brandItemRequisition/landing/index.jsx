/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import BrandItemRequisitionLandingTable from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import BrandItemRequisitionApproveForm from "./approve";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  territory: "",
  status: { value: 0, label: "All" },
};

function BrandItemRequisitionLanding() {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [
    singleData,
    getSingleData,
    singleDataLoader,
    setSingleData,
  ] = useAxiosGet();
  const [open, setOpen] = useState(false);

  const getLandingData = (values, pageNo = 0, pageSize = 15) => {
    const status = values?.status?.value;

    const urlForAllData = `/wms/ItemRequest/GetBrandItemRequest?areaId=${values
      ?.area?.value || 0}&businessUnitId=${buId}&fromDate=${
      values?.fromDate
    }&todate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;

    const urlForPending = `/wms/ItemRequest/GetBrandItemRequestDataForApproval?accountId=${accId}&businessUnitId=${buId}&areaId=${values?.area?.value}&fromDate=${values?.fromDate}&todate=${values?.toDate}&status=1&isApproveByRM=true&PageNo=${pageNo}&PageSize=${pageSize}`;

    const urlForHeadOffice = `/wms/ItemRequest/GetBrandItemRequestDataForApproval?accountId=${accId}&businessUnitId=${buId}&regionId=${
      values?.region?.value
    }&fromDate=${values?.fromDate}&todate=${values?.toDate}&status=${
      [2, 4].includes(status) ? 1 : 2
    }&isApproveByRM=false&PageNo=${pageNo}&PageSize=${pageSize}`;

    const url =
      status === 0
        ? urlForAllData
        : status === 1
        ? urlForPending
        : urlForHeadOffice;

    getRowData(url);
  };

  useEffect(() => {
    getLandingData(initData, pageNo, pageSize);
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  const getSingleDataById = (id) => {
    getSingleData(
      `/wms/ItemRequest/GetBrandItemRequestById?id=${id}`,
      (resData) => {
        const modifyData = {
          ...resData,
          programType: {
            value: resData?.brandRequestTypeId,
            label: resData?.brandRequestTypeName,
          },
          requiredDate: _dateFormatter(resData?.requiredDate),
          purpose: resData?.purpose,
        };
        setSingleData(modifyData);
        if (resData?.brandRequestId && resData?.brandItemRows?.length > 0) {
          setOpen(true);
        }
      }
    );
  };

  const loading = singleDataLoader || loader;

  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title="Brand Item Requisition"
        createHandler={() =>
          history.push(
            `/inventory-management/warehouse-management/branditemrequisition/entry`
          )
        }
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue }) => (
            <>
              <form>
                <div className="row global-form">
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      territory: false,
                      onChange: () => {
                        setRowData([]);
                      },
                    }}
                  />
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: () => {
                        setRowData([]);
                      },
                    }}
                  />
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Pending for Regional Manager Approval" },
                        { value: 2, label: "Approved by Regional Manager" },
                        { value: 4, label: "Pending for Head Office Approval" },
                        { value: 3, label: "Approved by Head Office" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setRowData([]);
                      }}
                      placeholder="Status"
                    />
                  </div>
                  <IButton
                    disabled={!values?.status || !values?.area}
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize);
                    }}
                  />
                </div>

                <BrandItemRequisitionLandingTable
                  obj={{ rowData, values, getSingleDataById }}
                />

                {rowData?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </form>
              <IViewModal show={open} onHide={() => setOpen(false)}>
                <BrandItemRequisitionApproveForm
                  getLandingData={getLandingData}
                  singleData={singleData}
                  setOpen={setOpen}
                  values={values}
                />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default BrandItemRequisitionLanding;
