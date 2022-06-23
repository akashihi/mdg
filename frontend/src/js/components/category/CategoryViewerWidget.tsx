import React, {Component, Fragment} from 'react';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClipLoader from 'react-spinners/ClipLoader';
import Button from '@mui/material/Button';
import Category from "../../models/Category";
import {CategoryViewerProps} from "../../containers/CategoryViewer";

//import CategoryEditor from '../../containers/CategoryEditor.ts';

export function CategoryViewerWidget(props: CategoryViewerProps) {

    const renderCategoryName = (c: Category) => {
        return `${c.name} (${c.account_type.charAt(0).toUpperCase()}${c.account_type.slice(1).toLowerCase()})`
    }

    const renderTree = (nodes: Category[]) => {
        return nodes.map(node => {
            return (<TreeItem key={node.id} nodeId={node.id.toString()} label={renderCategoryName(node)}>
                {Array.isArray(node.children)
                    ? renderTree(node.children)
                    : null}
            </TreeItem>)
        })
    }
    /*onAddClick() {
      this.props.actions.createCategory()
    }

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
            <Button color='primary' variant='outlined'>Add new category</Button>
            {/*<CategoryEditor/>*/}
        </Fragment>
    )
}

export default CategoryViewerWidget;
