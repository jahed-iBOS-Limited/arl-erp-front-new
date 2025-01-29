import React from "react";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createShipper, editShipper, getSingleData } from "../helper";
import Form from "./form";

const initData = {
  charterer: "",
  shipper: "",
  cargo: "",
};

export default function ShipperForm({ modalData, callLandingApi }) {
  const [loading, setLoading] = useState(false);

  const [singleData, setSingleData] = useState([]);
  const [cargoList, setCargoList] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const { formType, landingData, id } = modalData;

  useEffect(() => {
    if (id) {
      getSingleData({ id, setLoading, setter: setSingleData, setCargoList });
    }
  }, [id]);

  const saveHandler = (values, cb) => {
    if (cargoList?.length === 0) {
      return toast.warning("Please add at least one cargo");
    }

    if (cargoList?.filter((e) => e?.cargoQty < 1)?.length) {
      toast.warn("Please fill up all cargo info");
      return;
    }

    if (!id) {
      const payload = {
        objCreateDTO: {
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          charterId: values?.charterer?.value,
          charterName: values?.charterer?.label,
          voyageId: landingData?.voyageId,
          vesselId: landingData?.vesselId,
          hireTypeId: landingData?.hireTypeId,
          hireTypeName: landingData?.hireTypeName,
          shipperId: values?.shipper?.value,
          shipperName: values?.shipper?.label,
          demurrageRate: values?.demurrageRate,
          dispatchRate: values?.despatchRate,
          deadFreight: values?.deadFreightDetention,
          actionBy: profileData?.userId,
          totalFreight: cargoList?.reduce(
            (acc, obj) => acc + obj?.totalFreight,
            0
          ),
        },
        objCargoList: cargoList?.map((item) => {
          return {
            ...item,
            freightRate: 0,
          };
        }),
      };
      createShipper(payload, setLoading, async () => {
        await cb();
        await callLandingApi();
      });
    } else {
      const payload = {
        objEdit: {
          cargoHireId: +id,
          shipperId: values?.shipper?.value,
          shipperName: values?.shipper?.label,
        },
        objList: cargoList?.map((item) => {
          return {
            ...item,
            cargoHireId: +id,
            hireId: 0,
            numVoyageCargoQty: undefined,
            voyageCargoQty: item?.numVoyageCargoQty || 0,
            freightRate: 0,
          };
        }),
      };
      editShipper(payload, setLoading);
    }
  };

  const title =
    formType === "View"
      ? "View Shipper"
      : formType === "Edit"
      ? "Edit Shipper"
      : "Create Shipper";

  return (
    <>
      {loading && <Loading />}
      <Form
        title={title}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={formType}
        setLoading={setLoading}
        modalData={modalData}
        cargoList={cargoList}
        setCargoList={setCargoList}
      />
    </>
  );
}
