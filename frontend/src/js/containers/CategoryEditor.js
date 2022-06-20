import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CategoryDialog from '../components/category/CategoryDialog'
import * as CategoryActions from '../actions/CategoryActions'

const mapStateToProps = (state) => {
  return {
    categoryList: state.get('category').get('categoryList'),
    open: state.get('category').get('dialog').get('open'),
    full: state.get('category').get('dialog').get('full'),
    category: state.get('category').get('dialog').get('category'),
    id: state.get('category').get('dialog').get('id')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(CategoryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog)
