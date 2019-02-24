import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CategoryViewerWidget from '../components/CategoryViewerWidget'
import * as CategoryActions from '../actions/CategoryActions'


const mapStateToProps = (state) => {
    return {
        categoryList: state.category.categoryList,
        loading: state.category.ui.categoryListLoading,
        error: state.category.ui.categoryListError,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(CategoryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryViewerWidget)
