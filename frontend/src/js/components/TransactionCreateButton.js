import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const floatingButtonStyle = {
    marginRight: 40,
    marginBottom: 40,
    position: 'fixed',
    right: 0,
    bottom: 0
};

export default class TransactionCreateButton extends Component {
    onCreate() {
        this.props.actions.createTransaction();
    }

    render() {
        return (<FloatingActionButton secondary={true} style={floatingButtonStyle} onClick={::this.onCreate}>
                <ContentAdd />
            </FloatingActionButton>
        )
    }
}
