import moment from "moment";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../../_chartinghelper/_viewModal";
import FormikInput from "../../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../../_chartinghelper/common/selectCustomStyle";
import { GetDomesticPortDDL, GetLighterVesselDDL } from "../../../../helper";
import LighterVesselForm from "../../../lighterVesselInfo/Form/addEditForm";
import DomesticPortCreate from "../../_domesticPort/Form/addEditForm";
import { dateHandler } from "../../utils";
import NewSelect from "../../../../../_helper/_select";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export const CreateIcon = ({ onClick }) => {
  return (
    <span
      onClick={() => onClick()}
      style={{ position: "absolute", top: 0, right: "12px", cursor: "pointer" }}
    >
      <i style={{ color: "#08a5e5" }} className="fa fa-plus-circle"></i>
    </span>
  );
};

export function HeaderSection(props) {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    viewType,
    lighterDDL,
    portDDL,
    setLighterDDL,
    setPortDDL,
    getShipmentDDL,
    shipmentDDL,
    getInfoByShipmentId,
  } = props;

  const [lighterVesselCreateModal, setLighterVesselCreateModal] = useState(
    false
  );
  const [portCreateModal, setPortCreateModal] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const loadLCList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetLCDDL?accountId=${accId}&businessUnitId=${0}&searchByLc=${v}`
      )
      .then((res) => res?.data);
  };

  //localhost:44396/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=1&buId=4&searchTerm=aaaa

  return (
    <div className="marine-form-card-content">
      <div className="row">
        <div className="col-lg-3">
          <label>LC No</label>
          <SearchAsyncSelect
            selectedValue={values?.lcNo}
            isSearchIcon={true}
            paddingRight={10}
            name="lcNo"
            loadOptions={loadLCList}
            isDisabled={viewType}
            handleChange={(valueOption) => {
              setFieldValue("lcNo", valueOption);
              setFieldValue("lcnumber", valueOption);
              setFieldValue("shipmentNo", "");
              setFieldValue("shipment", "");
              getShipmentDDL(
                `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${accId}&buId=${0}&searchTerm=${
                  valueOption?.label
                }`
              );
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            name="shipmentNo"
            value={values?.shipmentNo}
            label={"Shipment No"}
            placeholder={"Shipment No"}
            options={shipmentDDL || []}
            isDisabled={viewType}
            onChange={(valueOption) => {
              setFieldValue("shipmentNo", valueOption);
              setFieldValue("shipment", valueOption);
              setFieldValue("motherVessel", "");
              setFieldValue("eta", "");
              setFieldValue("cargo", "");
              setFieldValue("numEstimatedCargoQty", "");

              getInfoByShipmentId(valueOption?.value, setFieldValue);
            }}
          />
        </div>
        <div className="col-lg-6"></div>
        <div className="col-lg-3 relative">
          <FormikSelect
            value={values?.lighterVessel || ""}
            isSearchable={true}
            label={`Lighter Vessel *`}
            options={lighterDDL}
            styles={customStyles}
            name="lighterVessel"
            placeholder="Lighter Vessel"
            onChange={(valueOption) => {
              setFieldValue("numEstimatedCargoQty", valueOption?.capacity || 0);
              setFieldValue("lighterVessel", valueOption);
              setFieldValue("tripNo", valueOption?.tripNo + 1 || "");
              if (valueOption) {
                setFieldValue(
                  "dteTripCommencedDate",
                  moment(valueOption?.lastCompletionDate).format(
                    "YYYY-MM-DDThh:mm"
                  ) || ""
                );
              } else {
                setFieldValue("dteTripCommencedDate", "");
              }
            }}
            isDisabled={viewType}
            errors={errors}
            touched={touched}
          />
          {!["view", "edit"]?.includes(viewType) ? (
            <CreateIcon
              onClick={() => {
                setLighterVesselCreateModal(true);
              }}
            />
          ) : null}
        </div>
        <div className="col-lg-3">
          <FormikInput
            value={values?.tripNo}
            name="tripNo"
            label="Trip No"
            placeholder="Trip No"
            type="text"
            errors={errors}
            touched={touched}
            disabled={true}
          />
        </div>

        <div className="col-lg-3">
          <FormikSelect
            label="Load Port *"
            value={values?.loadPort || ""}
            isSearchable={true}
            options={portDDL}
            styles={customStyles}
            name="loadPort"
            placeholder="Load Port"
            onChange={(valueOption) => {
              setFieldValue("loadPort", valueOption);
            }}
            isDisabled={viewType === "view"}
            errors={errors}
            touched={touched}
          />
        </div>

        <div className="col-lg-3 relative">
          <FormikSelect
            value={values?.dischargePort || ""}
            isSearchable={true}
            options={portDDL}
            label={`Discharge Port`}
            styles={customStyles}
            name="dischargePort"
            placeholder="Discharge Port"
            onChange={(valueOption) => {
              setFieldValue("dischargePort", valueOption);
            }}
            isDisabled={viewType === "view"}
            errors={errors}
            touched={touched}
          />

          {viewType !== "view" ? (
            <CreateIcon
              onClick={() => {
                setPortCreateModal(true);
              }}
            />
          ) : null}
        </div>

        <div className="col-lg-3">
          <FormikInput
            value={values?.arrivalAtCtg}
            name="arrivalAtCtg"
            label="Arrival At CTG"
            placeholder="Arrival At CTG"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>

        <div className="col-lg-3">
          <FormikInput
            value={values?.loadingCommenceAtCtg}
            name="loadingCommenceAtCtg"
            label="Loading Commence At CTG"
            min={
              values?.arrivalAtCtg
                ? moment(values?.arrivalAtCtg)?.format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            max={
              values?.loadingCompleteAtCtg
                ? moment(values?.loadingCompleteAtCtg)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            placeholder="Loading Commence At CTG"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>
        <div className="col-lg-3">
          <FormikInput
            value={values?.loadingCompleteAtCtg}
            name="loadingCompleteAtCtg"
            label="Loading Complete At CTG"
            min={
              values?.loadingCommenceAtCtg
                ? moment(values?.loadingCommenceAtCtg)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            placeholder="Loading Commence At CTG"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>
        <div className="col-lg-3">
          <FormikInput
            value={values?.departureAtCtg}
            name="departureAtCtg"
            label="Departure At CTG"
            min={
              values?.loadingCompleteAtCtg
                ? moment(values?.loadingCompleteAtCtg)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            placeholder="Departure At CTG"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>
        <div className="col-lg-3">
          <FormikInput
            value={values?.receiveDate}
            name="receiveDate"
            label="Receive Date & Time"
            placeholder="Receive Date & Time"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>

        <div className="col-lg-3">
          <FormikInput
            value={values?.dischargeStartDate}
            name="dischargeStartDate"
            label="Discharging Start"
            placeholder="Discharging Start"
            max={
              values?.dischargeComplDate
                ? moment(values?.dischargeComplDate)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>

        <div className="col-lg-3">
          <FormikInput
            value={values?.dischargeComplDate}
            name="dischargeComplDate"
            label="Discharging Complete"
            min={
              values?.dischargeStartDate
                ? moment(values?.dischargeStartDate)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            onChange={(e) => {
              setFieldValue("dischargeComplDate", e?.target?.value);
              setFieldValue("dteTripCompletionDate", e?.target?.value);
            }}
            placeholder="Discharging Complete"
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>

        {/* <div className="col-lg-3"></div> */}

        <div className="col-lg-3 mt-2">
          <FormikInput
            value={values?.dteTripCommencedDate}
            name="dteTripCommencedDate"
            label="Voy Commenced *"
            placeholder="Voy Commenced"
            onChange={(e) => {
              dateHandler(e, values, setFieldValue, "startDate");
            }}
            max={
              values?.dteTripCompletionDate
                ? moment(values?.dteTripCompletionDate)?.format(
                    "YYYY-MM-DDTHH:mm:ss"
                  )
                : ""
            }
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={viewType === "view"}
          />
        </div>

        <div className="col-lg-3 mt-2">
          <FormikInput
            value={values?.dteTripCompletionDate}
            name="dteTripCompletionDate"
            placeholder="dteTripCompletionDate"
            label="Voy Completion"
            min={moment(values?.dteTripCommencedDate)?.format(
              "YYYY-MM-DDTHH:mm:ss"
            )}
            onChange={(e) => {
              dateHandler(e, values, setFieldValue, "endDate");
            }}
            type="datetime-local"
            errors={errors}
            touched={touched}
            disabled={true}
            // disabled={viewType === "view"}
          />
        </div>

        <div className="col-lg-3 mt-2">
          <label>Duration</label>
          <FormikInput
            value={values?.numTotalTripDuration}
            name="numTotalTripDuration"
            placeholder="Duration"
            type="text"
            errors={errors}
            touched={touched}
            disabled={true}
          />
        </div>

        <div className="col-lg-3 d-flex align-items-center mt-2">
          <label className="mr-1">Is Complete</label>
          <input
            value={values?.isComplete}
            name="isComplete"
            checked={values?.isComplete}
            onChange={(e) => {
              setFieldValue("isComplete", e.target.checked);
            }}
            type="checkbox"
            disabled={viewType === "view"}
          />
        </div>
      </div>

      {/* Lighter Create Modal */}
      <IViewModal
        show={lighterVesselCreateModal}
        onHide={() => setLighterVesselCreateModal(false)}
      >
        <LighterVesselForm
          setLighterVesselCreateModal={setLighterVesselCreateModal}
          viewHandler={() => {
            GetLighterVesselDDL(accId, buId, setLighterDDL);
            setLighterVesselCreateModal(false);
          }}
        />
      </IViewModal>

      {/* Port Create Modal */}
      <IViewModal
        show={portCreateModal}
        onHide={() => {
          setPortCreateModal(false);
          GetDomesticPortDDL(setPortDDL);
        }}
        size="md"
      >
        <DomesticPortCreate />
      </IViewModal>
    </div>
  );
}
