import { connect } from 'react-redux';

import CategoryViewerWidget from '../components/category/CategoryViewerWidget';
import { updateCategory, createCategory } from '../actions/CategoryActions';
import Category from '../models/Category';

export interface CategoryViewerState {
    categoryList: Category[];
    available: boolean
}

const mapStateToProps = (state):CategoryViewerState => {
    return {
        categoryList: state.get('category').categoryList,
        available: state.get('category').available
    }
}
const mapDispatchToProps = { updateCategory, createCategory };

export type CategoryViewerProps = CategoryViewerState & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(CategoryViewerWidget)
