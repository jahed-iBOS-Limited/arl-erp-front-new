import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import InputField from "./../../../_helper/_inputField";
import { _todayDate } from "./../../../_helper/_todayDate";

function ChallanViewModal({
  item,
  type,
  callAfterGateOut,
  businessUnit,
  setIsShowModel,
}) {
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [outTime, setOutTime] = useState("");
  const [afterLunch, setAfterLunch] = useState(true);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate Out"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      if (outTime === "") {
                        return toast.warn("Please select out time");
                      }
                      saveData(
                        `/mes/MSIL/VehicleGateOutCreate`,
                        {
                          vehicleOutTime:
                            type === 3 && afterLunch ? null : outTime,
                          vehicleOutTimeAfterLunch:
                            type === 3 && afterLunch ? outTime : null,
                          intBusinessUnitId: businessUnit,
                          intActionBy: profileData?.userId,
                          dteActionDate: _todayDate(),
                          intStatus: type,
                          intAutoId: item?.intAutoId,
                          intReferenceId: item?.intReferenceId,
                        },
                        () => {
                          callAfterGateOut();
                          setIsShowModel(false);
                        },
                        true
                      );
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {saveDataLoader && <Loading />}
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <InputField
                        value={values?.outTime}
                        label="Out Time"
                        name="outTime"
                        type="time"
                        onChange={(e) => {
                          setOutTime(e.target.value);
                        }}
                      />
                    </div>
                    {type === 3 ? (
                      <div style={{ marginTop: "20px" }} className="ml-4">
                        <input
                          className="cursor-pointer"
                          type="checkbox"
                          name="outSlot"
                          checked={afterLunch}
                          onChange={(e) => {
                            setAfterLunch(!afterLunch);
                          }}
                        />
                        <label htmlFor="isComplete" className="pl-1">
                          After Lunch
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ChallanViewModal;
