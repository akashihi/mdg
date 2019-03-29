import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CategoryDialog from '../components/CategoryDialog'
import * as CategoryActions from '../actions/CategoryActions'


const mapStateToProps = (state) => {
    return {
        categoryList: state.category.get('categoryList'),
        open: state.category.get('dialog').get('open'),
        full: state.category.get('dialog').get('full'),
        category: state.category.get('dialog').get('category'),
        valid: state.category.get('dialog').get('valid'),
        errors: state.category.get('dialog').get('errors')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(CategoryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog)
