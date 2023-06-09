import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { GetDomesticPortDDL } from "../../loadingInformation/helper";
import { deleteTenderInfo, getMotherVesselDDL } from "../helper";

const initData = {
  motherVessel: "",
  port: "",
};

export default function TenderInformationLandingTable() {
  const history = useHistory();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const [isLoading, setIsLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (_pageNo, _pageSize, values) => {
    const url = `/tms/LigterLoadUnload/GetGTOGProgramInfoPagination?AccountId=${accId}&BusinessUnitId=${buId}&MotherVesselId=${values?.motherVessel?.value}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getGridData(url);
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
  }, [accId, buId]);

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this tender information?",
      yesAlertFunc: () => {
        deleteTenderInfo(id, setIsLoading, () => {
          setLandingData(pageNo, pageSize, values);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  return (
    <>
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard
            title="Tender Information"
            isCreteBtn={true}
            createHandler={() => {
              history.push(
                `/vessel-management/allotment/tenderinformation/entry`
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={portDDL || []}
                    value={values?.port}
                    label="Port"
                    onChange={(valueOption) => {
                      setFieldValue("port", valueOption);
                      setFieldValue("motherVessel", "");
                      getMotherVesselDDL(
                        accId,
                        buId,
                        setMotherVesselDDL,
                        valueOption?.value
                      );
                    }}
                    placeholder="Port"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={motherVesselDDL}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setFieldValue("motherVessel", valueOption);
                    }}
                    placeholder="Mother Vessel"
                    isDisabled={!values?.port}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                    disabled={!values?.motherVessel}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row cash_journal">
                {(loading || isLoading) && <Loading />}
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Mother Vessel</th>
                        <th>Program No</th>
                        <th>Award</th>
                        <th>CNF</th>
                        <th>CNF Rate</th>
                        <th>Steve Dore</th>
                        <th>Steve Dore Rate</th>
                        <th>Surveyor</th>
                        <th>Surveyor Rate</th>
                        <th>Lot No</th>
                        <th>Program Quantity</th>
                        <th>Weight</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td> {item?.sl}</td>
                            <td>{item?.motherVesselName}</td>
                            <td>{item?.program}</td>
                            <td>{item?.award}</td>
                            <td>{item?.cnfname}</td>
                            <td className="text-right">{item?.cnfrate}</td>
                            <td>{item?.stevdoreName}</td>
                            <td className="text-right">{item?.stevdorRate}</td>
                            <td>{item?.serveyorName}</td>
                            <td className="text-right">{item?.serveyorRate}</td>
                            <td>{item?.lotNo}</td>
                            <td className="text-right">
                              {_fixedPoint(item?.programQnt, true)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(item?.netWeight, true)}
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-around">
                                <span>
                                  <IEdit
                                    onClick={() =>
                                      history.push({
                                        pathname: `/vessel-management/allotment/tenderinformation/Edit/${item?.programId}`,
                                        state: item,
                                      })
                                    }
                                  />
                                </span>
                                <span>
                                  <IDelete
                                    id={item?.programId}
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
                      {/* {gridData?.data?.length > 0 && (
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={6}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalQty, true)}
                          </td>
                          <td></td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setLandingData}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
