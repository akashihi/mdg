import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

export default class TransactionsPagePager extends Component {
    render() {
        var props = this.props;

        var nextAction = props.nextAction;

        if (props.nextPageAvailable) {
            return <IconButton style={{display: 'block', margin: '0 auto'}} onClick={() => nextAction()}><FontIcon className='material-icons'>file_download</FontIcon></IconButton>
        } else {
            return <div>No more pages to load</div>
        }
    }
}
