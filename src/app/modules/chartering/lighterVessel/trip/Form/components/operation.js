import axios from "axios";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { imarineBaseUrl } from "../../../../../../App";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../../_chartinghelper/_dateFormate";
import IDelete from "../../../../_chartinghelper/_delete";
import IViewModal from "../../../../_chartinghelper/_viewModal";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../../_chartinghelper/icons/_edit";
import { GetLighterConsigneeDDL, getMotherVesselDDL } from "../../../../helper";
import ConsigneeForm from "../../../consignee/Form/addEditForm";
import MotherVesselCreate from "../../_motherVessel/Form/addEditForm";
import { setValue } from "../../helper";
import {
  editRowDataClick,
  removeRowData,
  rowDataAddHandler,
  rowDataEditHandler,
  setOperationFieldClear,
} from "../../utils";
import { CreateIcon } from "./header";
import NewSelect from "../../../../../_helper/_select";

export function OperationSection(props) {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    viewType,
    motherVesselDDL,
    consigneePartyDDL,
    cargoDDL,
    rowData,
    setRowData,
    setTouched,
    setErrors,
    editMode,
    setEditMode,
    setValues,
    setMotherVesselDDL,
    setConsigneePartyDDL,
    getShipmentDDL,
    shipmentDDL,
    getInfoByShipmentId,
  } = props;

  const [motherVesselCreateModal, setMotherVesselCreateModal] = useState(false);
  const [consigneeCreateModal, setConsigneeCreateModal] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const loadLCList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetLCDDL?accountId=${
          profileData?.accountId
        }&businessUnitId=${0}&searchByLc=${v}`
      )
      .then((res) => res?.data);
  };

  const loadBoeList = (v) => {
    if (v?.length < 3) return [];
    return axios.get(`/imp/ImportCommonDDL/GetBoeDDL?search=${v}`).then((res) =>
      res?.data?.map((item) => ({
        ...item,
        value: item?.boeNumber,
        label: item?.boeNumber,
      }))
    );
  };

  return (
    <div className="marine-form-card mt-4">
      <div className="marine-form-card-heading">
        <p>Operation</p>
      </div>

      {viewType === "view" ? null : (
        <div className="marine-form-card-content">
          <div className="row mt-4">
            <div className="col-lg-3">
              <label>BOE No</label>
              <SearchAsyncSelect
                selectedValue={values?.boeNo}
                isSearchIcon={true}
                paddingRight={10}
                name="boeNo"
                loadOptions={loadBoeList}
                isDisabled={viewType === "view"}
                handleChange={(valueOption) => {
                  setFieldValue("boeNo", valueOption);
                  setFieldValue("lcnumber", {
                    value: valueOption?.lcId,
                    label: valueOption?.lcNumber,
                  });
                  setFieldValue("shipment", "");
                  getShipmentDDL(
                    `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${
                      profileData?.accountId
                    }&buId=${0}&searchTerm=${valueOption?.lcNumber}`
                  );
                }}
              />
            </div>
            <div className="col-lg-3">
              <label>LC No</label>
              <SearchAsyncSelect
                selectedValue={values?.lcnumber}
                isSearchIcon={true}
                paddingRight={10}
                name="lcnumber"
                loadOptions={loadLCList}
                isDisabled={true}
                handleChange={(valueOption) => {
                  setFieldValue("lcnumber", valueOption);
                  setFieldValue("shipment", "");
                  getShipmentDDL(
                    `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${
                      profileData?.accountId
                    }&buId=${0}&searchTerm=${valueOption?.label}`
                  );
                }}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="shipment"
                value={values?.shipment}
                label={"Shipment No"}
                placeholder={"Shipment No"}
                options={shipmentDDL || []}
                isDisabled={viewType === "view"}
                onChange={(valueOption) => {
                  setFieldValue("shipment", valueOption);
                  setFieldValue("motherVessel", "");
                  setFieldValue("eta", "");
                  setFieldValue("cargo", "");
                  setFieldValue("numEstimatedCargoQty", "");

                  getInfoByShipmentId(valueOption?.value, setFieldValue);
                }}
              />
            </div>
            <div className="col-lg-3"></div>
            {/* <div className="col-lg-3">
              <label>LC No</label>
              <FormikInput
                value={values?.lcnumber}
                name="lcnumber"
                placeholder="LC No"
                type="text"
                errors={errors}
                touched={touched}
                disabled
              />
            </div> */}
            {/* <div className="col-lg-3">
              <NewSelect
                name="lcnumber"
                value={values?.lcnumber}
                label={"LC No"}
                placeholder={"LC No"}
                options={[]}
                isDisabled
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="shipment"
                value={values?.shipment}
                label={"Shipment No"}
                placeholder={"Shipment No"}
                options={[]}
                isDisabled
                errors={errors}
                touched={touched}
              />
            </div> */}
            <div className="col-lg-3">
              <FormikSelect
                value={values?.motherVessel || ""}
                isSearchable={true}
                options={motherVesselDDL}
                styles={customStyles}
                name="motherVessel"
                label="Mother Vessel"
                placeholder="Mother Vessel"
                onChange={(valueOption) => {
                  setFieldValue("voyageNo", "");
                  setFieldValue("motherVessel", valueOption);
                }}
                isDisabled={viewType === "view"}
                errors={errors}
                touched={touched}
              />

              {viewType !== "view" ? (
                <CreateIcon
                  onClick={() => {
                    setMotherVesselCreateModal(true);
                  }}
                />
              ) : null}
            </div>
            <div className="col-lg-3">
              <label>Voyage No</label>
              <FormikInput
                value={values?.voyageNo || ""}
                name="voyageNo"
                placeholder="VoyageNo"
                onChange={(e) => {
                  setFieldValue("voyageNo", e.target.value);
                }}
                type="text"
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="col-lg-3 relative">
              <FormikSelect
                value={values?.consigneeParty || ""}
                isSearchable={true}
                options={consigneePartyDDL}
                styles={customStyles}
                name="consigneeParty"
                label="Consignee Party"
                placeholder="Consignee Party"
                onChange={(valueOption) => {
                  setFieldValue("consigneeParty", valueOption);
                }}
                isDisabled={viewType === "view"}
                errors={errors}
                touched={touched}
              />

              {/* {viewType !== "view" ? (
                <CreateIcon
                  onClick={() => {
                    setConsigneeCreateModal(true);
                  }}
                />
              ) : null} */}
            </div>
            <div className="col-lg-3">
              <label>SR Number</label>
              <SearchAsyncSelect
                selectedValue={values?.srnumber}
                handleChange={(valueOption) => {
                  if (valueOption) {
                    setFieldValue("srnumber", valueOption);
                    setValue(valueOption?.value, setFieldValue);
                  } else {
                    setFieldValue("srnumber", "");
                    setFieldValue("eta", "");
                    setFieldValue("numBlqty", "");
                    setFieldValue("lcnumber", "");
                  }
                }}
                loadOptions={(v) => {
                  if (v?.length < 3) return [];
                  return axios
                    .get(
                      `${imarineBaseUrl}/domain/LighterVesselSurvey/GetLighterVesselSRDDL?BusinessUnitId=${selectedBusinessUnit?.value}&SearchSRNumber=${v}`
                    )
                    .then((res) => res?.data);
                }}
                disabled={true}
              />
            </div>
            <div className="col-lg-3">
              <label>ETA</label>
              <FormikInput
                value={values?.eta}
                name="eta"
                placeholder="ETA"
                type="date"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <FormikSelect
                value={values?.cargo || ""}
                isSearchable={true}
                options={cargoDDL}
                styles={customStyles}
                name="cargo"
                label="Cargo"
                placeholder="Cargo"
                onChange={(valueOption) => {
                  setFieldValue("cargo", valueOption);
                  setFieldValue(
                    "numEstimatedCargoQty",
                    valueOption?.shippedQuantity
                  );
                  setFieldValue("numBlqty", valueOption?.shippedQuantity);
                }}
                isDisabled={viewType === "view" || !values?.shipment}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <label>B/L Qty</label>
              <FormikInput
                value={values?.numBlqty}
                name="numBlqty"
                placeholder="B/L Qty"
                type="text"
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="col-lg-3">
              <label>Estimated Cargo</label>
              <FormikInput
                value={values?.numEstimatedCargoQty}
                name="numEstimatedCargoQty"
                placeholder="Estimated Cargo"
                type="number"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <label>Freight</label>
              <FormikInput
                value={values?.numFreight}
                name="numFreight"
                placeholder="Freight"
                onChange={(e) => {
                  setFieldValue(
                    "numTotalFreight",
                    +e.target.value * values?.numActualCargoQty || 0
                  );
                  setFieldValue("numFreight", e.target.value);
                }}
                type="number"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <label>Actual Cargo Qty</label>
              <FormikInput
                value={values?.numActualCargoQty}
                name="numActualCargoQty"
                placeholder="Actual Cargo Qty"
                type="number"
                onChange={(e) => {
                  setFieldValue(
                    "numTotalFreight",
                    +e.target.value * values?.numFreight || 0
                  );
                  setFieldValue("numActualCargoQty", e.target.value);
                }}
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="col-lg-3">
              <label>Total Freight</label>
              <FormikInput
                value={values?.numTotalFreight}
                name="numTotalFreight"
                placeholder="Total Freight"
                type="number"
                errors={errors}
                touched={touched}
                disabled={true}
              />
            </div>
            <div className="col-lg-3">
              <label>Dispatch Rate</label>
              <FormikInput
                value={values?.dispatchRate}
                name="dispatchRate"
                placeholder="Dispatch Rate"
                type="number"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <label>Demurrage Rate</label>
              <FormikInput
                value={values?.demurrageRate}
                name="demurrageRate"
                placeholder="Demurrage Rate"
                type="number"
                errors={errors}
                touched={touched}
              />
            </div>

            {editMode?.mode ? (
              <div className="col-lg-12 d-flex justify-content-end">
                <div>
                  <button
                    type="button"
                    className="btn btn-info px-3 py-2 mt-2 mr-2"
                    onClick={() => {
                      rowDataEditHandler(
                        values,
                        rowData,
                        setRowData,
                        setTouched,
                        setErrors,
                        setFieldValue,
                        editMode,
                        setEditMode
                      );
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 mt-2"
                    onClick={() => {
                      setOperationFieldClear(setFieldValue);
                      setEditMode({
                        mode: false,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="col-lg-12 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 mt-2"
                  onClick={() => {
                    rowDataAddHandler(
                      values,
                      rowData,
                      setRowData,
                      setTouched,
                      setErrors,
                      setFieldValue
                    );
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {rowData?.length ? (
        <div className="table-responsive">
          <table className="table mt-6 bj-table bj-table-landing">
          <thead>
            <tr>
              <th>LC No</th>
              <th>Shipment No</th>
              <th>Mother Vessel</th>
              <th>Voyage No</th>
              <th>Consignee Party</th>
              <th>SR Number</th>
              <th>ETA</th>
              <th>Cargo</th>
              <th>B/L Qty</th>
              <th>Estimated Cargo</th>
              <th>Freight</th>
              <th>Actual Cargo Qty</th>
              <th>Total Freight</th>
              <th>Dispatch Rate</th>
              <th>Demurrage Rate</th>
              {viewType !== "view" ? <th>Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item?.lcnumber || "-"}</td>
                <td className="text-center">{item?.strShipmentCode || "-"}</td>
                <td>{item?.motherVesselName}</td>
                <td className="text-center">{item?.voyageNo || "-"}</td>
                <td>{item?.consigneePartyName}</td>
                <td className="text-center">{item?.srnumber || "-"}</td>
                <td className="text-center">
                  {_dateFormatter(item?.eta) || "-"}
                </td>
                <td>{item?.cargoName}</td>
                <td className="text-center">{item?.numBlqty}</td>
                <td className="text-center">{item?.numEstimatedCargoQty}</td>
                <td className="text-right">{item?.numFreight}</td>
                <td className="text-center">{item?.numActualCargoQty}</td>
                <td className="text-right">{item?.numTotalFreight}</td>
                <td className="text-right">{item?.despachRate}</td>
                <td className="text-right">{item?.demageRate}</td>
                {viewType !== "view" ? (
                  <td className="text-center d-flex justify-content-center">
                    <span
                      onClick={() => {
                        editRowDataClick(
                          item,
                          values,
                          setValues,
                          setEditMode,
                          index
                        );
                        getInfoByShipmentId(item?.intShipmentId);
                        getShipmentDDL(
                          `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${
                            profileData?.accountId
                          }&buId=${0}&searchTerm=${item?.lcnumber}`
                        );
                      }}
                      className="mr-2"
                    >
                      <IEdit />
                    </span>
                    <span
                      onClick={() => {
                        removeRowData(index, rowData, setRowData);
                      }}
                    >
                      <IDelete />
                    </span>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : null}

      {/* Mohter Vessel Modal */}
      <IViewModal
        show={motherVesselCreateModal}
        onHide={() => {
          setMotherVesselCreateModal(false);
          getMotherVesselDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            setMotherVesselDDL
          );
        }}
        size="md"
      >
        <MotherVesselCreate />
      </IViewModal>

      {/* Consignee Modal */}
      <IViewModal
        show={consigneeCreateModal}
        onHide={() => {
          setConsigneeCreateModal(false);
          GetLighterConsigneeDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            setConsigneePartyDDL
          );
        }}
      >
        <ConsigneeForm />
      </IViewModal>
    </div>
  );
}
