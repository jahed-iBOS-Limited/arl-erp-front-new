import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { GetDomesticPortDDL } from "../../loadingInformation/helper";

export default function MotherVesselTransferForm({ obj }) {
  const { rowDto, addRow, history, initData, removeRow, saveHandler } = obj;
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();
  const rowLen = rowDto?.length;

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const onChangeHandler = (currentField, allValues, setFieldValue) => {
    const fields = ["fromMotherVessel", "toMotherVessel"];
    if (currentField === "fromMotherVessel") {
      setFieldValue("item", allValues?.fromMotherVessel?.itemName);
    }
    if (fields.includes(currentField)) {
      if (
        allValues?.fromMotherVessel?.value === allValues?.toMotherVessel?.value
      ) {
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
            title={"Mother vessel to Mother vessel transfer --OUT--"}
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
                <div className="col-lg-3">
                  <NewSelect
                    name="organization"
                    options={organizationDDL || []}
                    value={values?.organization}
                    label="Organization"
                    onChange={(valueOption) => {
                      setFieldValue("organization", valueOption);
                    }}
                    placeholder="Organization"
                  />
                </div>
                <div className="col-lg-9"></div>
                <div className="col-lg-6">
                  <h3>From</h3>
                </div>
                <div className="col-lg-6">
                  <h3>To</h3>
                </div>

                <FromPortAndMotherVessel
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
                    value={values?.item}
                    name="item"
                    placeholder="Item"
                    label="Item"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    name="quantity"
                    placeholder="Quantity"
                    label="Quantity"
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.reason}
                    name="reason"
                    placeholder="Reason"
                    label="Reason"
                    type="text"
                  />
                </div>
                <IButton
                  onClick={() => {
                    addRow(values, () => {});
                  }}
                  disabled={
                    !values?.fromMotherVessel ||
                    !values?.toMotherVessel ||
                    !values?.quantity
                  }
                >
                  + Add
                </IButton>
              </div>
            </Form>
            <Table
              obj={{
                rowDto,
                removeRow,
              }}
            />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

const FromPortAndMotherVessel = ({ obj }) => {
  const { values, setFieldValue, onChange } = obj;
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();

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
          name="fromPort"
          options={portDDL || []}
          value={values?.fromPort}
          label="Port"
          placeholder="Port"
          isDisabled={!values?.organization}
          onChange={(e) => {
            setFieldValue("fromPort", e);
            setFieldValue("fromMotherVessel", "");

            getMotherVesselDDL(
              `/tms/LigterLoadUnload/GetMotherVesselTenderDDL?businessUnitId=${buId}&portId=${e?.value}&businessPartnerId=${values?.organization?.value}`
            );
            onChange &&
              onChange("fromPort", {
                ...values,
                fromPort: e,
              });
          }}
        />
      </div>

      <div className="col-lg-3">
        <NewSelect
          name="fromMotherVessel"
          options={motherVesselDDL || []}
          value={values?.fromMotherVessel}
          label="Mother Vessel"
          placeholder="Mother Vessel"
          onChange={(e) => {
            setFieldValue("fromMotherVessel", e);
            onChange &&
              onChange("fromMotherVessel", {
                ...values,
                fromMotherVessel: e,
              });
          }}
          isDisabled={!values?.fromPort}
        />
      </div>
    </>
  );
};
const ToPortAndMotherVessel = ({ obj }) => {
  const { values, setFieldValue, onChange } = obj;
  const [portDDL, setPortDDL] = useState([]);
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet();

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
          options={portDDL}
          value={values?.toPort}
          label="Port"
          placeholder="Port"
          isDisabled={!values?.organization}
          onChange={(e) => {
            setFieldValue("toPort", e);
            setFieldValue("toMotherVessel", "");
            getMotherVesselDDL(
              `/tms/LigterLoadUnload/GetMotherVesselTenderDDL?businessUnitId=${buId}&portId=${e?.value}&businessPartnerId=${values?.organization?.value}`
            );
            onChange && onChange("toPort", { ...values, toPort: e });
          }}
        />
      </div>

      <div className="col-lg-3">
        <NewSelect
          name="toMotherVessel"
          options={motherVesselDDL || []}
          value={values?.toMotherVessel}
          label="Mother Vessel"
          placeholder="Mother Vessel"
          onChange={(e) => {
            if (e?.itemId === values?.fromMotherVessel?.itemId) {
              setFieldValue("toMotherVessel", e);
              onChange &&
                onChange("toMotherVessel", { ...values, toMotherVessel: e });
            } else {
              toast.warn(
                "Item of both mother vessels must have to be the same"
              );
               setFieldValue("toMotherVessel", "");
            }
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
