import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";

const initData = {
  lat: "",
  long: "",
};

export default function AddLatLong({ id, show, onHide }) {
  const [, postData, loading] = useAxiosPost();

  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values) => {
    const payload = {
      shipPoint: id,
      unitId: buId,
      latitude: values?.lat,
      longitude: values?.long,
    };
    postData(
      `/wms/ShipPoint/CreateShipPointLatitudeNLongitude`,
      payload,
      () => {
        onHide();
      },
      true
    );
  };

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={`Latitude and Longitude Entry`}
      >
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values }) => (
            <>
              {loading && <Loading />}
              <div className="text-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    saveHandler(values);
                  }}
                >
                  Done
                </button>
              </div>
              <form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-md-3">
                    <InputField
                      label="Latitude"
                      placeholder="Latitude"
                      value={values?.lat}
                      name="lat"
                      type="text"
                      disabled={false}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      label="Longitude"
                      placeholder="Longitude"
                      value={values?.long}
                      name="long"
                      type="text"
                      disabled={false}
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </Formik>
      </IViewModal>
    </div>
  );
}
