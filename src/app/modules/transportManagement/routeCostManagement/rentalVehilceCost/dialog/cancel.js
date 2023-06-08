import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import InputField from "../../../../_helper/_inputField";
import { Formik } from "formik";
import { cancelRentalVehicleCost } from "../helper";
import * as Yup from "yup";

export default function CancelRentalVehicleCost({
  show,
  setShow,
  tripId,
  userId,
}) {
  const saveHandler = (values) => {
    cancelRentalVehicleCost(tripId, values?.reason, userId);
  };
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Reason is required"),
  });
  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{ reason: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, handleSubmit }) => (
          <Dialog open={show} onClose={() => setShow(false)}>
            <DialogTitle>Cancel Rental Vehicle Cost</DialogTitle>
            <DialogContent style={{ width: "500px" }}>
              <InputField
                name="reason"
                value={values?.reason}
                label="Reason"
                placeholder="Reason"
                type="text"
              />
            </DialogContent>
            <DialogActions>
              <button
                className="btn btn-outline"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </div>
  );
}
