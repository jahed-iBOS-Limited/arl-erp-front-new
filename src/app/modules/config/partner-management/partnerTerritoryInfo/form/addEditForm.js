import React, { useEffect, useState } from "react";
import {
  getPartnerTerritoryInfoById,
  getTerritoryList,
  updatePartnerTerritory,
} from "../helper";
import Form from "./form";

const PartnerTerritoryInfoForm = ({ id, values, accId, buId, setShow }) => {
  const [singleData, setSingleData] = useState({});
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getPartnerTerritoryInfoById(id, setSingleData, setLoading);
      getTerritoryList(accId, buId, values?.channel?.value, setTerritoryDDL);
    }
  }, [id, accId, buId, values]);

  const saveHandler = (values, cb) => {
    const payload = {
      configId: id,
      territoryId: values?.territory?.value,
    };
    updatePartnerTerritory(payload, setLoading, () => {
      cb();
      setShow(false);
    });
  };

  return (
    <>
      <Form
        initData={{
          ...singleData,
          territory: {
            value: singleData?.territoryId,
            label: singleData?.territory,
          },
        }}
        loading={loading}
        territoryDDL={territoryDDL}
        saveHandler={saveHandler}
      ></Form>
    </>
  );
};

export default PartnerTerritoryInfoForm;
