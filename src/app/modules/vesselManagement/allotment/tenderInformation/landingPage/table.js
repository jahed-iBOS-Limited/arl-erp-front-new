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
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import ICustomTable from "../../../../chartering/_chartinghelper/_customTable";

const initData = {
  motherVessel: "",
  port: "",
};

const tHeaders = [
  { name: "SL", style: { minWidth: "30px" } },
  { name: "Mother Vessel", style: { minWidth: "150px" } },
  { name: "Program No", style: { minWidth: "80px" } },
  { name: "Award", style: { minWidth: "160px" } },
  { name: "CNF", style: { minWidth: "130px" } },
  { name: "CNF Rate", style: { minWidth: "50px" } },
  { name: "Steve Dore", style: { minWidth: "130px" } },
  { name: "Steve Dore Rate", style: { minWidth: "50px" } },
  { name: "Surveyor", style: { minWidth: "130px" } },
  { name: "Surveyor Rate", style: { minWidth: "50px" } },
  { name: "Hatch Labour", style: { minWidth: "130px" } },
  { name: "Hatch Labour Rate", style: { minWidth: "50px" } },
  { name: "Lot No", style: { minWidth: "50px" } },
  { name: "Program Qty", style: { minWidth: "80px" } },
  { name: "Transfer Qty", style: { minWidth: "80px" } },
  { name: "Challan Qty", style: { minWidth: "80px" } },
  { name: "Remaining Qty", style: { minWidth: "80px" } },
  { name: "Weight", style: { minWidth: "80px" } },
  { name: "Action", style: { minWidth: "70px" } },
  { name: "Bill Generate", style: { minWidth: "70px" } },
];

export default function TenderInformationLandingTable() {
  const history = useHistory();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [isLoading, setIsLoading] = useState(false);
  const [portDDL, setPortDDL] = useState([]);
  const [, billGenerate, billGenerateLoader] = useAxiosPost();
  const [unloadStarted, getIsUnloadStarted, usLoader] = useAxiosGet();

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

  const generateBills = (item, billType) => {
    if (!unloadStarted) {
      return toast.warn("Mother vessel unloading has not started yet!");
    }
    const cnfURL = `/tms/LigterLoadUnload/G2GStandardCostingCNF?motherVesselId=${item?.motherVesselId}`;
    const steveDoreURL = `/tms/LigterLoadUnload/G2GStandardCostingStevdore?motherVesselId=${item?.motherVesselId}`;
    const surveyorURL = `/tms/LigterLoadUnload/G2GStandardCostingServeyor?motherVesselId=${item?.motherVesselId}`;
    const hatchLabourURL = `/tms/LigterLoadUnload/G2GStandardCostingHatchLabour?motherVesselId=${item?.motherVesselId}`;

    let URL = ``;

    switch (billType) {
      case "cnf":
        URL = cnfURL;
        break;
      case "steveDore":
        URL = steveDoreURL;
        break;
      case "surveyor":
        URL = surveyorURL;
        break;
      case "hatchLabour":
        URL = hatchLabourURL;
        break;

      default:
        break;
    }

    billGenerate(URL, {}, () => {});
  };

  const loader = loading || isLoading || billGenerateLoader || usLoader;

  const billIcons = [
    { title: "Generate CNF Bill", billType: "cnf" },
    { title: "Generate SteveDore Bill", billType: "steveDore" },
    { title: "Generate Surveyor Bill", billType: "surveyor" },
    { title: "Generate Hatch Labour Bill", billType: "hatchLabour" },
  ];

  return (
    <>
      {loader && <Loading />}
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
                      setGridData([]);
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
                      setGridData([]);
                      getIsUnloadStarted(
                        `/tms/LigterLoadUnload/MotherVesselInLoadingState?businessUnitId=${buId}&motherVesselId=${valueOption?.value}`
                      );
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
              <ICustomTable ths={tHeaders} scrollable={true}>
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
                      <td>{item?.hatchLabour}</td>
                      <td className="text-right">{item?.hatchLabourRate}</td>
                      <td>{item?.lotNo}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.programQnt, true)}
                      </td>
                      <td
                        className="text-right"
                        style={{ backgroundColor: "#f6f602" }}
                      >
                        {_fixedPoint(item?.transferQnt, true)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.challanQuantity, true)}
                      </td>
                      <td
                        className="text-right"
                        style={
                          item?.remaingQuantity < 0
                            ? { backgroundColor: "#ff00007d" }
                            : { backgroundColor: "#90ee90" }
                        }
                      >
                        {_fixedPoint(item?.remaingQuantity, true)}
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
                                  pathname: `/vessel-management/allotment/tenderinformation/edit/${item?.programId}`,
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
                      {index === 0 && (
                        <td
                          className="text-center"
                          rowSpan={gridData?.data?.length}
                        >
                          <div className="d-flex justify-content-around align-items-center">
                            {billIcons?.map((e) => {
                              return (
                                <span className="p-1">
                                  <ICon
                                    title={e?.title}
                                    onClick={() => {
                                      generateBills(item, e?.billType);
                                    }}
                                  >
                                    <i class="fas fa-file-invoice-dollar"></i>{" "}
                                  </ICon>
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </ICustomTable>
              {/* <div className="row cash_journal">
                <div className="col-lg-12">
                  <div className="loan-scrollable-table inventory-statement-report">
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>SL</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div> */}{" "}
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
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
