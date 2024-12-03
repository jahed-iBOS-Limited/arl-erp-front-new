import React from 'react';
import { useHistory } from 'react-router-dom';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import { toast } from 'react-toastify';
import BankDetailsModal from './BankDetailsModal';
import PaginationTable from '../../../../_helper/_tablePagination';
import PaginationSearch from '../../../../_helper/_search';
import Loading from '../../../../_helper/_loading';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';

export default function GlobalBankList() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [globalBankList, GetGlobalBankList, isLoading] = useAxiosGet();
    const [, DeleteGlobalBank, bdeleteLoading] = useAxiosPut();

    let history = useHistory();
    const [pageNo, setPageNo] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(15);

    React.useEffect(() => {
        commonLandingApi();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const commonLandingApi = (
        searchValue,
        PageNo = pageNo,
        PageSize = pageSize,
    ) => {
        GetGlobalBankList(
            `${imarineBaseUrl}/domain/ShippingService/GetGlobalBankLanding?PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ??
            ''}`,
        );

    };
    const handleDelete = (id) => {
        DeleteGlobalBank(
            `${imarineBaseUrl}/domain/ShippingService/RemoveGlobalBankById?bankId=${id}`,
            null,
            () => {
                commonLandingApi();
                toast.success('Bank Deleted Successfully');
            }
        );
    }

    return (
        <ICustomCard
            title="Bank List"
            createHandler={() => {
                history.push('/cargoManagement/configuration/globalBank/create');
            }}
            backHandler={() => {
                history.goBack();
            }}
        >
            {
                isLoading && <Loading />
            }
            <PaginationSearch
                placeholder="Search Bank"
                paginationSearchHandler={(searchValue) => {
                    commonLandingApi(searchValue, 1, 100);
                }}
            />
            <div className="col-lg-12">
                <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Bank Name</th>
                                <th>Primary Address</th>
                                <th>Country </th>
                                <th>City</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {globalBankList?.data?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.bankName}</td>
                                    <td>{item?.primaryAddress}</td>
                                    <td>{item?.country}</td>
                                    <td>{item?.city}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    history.push(
                                                        `/cargoManagement/configuration/globalBank/edit/${item?.bankId}`,
                                                    );
                                                }}
                                            >
                                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                            </button>
                                            <button
                                                className="btn btn-primary ml-2"
                                                onClick={() => {
                                                    setIsModalOpen(true);
                                                    setSelectedItem(item);
                                                }}
                                            >
                                                <i class="fa fa-eye" aria-hidden="true"></i>
                                            </button>
                                            <button
                                                className="btn btn-danger ml-2"
                                                onClick={() => {
                                                    handleDelete(item?.bankId);
                                                }}
                                            >
                                                <i class="fa fa-trash" aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                isModalOpen && <BankDetailsModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedItem={selectedItem}


                />
            }
            {globalBankList?.data?.length > 0 && (
                <PaginationTable
                    count={globalBankList?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                        commonLandingApi(null, pageNo, pageSize);
                    }}
                    paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                    }}
                />
            )}

        </ICustomCard>
    );
}
