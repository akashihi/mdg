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
        id: state.category.get('dialog').get('id')
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(CategoryActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog)
