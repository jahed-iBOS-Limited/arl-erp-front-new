import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import * as Yup from "yup";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../../_helper/_todayDate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import ScrapusedCreateForm from "./form";
import { useLocation, useParams } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  date: "",
  shift: "",
  // grade: "",
  // forignScrap: "",
  // hundredSuper: "",
  // castIron: "",
  // hardScrap: "",
  // railwayWheel: "",
  // mediumSuper: "",
  // msBabri: "",
  // tinBundle: "",
  // spongeIron: "",
  // scapAvgGrade: "",
  // total: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  shift: Yup.object()
    .shape({
      label: Yup.string().required("Shift is required"),
      value: Yup.string().required("Shift is required"),
    })
    .typeError("Shift is required"),
});

export default function ScrapusedCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, saveData] = useAxiosPost();
  const [modifyData, setModifyData] = useState(null);
  const [total, setTotal] = useState(0);
  const params = useParams();
  const location = useLocation();

  const [numberInfo, setNumberInfo] = useState({
    scapAvgGrade: "",
    spongeIron: "",
    tinBundle: "",
    msBabri: "",
    mediumSuper: "",
    railwayWheel: "",
    hardScrap: "",
    castIron: "",
    hundredSuper: "",
    forignScrap: "",
    grade: "",
  });

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (params?.id) {
      setNumberInfo({
        scapAvgGrade: location?.state?.numScrapAvgGrade,
        spongeIron: location?.state?.numSpongeIron,
        tinBundle: location?.state?.numTinBundle,
        msBabri: location?.state?.numMsbabri,
        mediumSuper: location?.state?.numMediumSuper,
        railwayWheel: location?.state?.numRailwayWheel,
        hardScrap: location?.state?.numHardScrap,
        castIron: location?.state?.numCastIron,
        hundredSuper: location?.state?.num100Super,
        forignScrap: location?.state?.numForeignScrap,
        grade: location?.state?.numAgrade,
      });
      setTotal(location?.state?.numTotalPercent);
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        shift: {
          value: location?.state?.strShift,
          label: location?.state?.strShift,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const saveHandler = async (values, setFieldValue, cb) => {
    saveData(
      `/mes/MSIL/CreateEditMSIL`,
      {
        meltingScrapUsedPercentage: {
          intAutoId: params?.id ? params?.id : 0,
          strShift: values?.shift?.label,
          dteDate: values?.date,
          numAgrade: +numberInfo?.grade || 0,
          numForeignScrap: +numberInfo?.forignScrap || 0,
          num100Super: +numberInfo?.hundredSuper || 0,
          numCastIron: +numberInfo?.castIron || 0,
          numHardScrap: +numberInfo?.hardScrap || 0,
          numRailwayWheel: +numberInfo?.railwayWheel || 0,
          numScrapAvgGrade: +numberInfo?.scapAvgGrade || 0,
          numMediumSuper: +numberInfo?.mediumSuper || 0,
          numMsbabri: +numberInfo?.msBabri || 0,
          numTinBundle: +numberInfo?.tinBundle || 0,
          numSpongeIron: +numberInfo?.spongeIron || 0,
          numTotalPercent: total,
          intInsertBy: profileData?.userId,
          dteInsertDateTime: _todayDate(),
          isActive: true,
        },
      },
      !params?.id &&
        (() => {
          setNumberInfo({
            scapAvgGrade: "",
            spongeIron: "",
            tinBundle: "",
            msBabri: "",
            mediumSuper: "",
            railwayWheel: "",
            hardScrap: "",
            castIron: "",
            hundredSuper: "",
            forignScrap: "",
            grade: "",
          });
          setTotal(0);
          cb();
        }),
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title={
        params?.id
          ? "Edit Scrapused Used Entry From"
          : "Scrapused Used Entry From"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <ScrapusedCreateForm
        {...objProps}
        initData={params?.id ? modifyData : initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        validationSchema={validationSchema}
        total={total}
        setTotal={setTotal}
        numberInfo={numberInfo}
        setNumberInfo={setNumberInfo}
        id={params?.id}
      />
    </IForm>
  );
}
