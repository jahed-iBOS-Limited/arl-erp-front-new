import { Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../../_helper/_loading";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import { PortAndMotherVessel } from "../../../common/components";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { StockOutFromInventoryApproval } from "../helper";

const initData = {
  port: "",
  motherVessel: "",
  lighterVessel: "",
};

const WarehouseApprove = ({ obj }) => {
  const {
    formValues,
    userId,
    getData,
    pageNo,
    pageSize,
    singleItem,
    setOpen,
  } = obj;

  const [
    lighterDDL,
    getLighterDDL,
    lighterLoader,
    setLighterDDL,
  ] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  const getLighters = (values) => {
    getLighterDDL(
      `/tms/LigterLoadUnload/GetLighterVesselNItemDDL?ShipPointId=${formValues
        ?.shipPoint?.value || 0}&MotherVesselId=${values?.motherVessel?.value}`,
      (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            ...item,
            value: item?.lighterVessel,
            label: item?.lighterVesselName,
          };
        });
        setLighterDDL(modifyData);
      }
    );
  };

  const approveSubmitHandler = (values) => {
    const payload = {
      deliveryId: singleItem?.deliveryId,
      actionBy: userId,
      motherVesselId: values?.motherVessel?.value,
      lighterVesselId: values?.lighterVessel?.value,
    };
    StockOutFromInventoryApproval(payload, setLoading, () => {
      setOpen(false);
      getData(formValues, pageNo, pageSize);
    });
  };

  const loader = lighterLoader || loading;
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loader && <Loading />}
            <ICustomCard
              title={"Warehouse Approve"}
              saveHandler={() => {
                approveSubmitHandler(values);
              }}
            >
              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <PortAndMotherVessel
                      obj={{
                        values,
                        setFieldValue,
                        onChange: (fieldName, allValues) => {
                          if (fieldName === "motherVessel") {
                            getLighters(allValues);
                          }
                        },
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="lighterVessel"
                        options={lighterDDL || []}
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        onChange={(e) => {
                          setFieldValue("lighterVessel", e);
                        }}
                        placeholder="Lighter"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.motherVessel}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default WarehouseApprove;
