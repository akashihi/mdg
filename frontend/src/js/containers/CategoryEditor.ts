import { connect } from 'react-redux';

import CategoryDialog from '../components/category/CategoryDialog';
import { updateCategory, createCategory } from '../actions/CategoryActions';
import Category from '../models/Category';

export interface CategoryEditorState {
    categoryList: Category[];
    available: boolean
}

const mapStateToProps = (state):CategoryEditorState => {
  return {
    categoryList: state.get('category').categoryList,
      available: state.get('category').available
  }
}
const mapDispatchToProps = { updateCategory, createCategory };

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDialog)
