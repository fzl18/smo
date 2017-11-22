import React from 'react';
import List from './List';
import Filter from './Filter';
import CreateModal from './CreateModal';
import PreviewModal from './PreviewModal';
import './style/list.less';

class Daily extends React.Component {

    showPreviewModal = id => {
        this.refs.previewModalRef.show(id);
        console.log(this.refs.previewModalRef)
    }

    showCreateModal = id => {
        this.refs.createModalRef.show(id);
    }

    reload = () => {
        this.refs.listRef.reload();
    }

    render() {
        return (
            <div className="content-inner">
                <Filter
                    showCreateModal={this.showCreateModal}
                />
                <div className="content">
                    <List
                        showPreviewModal={this.showPreviewModal}
                        showUpdateModal={this.showCreateModal}
                        ref="listRef"
                    />
                </div>
                <PreviewModal ref="previewModalRef" />
                <CreateModal
                    ref="createModalRef"
                    reload={this.reload}
                />
            </div>
        );
    }
}

export default Daily;
