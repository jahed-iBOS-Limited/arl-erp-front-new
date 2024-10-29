import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { imarineBaseUrl } from "../../../../App";
import { toast } from "react-toastify";

const AdjustmentJournalCreate = ({ objProps }) => {
  // destructure
  const {
    createAJSignleItem,
    setCreateAJModalShow,
    setCreateAJSignleItem,
  } = objProps;

  // destructure single item
  const { voyageNo, vesselName } = createAJSignleItem;

  // redux
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // api action
  const [
    netAndJournalAmount,
    getNetAndJournalAmount,
    getNetAndJournalAmountLoading,
  ] = useAxiosGet();

  const [, createVesselWiseAJ, createVesselWiseAJLoading] = useAxiosPost();

  // decide loading
  const isLoading = getNetAndJournalAmountLoading || createVesselWiseAJLoading;

  // inital use effect
  useEffect(() => {
    getNetAndJournalAmount(
      `${imarineBaseUrl}/domain/Report/GetNetIncomeAndFetchJournalAmount?VesselName=${vesselName}&VoyageNo=${voyageNo}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handleCreateVesselWiseAJ
  const handleCreateVesselWiseAJ = () => {
    createVesselWiseAJ(
      `${imarineBaseUrl}/domain/Report/VesselWiseAdjustmentJournal?businessUnitId=${selectedBusinessUnit?.value}&VesselName=${vesselName}&VoyageNo=${voyageNo}&ActionBy=${profileData?.userId}`,
      "",
      function(res) {
        const statusCode = res?.[0]?.statusCode;
        const statusMessage = res?.[0]?.message;
        if (statusCode === 200) {
          setCreateAJModalShow(false);
          setCreateAJSignleItem({});
          toast.success(statusMessage);
        }
        if (statusCode === 500) {
          setCreateAJModalShow(false);
          setCreateAJSignleItem({});
          toast.warn(statusMessage);
        }
      }
    );
  };

  console.log(netAndJournalAmount);

  return (
    <Formik enableReinitialize={true} initialValues={{}}>
      {() => (
        <ICustomCard
          title="Create Adjustment Journal"
          saveHandler={handleCreateVesselWiseAJ}
        >
          {isLoading && <Loading />}
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                {netAndJournalAmount.length > 0 ? (
                  <table className="table table-striped table-bordered mt-1 bj-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Vessel Name</th>
                        <th>Net Income</th>
                        <th>Journal Amount</th>
                        <th>Actual Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {netAndJournalAmount?.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.vesselName}</td>
                          <td className="text-right">
                            {_formatMoney(item?.netIncome, 4)}
                          </td>
                          <td className="text-right">
                            {_formatMoney(item?.journalAmount, 4)}
                          </td>
                          <td className="text-right">
                            {_formatMoney(
                              item?.netIncome - item?.journalAmount,
                              4
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </ICustomCard>
      )}
    </Formik>
  );
};

export default AdjustmentJournalCreate;
