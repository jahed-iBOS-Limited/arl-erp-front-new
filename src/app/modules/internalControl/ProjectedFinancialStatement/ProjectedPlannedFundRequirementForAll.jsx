import React, { useEffect, useState } from "react";
import numberWithCommas from "../../_helper/_numberWithCommas";

const ProjectedPlannedFundRequirementForAll = ({ rowData }) => {
  const [listData, setListData] = useState({
    typeOne: [],
    typeTwo: [],
    typeThree: [],
  });
  const [tableHeader, setTableHeader] = useState([]);

  useEffect(() => {
    //prepare table header
    const prepareTableHeader = (data) => {
      let tableHeaderList = [];
      if (rowData.length > 0 && data.length > 0) {
        const str = data[0]?.dynamicColumnListForMap;
        tableHeaderList = str?.length ? str?.split("$") : [];
      }
      return tableHeaderList;
    };
    if (rowData.length > 0) setTableHeader(prepareTableHeader(rowData));
  }, [rowData]);

  useEffect(() => {
    if (rowData?.length) {
      const data = {
        typeOne: rowData?.filter((item) => item?.TypeId === 1),
        typeTwo: rowData?.filter((item) => item?.TypeId === 2),
        typeThree: rowData?.filter((item) => item?.TypeId === 3),
      };

      setListData(data);
    }
  }, [rowData]);

  //Dynamic colum Renderer
  const renderDynamicColum = (header, item) => {
    let content;
    if (header?.length > 0) {
      content = header?.map((title) => (
        <td className="text-center">
          {numberWithCommas(Math.round(item[title]) || 0)}
        </td>
      ));
    }
    return content;
  };

  const calculateColSumByTitleFromList = (title, list) => {
    return Math.round(list.reduce((acc, curr) => acc + curr?.[title], 0) || 0);
  };

  //calculate and render column sum
  const renderCalculatedColumnSum = ({ header, list }) => {
    const cols = header?.length;
    let content;
    if (cols > 0) {
      content = header.map((title) => (
        <td className="text-center">
          {numberWithCommas(
            Math.round(list.reduce((acc, curr) => acc + curr?.[title], 0) || 0)
          )}
        </td>
      ));
    }
    return content;
  };

  //render net working capital sum
  const renderNetWorkingCapitalSum = (listOne, listTwo, header) => {
    let content;
    content = header.map((title) => {
      return (
        <td className="text-center">
          {numberWithCommas(
            calculateColSumByTitleFromList(title, listOne) -
              calculateColSumByTitleFromList(title, listTwo)
          )}
        </td>
      );
    });
    return content;
  };

  return (
    <div>
      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Working Capital/ Short-Term Loan Requirement</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <div className="loan-scrollable-table employee-overall-status">
              <div
                style={{ maxHeight: "600px" }}
                className="scroll-table _table"
              >
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Particulars</th>
                        {/* Dynamic table col start */}
                        {tableHeader?.length > 0 &&
                          tableHeader.map((title) => (
                            <th style={{ minWidth: "130px" }}>{title}</th>
                          ))}
                        {/* Dynamic table col end */}
                      </tr>
                    </thead>
                    <tbody>
                      {listData?.typeOne?.length > 0 &&
                        listData?.typeOne?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {item?.strGeneralLedgerCode}
                            </td>
                            <td>{item?.strGeneralLedgerName}</td>
                            {renderDynamicColum(tableHeader, item)}
                          </tr>
                        ))}
                      {listData?.typeOne?.length > 0 && (
                        <tr>
                          <td colSpan={2} className="text-center">
                            <strong> Total Current Assest (a)</strong>
                          </td>
                          {renderCalculatedColumnSum({
                            header: tableHeader,
                            list: listData?.typeOne,
                          })}
                        </tr>
                      )}

                      {listData?.typeTwo?.length > 0 &&
                        listData?.typeTwo?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">
                              {item?.strGeneralLedgerCode}
                            </td>
                            <td>{item?.strGeneralLedgerName}</td>
                            {renderDynamicColum(tableHeader, item)}
                          </tr>
                        ))}
                      {listData?.typeTwo?.length > 0 && (
                        <tr>
                          <td colSpan={2} className="text-center">
                            <strong> Total Current Liabibility (b)</strong>
                          </td>

                          {renderCalculatedColumnSum({
                            header: tableHeader,
                            list: listData?.typeTwo,
                          })}
                        </tr>
                      )}
                      {listData?.typeTwo?.length > 0 && (
                        <tr>
                          <td colSpan={2} className="text-center">
                            <strong>
                              Net Working Capital/STL Requirement (c)
                            </strong>
                          </td>
                          {renderNetWorkingCapitalSum(
                            listData?.typeOne,
                            listData?.typeTwo,
                            tableHeader
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProjectedPlannedFundRequirementForAll;
