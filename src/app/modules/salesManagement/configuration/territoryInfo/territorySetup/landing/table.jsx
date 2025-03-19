import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getTerritorySetupLanding, getChannelDDL } from "../helper";
import "../style.css";
import { useHistory } from "react-router";
import TerritorySetupForm from "../form/addEditForm";
import { Formik } from "formik";
import NewSelect from "./../../../../../_helper/_select";
import IViewModal from "./../../../../../_helper/_viewModal";
import Loading from "./../../../../../_helper/_loading";
import ICard from "./../../../../../_helper/_card";

const initData = {
  channel: { value: 0, label: "All" },
};

const TerritorySetupLanding = () => {
  // const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [channelDDL, setChannelDDL] = useState([]);
  // //paginationState
  // const [pageNo, setPageNo] = useState(0);
  // const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setChannelDDL
      );
      setLandingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setLandingData = (values) => {
    getTerritorySetupLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.channel?.value || 0,
      setLoading,
      setGridData
    );
  };
  const history = useHistory();
  return (
    <>
      <ICard
        title="Territory Setup"
        isPrint={true}
        isBackBtn={true}
        backHandler={() => {
          history.goBack();
        }}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <div className="table-card">
                {loading && <Loading />}
                <div className="table-card-heading"></div>
                <div className="form-card-content">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={channelDDL || []}
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: "18px" }}
                        onClick={() => {
                          setLandingData(values);
                        }}
                        disabled={!values?.channel}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th>Channel</th>
                        {gridData?.objTypeList?.map((item, index) => {
                          return <th key={index}>{item?.territoryTypeName}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.objInfoList?.map((data, index) => {
                        let isButtonShow = false;
                        return (
                          <tr key={index}>
                            {<td key={index}>{data?.channelName}</td>}
                            {gridData?.objTypeList?.map((item, keyIndex) => {
                              if (
                                data[
                                  item["territoryTypeCodeName"].toLowerCase()
                                ]
                              ) {
                                if (
                                  item[
                                    "territoryTypeCodeName"
                                  ].toLowerCase() !== data["editBtn"]
                                ) {
                                  return (
                                    <td>
                                      {
                                        data[
                                          item[
                                            "territoryTypeCodeName"
                                          ].toLowerCase()
                                        ]
                                      }
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td>
                                      <span>
                                        {
                                          data[
                                            item[
                                              "territoryTypeCodeName"
                                            ].toLowerCase()
                                          ]
                                        }
                                      </span>
                                      <button
                                        className="btn btn-outline-primary rounded-circle"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          textAlign: "center",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          float: "right",
                                        }}
                                        onClick={() => {
                                          setSelectedData({
                                            header: item,
                                            row: data,
                                            routeState: "edit",
                                            editlabelKey: item[
                                              "territoryTypeCodeName"
                                            ].toLowerCase(),
                                          });
                                          setIsShowModal(true);
                                        }}
                                      >
                                        <i
                                          className={`fas fa-pen-square pointer`}
                                        ></i>
                                      </button>
                                      {/* <button
                                        className="btn btn-outline-primary rounded-circle"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          textAlign: "center",
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          float: "right",
                                        }}
                                        onClick={() => {
                                          setSelectedData({
                                            header: item,
                                            row: data,
                                            editableKey: item[
                                              "territoryTypeCodeName"
                                            ].toLowerCase(),
                                          });
                                          setEmployeeModal(true);
                                        }}
                                      >
                                        <i
                                          className={`fas fa-male pointer`}
                                        ></i>
                                      </button> */}
                                    </td>
                                  );
                                }
                              } else {
                                if (
                                  item[
                                    "territoryTypeCodeName"
                                  ].toLowerCase() !== data["addBtn"]
                                ) {
                                  return <td></td>;
                                } else {
                                  return (
                                    <td className="text-right">
                                      {!isButtonShow && (
                                        <button
                                          className="btn btn-outline-primary rounded-circle"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                            textAlign: "center",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            float: "left",
                                          }}
                                          onClick={() => {
                                            setSelectedData({
                                              header: item,
                                              row: data,
                                            });
                                            setIsShowModal(true);
                                          }}
                                        >
                                          <i
                                            className={`fa pointer fa-plus`}
                                          ></i>
                                        </button>
                                      )}
                                    </td>
                                  );
                                }
                              }
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <IViewModal
                  title=""
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <TerritorySetupForm
                    selectedData={selectedData}
                    setIsShowModal={setIsShowModal}
                    setLandingData={setLandingData}
                    value={values}
                  ></TerritorySetupForm>
                </IViewModal>

                {/* Employee Table Modal */}
                {/* <IViewModal
                  title=""
                  show={employeeModal}
                  onHide={() => setEmployeeModal(false)}
                >
                  <EmployeeTable
                    accId={profileData?.accountId}
                    buId={selectedBusinessUnit?.value}
                    selectedData={selectedData}
                  />
                </IViewModal> */}
              </div>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
};

export default TerritorySetupLanding;
