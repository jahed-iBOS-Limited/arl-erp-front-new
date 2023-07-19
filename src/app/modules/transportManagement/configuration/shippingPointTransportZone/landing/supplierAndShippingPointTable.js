import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { createAndUpdateSupplierByShippoint } from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";

function SupplierAndShippingPointTable({
  landingCB,
  landingSupplierByShippoint,
  setLandingSupplierByShippoint,
  paginationState,
  setPositionHandler,
  shipPointDDL,
}) {
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const [loading, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  return (
    <>
      {loading && <Loading />}
      <div className='table-responsive'>
        <table className='table table-striped table-bordered global-table'>
          <thead>
            <tr>
              <th>SL</th>
              <th>Supplier Name</th>
              <th>Ship Point Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {landingSupplierByShippoint?.data?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='text-center'> {index + 1}</td>
                  <td>{item?.supplierName}</td>
                  <td>
                    {item?.isEdit ? (
                      <>
                        {" "}
                        <NewSelect
                          name='shipPoint'
                          options={shipPointDDL || []}
                          value={
                            item?.shipPointId
                              ? {
                                  value: item?.shipPointId,
                                  label: item?.shipPointName,
                                }
                              : ""
                          }
                          onChange={(valueOption) => {
                            const copyRowDto = [
                              ...landingSupplierByShippoint?.data?.data,
                            ];
                            copyRowDto[index].shipPointId = valueOption?.value;
                            copyRowDto[index].shipPointName =
                              valueOption?.label;
                            setLandingSupplierByShippoint({
                              ...landingSupplierByShippoint,
                              data: {
                                ...landingSupplierByShippoint?.data,
                                data: [...copyRowDto],
                              },
                            });
                          }}
                          isClearable={false}
                          menuPosition='fixed'
                        />
                      </>
                    ) : (
                      item?.shipPointName
                    )}
                  </td>
                  <td className='text-center'>
                    <span>
                      {item?.isEdit ? (
                        <>
                          <button
                            type='button'
                            style={{
                              padding: "1px 6px",
                              margin: "0",
                            }}
                            className='btn btn-primary'
                            onClick={() => {
                              const payload = [
                                {
                                  id: item?.id || 0,
                                  shipPointId: item?.shipPointId || 0,
                                  supplierId: item?.supplierId || 0,
                                  unitId: selectedBusinessUnit?.value || 0,
                                  insertBy: profileData?.userId,
                                },
                              ];
                              createAndUpdateSupplierByShippoint(
                                payload,
                                setLoading,
                                () => {
                                  landingCB();
                                }
                              );
                            }}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          {" "}
                          <button
                            type='button'
                            style={{
                              padding: "1px 6px",
                              margin: "0",
                            }}
                            className='btn btn-primary'
                            onClick={() => {
                              const copyRowDto = [
                                ...landingSupplierByShippoint?.data?.data,
                              ];

                              copyRowDto[index].isEdit = true;
                              setLandingSupplierByShippoint({
                                ...landingSupplierByShippoint,
                                data: {
                                  ...landingSupplierByShippoint?.data,
                                  data: [...copyRowDto],
                                },
                              });
                            }}
                          >
                            Update
                          </button>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Code */}
      {landingSupplierByShippoint?.data?.data?.length > 0 && (
        <PaginationTable
          count={landingSupplierByShippoint?.data?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}

export default SupplierAndShippingPointTable;
