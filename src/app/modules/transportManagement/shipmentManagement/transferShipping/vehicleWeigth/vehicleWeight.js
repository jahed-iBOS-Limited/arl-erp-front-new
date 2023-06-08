import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { GetItemWeightInfo_action, SaveVehicleWeight } from "../_redux/Actions";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
const validationSchema = Yup.object().shape({
  vehicleUnloadedWeight: Yup.number()
    .min(1, "Minimum 1 number")
    .required("Vehicle Unloaded Weight required"),
  // .test("approveAmount", "invalid number ", function(value) {
  //   return 10 >= value;
  // }),
  vehicleLoadedWeight: Yup.number()
    .min(1, "Minimum 1 number")
    .required("Vehicle Loaded Weight required")
    .test("approveAmount", "invalid number ", function(value) {
      const validaionCheck =
        this.parent.maximumToleranceTotal >= +value &&
        this.parent.minimumToleranceTotal <= +value;
      return validaionCheck;
    }),
});
const initData = {
  totalGrossWeight: "",
  vehicleUnloadedWeight: "",
  vehicleLoadedWeight: "",
};

const VehicleWeight = (id) => {
  const { state: landingData } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const itemWeightInfo = useSelector((state) => {
    return state.shipment?.itemWeightInfo;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [loading, setLoading] = React.useState(false);
  const saveHandler = (values) => {
    const { vehicleLoadedWeight, vehicleUnloadedWeight } = values;
    dispatch(
      SaveVehicleWeight(
        id?.id,
        vehicleLoadedWeight,
        vehicleUnloadedWeight,
        () => {
          history.push("/transport-management/shipmentmanagement/transfershipping");
        }
      )
    );
  };
  useEffect(() => {
    if (landingData?.shipmentCode) {
      dispatch(GetItemWeightInfo_action(landingData?.shipmentCode, setLoading));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...itemWeightInfo,
          minimumToleranceTotal:
            itemWeightInfo?.vehicleUnloadedWeight +
            itemWeightInfo?.minimumTolerance,
          maximumToleranceTotal:
            itemWeightInfo?.vehicleUnloadedWeight +
            itemWeightInfo?.maximumTolerance,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <Card>
              <CardHeader title={"Vehicle Weight"}>
                <CardHeaderToolbar>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right global-form">
                  <div className="row mt-1">
                    <div className="col-md-9 offset-md-3">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ minWidth: "255px", marginBottom: 0 }}>
                          <b>Minimum Weight Tolerance: </b>
                          {values?.vehicleUnloadedWeight &&
                            values?.minimumToleranceTotal}
                        </p>
                        <p style={{ minWidth: "255px", marginBottom: 0 }}>
                          <b>Maximum Weight Tolerance: </b>
                          {values?.vehicleUnloadedWeight &&
                            values?.maximumToleranceTotal}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <label>Goods Gross Weight</label>
                      <InputField
                        value={values?.totalGrossWeight}
                        placeholder="Goods Gross Weight"
                        name="TotalItemGrossWeight"
                        type="number"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>
                        {`Vehicle Unloaded Weight ${selectedBusinessUnit?.value ===
                          4 && "(TON)"}`}{" "}
                      </label>
                      <InputField
                        value={values?.vehicleUnloadedWeight || ""}
                        placeholder="Vehicle Unloaded Weight"
                        name="vehicleUnloadedWeight"
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "vehicleUnloadedWeight",
                            e.target.value
                          );
                          setFieldValue(
                            "minimumToleranceTotal",
                            +e.target.value + values?.minimumTolerance
                          );
                          setFieldValue(
                            "maximumToleranceTotal",
                            +e.target.value + values?.maximumTolerance
                          );
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>
                        {`Vehicle Loaded Weight ${selectedBusinessUnit?.value ===
                          4 && "(TON)"}`}{" "}
                      </label>
                      <InputField
                        value={values?.vehicleLoadedWeight || ""}
                        placeholder="Vehicle Loaded Weight"
                        name="vehicleLoadedWeight"
                        type="number"
                      />
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};
export default VehicleWeight;
