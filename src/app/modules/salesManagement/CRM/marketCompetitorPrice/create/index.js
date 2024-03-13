import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import Loading from "./../../../../_helper/_loading";
import RowTable from "./rowTable";
import {
  filterAndMapOptions,
  getUniqueGroups,
  onFilterHandler,
  onResetFilterHandler,
} from "./helper";
const initData = {
  date: _todayDate(),
  businessUnit: "",
  channel: "",
  district: "",
  policeStation: "",
  territory: "",
  group: "",
  subCategory: "",
  skuName: "",
  brandName: "",
};
export const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    label: Yup.string().required("Business Unit is required"),
    value: Yup.string().required("Business Unit is required"),
  }),
  channel: Yup.object().shape({
    label: Yup.string().required("Channel is required"),
    value: Yup.string().required("Channel is required"),
  }),
  district: Yup.object().shape({
    label: Yup.string().required("District is required"),
    value: Yup.string().required("District is required"),
  }),
  date: Yup.date().required("Date is required"),
});
const transactionTypeDDL = [
  {
    value: 1,
    label: "Cash",
  },
  {
    value: 2,
    label: "Credit",
  },
  {
    label: "Both",
    value: 3,
  },
];

function Form() {
  const { id } = useParams();
  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [rowDto, setRowDto] = React.useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useAxiosGet([]);
  const [districtDDL, setDistrictDDL] = useAxiosGet();
  const [channelList, setDDLChannelList, rowListLoading] = useAxiosGet();
  const [policeStationDDL, setPoliceStationDDL] = useAxiosGet();
  const [territoryDDL, setTerritoryDDL] = useAxiosGet();
  const [, setCompetitorProductsRowList] = useAxiosGet();
  const [, setCompetitorPriceById, loadingGetBy] = useAxiosGet();
  const [, postCreateCompetitorPrice, postLoading] = useAxiosPost();
  const [, putCompetitorPrice, putLoading] = useAxiosPut();
  const formikRef = React.useRef(null);
  const [filterType, setFilterType] = useState({
    groupList: [],
    subCategoryList: [],
    skuList: [],
    brandList: [],
  });
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (buId && accId) {
      setDistrictDDL(
        `/oms/TerritoryInfo/GetDistrictDDL?countryId=${18}&divisionId=${0}`
      );
      setDDLChannelList(`/oms/CompetitorChannel/GetDDLCompetitorChannelList`);
      setBusinessUnitDDL(
        `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=0`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    if (+id) {
      setCompetitorPriceById(
        `/oms/CompetitorPrice/GetCompetitorPriceById?PriceHeaderId=${id}`,
        (resData) => {
          if (formikRef.current) {
            formikRef.current.setValues({
              date: _dateFormatter(resData?.objHeader?.dteDate),
              businessUnit: resData?.objHeader?.intBusinessUnitId
                ? {
                    value: resData?.objHeader?.intBusinessUnitId,
                    label: resData?.objHeader?.strBusinessUnitName,
                  }
                : "",
              channel: resData?.objHeader?.intCompetitorChannelId
                ? {
                    value: resData?.objHeader?.intCompetitorChannelId,
                    label: resData?.objHeader?.strChannelName,
                  }
                : "",
              district: resData?.objHeader?.intDistrictId
                ? {
                    value: resData?.objHeader?.intDistrictId,
                    label: resData?.objHeader?.strDistrictName,
                  }
                : "",
              policeStation: resData?.objHeader?.intThanaId
                ? {
                    value: resData?.objHeader?.intThanaId,
                    label: resData?.objHeader?.strThanaName,
                  }
                : "",
              territory: resData?.objHeader?.intTerritoryId
                ? {
                    value: resData?.objHeader?.intTerritoryId,
                    label: resData?.objHeader?.strTerritoryName,
                  }
                : "",
            });
          }

          setRowDto(
            resData?.objRowList?.map((itm) => {
              const transactionType = transactionTypeDDL.find(
                (item) => item.label === itm?.strTransactionType
              );
              return {
                ...itm,
                strTransactionType: transactionType?.label || "",
                numTransactionTypeId: transactionType?.value || "",
                strDisplayName:
                  itm?.strDisplayName || itm?.strProductDisplayName || "",
              };
            })
          );

          setPoliceStationDDL(
            `/oms/TerritoryInfo/GetThanaDDL?countryId=${18}&divisionId=${0}&districtId=${
              resData?.objHeader?.intDistrictId
            }`
          );
          setTerritoryDDL(
            `/oms/TerritoryInfo/GetTerritoryList?AccountId=${accId}&BusinessUnitId=${resData?.objHeader?.intBusinessUnitId}`
          );
        }
      );
    } else {
      formikRef.current.setValues({
        ...initData,
        businessUnit: buId
          ? {
              value: buId,
              label: buName,
            }
          : "",
      });
      setTerritoryDDL(
        `/oms/TerritoryInfo/GetTerritoryList?AccountId=${accId}&BusinessUnitId=${buId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const history = useHistory();

  const saveHandler = (values, cb) => {
    // rowDto mikrate > 0 check

    if (rowDto?.length === 0)
      return toast.warn("Please add at least one product");

    const check = rowDto?.every((itm) => +itm?.numMillRate > 0);
    if (!check && values?.channel?.value !== 3)
      return toast.warn("Mill Rate must be greater than 0");

    const payload = {
      objheader: {
        intCompetitorPriceHeaderId: id || 0,
        dteDate: values?.date,
        intBusinessUnitId: values?.businessUnit?.value || 0,
        intCompetitorChannelId: values?.channel?.value || 0,
        intDistrictId: values?.district?.value || 0,
        intThanaId: values?.policeStation?.value || 0,
        intTerritoryId: values?.territory?.value || 0,
        strSalOrMkt: "Market",
        isActive: true,
        intCreatedBy: userId,
        dteServerDateTime: new Date(),
        intLastActionBy: userId,
        dteLastActionDateTime: new Date(),
      },
      objrow: rowDto.map((itm) => {
        return {
          intCompetitorPriceRowId: +itm?.intCompetitorPriceRowId || 0,
          intCompetitorPriceHeaderId: +id || 0,
          intCompetitorProductId: +itm?.intCompetitorProductId || 0,
          numMillRate: +itm?.numMillRate || 0,
          numAvgTransportFare: +itm?.numAvgTransportFare || 0,
          numLandingRate: +itm?.numLandingRate || 0,
          numLandingRateMkt: +itm?.numLandingRateMkt || 0,
          numAvgMarketOffer: +itm?.numAvgMarketOffer || 0,
          numNsp: +itm?.numNsp || 0,
          numDp: +itm?.numDp || 0,
          numTp: +itm?.numTp || 0,
          numMrp: +itm?.numMrp || 0,
          numEdp: +itm?.numEdp || 0,
          numEtp: +itm?.numEtp || 0,
          numMktRate: +itm?.numMktRate || 0,
          strMarketName: itm?.strMarketName || "",
          strDeliveryPoint: itm?.strDeliveryPoint || "",
          strTransactionType: itm?.strTransactionType || "",
          isActive: true,
          intCreatedBy: userId,
          dteServerDateTime: new Date(),
          intLastActionBy: userId,
          dteLastActionDateTime: new Date(),
          strRemarks: itm?.strRemarks || "",
        };
      }),
    };

    if (id) {
      putCompetitorPrice(
        "/oms/CompetitorPrice/EditCompetitorPrice",
        payload,
        () => {},
        true
      );
    } else {
      postCreateCompetitorPrice(
        "/oms/CompetitorPrice/CreateCompetitorPrice",
        payload,
        cb,
        true
      );
    }
  };

  const viewHandler = (values) => {
    setRowDto([]);
    onResetFilterHandler(values?.setFieldValue);
    setCompetitorProductsRowList(
      `/oms/CompetitorPrice/GetCompetitorProductsRowList?channelId=${values?.channel?.value}&businessUnitId=${values?.businessUnit?.value}`,
      (resData) => {
        setRowDto(resData);
        setAllData(resData);
        const generatedFilterType = {
          groupList: getUniqueGroups("strGroup", resData),
          subCategoryList: getUniqueGroups("strProductCategory", resData),
          skuList: getUniqueGroups("strProductSku", resData),
          brandList: getUniqueGroups("strProductBrand", resData),
        };
        setFilterType(generatedFilterType);
      }
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm();
            setRowDto([]);
          });
        }}
        validationSchema={validationSchema}
        innerRef={formikRef}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          errors,
          touched,
          resetForm,
        }) => (
          <ICustomCard
            title={`${id ? "Edit" : "Create"} Market Competitor Price`}
            backHandler={() => {
              history.goBack();
            }}
            saveHandler={() => {
              handleSubmit();
            }}
            resetHandler={() => {
              resetForm(initData);
            }}
          >
            {(postLoading || rowListLoading || loadingGetBy || putLoading) && (
              <Loading />
            )}
            <form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>
                    <b
                      style={{
                        color: "red",
                      }}
                    >
                      *
                    </b>{" "}
                    Date
                  </label>
                  <InputField
                    value={values?.date}
                    placeholder="date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      setFieldValue("territory", "");
                      setTerritoryDDL(
                        `/oms/TerritoryInfo/GetTerritoryList?AccountId=${accId}&BusinessUnitId=${valueOption?.value}`
                      );
                      viewHandler({
                        ...values,
                        businessUnit: valueOption,
                        setFieldValue,
                      });
                    }}
                    placeholder="Select Business Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="channel"
                    options={channelList || []}
                    value={values?.channel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption || "");
                      viewHandler({
                        ...values,
                        channel: valueOption,
                        setFieldValue,
                      });
                    }}
                    placeholder="Select Channel"
                    errors={errors}
                    touched={touched}
                    isDisabled={id || !values?.businessUnit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isRequiredSymbol={true}
                    name="district"
                    options={districtDDL || []}
                    value={values?.district}
                    label="District"
                    onChange={(valueOption) => {
                      setFieldValue("district", valueOption || "");
                      setFieldValue("policeStation", "");
                      setPoliceStationDDL(
                        `/oms/TerritoryInfo/GetThanaDDL?countryId=${18}&divisionId=${0}&districtId=${
                          valueOption?.value
                        }`
                      );
                    }}
                    placeholder="Select District"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 ">
                  <NewSelect
                    name="policeStation"
                    options={policeStationDDL || []}
                    value={values?.policeStation}
                    label="Police Station"
                    onChange={(valueOption) => {
                      setFieldValue("policeStation", valueOption);
                    }}
                    placeholder="Select Police Station"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 ">
                  <NewSelect
                    name="territory"
                    options={territoryDDL || []}
                    value={values?.territory}
                    label="Territory"
                    onChange={(valueOption) => {
                      setFieldValue("territory", valueOption);
                    }}
                    placeholder="Select Territory"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {!id && (
                  <div className="mt-3">
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => {
                        viewHandler({ ...values, setFieldValue });
                      }}
                      type="button"
                      disabled={!values?.channel}
                    >
                      View
                    </button>
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-lg-2">
                  <NewSelect
                    name="group"
                    options={filterAndMapOptions(allData, values, "strGroup")}
                    value={values?.group}
                    label="Group"
                    onChange={(valueOption) => {
                      setFieldValue("group", valueOption || "");
                      setFieldValue("subCategory", "");
                      setFieldValue("skuName", "");
                      setFieldValue("brandName", "");
                      onFilterHandler(
                        allData,
                        { ...values, group: { ...valueOption } },
                        setRowDto
                      );
                    }}
                    placeholder="Select Group"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="subCategory"
                    options={filterAndMapOptions(
                      allData,
                      values,
                      "strProductCategory"
                    )}
                    value={values?.subCategory}
                    label="Sub Category"
                    onChange={(valueOption) => {
                      setFieldValue("subCategory", valueOption || "");
                      setFieldValue("skuName", "");
                      setFieldValue("brandName", "");
                      onFilterHandler(
                        allData,
                        { ...values, subCategory: { ...valueOption } },
                        setRowDto
                      );
                    }}
                    placeholder="Sub Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="skuName"
                    options={filterAndMapOptions(
                      allData,
                      values,
                      "strProductSku"
                    )}
                    value={values?.skuName}
                    label="SKU Name"
                    onChange={(valueOption) => {
                      setFieldValue("skuName", valueOption || "");
                      setFieldValue("brandName", "");
                      onFilterHandler(
                        allData,
                        { ...values, skuName: { ...valueOption } },
                        setRowDto
                      );
                    }}
                    placeholder="SKU Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    name="brandName"
                    options={filterAndMapOptions(
                      allData,
                      values,
                      "strProductBrand"
                    )}
                    value={values?.brandName}
                    label="Brand Name"
                    onChange={(valueOption) => {
                      setFieldValue("brandName", valueOption || "");
                      onFilterHandler(
                        allData,
                        { ...values, brandName: { ...valueOption } },
                        setRowDto
                      );
                    }}
                    placeholder="Brand Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <RowTable
                propsObj={{
                  rowDto,
                  setRowDto,
                  values,
                  transactionTypeDDL,
                }}
              />
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}

export default Form;
