import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CategoryViewerWidget from '../components/category/CategoryViewerWidget'
import * as CategoryActions from '../actions/CategoryActions'

const mapStateToProps = (state) => {
  return {
    categoryList: state.get('category').get('categoryList'),
    loading: state.get('category').get('ui').get('categoryListLoading'),
    error: state.get('category').get('ui').get('categoryListError')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(CategoryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryViewerWidget)
