import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
export default function VehicleDemandEditModal({
  vehicleDemandItem,
  setVehicleDemandModal,
  getVehicleDemandData,
}) {
  const [supplierDDL, getSupplierDDL] = useAxiosGet();
  const [, saveLighterLoad] = useAxiosPost();
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  console.log(vehicleDemandItem);

  useEffect(() => {
    getSupplierDDL(
      `/wms/TransportMode/GetTransportMode?intParid=2&intBusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        supplier: {
          value: vehicleDemandItem?.supplierId || "",
          label: vehicleDemandItem?.supplierName || "",
        },
        demandVehicle: vehicleDemandItem?.demandVehicle || 0,
        receiveVehicle: vehicleDemandItem?.receiveVehicle || 0,
        truckLoaded: vehicleDemandItem?.truckLoaded || 0,
        packingMt: vehicleDemandItem?.packingQntMt || 0,
        labourRequired: vehicleDemandItem?.labourRequired || 0,
        labourPresent: vehicleDemandItem?.presentLabour || 0,
        lighterWaiting: vehicleDemandItem?.lighterWaiting || 0,
        bufferQty: vehicleDemandItem?.bufferQntMt || 0,
      }}
      // validationSchema={{}}
      //   onSubmit={(values, { setSubmitting, resetForm }) => {
      //     saveHandler(values, () => {
      //       resetForm(initData);
      //     });
      //   }}
    >
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
          {false && <Loading />}
          <IForm
            title="Vehicle DemandEdit"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row mt-4">
                <div className="col-lg-12">
                  <div
                    style={{
                      marginLeft: "auto",
                      marginRight: "11px",
                      width: "fit-content",
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const payload = [
                          {
                            automId: vehicleDemandItem?.automId,
                            shipPointId: vehicleDemandItem?.shipPointId,
                            shipPointName: vehicleDemandItem?.shipPointName,
                            accountId: accId,
                            businessUnitId: vehicleDemandItem?.businessUnitId,
                            demandDate: vehicleDemandItem?.demandDate,
                            demandVehicle: +values?.demandVehicle || 0,
                            receiveVehicle: +values?.receiveVehicle || 0,
                            truckLoaded: +values?.truckLoaded || 0,
                            packingQntMt: +values?.packingMt || 0,
                            bufferQntMt: +values?.bufferQty || 0,
                            labourRequired: +values?.labourRequired || 0,
                            presentLabour: +values?.labourPresent || 0,
                            lighterWaiting: +values?.lighterWaiting || 0,
                            actionBy: userId,
                            supplierId: values?.supplier?.value,
                            supplierName: values?.supplier?.label,
                          },
                        ];
                        saveLighterLoad(
                          `/tms/LigterLoadUnload/CreateLogisticDemandNReciveInfo`,
                          payload,
                          (data) => {
                            if (data) {
                              getVehicleDemandData(
                                `/tms/LigterLoadUnload/GetLogisticDemandNReciveInfo?ShipPointId=${vehicleDemandItem?.shipPointId}&AccountId=${accId}&BusinessUnitId=${buId}&DayDate=${vehicleDemandItem?.demandDate}`
                              );
                              setVehicleDemandModal(false);
                            }
                          },
                          true
                        );
                      }}
                    >
                      Save
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "200px" }}>Supplier Name</th>
                          <th>Demand Vehicle</th>
                          <th>Packing MT</th>
                          <th>Dump Qty Ton</th>
                          <th>Labour Requirement</th>
                          <th>Labour Present</th>
                          <th>Lighter Waiting</th>
                        </tr>
                      </thead>
                      <tbody>
                        <td>
                          <NewSelect
                            name="supplier"
                            options={supplierDDL}
                            value={values?.supplier}
                            onChange={(valueOption) => {
                              if (valueOption?.value) {
                                setFieldValue("supplier", valueOption);
                              } else {
                                setFieldValue("supplier", "");
                              }
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={+values?.demandVehicle || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("demandVehicle", e?.target?.value);
                            }}
                          />
                        </td>
                        {/* <td>
                        <InputField
                          value={+values?.receiveVehicle || 0}
                          min="0"
                          onChange={(e) => {
                            setFieldValue("receiveVehicle", e?.target?.value);
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={+values?.truckLoaded || 0}
                          min="0"
                          onChange={(e) => {
                            setFieldValue("truckLoaded", e?.target?.value);
                          }}
                        />
                      </td> */}
                        <td>
                          <InputField
                            value={+values?.packingMt || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("packingMt", e?.target?.value);
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={+values?.bufferQty || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("bufferQty", e?.target?.value);
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={+values?.labourRequired || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("labourRequired", e?.target?.value);
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={+values?.labourPresent || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("labourPresent", e?.target?.value);
                            }}
                          />
                        </td>
                        <td>
                          <InputField
                            value={+values?.lighterWaiting || 0}
                            min="0"
                            onChange={(e) => {
                              setFieldValue("lighterWaiting", e?.target?.value);
                            }}
                          />
                        </td>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
