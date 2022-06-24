import React, {useState, Fragment} from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import ClipLoader from 'react-spinners/ClipLoader';
import Button from '@mui/material/Button';
import Category from "../../models/Category";
import {CategoryViewerProps} from "../../containers/CategoryViewer";

import CategoryDialog from './CategoryDialog';

export function CategoryViewerWidget(props: CategoryViewerProps) {
    const [dialogVisible, setDialogVisible] = useState(false)
    const [fullEditor, setFullEditor] = useState(false)
    const [editedCategory, setEditedCategory] = useState<Partial<Category>>({})

    const renderCategoryLabel = (c: Category) => {
        const title = `${c.name} (${c.account_type.charAt(0).toUpperCase()}${c.account_type.slice(1).toLowerCase()})`
        return (
            <p>{title}&nbsp;<Button variant='text' size='small'><EditIcon/></Button></p>
        )
    }

    const renderTree = (nodes: Category[]) => {
        return nodes.map(node => {
            return (<TreeItem key={node.id} nodeId={node.id.toString()} label={renderCategoryLabel(node)}>
                {Array.isArray(node.children)
                    ? renderTree(node.children)
                    : null}
            </TreeItem>)
        })
    }

    const createCategory = () => {
        setDialogVisible(true);
        setFullEditor(true);
        setEditedCategory({account_type: 'income', priority: 1, name: '', parent_id: -1});
    }
    /*
       if (props.error) {
        return (<h1>Error loading category list</h1>)
      }

      if (props.loading) {
        return (<ClipLoader sizeUnit={'px'} size={150} loading={true}/>)
      }
*/

    return (
        <Fragment>
            Categories:
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon/>}
                sx={{height: 480, flexGrow: 1, overflowY: 'auto'}}
            >
                {renderTree(props.categoryList)}
            </TreeView>
            <Button color='primary' variant='outlined' onClick={createCategory}>Add new category</Button>
            <CategoryDialog open={dialogVisible} category={editedCategory} full={fullEditor} categoryList={props.categoryList} close={()=> setDialogVisible(false)}/>
        </Fragment>
    )
}

export default CategoryViewerWidget;
