/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  GetDomesticPortDDL,
  GetShipPointDDL,
} from "../../generalInformation/helper";
import {
  GetLighterDestinationDDL,
  getLightersByVesselNLighterDestination,
} from "../../unLoadingInformation/helper";
import {
  deleteCostInfo,
  getGhatCostInfoLanding,
  getMotherVesselDDL,
} from "../helper";

const initData = {
  port: "",
  motherVessel: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  destination: "",
  lighterVessel: "",
  shipPoint: "",
};
const headers = [
  "SL",
  "Lighter Vessel",
  "ShipPoint",
  "From Date",
  "To Date",
  "Total Quantity",
  "Total Amount",
  "Action",
];

const GhatCostInfoTable = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [destinationDDL, setDestinationDDL] = useState([]);
  const [lighters, setLighters] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, _pageNo = 0, _pageSize = 15) => {
    getGhatCostInfoLanding(
      buId,
      values?.motherVessel?.value,
      values?.shipPoint?.value,
      values?.lighterVessel?.value,
      values?.fromDate,
      values?.toDate,
      _pageNo,
      _pageSize,
      setLoading,
      setGridData
    );
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    GetLighterDestinationDDL(accId, buId, setDestinationDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this cost info?",
      yesAlertFunc: () => {
        deleteCostInfo(id, setLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  let grandTotalQty = 0;
  let grandTotalAmount = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title="Ghat Cost Information"
              createHandler={() => {
                history.push(
                  `/vessel-management/allotment/ghatcostinfo/create`
                );
              }}
            >
              {loading && <Loading />}
              <form className="form form-label-right">
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="destination"
                      options={destinationDDL}
                      value={values?.destination}
                      label="Lighter Destination"
                      onChange={(e) => {
                        setFieldValue("destination", e);
                      }}
                      placeholder="Lighter Destination"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="port"
                      options={[...portDDL] || []}
                      value={values?.port}
                      label="Loading Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                        setFieldValue("motherVessel", "");
                        setFieldValue("lighterVessel", "");
                        getMotherVesselDDL(
                          accId,
                          buId,
                          setMotherVesselDDL,
                          valueOption?.value
                        );
                      }}
                      placeholder="Loading Port"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="motherVessel"
                      options={[...motherVesselDDL]}
                      value={values?.motherVessel}
                      label="Mother Vessel"
                      onChange={(valueOption) => {
                        setFieldValue("motherVessel", valueOption);
                        setFieldValue("lighterVessel", "");
                        if (valueOption) {
                          getLightersByVesselNLighterDestination(
                            values?.destination?.value,
                            valueOption?.value,
                            setLighters,
                            setLoading,
                            (e) => {}
                          );
                        }
                      }}
                      placeholder="Mother Vessel"
                      isDisabled={!values?.destination}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="lighterVessel"
                      options={lighters}
                      value={values?.lighterVessel}
                      label="Lighter Vessel"
                      onChange={(e) => {
                        setFieldValue("lighterVessel", e);
                      }}
                      placeholder="Lighter"
                      isDisabled={!values?.motherVessel}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={shipPointDDL}
                      value={values?.shipPoint}
                      label="ShipPoint"
                      onChange={(e) => {
                        setFieldValue("shipPoint", e);
                      }}
                      placeholder="ShipPoint"
                    />
                  </div>
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                    }}
                  />
                  <IButton
                    onClick={() => {
                      getData(values);
                    }}
                  />
                </div>
                {gridData?.data?.length > 0 && (
                  <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => {
                        grandTotalQty += item?.totalQuantity;
                        grandTotalAmount += item?.totalAmount;
                        return (
                          <tr key={index}>
                            <td> {index + 1}</td>
                            <td> {item?.lighterVesselName}</td>
                            <td> {item?.shipPointName}</td>
                            <td> {_dateFormatter(values?.fromDate)}</td>
                            <td> {_dateFormatter(values?.toDate)}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.totalQuantity, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.totalAmount, true)}
                            </td>
                            <td style={{ width: "100px" }}>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push({
                                      pathname: `/vessel-management/allotment/ghatcostinfo/update/${item?.id}`,
                                      state: item,
                                    });
                                  }}
                                >
                                  <IEdit title={"Rate Entry"} />
                                </span>
                                <span>
                                  <IDelete
                                    id={item?.id}
                                    remover={(id) => {
                                      deleteHandler(id, values);
                                    }}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {gridData?.data?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={5}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(grandTotalQty, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(grandTotalAmount, true)}
                          </td>

                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default GhatCostInfoTable;
