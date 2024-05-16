import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import DirectAndDumpRateEntry from "./createEdit";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

export default function DirectAndDumpRateLanding() {
  const [landingData, getLandingData, landingLoading] = useAxiosGet();
  const [id, setId] = useState(null);
  const [isShowEntryForm, setIsShowEntryForm] = useState(false);
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      `/wms/ShipPoint/GetAllGoDownNothersRate?businessUnitId=${selectedBusinessUnit?.value}&Type=1&searchTerm=`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik enableReinitialize={true} initialValues={{}}>
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {landingLoading && <Loading />}
          <IForm
            title="Direct and Dump Rate"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setIsShowEntryForm(true);
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="col-md-3 mb-5 mt-3">
                <SearchAsyncSelect
                  selectedValue={values?.lineManager}
                  isSearchIcon={true}
                  handleChange={(valueOption) => {}}
                  isDebounce
                  loadOptions={(v, resolve) => {
                    getLandingData(
                      `/wms/ShipPoint/GetAllGoDownNothersRate?businessUnitId=${
                        selectedBusinessUnit?.value
                      }&Type=1&searchTerm=${v?.length > 2 ? v : ""}`
                    );
                  }}
                />
              </div>
              {landingData?.length > 0 && (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered inv-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Ship Point Name</th>
                          <th>Direct Delivery Rate (per bag)</th>
                          <th>Dump Delivery Rate (per bag)</th>
                          <th>Dump To Truck Rate (per bag)</th>
                          <th>Truck To Dam Rate (per bag)</th>
                          <th>Lighter To Bolgate Rate (per bag)</th>
                          <th>Bolgate To DamRate (per bag)</th>
                          <th>Truck To Dam Outside Rate (per bag)</th>
                          <th>BIWTA Rate (per bag)</th>
                          <th>Ship Sweeping Rate (per bag)</th>
                          <th>Scale Rate (per bag)</th>
                          <th>Daily Labor Rate (per bag)</th>
                          <th>Others Cost Rate (per bag)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {item?.strShipPointName}
                            </td>
                            <td className="text-center">
                              {item?.decDirectRate}
                            </td>
                            <td className="text-center">
                              {item?.decDumpDeliveryRate}
                            </td>
                            <td className="text-center">
                              {item?.decDamToTruckRate}
                            </td>
                            <td className="text-center">
                              {item?.decTruckToDamRate}
                            </td>
                            <td className="text-center">
                              {item?.decLighterToBolgateRate}
                            </td>
                            <td className="text-center">
                              {item?.decBolgateToDamRate}
                            </td>
                            <td className="text-center">
                              {item?.decTruckToDamOutSideRate}
                            </td>
                            <td className="text-center">
                              {item?.decBiwtarate}
                            </td>
                            <td className="text-center">
                              {item?.decShipSweepingRate}
                            </td>
                            <td className="text-center">
                              {item?.decScaleRate}
                            </td>
                            <td className="text-center">
                              {item?.decDailyLaboureRate}
                            </td>
                            <td className="text-center">
                              {item?.decOthersCostRate}
                            </td>

                            <td className="text-center">
                              <IEdit
                                onClick={() => {
                                  setId(item?.intAutoid);
                                  setIsShowEntryForm(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Form>
          </IForm>
          <IViewModal
            show={isShowEntryForm}
            backdrop={false}
            onHide={() => {
              setIsShowEntryForm(false);
              setId(null);
            }}
          >
            <DirectAndDumpRateEntry id={id} getLandingData={getLandingData} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
