/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getBrokerDDL,
  getCargoDDL,
  getCharterPartyDDL,
  GetPortDDL,
} from "../../helper";
import Loading from "../../_chartinghelper/loading/_loading";
import { _todayDate } from "../../_chartinghelper/_todayDate";
import {
  createVoyage,
  editVoyage,
  editVoyageTimeCharterer,
  getBusinessPartnerType,
  getVoyageById,
} from "../helper";
import Form from "./form";
import {
  previousDataMaker,
  timeChartererEditPayloadMaker,
  timeChartererSavePayloadMaker,
  voyageChartererEditPayloadMaker,
  voyageChartererSavePayloadMaker,
} from "./utils";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const date = new Date();

const initData = {
  startDate: moment(date).format("YYYY-MM-DD HH:mm"),
  completionDate: "",
  // completionDate: moment(date).format("YYYY-MM-DDTHH:mm"),
  voyageDuration: "",
  hireType: "",
  vesselName: "",
  voyageType: "",
  currentVoyageNo:"",
  chartererVoyageCode: "",
  businessPartnerName: "",
  businessPartnerType: "",
  charterName: "",
  brokerName: "",
  brokerCommission: "",
  addressCommission: "",
  startPort: "",
  endPort: "",
  cpDate: _todayDate(),
  layCanFrom: _todayDate(),
  layCanTo: _todayDate(),
  lsmgoPrice: "",
  lsifoPrice: "",
  iloch: "",
  cve30Days: "",
  dailyHire: "",
  ap: "",
  others: "",
  totalAmount: "",
  dueAmount: "",

  demurrageRate: "",
  despatchRate: "",
  deadFreightDetention: "",
  cargoName: "",

  // new fields
  freightPercentage: "",
  detention: "",

  deliveryDate: "",
  reDeliveryDate: "",
};

export default function VoyageForm() {
  const { type, id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // State For DDL
  const [vesselDDL, setVesselDDL] = useState([]);
  const [chartererDDL, setChartererDDL] = useState([]);
  const [brokerDDL, setBrokerDDL] = useState([]);
  const [cargoDDL, setCargoDDL] = useState([]);
  const [businessPartnerTypeDDL, setBusinessPartnerTypeDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);

  /* State For Row Data All */
  const [cargoList, setCargoList] = useState([]);
  const [businessPartnerGrid, setBusinessPartnerGrid] = useState([]);
  const [chartererRowData, setChartererRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [cpList, setCPList] = useState([]);
  const [currentVoyageNo, getCurrentVoyageNo, , setCurrentVoyageNo] = useAxiosGet()


  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // success popup
  const SuccessPopup = (props) => {
    const { values, resData } = props;
    return confirmAlert({
      title: "Success",
      message: resData?.message,
      buttons: [
        {
          label: "Next",
          onClick: () => {
            history.push({
              pathname: `/chartering/next/bunkerInformation`,
              state: previousDataMaker(values, resData),
            });
          },
        },
      ],
      closeOnClickOutside: false,
    });
  };

  /* Fetch DDL */
  useEffect(() => {
    getBusinessPartnerType(setBusinessPartnerTypeDDL);
    GetPortDDL(setPortDDL);
    getCharterPartyDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChartererDDL
    );
    getCargoDDL(setCargoDDL);
    getBrokerDDL(setBrokerDDL);
    getByIdCalled();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, id]);

  const getByIdCalled = () => {
    if (id) {
      getVoyageById(
        id,
        setSingleData,
        setChartererRowData,
        setBusinessPartnerGrid,
        setLoading
      );
    }
  };

  /* Save Handler */
  const saveHandler = (values, cb) => {
    if (!id) {
      /* Create Part */
      if(currentVoyageNo && +values?.currentVoyageNo < +currentVoyageNo){
        return toast.warn(`You cann't input less than ${currentVoyageNo}`)
       }
      let payload;
      if (values?.voyageType?.value === 1) {
        payload = timeChartererSavePayloadMaker(
          values,
          chartererRowData,
          businessPartnerGrid,
          profileData,
          selectedBusinessUnit,
          uploadedFile
        );
      } else {
        if (chartererRowData?.length === 0) {
          toast.warning("Please add at least one charterer");
          return;
        }
        payload = voyageChartererSavePayloadMaker(
          values,
          chartererRowData,
          businessPartnerGrid,
          profileData,
          selectedBusinessUnit,
          cpList
        );
      }
      // SuccessPopup({
      //   values,
      //   resData: { message: "voyage no 3", voyageId: 70, voyageNo: "1" },
      // });
      createVoyage(payload, setLoading, (resData) => {
        cb();
        SuccessPopup({ values, resData });
      });
    } else {
      /* Edit Part */
      let payload;
      if (values?.voyageType?.value === 1) {
        payload = timeChartererEditPayloadMaker(
          +id,
          values,
          chartererRowData,
          businessPartnerGrid,
          profileData,
          selectedBusinessUnit,
          uploadedFile
        );
        editVoyageTimeCharterer(payload, setLoading);
      } else {
        if (chartererRowData?.length === 0) {
          toast.warning("Please add at least one charterer");
          return;
        }
        if(currentVoyageNo && +values?.currentVoyageNo < +currentVoyageNo){
          return toast.warn(`You cann't input less than ${currentVoyageNo}`)
         }
        payload = voyageChartererEditPayloadMaker(
          +id,
          values,
          chartererRowData,
          businessPartnerGrid,
          profileData,
          selectedBusinessUnit
        );
        editVoyage(payload, setLoading);
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "view"
            ? "View Voyage"
            : type === "edit"
            ? "Edit Voyage"
            : "Create Voyage"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        getByIdCalled={getByIdCalled}
        /* DDL */
        vesselDDL={vesselDDL}
        chartererDDL={chartererDDL}
        brokerDDL={brokerDDL}
        setLoading={setLoading}
        setVesselDDL={setVesselDDL}
        cargoDDL={cargoDDL}
        portDDL={portDDL}
        businessPartnerTypeDDL={businessPartnerTypeDDL}
        /* Row Data */
        cargoList={cargoList}
        setCargoList={setCargoList}
        businessPartnerGrid={businessPartnerGrid}
        setBusinessPartnerGrid={setBusinessPartnerGrid}
        chartererRowData={chartererRowData}
        setChartererRowData={setChartererRowData}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        setCPList={setCPList}
        cpList={cpList}
        currentVoyageNo={currentVoyageNo}
        getCurrentVoyageNo={getCurrentVoyageNo}
        setCurrentVoyageNo={setCurrentVoyageNo}
      />
    </>
  );
}
