import React, {Component} from 'react';
import Pagination from 'material-ui-pagination';

export default class TransactionsPagePager extends Component {
    setPage(no) {
        this.props.actions.setTransactionPage(no)
    }

    render() {
        var props = this.props;
        if (props.count ==0) {
            return <div/>
        }

        var pages = Math.ceil(props.count/props.pageSize);

        return (
            <div style = {{width: 500,margin: '0 auto',}}>
                <Pagination style={{display: 'block', margin: '0 auto'}} total={pages} current={props.pageNumber} display={10} onChange = {::this.setPage} />
            </div>
        )
    }
}
