import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  channel: "",
  fromDate: "",
  toDate: "",
  salesOrganization: "",
};

export default function SalesForceIncentiveCreate({ headerData }) {
  const [objProps, setObjprops] = useState({});
  const [channelDDL, getChannelDDL, , setChannelDDL] = useAxiosGet();
  const [essentialLandingData, getEssentialLandingData] = useAxiosGet();
  const {
    profileData: { accountId: accId, userId: actionBy },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [
    incentiveData,
    getIncentiveData,
    loadIncentiveData,
    setIncentiveData,
  ] = useAxiosGet();
  const [, incentiveSave, loadIncentiveSave] = useAxiosPost();
  const [salesOrganizationList, getSalesOrganizationList] = useAxiosGet();


  const saveHandler = (values, cb) => {
    const newData = incentiveData?.filter((item) => item?.isSelected);
    if (!newData?.length) {
      return toast.warn("Select at least one row");
    }

    const rowPayloadData = newData?.map((item) => ({
      businessId: buId,
      region: item?.strRegoin || "",
      area: item?.strArea || "",
      territory: item?.strTeritory || "",
      employeeId: item?.intEmployeeBasicInfoId || 0,
      employeeName: item?.strEmployeeName || "",
      monthId: +values?.toDate?.split("-")[1],
      yearId: +values?.toDate?.split("-")[0],
      salesAmount: item?.numSalesAmount,
      targetAmount: item?.numTargetAmount || 0,
      achievement: item?.numAchievement || 0,
      incentiveAmount: item?.numIncentiveAmount || 0,
      regionId: item?.intRegionId || 0,
      areaId: item?.intAreaId || 0,
      territoryId: item?.intTerritoryId || 0,
      zoneId: item?.intZoneId || 0,
      channelId: item?.intChannelid || 0,
      salesQnt: item?.numSalesQnt || 0,
      targetQnt: item?.numTargetQuantity || 0,
      naration: values?.narration || "",
      billRef: values?.billNo || 0,
      billTypeId: +headerData?.billType?.value || 0,
    }));

    const payload = {
      headerObj: rowPayloadData,
      imgObj: {
        imageId: values?.attachment || "",
      },
    };
    incentiveSave(
      `/oms/IncentiveConfig/SaveIncentiveConfig?intActionBy=${actionBy}`,
      payload,
      cb,
      true
    );
  };

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
      (res) => {
        const ddl = res.map((item) => {
          return {
            value: item.value,
            label: item.label,
          };
        });
        setChannelDDL(ddl);
      }
    );

    getSalesOrganizationList(
      `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadIncentiveData || loadIncentiveSave) && <Loading />}
          <IForm title="Sales Incentive" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={boninessUnitDDL}
                    value={values?.item}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {![144].includes(buId) && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="salesOrganization"
                      options={salesOrganizationList}
                      value={values?.salesOrganization}
                      label="Sales Organization"
                      onChange={(valueOption) => {
                        setFieldValue("salesOrganization", valueOption);
                        setIncentiveData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={channelDDL}
                    value={values?.channel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption);
                      setIncentiveData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="fromDate"
                    value={values?.fromDate}
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setIncentiveData([]);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="toDate"
                    value={values?.toDate}
                    label="To Date"
                    type="date"
                    min={values?.fromDate}
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setIncentiveData([]);
                    }}
                  />
                </div>
                <div>
                  <button
                    disabled={
                      !values?.channel?.value ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      // const api = `/oms/IncentiveConfig/GetIncenttiveView?businessUnitId=${buId}&certainDate=${values?.toDate}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;
                      const api = `/oms/IncentiveConfig/GetIncenttiveViewByDesignation?intunitid=4&fromdate=${values?.fromDate}&todate=${values?.toDate}&intSalesOrganizationId=${values?.salesOrganization?.value}&intChannelId=${values?.channel?.value}&intRATId=0&intLevelid=0`;

                      const essentialRowDataApi = `/oms/OMSPivotReport/GetEmployeeTargetVsAchForCommission?PartId=${1}&BusinessUnitId=${buId}&ChannelId=${
                        values.channel.value
                      }&RegionId=0&AreaId=0&FromDate=${
                        values.fromDate
                      }&ToDate=${values.toDate}`;

                      if (buId === 144) {
                        // console.log("scope");
                        getEssentialLandingData(essentialRowDataApi);
                      } else {
                        getIncentiveData(api);
                      }
                    }}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Show
                  </button>
                </div>
              </div>

              <div class="form-group global-form my-2 row">
                <div className="col-lg-3 ">
                  <label>Narration</label>
                  <InputField
                    value={values?.narration}
                    name="narration"
                    placeholder="Narration"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Bill No</label>
                  <InputField
                    value={values?.billNo}
                    name="billNo"
                    placeholder="Bill No"
                    type="text"
                  />
                </div>
                <div className="col-lg-3 mt-3">
                  <AttachmentUploaderNew
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                    }}
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        // console.log({ attachment: attachmentData });
                        setFieldValue("attachment", attachmentData?.[0]?.id);
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                {buId === 144 ? (
                  <AkijEssentialLandingDataTable
                    rowData={essentialLandingData}
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={
                                incentiveData?.length > 0 &&
                                incentiveData.every((item) => item?.isSelected)
                              }
                              onChange={(e) => {
                                const data = incentiveData.map((item) => ({
                                  ...item,
                                  isSelected: e.target.checked,
                                }));
                                setIncentiveData(data);
                              }}
                            />
                          </th>
                          <th>Sl</th>
                          <th>Employee</th>
                          <th>Enroll</th>
                          <th>Designation</th>
                          <th>Account Name</th>
                          <th>Bank Wallet</th>
                          <th>Branch Name</th>
                          <th>Account No</th>
                          <th>Region</th>
                          <th>Area</th>
                          <th>Territory</th>
                          <th>Zone</th>
                          <th>Target Quantity</th>
                          <th>Sales Quantity</th>
                          <th>Achievement %</th>
                          <th>Incentive Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incentiveData?.length > 0 &&
                          incentiveData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item?.isSelected}
                                  onChange={(e) => {
                                    const data = [...incentiveData];
                                    data[index]["isSelected"] =
                                      e.target.checked;
                                    setIncentiveData(data);
                                  }}
                                />
                              </td>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strEmployeeName}
                              </td>
                              <td className="text-center">
                                {item?.intEmployeeBasicInfoId}
                              </td>
                              <td className="text-center">
                                {item?.strDesignation}
                              </td>
                              <td>{item?.strAccountName}</td>
                              <td>{item?.strBankWalletName}</td>
                              <td>{item?.strBranchName}</td>
                              <td>{item?.strAccountNo}</td>
                              <td className="text-center">{item?.strRegoin}</td>
                              <td className="text-center">{item?.strArea}</td>
                              <td className="text-center">
                                {item?.strTeritory}
                              </td>
                              <td className="text-center">
                                {item?.strZoneName}
                              </td>
                              <td className="text-center">
                                {item?.numTargetQuantity}
                              </td>
                              <td className="text-center">
                                {item?.numSalesQnt}
                              </td>
                              <td className="text-center">
                                {item?.numAchievement}
                              </td>
                              <td className="text-center">
                                <InputField
                                  value={item?.numIncentiveAmount || ""}
                                  type="number"
                                  onChange={(e) => {
                                    if (+e.target.value < 0) return;
                                    const data = [...incentiveData];
                                    data[index]["numIncentiveAmount"] = +e
                                      .target.value;
                                    setIncentiveData(data);
                                  }}
                                />
                                {/* {item?.numIncentiveAmount} */}
                              </td>
                              <td className="text-center">
                                {" "}
                                <IView
                                  title="View"
                                  clickHandler={() => alert("hello")}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

const AkijEssentialLandingDataTable = ({ rowData = [] }) => {
  //   console.log({ rowData });
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Enroll</th>
              <th>Field Force Name</th>
              <th>Design.</th>
              <th>Territory</th>
              <th>Target Chinigura</th>
              <th>Target Others</th>
              <th>Total Target</th>
              <th>Achv. Chinigira %</th>
              <th>Achv. Other %</th>
              <th>Total Achv.</th>
              <th>Incentive Chinigura</th>
              <th>Incentive Others</th>
              <th>Payable Incentive</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => (
              <tr>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item.intEmployeeIdSO}</td>
                <td className="text-center">{item.strEmployeeNameTSO}</td>
                <td className="text-center">{item.strDesignationName}</td>
                <td className="text-center">{item.territoryid}</td>
                <td className="text-center">{item.numTargetQntChiniguraTon}</td>
                <td className="text-center">
                  {item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numTargetQntChiniguraTon +
                    item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">{item.numChiniguraAchievement}</td>
                <td className="text-center">
                  {item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numChiniguraAchievement +
                    item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numChiniguraCommissionAmount}
                </td>
                <td className="text-center">
                  {item.numwithoutChiniguraCommissionAmount}
                </td>
                <td className="text-center">{item.numTotalCommission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
