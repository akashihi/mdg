import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CategoryDialog from '../components/CategoryDialog'
import * as CategoryActions from '../actions/CategoryActions'


const mapStateToProps = (state) => {
    return {
        categoryList: state.category.categoryList,
        open: state.category.dialog.open,
        full: state.category.dialog.full,
        category: state.category.dialog.category,
        valid: state.category.dialog.valid,
        errors: state.category.dialog.errors
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(CategoryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog)
