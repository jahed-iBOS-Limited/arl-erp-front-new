import React from 'react';
import InputField from '../../../../_helper/_inputField';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import { Button } from 'react-bootstrap';

const SalesCommissionConfigureFormTable = ({ obj }) => {
  const { rowData, setRowData, values, akijAgroFeedCommissionTypeList } = obj;

  const rowDataHandler = (index, name, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  return (
    <div>
      {[
        15, 19,
        // 22
      ].includes(values?.commissionType?.value) && (
        <TableOne
          obj={{ selectedAll, allSelect, rowData, rowDataHandler, setRowData }}
        />
      )}
      {[14, 16, 20, 23].includes(values?.commissionType?.value) && (
        <TableTwo
          obj={{ selectedAll, allSelect, rowData, rowDataHandler, setRowData }}
        />
      )}
      {[
        17,
        18,
        25,
        27,
        22,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        52,
        ...akijAgroFeedCommissionTypeList,
      ].includes(values?.commissionType?.value) && (
        <TableThree
          obj={{
            selectedAll,
            allSelect,
            rowData,
            rowDataHandler,
            values,
            setRowData,
          }}
        />
      )}
    </div>
  );
};

export default SalesCommissionConfigureFormTable;

const TableOne = ({ obj }) => {
  const { selectedAll, allSelect, rowData, rowDataHandler, setRowData } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: '30px' }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th style={{ width: '40px' }}>SL</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
              <th>CA Rate/Bag</th>
              {/* <th>Sales Qty</th>
            <th>Rate/bag</th>
            <th>Commission</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, 'isSelected', !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>{item?.areaName}</td>
                  <td>
                    <InputField
                      value={item?.bpcommissionRate}
                      name="bpcommissionRate"
                      placeholder="BP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'bpcommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.bacommissionRate}
                      name="bacommissionRate"
                      placeholder="BA"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'bacommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cpcommissionRate}
                      name="cpcommissionRate"
                      placeholder="CP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'cpcommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cacommissionRate}
                      name="cacommissionRate"
                      placeholder="CP"
                      type="number"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'cacommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() => {
                          const prv = [...rowData];
                          const filtered = prv.filter((_, i) => i !== index);
                          setRowData(filtered);
                        }}
                        color="error"
                        size="small"
                        title="Remove"
                      >
                        <IDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const TableTwo = ({ obj }) => {
  const { selectedAll, allSelect, rowData, rowDataHandler, setRowData } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: '30px' }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th style={{ width: '40px' }}>SL</th>
              <th>Date</th>
              <th>Area Name</th>
              <th>BP Rate/bag</th>
              <th>BA Rate/bag</th>
              <th>CP Rate/bag</th>
              <th>CA Rate/Bag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, 'isSelected', !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  <td>
                    <InputField
                      value={item?.commissionDate}
                      name="commissionDate"
                      placeholder="Commission Date"
                      type="date"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'commissionDate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>{' '}
                  <td>{item?.areaName}</td>
                  <td>
                    <InputField
                      value={item?.bpcommissionRate}
                      name="bpcommissionRate"
                      placeholder="BP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'bpcommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.bacommissionRate}
                      name="bacommissionRate"
                      placeholder="BA"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'bacommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cpcommissionRate}
                      name="cpcommissionRate"
                      placeholder="CP"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'cpcommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.cacommissionRate}
                      name="cacommissionRate"
                      placeholder="CA"
                      type="number"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          'cacommissionRate',
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() => {
                          const prv = [...rowData];
                          const filtered = prv.filter((_, i) => i !== index);
                          setRowData(filtered);
                        }}
                        color="error"
                        size="small"
                        title="Remove"
                      >
                        <IDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const TableThree = ({ obj }) => {
  const {
    selectedAll,
    allSelect,
    rowData,
    rowDataHandler,
    values,
    setRowData,
  } = obj;
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: '30px' }}
                rowSpan={2}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              <th rowSpan={2} style={{ width: '40px' }}>
                SL
              </th>
              {[46].includes(values?.commissionType?.value) && (
                <th rowSpan={2}>Business Partner</th>
              )}
              <th rowSpan={2}>Area Name</th>
              {[52].includes(values?.commissionType?.value) && (
                <th rowSpan={2}>Item Name</th>
              )}
              <th colSpan={2}>Achievement</th>
              <th colSpan={2}>Quantity</th>
              {![35, 36, 37, 38, 39, 40, 46, 43, 52].includes(
                values?.commissionType?.value
              ) && (
                <>
                  <th rowSpan={2}>BP Rate/bag</th>
                  <th rowSpan={2}>BA Rate/bag</th>
                  <th rowSpan={2}>CP Rate/bag</th>
                  <th rowSpan={2}>CA Rate/Bag</th>
                </>
              )}
              {[43].includes(values?.commissionType?.value) && (
                <th rowSpan={2}>Customer Type</th>
              )}
              {[35, 36, 37, 38, 39, 40, 46, 43, 52].includes(
                values?.commissionType?.value
              ) && <th rowSpan={2}>Common Rate</th>}

              {/* <th>1-99%</th>
              <th>100-999%</th>
              <th> {">"}999% </th> */}
              <th rowSpan={2}>Actions</th>
            </tr>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td
                    onClick={() => {
                      rowDataHandler(index, 'isSelected', !item.isSelected);
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                  <td> {index + 1}</td>
                  {[46].includes(values?.commissionType?.value) && (
                    <td>{item?.customerName}</td>
                  )}
                  <td>{item?.areaName}</td>
                  {[52].includes(values?.commissionType?.value) &&
                    item?.itemName}
                  <td>{item?.achievementFrom}</td>
                  <td>{item?.achievementTo}</td>
                  <td>{item?.offerQntFrom}</td>
                  <td>{item?.offerQntTo}</td>
                  {![35, 36, 37, 38, 39, 40, 46, 43, 52].includes(
                    values?.commissionType?.value
                  ) && (
                    <>
                      <td>
                        <InputField
                          value={item?.bpcommissionRate}
                          name="bpcommissionRate"
                          placeholder="BP"
                          type="text"
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              'bpcommissionRate',
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.bacommissionRate}
                          name="bacommissionRate"
                          placeholder="BA"
                          type="text"
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              'bacommissionRate',
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.cpcommissionRate}
                          name="cpcommissionRate"
                          placeholder="CP"
                          type="text"
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              'cpcommissionRate',
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={item?.cacommissionRate}
                          name="cacommissionRate"
                          placeholder="CA"
                          type="number"
                          onChange={(e) => {
                            rowDataHandler(
                              index,
                              'cacommissionRate',
                              e?.target?.value
                            );
                          }}
                        />
                      </td>
                    </>
                  )}
                  {[43].includes(values?.commissionType?.value) && (
                    <td>{item?.customerPartyStatusLabel}</td>
                  )}

                  {[35, 36, 37, 38, 39, 40, 46, 43, 52].includes(
                    values?.commissionType?.value
                  ) && (
                    <td>
                      <InputField
                        value={item?.commissionRate}
                        name="commissionRate"
                        placeholder="Commission Rate"
                        type="text"
                        onChange={(e) => {
                          rowDataHandler(
                            index,
                            'commissionRate',
                            e?.target?.value
                          );
                        }}
                      />
                    </td>
                  )}

                  {/* <td>
                    <InputField
                      value={item?.firstSlabCommissionRate}
                      name="firstSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "firstSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.secondSlabCommissionRate}
                      name="secondSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "secondSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={item?.thirdSlabCommissionRate}
                      name="thirdSlabCommissionRate"
                      type="text"
                      onChange={(e) => {
                        rowDataHandler(
                          index,
                          "thirdSlabCommissionRate",
                          e?.target?.value
                        );
                      }}
                    />
                  </td> */}

                  <td>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() => {
                          const prv = [...rowData];
                          const filtered = prv.filter((_, i) => i !== index);
                          setRowData(filtered);
                        }}
                        color="error"
                        size="small"
                        title="Remove"
                      >
                        <IDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
