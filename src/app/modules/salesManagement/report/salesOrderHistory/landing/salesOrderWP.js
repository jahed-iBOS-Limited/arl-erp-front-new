import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";

const SalesOrderWP = ({ values, setFieldValue, errors, touched }) => {
  const [shipPointDDL, getShipPointDDL, , setShipPointDDL] = useAxiosGet();
  const [channelList, getChannelList] = useAxiosGet();
  const [customerDDL, getCustomerDDL, , setCustomerDDL] = useAxiosGet();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getShipPointDDL(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${profileData?.userId}&ClientId=1&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const modifiyData = data.map((item) => ({
          ...item,
          value: item.organizationUnitReffId,
          label: item.organizationUnitReffName,
        }));
        setShipPointDDL(modifiyData);
      }
    );
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="shipPointFP"
          options={shipPointDDL || []}
          value={values?.shipPointFP}
          label="Ship Point"
          onChange={(valueOption) => {
            setFieldValue("shipPointFP", valueOption);
          }}
          placeholder="Ship Point"
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="dbChannelFP"
          options={channelList || []}
          value={values?.dbChannelFP}
          label="Distribution Channel"
          onChange={(valueOption) => {
            if (valueOption) {
              setFieldValue("dbChannelFP", valueOption);
              setFieldValue("customerFP", "");
              getCustomerDDL(
                `/oms/DistributionChannel/GetDistributionByChanneIdlDDL?accountId=1&businessUnitId=${selectedBusinessUnit?.value}&distributionChannelId=${valueOption?.value}`
              );
            } else {
              setFieldValue("dbChannelFP", "");
              setFieldValue("customerFP", "");
              setCustomerDDL([]);
            }
          }}
          placeholder="Distribution Channel"
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="customerFP"
          options={customerDDL || []}
          value={values?.customerFP}
          label="Customer"
          onChange={(valueOption) => {
            setFieldValue("customerFP", valueOption);
          }}
          placeholder="Customer"
          errors={errors}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.salesOrderFP}
          name="salesOrderFP"
          label="Sales Order"
          type="text"
          onChange={(e) => {
            setFieldValue("salesOrderFP", e?.target?.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <InputField
          value={values?.reasonFP}
          name="reasonFP"
          label="Reason"
          type="text"
          onChange={(e) => {
            setFieldValue("reasonFP", e?.target?.value);
          }}
        />
      </div>
    </>
  );
};

export default SalesOrderWP;
