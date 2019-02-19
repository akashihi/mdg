import React, {Component, Fragment} from 'react';
import MuiTreeView from 'material-ui-treeview';

export default class CategoryViewerWidget extends Component {

  categoryToTree(category) {
    if ('attributes' in category) {
      var attr = category.attributes
    } else {
      attr = category
    }
    if ('children' in attr) {
      return {
        id: attr.id,
        value: attr.name,
        nodes: attr.children.map(::this.categoryToTree)
      }
    } else {
        return {id: attr.id, value: attr.name}
    }
  }

  render() {
    var props = this.props
    
    var tree = props.categoryList.map(::this.categoryToTree)

    return (
      <Fragment>
        Categories:
        <MuiTreeView tree = {tree}/>
      </Fragment>
    )
  }
}
