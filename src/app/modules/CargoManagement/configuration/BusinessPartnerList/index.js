import React from 'react';
import ICustomCard from '../../../_helper/_customCard';
import AssigneeModal from './AssigneeModal';

export default function BusinessPartnerList() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <ICustomCard
      title="Consignee’s/Buyer Assign"
      // createHandler={() => {
      //   history.push('/cargoManagement/configuration/assign/create');
      // }}
      renderProps={() => {
        return (
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="ml-2 btn btn-primary"
            title="Assignee"
            // startIcon={<i class="fa fa-user-plus" aria-hidden="true"></i>}
          >
            <i class="fa fa-user-plus" aria-hidden="true"></i>
          </button>
        );
      }}
    >
      {isModalOpen && (
        <AssigneeModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </ICustomCard>
  );
}
