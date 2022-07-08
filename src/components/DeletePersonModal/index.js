import React from 'react';

//Component
import TailwindModalDialog from '../TailwindModalDialog';
import Icon from "../Icon";

const DeletePersonModal = ({
    showDeleteModal,
    setShowDeleteModal,
    handleDelete,
    choosenPerson,
    loading
}) => {
    return (
        <TailwindModalDialog
            title="Delete Person"
            content={getContentForDelete(choosenPerson)}
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            handleAction={handleDelete}
            loading={loading}
        />
    )
}

//Delete Modal content
const getContentForDelete = (choosenPerson) => {
    return (
      <>
        {choosenPerson && (
          <>
            <p className="text-delete-info"> Are you sure you want to permanently delete <strong> {`${choosenPerson.firstName} ${choosenPerson.lastName}`} </strong> from your tree? </p>
            <div className="text-sm flex">
             <div className="icon-link"><Icon type="link-to" id="link-to"/></div>
              Links to photos, stories, and other content will also be removed.</div>
          </>
        )}
      </>
    )
  }

  export default DeletePersonModal;

