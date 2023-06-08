import { Formik } from "formik";
import React from "react";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { updateTransportZone } from "../helper";

const initData = {
  transportZone: "",
};

const Update = ({
  transportZoneDDL,
  singleRow,
  setShow,
  profileData,
  getGridData,
  values,
}) => {
  const [loading, setLoading] = React.useState(false);

  const saveHandler = async (values, callback) => {
    const payload = {
      shipToPartnerId: singleRow?.intShiptoPartnerId,
      zoneId: values?.transportZone?.value,
      actionBy: profileData?.userId,
    };
    updateTransportZone(payload, setLoading, () => {
      callback();
      getGridData(values);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        initialValues={{
          ...initData,
          transportZone: {
            value: singleRow?.intTransportZoneId,
            label: singleRow?.strTransportZoneName,
          },
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            setShow(false);
            resetForm(initData);
          });
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <>
            <form className="form form-label-right">
              <div className="d-flex justify-content-between p-3">
                <h3> Update Transport Zone </h3>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Done
                </button>
              </div>
              <div className="form-group row pb-5">
                <div className="col-lg-12 pb-5">
                  <NewSelect
                    name="transportZone"
                    options={transportZoneDDL || []}
                    value={values?.transportZone}
                    onChange={(e) => {
                      setFieldValue("transportZone", e);
                    }}
                    label="Transport Zone"
                    placeholder="Transport Zone"
                  />
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Update;
