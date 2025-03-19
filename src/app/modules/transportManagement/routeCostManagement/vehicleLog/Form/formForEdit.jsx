import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import TextArea from "../../../../_helper/TextArea";
import NewSelect from "../../../../_helper/_select";
import { getVehicleNoDDL, updateVehicle } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";

export default function VehicleEditForm({
  singleItem,
  setOpen,
  getGridData,
  value,
  pageNo,
  pageSize,
}) {
  const initData = { preVehicleNo: "", updatedVehicleNo: "", reason: "" };
  const [vehicleNoList, setVehicleNoList] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getVehicleNoDDL(accId, buId, setVehicleNoList);
  }, [accId, buId, singleItem]);

  const saveHandler = (values) => {
    const payload = {
      vehicleLogId: singleItem?.vehicleLogId,
      comments: `Reason updating vehicle no: ${singleItem?.vehicleNumber} to ${values?.updatedVehicleNo?.label} \n ${values?.reason}`,
      actionBy: userId,
      vehicleId: values?.updatedVehicleNo?.value,
      vehicleNumber: values?.updatedVehicleNo?.label,
    };
    updateVehicle(payload, setLoading, () => {
      getGridData(value, pageNo, pageSize);
      setOpen(false);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          preVehicleNo: {
            value: singleItem?.vehicleId,
            label: singleItem?.vehicleNumber,
          },
        }}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <ICustomCard
            title="Vehicle Update"
            saveHandler={() => {
              saveHandler(values);
            }}
            saveDisabled={!values?.updatedVehicleNo || !values?.reason}
          >
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="preVehicleNo"
                      options={[]}
                      value={values?.preVehicleNo}
                      label="Pre Vehicle No."
                      placeholder="Pre Vehicle No."
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="updatedVehicleNo"
                      options={vehicleNoList}
                      value={values?.updatedVehicleNo}
                      label="Updated Vehicle No."
                      onChange={(valueOption) => {
                        setFieldValue("updatedVehicleNo", valueOption);
                      }}
                      placeholder="Updated Vehicle No."
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label htmlFor="reason">Reason</label>
                    <TextArea
                      name="reason"
                      value={values?.reason}
                      placeholder="Reason"
                    />
                  </div>
                </div>
              </div>
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
