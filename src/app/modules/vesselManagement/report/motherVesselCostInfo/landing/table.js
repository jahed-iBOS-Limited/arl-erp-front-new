import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { GetCarrierDDL } from "../helper";

export default function MotherVesselCostInfo() {
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [carrierDDL, setCarrierDDL] = useState([]);

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetCarrierDDL(accId, buId, 0, setCarrierDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const setLandingData = (values) => {
    const portId = values?.port?.value || 0;
    const motherVesselId = values?.motherVessel?.value || 0;
    const lighterVesselId = values?.lighterVessel?.value || 0;
    const partId = values?.part?.value || 0;
    const carrierId = values?.carrier?.value || 0;
    const url = `/tms/LigterLoadUnload/GtoGRentInfo?intPartid=${partId}&intPortId=${portId}&UnitId=${buId}&intMotherVesselId=${motherVesselId}&intLighterVeselId=${lighterVesselId}&intLocalAgentId=${carrierId}&FromdDate=${values.fromDate}&ToDate=${values.toDate}`;
    getRowData(url);
  };

  const initData = {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    port: { value: 0, label: "All" },
  };

  return (
    <>
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard title="Mother Vessel Cost Info">
            <Form>
              <div className="row global-form global-form-custom">
                <FromDateToDateForm obj={{ values, setFieldValue }} />
                <div className="col-lg-3">
                  <NewSelect
                    name="part"
                    options={[
                      {
                        value: 1,
                        label: "Carrier Bill Check",
                      },
                      {
                        value: 2,
                        label: "Cost Report",
                      },
                    ]}
                    value={values?.part}
                    label="Part"
                    onChange={(valueOption) => {
                      setFieldValue("part", valueOption);
                    }}
                    placeholder="Part"
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="carrier"
                    options={carrierDDL || []}
                    label="Carrier Name"
                    onChange={(valueOption) => {
                      setFieldValue("lighterVessel", "");
                      setFieldValue("carrier", valueOption);
                    }}
                    placeholder="Carrier Name"
                  />
                </div>

                {/* searchable ddl  */}
                <div className="col-lg-3">
                  <label>Lighter Vessel</label>
                  <SearchAsyncSelect
                    name="lighterVessel"
                    selectedValue={values?.lighterVessel}
                    handleChange={(valueOption) => {
                      setFieldValue("lighterVessel", valueOption);
                    }}
                    placeholder="Search Lighter Vessel"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/FertilizerOperation/GetLighterVesselByCarrierDDL?${searchValue}&CarrierId=${values
                            ?.carrier?.value || 0}&BusinessUnitId=${buId}`
                        )
                        .then((res) => {
                          return res?.data?.map((item) => ({
                            value: item?.lighterVesselId,
                            label: item?.lighterVesselName,
                            contact: item?.contact,
                          }));
                        });
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(values);
                    }}
                    disabled={values?.fromDate === "" || values?.toDate === ""}
                  >
                    View
                  </button>
                </div>
              </div>
              {isLoading && <Loading />}
              <div className="row cash_journal">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Ship Point</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Commission</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td>{item?.strShipPointName}</td>
                              <td>{item?.UnloadQnt}</td>
                              <td className="text-right">
                                {item?.numInternationRateTaka}
                              </td>
                              <td className="text-right">
                                {item?.BillClaimAmount}
                              </td>
                              <td className="text-right">
                                {item?.BillClaimAmount}
                              </td>
                            </tr>
                          );
                        })}
                        {rowData.length ? (
                          <>
                            <tr>
                              <td colSpan="5" className="text-right">
                                Total
                              </td>
                              <td>000</td>
                            </tr>
                            <tr>
                              <td colSpan="5" className="text-right">
                                (-)Received Amount
                              </td>
                              <td>000</td>
                            </tr>
                            <tr>
                              <td colSpan="5" className="text-right">
                                Receivable Amount
                              </td>
                              <td>000</td>
                            </tr>
                          </>
                        ) : (
                          ""
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
