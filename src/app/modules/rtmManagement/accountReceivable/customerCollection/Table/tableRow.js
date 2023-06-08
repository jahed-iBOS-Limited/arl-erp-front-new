import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";

// eslint-disable-next-line no-unused-vars
import { getGridData, createCustomerCollection } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { SearchForm } from "./form";

import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [, setValues] = useState({});

  //paginationState
  const [pageNo] = React.useState(0);
  const [pageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler

  const dataHandler = (name, value, sl) => {
    const xData = [...gridData.data];
    xData[sl][name] = value;
    setGridData({ ...gridData, data: xData });
  };

  const saveHandler = () => {
    const objRow = gridData?.data?.map((item) => ({
      accountId: profileData.accountId,
      businessUnitId: selectedBusinessUnit.value,
      partnerAutoId: item.partnerAutoId,
      partnerId: item.partnerId,
      collectionDate: item.collectionDate,
      numAmount: +item.numAmount,
      narration: item.comments || "",
      isReceived: item.isReceived,
      intActionBy: profileData.userId,
    }));

    const payload = objRow?.filter((item) => item?.isReceived);
    if (payload?.length > 0) {
      createCustomerCollection(payload, setLoading);
    } else {
      toast.warning("Please add at least one item select");
    }
  };

  return (
    <>
      <ICustomCard
        title='Customer Collection'
        renderProps={() => (
          <>
            <button
              onClick={saveHandler}
              type='button'
              className='btn btn-primary'
            >
              Save
            </button>
          </>
        )}
      >
        <SearchForm
          onSubmit={(values) => {
            setValues(values);
            getGridData(
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading,
              pageNo,
              pageSize
            );
          }}
        />

        {/* Table Start */}
        <div className='row cash_journal'>
          {loading && <Loading />}
          <div className='col-lg-12 pr-0 pl-0'>
            <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing'>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Check Box</th>
                  <th>Collection Date</th>
                  <th>Business Partner Name</th>
                  <th>Amount</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    {/* key={item.businessUnitId} */}
                    <td calssName='text-center'> {item?.sl}</td>
                    <td className='text-center'>
                      <div calssName='text-center pl-5'>
                        <input
                          type='checkbox'
                          checked={item?.isReceived}
                          name=''
                          id=''
                          onChange={(e) => {
                            dataHandler("isReceived", e.target.checked, index);
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className='pl-2 text-center'>
                        {_dateFormatter(item?.collectionDate)}
                      </div>
                    </td>
                    <td>
                      <div className='pl-2'>{item?.businessPartnerName}</div>
                    </td>
                    <td>
                      {/* <div className="pr-2 text-right">{item?.numAmount}</div> */}
                      <input
                        type='number'
                        class='form-control'
                        value={item?.numAmount || ""}
                        onChange={(e) => {
                          dataHandler("numAmount", e.target.value, index);
                        }}
                        placeholder='Amount'
                        min='0'
                      />
                    </td>

                    <td>
                      <div className='pl-2'>
                        <input
                          type='text'
                          class='form-control'
                          value={item?.comments || ""}
                          onChange={(e) => {
                            dataHandler("comments", e.target.value, index);
                          }}
                          placeholder='Comments'
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              values={values}
            />
          )} */}
        </div>
      </ICustomCard>
    </>
  );
}
