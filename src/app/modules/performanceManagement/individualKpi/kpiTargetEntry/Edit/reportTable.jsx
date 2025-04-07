import React from 'react';
import PmsCommonTable from '../../../_helper/pmsCommonTable/PmsCommonTable';

export default function KpiReportTable({ report }) {
  return (
    <PmsCommonTable
      ths={[
        { name: 'BSC' },
        { name: 'Objective' },
        { name: 'KPI' },
        { name: 'SRF' },
        { name: 'Weight' },
        { name: 'Benchmark' },
        { name: 'Target' },
        { name: 'Achievement' },
        { name: 'Progress' },
      ]}
    >
      {report?.infoList?.map((itm, indx) => (
        <>
          {itm.dynamicList.map((item, index) => (
            <tr>
              {index === 0 && (
                <td
                  className={`bsc bsc${indx}`}
                  rowspan={itm.dynamicList.length}
                >
                  <div>{itm?.bsc}</div>
                </td>
              )}
              {item?.isParent && (
                <td className="obj" rowspan={item?.numberOfChild}>
                  {' '}
                  {item?.parentName}{' '}
                </td>
              )}
              <td> {item?.label} </td>
              <td> {item?.strFrequency} </td>
              <td> {item?.numWeight} </td>
              <td> {item?.benchmark} </td>
              <td> {item?.numTarget} </td>
              <td> {item?.numAchivement} </td>
              <td>
                {indx !== report?.infoList.length - 1 && (
                  <div className="text-right">
                    {item?.progress}%{' '}
                    <i
                      className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                    ></i>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </>
      ))}
    </PmsCommonTable>
  );
}
