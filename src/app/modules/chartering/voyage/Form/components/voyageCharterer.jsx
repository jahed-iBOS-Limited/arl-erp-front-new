import React from "react";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IDelete from "../../../_chartinghelper/icons/_delete";
import ICustomTable from "../../../_chartinghelper/_customTable";
import {
  addCargo,
  addCharterer,
  cargoRowDataHandler,
  removeCargo,
} from "../utils";

export default function VoyageCharterer({
  values,
  setFieldValue,
  viewType,
  errors,
  touched,
  cargoList,
  cargoDDL,
  setCargoList,
  componentType,
  chartererRowData,
  setChartererRowData,
  setErrors,
  setTouched,
  portDDL,
  uploadedFile,
  setCPList,
  cpList,
}) {
  return (
    <>
      <div className="marine-form-card-content">
        <div className="row">
          <div className="col-lg-3">
            <label>Demurrage Rate</label>
            <FormikInput
              value={values?.demurrageRate}
              name="demurrageRate"
              placeholder="Demurrage Rate"
              type="number"
              onChange={(e) => {
                setFieldValue("demurrageRate", e.target.value);
                setFieldValue("despatchRate", Number(e?.target?.value) / 2);
              }}
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className="col-lg-3">
            <label>Despatch Rate</label>
            <FormikInput
              value={values?.despatchRate}
              name="despatchRate"
              placeholder="Despatch Rate"
              type="number"
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </div>
          <div className="col-lg-3">
            <label>Detention</label>
            <FormikInput
              value={values?.detention}
              name="detention"
              placeholder="Detention"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className={"col-lg-3"}>
            <label>Dead Freight</label>
            <FormikInput
              value={values?.deadFreightDetention}
              name="deadFreightDetention"
              placeholder="Dead Freight"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          {viewType !== "view" ? (
            <div className="col-lg-3">
              <FormikSelect
                value={values?.cargoName}
                isSearchable={true}
                options={cargoDDL || []}
                styles={customStyles}
                name="cargoName"
                placeholder="Cargo Name"
                label="Cargo Name"
                onChange={(valueOption) => {
                  setFieldValue("cargoName", valueOption);
                }}
                isDisabled={viewType === "view"}
                errors={errors}
                touched={touched}
              />
            </div>
          ) : null}

          <div className="col-lg-3">
            <FormikSelect
              value={values?.startPort}
              isSearchable={true}
              options={portDDL || []}
              styles={customStyles}
              name="startPort"
              placeholder={"Load Port"}
              label={"Load Port"}
              onChange={(valueOption) => {
                setFieldValue("startPort", valueOption);
              }}
              isDisabled={viewType === "view"}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-3">
            <FormikSelect
              value={values?.endPort}
              isSearchable={true}
              options={portDDL || []}
              styles={customStyles}
              name="endPort"
              placeholder={"End Port"}
              label={"End Port"}
              onChange={(valueOption) => {
                setFieldValue("endPort", valueOption);
              }}
              isDisabled={viewType === "view"}
              errors={errors}
              touched={touched}
            />
          </div>

          {viewType !== "view" ? (
            <>
              <div className="col-lg-3 mt-5">
                <button
                  className="btn btn-primary px-3 py-2"
                  type="button"
                  onClick={() => {
                    if (
                      !values?.cargoName?.value ||
                      !values?.startPort?.value ||
                      !values?.endPort?.value
                    ) {
                      setTouched({
                        ...touched,
                        cargoName: true,
                        startPort: true,
                        endPort: true,
                      });
                      window.setTimeout(() => {
                        setErrors({
                          ...errors,
                          cargoName:
                            !values?.cargoName?.value &&
                            "Cargo Name is required",
                          startPort:
                            !values?.startPort?.value &&
                            "Load Port is required",
                          endPort:
                            !values?.endPort?.value &&
                            "Discharge Port is required",
                        });
                      }, 50);
                    } else {
                      addCargo(values, setFieldValue, cargoList, setCargoList);
                    }
                  }}
                >
                  Add +
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Cargo List */}
      <div className="voyageStatement mt-2">
        {cargoList?.length > 0 && (
          <>
            <h6 className="">Cargo List</h6>
            <ICustomTable
              ths={[
                { name: "SL" },
                { name: "Cargo Name" },
                { name: "Load Port" },
                { name: "Discharge Port" },
                { name: "Cargo Qty" },
                { name: "Freight/MT" },
                { name: "Freight Value" },
                { name: "Action", isHide: viewType === "view" },
              ]}
            >
              {cargoList?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center" style={{ maxWidth: "30px" }}>
                    {index + 1}
                  </td>
                  <td>{item?.cargoName}</td>
                  <td>{item?.cargoLoadPortName}</td>
                  <td>{item?.cargoDischargePortName}</td>
                  <td>
                    <FormikInput
                      value={item?.cargoQty}
                      name="cargoQty"
                      placeholder="Cargo Qty"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view" || item?.cargoRowId}
                      onChange={(e) => {
                        cargoRowDataHandler(
                          "cargoQty",
                          e?.target?.value,
                          index,
                          cargoList,
                          setCargoList
                        );
                      }}
                    />
                  </td>
                  <td>
                    <FormikInput
                      value={item?.freightRate}
                      name="freightRate"
                      placeholder="Freight/MT"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view" || item?.cargoRowId}
                      onChange={(e) => {
                        cargoRowDataHandler(
                          "freightRate",
                          e?.target?.value,
                          index,
                          cargoList,
                          setCargoList
                        );
                      }}
                    />
                  </td>
                  <td className="text-right">{item?.totalFreight}</td>
                  {viewType !== "view" ? (
                    <td className="text-center">
                      <p
                        onClick={() => {
                          removeCargo(
                            index,
                            values,
                            setFieldValue,
                            cargoList,
                            setCargoList
                          );
                        }}
                      >
                        <IDelete />
                      </p>
                    </td>
                  ) : null}
                </tr>
              ))}
              <tr className="font-weight-bold">
                <td colSpan={4} className="text-right">
                  Total
                </td>
                <td>
                  <p className="ml-3">
                    {cargoList?.reduce(
                      (acc, cur) => acc + Number(cur?.cargoQty),
                      0
                    )}
                  </p>
                </td>
                <td>
                  <p className="ml-3">
                    {cargoList?.reduce(
                      (acc, cur) => acc + cur?.totalFreight,
                      0
                    ) /
                      cargoList
                        ?.reduce((acc, cur) => acc + Number(cur?.cargoQty), 0)
                        .toFixed(2)}
                  </p>
                </td>
                <td className="text-right">
                  {cargoList?.reduce((acc, cur) => acc + cur?.totalFreight, 0)}
                </td>
                {viewType !== "view" ? <td></td> : null}
              </tr>
            </ICustomTable>
          </>
        )}
      </div>

      {viewType !== "view" && !componentType ? (
        <div className="text-center mt-4">
          <button
            onClick={() => {
              if (
                !values?.charterName?.value ||
                !values?.brokerCommission ||
                !values?.addressCommission ||
                !values?.freightPercentage ||
                // !values?.startPort?.value ||
                // !values?.endPort?.value ||
                !values?.demurrageRate
              ) {
                setTouched({
                  charterName: true,
                  brokerCommission: true,
                  addressCommission: true,
                  // startPort: true,
                  // endPort: true,
                  demurrageRate: true,
                  freightPercentage: true,
                });
                window.setTimeout(() => {
                  setErrors({
                    charterName:
                      !values?.charterName?.value &&
                      "Charterer Name is required",
                    brokerCommission:
                      !values?.brokerCommission &&
                      "Broker Commission is required",
                    addressCommission:
                      !values?.addressCommission &&
                      "Address Commission is required",
                    freightPercentage:
                      !values?.freightPercentage &&
                      "Freight Percentage is required",
                    // startPort:
                    //   !values?.startPort?.value && "This field is required",
                    // endPort:
                    //   !values?.endPort?.value && "This field is required",
                    demurrageRate:
                      !values?.demurrageRate && "Demurrage Rate is required",
                  });
                }, 50);
              } else {
                addCharterer(
                  values,
                  cargoList,
                  chartererRowData,
                  setChartererRowData,
                  setCargoList,
                  uploadedFile,
                  setCPList,
                  cpList
                );
              }
            }}
            type="button"
            className="btn btn-lg btn-info col-lg-6 px-3 py-2"
          >
            + Add Charterer
          </button>
        </div>
      ) : null}
    </>
  );
}
