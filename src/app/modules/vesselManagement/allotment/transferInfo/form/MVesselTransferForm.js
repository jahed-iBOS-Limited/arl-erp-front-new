import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { PortAndMotherVessel } from "../../../common/components";
import { getMotherVesselDDL } from "../../confirmBySupervisor/helper";
import { GetDomesticPortDDL } from "../../loadingInformation/helper";
import IButton from "../../../../_helper/iButton";
import { toast } from "react-toastify";

export default function MotherVesselTransferForm({ obj }) {
  const { rowDto, addRow, history, initData, removeRow, saveHandler } = obj;
  const rowLen = rowDto?.length;

  const onChangeHandler = (currentField, allValues, setFieldValue) => {
    const fields = ["motherVessel", "toMotherVessel"];
    if (fields.includes(currentField)) {
      if (allValues?.motherVessel?.value === allValues?.toMotherVessel?.value) {
        toast.warn(
          "From Mother Vessel and To Mother Vessel must be different! please select another one."
        );
        setFieldValue(currentField, "");
      }
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title={"Mother vessel to Mother vessel transfer"}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm();
            }}
            saveHandler={() => {
              saveHandler(values, () => {
                resetForm();
              });
            }}
            saveDisabled={!rowLen}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-6">
                  <h3>From</h3>
                </div>
                <div className="col-lg-6">
                  <h3>To</h3>
                </div>
                <PortAndMotherVessel
                  obj={{
                    values,
                    setFieldValue,
                    onChange: (currentField, allValues) => {
                      onChangeHandler(currentField, allValues, setFieldValue);
                    },
                  }}
                />

                <ToPortAndMotherVessel
                  obj={{
                    values,
                    setFieldValue,
                    onChange: (currentField, allValues) => {
                      onChangeHandler(currentField, allValues, setFieldValue);
                    },
                  }}
                />

                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    label="Quantity"
                    type="number"
                  />
                </div>
                <IButton
                  onClick={() => {
                    addRow(values, () => {});
                  }}
                  disabled={
                    !values?.motherVessel ||
                    !values?.toMotherVessel ||
                    !values?.quantity
                  }
                >
                  + Add
                </IButton>
              </div>
            </Form>
            <Table obj={{ rowDto, removeRow }} />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

const ToPortAndMotherVessel = ({ obj }) => {
  const { values, setFieldValue, onChange } = obj;
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
  }, [accId, buId]);

  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="toPort"
          options={[{ value: 0, label: "All" }, ...portDDL]}
          value={values?.toPort}
          label="Port"
          placeholder="Port"
          onChange={(e) => {
            setFieldValue("toPort", e);
            setFieldValue("toMotherVessel", "");
            getMotherVesselDDL(accId, buId, e?.value, setMotherVesselDDL);
            onChange && onChange("toPort", { ...values, toPort: e });
          }}
        />
      </div>

      <div className="col-lg-3">
        <NewSelect
          name="toMotherVessel"
          options={[{ value: 0, label: "All" }, ...motherVesselDDL] || []}
          value={values?.toMotherVessel}
          label="Mother Vessel"
          placeholder="Mother Vessel"
          onChange={(e) => {
            setFieldValue("toMotherVessel", e);
            onChange &&
              onChange("toMotherVessel", { ...values, toMotherVessel: e });
          }}
          isDisabled={!values?.toPort}
        />
      </div>
    </>
  );
};

const Table = ({ obj }) => {
  const { rowDto, removeRow } = obj;
  return (
    <>
      {rowDto?.length > 0 && (
        <div className="scroll-table _table">
          <table className="global-table table table-font-size-sm">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>

                <th>From Mother Vessel</th>
                <th>To Mother Vessel</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.fromMotherVesselName}</td>
                  <td>{item?.toMotherVesselName}</td>
                  <td>{item?.transferQuantity}</td>

                  <td className="text-center">
                    <IDelete id={index} remover={removeRow} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
