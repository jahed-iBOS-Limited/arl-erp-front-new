/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import ShipToPartyTargetLandingForm from "./form";
import ShipToPartyTargetLandingTable from "./table";

const initData = {
  type: "",
  month: "",
  year: "",
};

const ShipToPartyTargetLanding = () => {
  const history = useHistory();
  const [loading] = useState(false);
  const [rowData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  //   const {
  //     profileData: { accountId: accId, userId },
  //     selectedBusinessUnit: { value: buId },
  //   } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title="Ship To Party Target"
              isCreteBtn={true}
              createHandler={() => {
                history.push(
                  "/sales-management/report/shiptopartnertarget/entry"
                );
              }}
            >
              {loading && <Loading />}
              <ShipToPartyTargetLandingForm
                obj={{ values, setFieldValue, getData, pageNo, pageSize }}
              />
              <ShipToPartyTargetLandingTable
                obj={{
                  pageNo,
                  values,
                  rowData,
                  getData,
                  pageSize,
                  setPageNo,
                  setPageSize,
                }}
              />
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ShipToPartyTargetLanding;
