(function(){angular.module("angularBootstrapNavTree",[]).directive("abnTree",["$timeout",function($timeout){return{restrict:"E",template:'<ul class="nav nav-list nav-pills nav-stacked abn-tree">\n  <li ng-repeat="row in tree_rows | filter:{visible:true} track by row.branch.uid" ng-animate="\'abn-tree-animate\'" ng-class="\'level-\' + {{ row.level }} + (row.branch.selected ? \' active\':\'\')" class="abn-tree-row">\n    <a ng-click="user_clicks_branch(row.branch)">\n      <i ng-class="row.tree_icon" ng-click="row.branch.expanded = !row.branch.expanded" class="indented tree-icon"> </i>\n      <span class="indented tree-label">{{ row.label }} </span>\n    </a>\n  </li>\n</ul>',replace:!0,scope:{treeData:"=",onSelect:"&",initialSelection:"@",treeControl:"="},link:function(scope,element,attrs){var expand_all_parents,expand_level,for_all_ancestors,for_each_branch,get_parent,n,on_treeData_change,select_branch,selected_branch,tree;if(null==attrs.iconExpand&&(attrs.iconExpand="icon-plus  glyphicon glyphicon-plus  fa fa-plus"),null==attrs.iconCollapse&&(attrs.iconCollapse="icon-minus glyphicon glyphicon-minus fa fa-minus"),null==attrs.iconLeaf&&(attrs.iconLeaf="icon-file  glyphicon glyphicon-file  fa fa-file"),null==attrs.expandLevel&&(attrs.expandLevel="3"),expand_level=parseInt(attrs.expandLevel,10),scope.treeData){if(null==scope.treeData.length){if(null==treeData.label)return void alert("treeData should be an array of root branches");scope.treeData=[treeData]}return for_each_branch=function(f){var do_f,root_branch,_i,_len,_ref,_results;for(do_f=function(branch,level){var child,_i,_len,_ref,_results;if(f(branch,level),null!=branch.children){for(_results=[],_i=0,_len=(_ref=branch.children).length;_i<_len;_i++)child=_ref[_i],_results.push(do_f(child,level+1));return _results}},_results=[],_i=0,_len=(_ref=scope.treeData).length;_i<_len;_i++)root_branch=_ref[_i],_results.push(do_f(root_branch,1));return _results},selected_branch=null,select_branch=function(branch){if(!branch)return null!=selected_branch&&(selected_branch.selected=!1),void(selected_branch=null);if(branch!==selected_branch){if(null!=selected_branch&&(selected_branch.selected=!1),branch.selected=!0,selected_branch=branch,expand_all_parents(branch),null!=branch.onSelect)return $timeout(function(){return branch.onSelect(branch)});if(null!=scope.onSelect)return $timeout(function(){return scope.onSelect({branch:branch})})}},scope.user_clicks_branch=function(branch){if(branch!==selected_branch)return select_branch(branch)},get_parent=function(child){var parent;return parent=void 0,child.parent_uid&&for_each_branch(function(b){if(b.uid===child.parent_uid)return parent=b}),parent},for_all_ancestors=function(child,fn){var parent;if(null!=(parent=get_parent(child)))return fn(parent),for_all_ancestors(parent,fn)},expand_all_parents=function(child){return for_all_ancestors(child,function(b){return b.expanded=!0})},scope.tree_rows=[],on_treeData_change=function(){var add_branch_to_list,root_branch,_i,_len,_ref,_results;for(for_each_branch(function(b,level){if(!b.uid)return b.uid=""+Math.random()}),console.log("UIDs are set."),for_each_branch(function(b){var child,_i,_len,_ref,_results;if(angular.isArray(b.children)){for(_results=[],_i=0,_len=(_ref=b.children).length;_i<_len;_i++)child=_ref[_i],_results.push(child.parent_uid=b.uid);return _results}}),scope.tree_rows=[],for_each_branch(function(branch){var child,f;return branch.children?branch.children.length>0?(f=function(e){return"string"==typeof e?{label:e,children:[]}:e},branch.children=function(){var _i,_len,_ref,_results;for(_results=[],_i=0,_len=(_ref=branch.children).length;_i<_len;_i++)child=_ref[_i],_results.push(f(child));return _results}()):void 0:branch.children=[]}),add_branch_to_list=function(level,branch,visible){var child,child_visible,tree_icon,_i,_len,_ref,_results;if(null==branch.expanded&&(branch.expanded=!1),tree_icon=branch.children&&0!==branch.children.length?branch.expanded?attrs.iconCollapse:attrs.iconExpand:attrs.iconLeaf,scope.tree_rows.push({level:level,branch:branch,label:branch.label,tree_icon:tree_icon,visible:visible}),null!=branch.children){for(_results=[],_i=0,_len=(_ref=branch.children).length;_i<_len;_i++)child=_ref[_i],child_visible=visible&&branch.expanded,_results.push(add_branch_to_list(level+1,child,child_visible));return _results}},_results=[],_i=0,_len=(_ref=scope.treeData).length;_i<_len;_i++)root_branch=_ref[_i],_results.push(add_branch_to_list(1,root_branch,!0));return _results},scope.$watch("treeData",on_treeData_change,!0),null!=attrs.initialSelection&&for_each_branch(function(b){if(b.label===attrs.initialSelection)return $timeout(function(){return select_branch(b)})}),n=scope.treeData.length,console.log("num root branches = "+n),for_each_branch(function(b,level){return b.level=level,b.expanded=b.level<expand_level}),null!=scope.treeControl&&angular.isObject(scope.treeControl)?(tree=scope.treeControl,tree.expand_all=function(){return for_each_branch(function(b,level){return b.expanded=!0})},tree.collapse_all=function(){return for_each_branch(function(b,level){return b.expanded=!1})},tree.get_first_branch=function(){if((n=scope.treeData.length)>0)return scope.treeData[0]},tree.select_first_branch=function(){var b;return b=tree.get_first_branch(),tree.select_branch(b)},tree.get_selected_branch=function(){return selected_branch},tree.get_parent_branch=function(b){return get_parent(b)},tree.select_branch=function(b){return select_branch(b),b},tree.get_children=function(b){return b.children},tree.select_parent_branch=function(b){var p;if(null==b&&(b=tree.get_selected_branch()),null!=b&&null!=(p=tree.get_parent_branch(b)))return tree.select_branch(p),p},tree.add_branch=function(parent,new_branch){return null!=parent?(parent.children.push(new_branch),parent.expanded=!0):scope.treeData.push(new_branch),new_branch},tree.add_root_branch=function(new_branch){return tree.add_branch(null,new_branch),new_branch},tree.expand_branch=function(b){if(null==b&&(b=tree.get_selected_branch()),null!=b)return b.expanded=!0,b},tree.collapse_branch=function(b){if(null==b&&(b=selected_branch),null!=b)return b.expanded=!1,b},tree.get_siblings=function(b){var p;if(null==b&&(b=selected_branch),null!=b)return(p=tree.get_parent_branch(b))?p.children:scope.treeData},tree.get_next_sibling=function(b){var i,siblings;if(null==b&&(b=selected_branch),null!=b&&(siblings=tree.get_siblings(b),n=siblings.length,(i=siblings.indexOf(b))<n))return siblings[i+1]},tree.get_prev_sibling=function(b){var i,siblings;if(null==b&&(b=selected_branch),siblings=tree.get_siblings(b),n=siblings.length,(i=siblings.indexOf(b))>0)return siblings[i-1]},tree.select_next_sibling=function(b){var next;if(null==b&&(b=selected_branch),null!=b&&null!=(next=tree.get_next_sibling(b)))return tree.select_branch(next)},tree.select_prev_sibling=function(b){var prev;if(null==b&&(b=selected_branch),null!=b&&null!=(prev=tree.get_prev_sibling(b)))return tree.select_branch(prev)},tree.get_first_child=function(b){var _ref;if(null==b&&(b=selected_branch),null!=b&&(null!=(_ref=b.children)?_ref.length:void 0)>0)return b.children[0]},tree.get_closest_ancestor_next_sibling=function(b){var next,parent;return null!=(next=tree.get_next_sibling(b))?next:(parent=tree.get_parent_branch(b),tree.get_closest_ancestor_next_sibling(parent))},tree.get_next_branch=function(b){var next;if(null==b&&(b=selected_branch),null!=b)return null!=(next=tree.get_first_child(b))?next:next=tree.get_closest_ancestor_next_sibling(b)},tree.select_next_branch=function(b){var next;if(null==b&&(b=selected_branch),null!=b&&null!=(next=tree.get_next_branch(b)))return tree.select_branch(next),next},tree.last_descendant=function(b){var last_child;return 0===(n=b.children.length)?b:(last_child=b.children[n-1],tree.last_descendant(last_child))},tree.get_prev_branch=function(b){var prev_sibling;if(null==b&&(b=selected_branch),null!=b)return null!=(prev_sibling=tree.get_prev_sibling(b))?tree.last_descendant(prev_sibling):tree.get_parent_branch(b)},tree.select_prev_branch=function(b){var prev;if(null==b&&(b=selected_branch),null!=b&&null!=(prev=tree.get_prev_branch(b)))return tree.select_branch(prev),prev}):void 0}alert("no treeData defined for the tree!")}}}])}).call(this);