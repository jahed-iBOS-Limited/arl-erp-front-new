import { SaveOutlined } from '@material-ui/icons';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import IConfirmModal from '../../../../_helper/_confirmModal';
import NewSelect from '../../../../_helper/_select';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

export default function BusinessPartnerGroupLandingTable({ obj }) {
  const { rowData, businessPartnerGroup, setRowData } = obj;
  const [, handleBusinessPartnerGroupUpdate] = useAxiosPost();
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  return (
    <>
      {rowData?.data?.data?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>SL</th>
                <th>Partner Name</th>
                <th>Partner Group</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.data?.data?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item?.businessPartneName}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <NewSelect
                        isClearable={false}
                        options={businessPartnerGroup || []}
                        value={{
                          value: item?.businessPartnerGroupId,
                          label: item?.businessPartnerGroupName,
                        }}
                        onChange={(valueOption) => {
                          const modifyData = { ...rowData };
                          modifyData['data']['data'][i][
                            'businessPartnerGroupId'
                          ] = valueOption?.value;
                          modifyData['data']['data'][i][
                            'businessPartnerGroupName'
                          ] = valueOption?.label;
                          setRowData(modifyData);
                        }}
                      />
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">Update</Tooltip>}
                      >
                        <SaveOutlined
                          onClick={() => {
                            IConfirmModal({
                              title: 'Update Business Partner Group',
                              message:
                                'Are you sure, You want to update business partner group ?',
                              yesAlertFunc: () => {
                                const payload = {
                                  autoId: item?.autoId,
                                  businessPartnerGroupId:
                                    item?.businessPartnerGroupId,
                                  businessPartnerGroupName:
                                    item?.businessPartnerGroupName,
                                  actionBy: profileData?.userId,
                                  isActive: item?.isActive,
                                  updateBy: profileData?.userId,
                                };
                                handleBusinessPartnerGroupUpdate(
                                  `/partner/BusinessPartnerBasicInfo/UpdateBusinessPartnerGroup`,
                                  payload,
                                  null,
                                  true,
                                );
                              },
                              noAlertFunc: () => {},
                            });
                          }}
                          role="button"
                          className="bg-primary text-white p-1 ml-2 rounded"
                        />
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
