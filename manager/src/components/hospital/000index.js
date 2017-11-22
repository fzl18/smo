// hospital
import React from 'react';
import List from './list';
import Filter from './Filter';
import CreateModal from './CreateModal';
import EditModal from './EditModal';


class Hospital extends React.Component {
    showEditModal = id => {
        this.refs.editModalRef.show(id);
    }

    showCreateModal = () => {
        this.refs.createModalRef.show();
    }
    render() {
        return (
            <div className="content-inner content">
                <Filter
                    showCreateModal={this.showCreateModal}
                />
                <List
                    showEditModal={this.showEditModal}
                />
                <CreateModal ref="createModalRef" />
                <EditModal ref="editModalRef" />
            </div>
        );
    }
}

export default Hospital;