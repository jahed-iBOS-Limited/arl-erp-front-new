import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getTerritorySetupLanding, getChannelDDL } from "../helper";
import { Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import ICard from "../../../../_helper/_card";
import { useHistory } from "react-router";

const initData = {
  channel: { value: 0, label: "All" },
};

const TerritoryInfoLanding = () => {
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  // const [employeeModal, setEmployeeModal] = useState(false);
  // const [selectedData, setSelectedData] = useState(null);
  const [channelDDL, setChannelDDL] = useState([]);

  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
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
        title="Territory Information"
        isCreteBtn={true}
        createHandler={() => {
          history.push(`/sales-management/configuration/territoryInfo/crate`);
        }}
        isPrint={true}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values) => {}}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              {loading && <Loading />}

              <form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={
                        [{ value: 0, label: "All" }, ...channelDDL] || []
                      }
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
              </form>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
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
                      // let isButtonShow = false;
                      return (
                        <tr key={index}>
                          {<td key={index}>{data?.channelName}</td>}
                          {gridData?.objTypeList?.map((item, keyIndex) => {
                            if (
                              data[item["territoryTypeCodeName"].toLowerCase()]
                            ) {
                              if (
                                item["territoryTypeCodeName"].toLowerCase() !==
                                data["editBtn"]
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
                                   
                                  </td>
                                );
                              }
                            } else {
                              if (
                                item["territoryTypeCodeName"].toLowerCase() !==
                                data["addBtn"]
                              ) {
                                return <td></td>;
                              } else {
                                return <td className="text-right"></td>;
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
              ></IViewModal>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
};

export default TerritoryInfoLanding;
