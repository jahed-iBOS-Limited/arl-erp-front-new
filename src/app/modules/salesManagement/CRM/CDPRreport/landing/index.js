import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "./../../../../_helper/customHooks/useAxiosGet";
import LandingTable from "./table";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  productName: "",
  channel: {
    value: "B2B",
    label: "B2B",
  },
};

const CDPRreportLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [withoutModfifyData, setWithoutModfifyData] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [, setCompetitorPriceLandingPag, landingLoading] = useAxiosGet();
  const [, EditCDPMasterData, postLoading] = useAxiosPost();
  const formikRef = React.useRef(null);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGridData = () => {
    setCompetitorPriceLandingPag(
      `/partner/PManagementCommonDDL/CDPMasterData_Rev1`,
      (resData) => {
        // setGridData(resData);
        setWithoutModfifyData(resData);
        const arrylist = [...resData];
        // uqique channel list "channel"
        const unique = [
          ...new Map(arrylist.map((item) => [item["channel"], item])).values(),
        ];
        setChannelList(
          unique?.map((item, idx) => ({
            value: item?.channel,
            label: item?.channel,
          }))
        );
        // uqique product list "productName"
        const uniqueProduct = [
          ...new Map(
            arrylist.map((item) => [item["productName"], item])
          ).values(),
        ];
        setProductList(
          uniqueProduct?.map((itm) => {
            return {
              value: itm?.productName,
              label: itm?.productName,
            };
          })
        );

        const defaultProductName = uniqueProduct?.[0]?.productName
          ? {
              value: uniqueProduct?.[0]?.productName,
              label: uniqueProduct?.[0]?.productName,
            }
          : "";
        if (formikRef.current) {
          formikRef.current.setFieldValue(
            "productName",
            defaultProductName || ""
          );
        }
        filterGridDataHandler({
          values: {
            ...initData,
            productName: defaultProductName,
          },
          withoutModfifyData: resData,
        });
      }
    );
  };

  useEffect(() => {
    commonGridData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterGridDataHandler = ({ values, withoutModfifyData }) => {
    const allGridData = [...withoutModfifyData];
    const filterData = allGridData?.filter((item) => {
      const channel = item?.channel === values?.channel?.label;
      const product = item?.productName === values?.productName?.label;
      return channel && product;
    });
    setGridData(filterData);
  };

  const saveHandler = () => {
    const payload = gridData.map((item) => {
      return {
        intId: item?.intId,
        enroll: item?.enroll || "",
        customerId: item?.customerId || '',
      };
    });
    EditCDPMasterData(
      `/partner/PManagementCommonDDL/EditCDPMasterDataByEnrollId`,
      payload,
      () => {},
      true
    );
  };

  const landingCB = (values) => {
    setCompetitorPriceLandingPag(
      `/partner/PManagementCommonDDL/CDPMasterData_Rev1`,
      (resData) => {
        // setGridData(resData);
        setWithoutModfifyData(resData);
        filterGridDataHandler({
          values: { ...values },
          withoutModfifyData: resData,
        });
      }
    );
  };
  return (
    <>
      {(landingLoading || postLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title="CDP Rreport"
              saveHandler={() => {
                saveHandler();
              }}
            >
              <div className="row global-form my-3">
                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="channel"
                    options={[...channelList] || []}
                    value={values?.channel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption || "");
                      setFieldValue("productName", "");
                      setGridData([]);
                    }}
                    placeholder="Select Channel"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="productName"
                    options={[...productList] || []}
                    value={values?.productName}
                    label="Product"
                    onChange={(valueOption) => {
                      setFieldValue("productName", valueOption || "");
                      const modifyValues = {
                        ...values,
                        productName: valueOption,
                      };
                      filterGridDataHandler({
                        values: modifyValues,
                        withoutModfifyData: withoutModfifyData,
                      });
                    }}
                    placeholder="Select Product"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col d-flex align-items-end justify-content-end">
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => {
                      filterHandler({
                        values: values,
                        withoutModfifyData: withoutModfifyData,
                      });
                    }}
                  >
                    View
                  </button>
                </div> */}
              </div>

              <LandingTable
                obj={{
                  setGridData,
                  gridData,
                  landingCB: () => {
                    landingCB(values);
                  },
                }}
              />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default CDPRreportLanding;
