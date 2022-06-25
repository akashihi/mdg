import { connect } from 'react-redux';

import CategoryViewerWidget from '../components/category/CategoryViewerWidget';
import { updateCategory, deleteCategory } from '../actions/CategoryActions';
import Category from '../models/Category';
import {RootState} from "../reducers/rootReducer";

export interface CategoryViewerState {
    categoryList: Category[];
    available: boolean
}

const mapStateToProps = (state: RootState):CategoryViewerState => {
    return {
        categoryList: state.category.categoryList,
        available: state.category.available
    }
}
const mapDispatchToProps = { updateCategory, deleteCategory };

export type CategoryViewerProps = CategoryViewerState & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(CategoryViewerWidget)
