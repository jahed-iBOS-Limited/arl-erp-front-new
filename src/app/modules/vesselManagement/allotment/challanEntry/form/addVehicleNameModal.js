import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getVehicleDDL } from "../helper";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "./../../../../_helper/customHooks/useAxiosPost";

const initData = {
  // vehicleCity: "",
  // vehicleRegistrationLetter: "",
  // vehicleRegistrationNumber: "",
  // vehicleManualNo: "",
  vehicleManualFinalNo: "",
  vehicleType: "",
  ownerType: "",
  capacity: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  // vehicleCity: Yup.object().shape({
  //   label: Yup.string().required("Vehicle City is required"),
  //   value: Yup.string().required("Vehicle City is required"),
  // }),
  // vehicleRegistrationLetter: Yup.object().shape({
  //   label: Yup.string().required("Vehicle Registration Letter is required"),
  //   value: Yup.string().required("Vehicle Registration Letter is required"),
  // }),
  // vehicleRegistrationNumber: Yup.object().shape({
  //   label: Yup.string().required("Vehicle Registration Number is required"),
  //   value: Yup.string().required("Vehicle Registration Number is required"),
  // }),
  vehicleManualFinalNo: Yup.string().required("Vehicle Full No is required"),
  vehicleType: Yup.object().shape({
    label: Yup.string().required("Vehicle Type is required"),
    value: Yup.string().required("Vehicle Type is required"),
  }),
  ownerType: Yup.object().shape({
    label: Yup.string().required("Owner Type is required"),
    value: Yup.string().required("Owner Type is required"),
  }),
  // vehicleManualNo: Yup.string()
  //   .min(0, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Vehicle Manual No is required"),
});

export default function AddVehicleNameModal({
  setIsShowModal,
  logisticId,
  setVehicleDDL,
}) {
  const [objProps, setObjprops] = useState({});
  // const [vehicheCityDDL, getVehicleCityDDL] = useAxiosGet();
  // const [vehicleAddress, setVehicleAddress] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // const [
  //   vehicleRegistrationLetterDDL,
  //   getVehicleRegistrationLetterDDL,
  // ] = useAxiosGet();
  // const [
  //   vehicleRegistrationNumberDDL,
  //   getVehicleRegistrationNumberDDL,
  // ] = useAxiosGet();
  const [vehicleTypeDDL, getVehicleTypeDDL] = useAxiosGet();
  const [capacityDDL, getCapacityDDL] = useAxiosGet();
  const [, createHandler] = useAxiosPost();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // getVehicleCityDDL(`/tms/TransportMgtDDL/GetVehicleCityDDL`);
    // getVehicleRegistrationLetterDDL(
    //   `/tms/TransportMgtDDL/GetVehicleRegistrationLetterDDL`
    // );
    // getVehicleRegistrationNumberDDL(
    //   `/tms/TransportMgtDDL/GetVehicleRegitrationNumberDDL`
    // );
    getVehicleTypeDDL(`/tms/Vehicle/GetVehicleTypeDDL`);
    getCapacityDDL(`/tms/TransportMgtDDL/GetVehicleCapacityDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    createHandler(
      `/tms/LigterLoadUnload/CreateVehicleForG2G`,
      {
        // vehicleNo: vehicleAddress || values?.vehicleManualFinalNo || "",
        vehicleNo: values?.vehicleManualFinalNo || "",
        businessUnitId: selectedBusinessUnit?.value,
        accountId: profileData?.accountId,
        ownerTypeId: values.ownerType?.value,
        ownerType: values.ownerType?.label,
        vehicleTypeId: values.vehicleType?.value,
        actionBy: profileData?.userId,
        vehicleCapacityId: values?.capacity?.value,
      },
      logisticId
        ? () => {
            getVehicleDDL(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              logisticId,
              setVehicleDDL,
              setIsLoading
            );
          }
        : null,
      true
    );
    cb();
  };

  return (
    <IForm
      title="Create Vehicle Name"
      getProps={setObjprops}
      isHiddenReset={true}
      isHiddenBack={true}
    >
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            vehicleType: {
              value: vehicleTypeDDL[2]?.value,
              label: vehicleTypeDDL[2]?.label,
            },
            ownerType: { value: 2, label: "Customize" },
            capacity: {
              value: capacityDDL[7]?.value,
              label: capacityDDL[7]?.label,
            },
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setIsShowModal(false);
            });
          }}
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
              <Form className="form form-label-right">
                {false && <Loading />}

                <div className="form-group row ">
                  <div className="col-lg-12">
                    <div
                      className="row bank-journal bank-journal-custom bj-left"
                      style={{ paddingBottom: "0px" }}
                    >
                      <div className="col-lg-2 mb-2">
                        <label>Vehicle Full No</label>
                        <InputField
                          // value={
                          //   vehicleAddress || values?.vehicleManualFinalNo || ""
                          // }
                          values={values?.vehicleManualFinalNo}
                          name="vehicleManualFinalNo"
                          placeholder="Vehicle Full No"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-2 mb-2 d-none">
                        <NewSelect
                          name="vehicleType"
                          options={vehicleTypeDDL}
                          value={values?.vehicleType}
                          label="Vehicle Type"
                          onChange={(valueOption) => {
                            setFieldValue("vehicleType", valueOption);
                          }}
                          placeholder="Vehicle Type"
                          errors={errors}
                          touched={touched}
                          disable
                        />
                      </div>
                      <div className="col-lg-2 mb-2 d-none">
                        <NewSelect
                          name="ownerType"
                          options={[
                            { value: 1, label: "Company" },
                            { value: 3, label: "Customer" },
                            { value: 2, label: "Customize" },
                          ]}
                          value={values?.ownerType}
                          label="Owner Type"
                          onChange={(valueOption) => {
                            setFieldValue("ownerType", valueOption);
                          }}
                          placeholder="Owner Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2 mb-2 d-none">
                        <NewSelect
                          name="capacity"
                          options={capacityDDL}
                          value={values?.capacity}
                          label="Capacity"
                          onChange={(valueOption) => {
                            setFieldValue("capacity", valueOption);
                          }}
                          placeholder="Capacity"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
