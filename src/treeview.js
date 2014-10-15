/** @jsx React.DOM */

// Treeview component
var Treeview = React.createClass({
    name: 'treeview',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'treeview type' },
            { name:'expandLevel', type:'number', required:false, defaultValue:3, note:'levels to expand' },
            { name:'treedata', type:'array', required:false, defaultValue:[], note:'input treeview data' },
            // internal, don't pass in
            { name:'treedataObject', type:'object', required:false, defaultValue:[], note:'treeview data object' },
            { name:'treedataCol', type:'array', required:false, defaultValue:[], note:'treeview data in hash array' }
        ];
        return attributes;
    },
    
    componentWillMount: function() {
        this.state.treedataObject = this.prepareTreedata(this.state.treedata);
        this.state.nodes = this.getNodesFromTreeItem(this.state.treedataObject);
    },
    
    // add unique id to treedata
    prepareTreedata: function(treedata) {
        // convert object into array
        var startLevel = 1;
        this.state.treedataCol = {};
        if (typeof treedata === 'object') {
            if (treedata.constructor.name === 'Array') {
                startLevel = 0;
                treedata = { children:treedata };
            }
        }
        this.processTreedataItem(treedata, startLevel);
        return treedata;
    },
    
    processTreedataItem: function(item, level) {
        item.level = level;
        item.uid = this.generateUid();
        item.isSelected = false;
        item.isExpanded = (level < this.state.expandLevel) || false;
        item.hasChildren = (item.children && item.children.length > 0) || false;
        if (level > 0) {
            this.state.treedataCol[item.uid] = item;
        }
        if (item.children) {
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                this.processTreedataItem(childItem, level + 1);
            }
        }
    },
    
    /*
    Getting nodes from treedata item
    Example input treedata:
    [
        {
            "name": "Top Level",
            "children": [
                {
                    "name": "Level 2: A",
                    "children": [
                        {
                            "name": "Son of A"
                        },
                        {
                            "name": "Daughter of A"
                        }
                    ]
                },
                {
                    "name": "Level 2: B"
                },
                {
                    "name": "Level 2: C",
                    "children": [
                        {
                            "name": "Son of C"
                        }
                    ]
                }
            ]
        }
    ]
    output nodes:
    [
        { display:'Top Level', level:1 },
        { display:'Level 2: A', level:2 },
        { display:'Son of A', level:3 },
        { display:'Daughter of A', level:3 },
        { display:'Level 2: B', level:2 },
        { display:'Level 2: C', level:2 },
        { display:'Son of C', level:3 }
    ]
    */
    getNodesFromTreeItem: function(item) {
        var nodes = [];
        var currentNode = { isExpanded:true };
        var display = item.name || item.text || 'NA';
        // skip level 0, it is artificial object for array input
        if (item.level > 0) {
            currentNode = {
                uid: item.uid,
                item: item,
                display: display,
                level: item.level,
                hasChildren: item.hasChildren,
                isExpanded: item.isExpanded,
                isSelected: item.isSelected,
                boxClass: item.boxClass
            };
            nodes.push(currentNode);
        }
        if (item.children && currentNode.isExpanded) {
            var childNodes = [];
            for (var i = 0; i < item.children.length; i++) {
                var childItem = item.children[i];
                var childNodes = this.getNodesFromTreeItem(childItem);
                nodes = nodes.concat(childNodes);
            }
        }
        return nodes;
    },
    
    onClick: function(event) {
        var target = $(event.target);
        // get cellId from cell icon <i> or from cell container
        var cellId = target.attr('data-uid'); 
        if (target.hasClass('treeview-cell-expand-container')) {
            cellId = target.find('i').attr('data-uid');
        }
        if (!cellId) {
            return;
        }
        // cellId format: "<nodeKey>-<cellType>"
        // cellId example: "36c2b148338c8d7a7f99ef6b881e281f-expand"
        var parts = cellId.split('-');
        var nodeKey = parts[0];
        var cellType = parts[1];
        var treedataItem = this.state.treedataCol[nodeKey];
        // change this.state.treedata according to type of icon clicked
        switch (cellType) {
            case 'expand':
                treedataItem.isExpanded = !treedataItem.isExpanded;
                break;
            case 'icon':
                break;
            case 'select':
                treedataItem.isSelected = !treedataItem.isSelected;
                break;
        }
        this.state.nodes = this.getNodesFromTreeItem(this.state.treedataObject);
        // update display
        this.forceUpdate();
    },
    
    // set data for display
    setData: function(treedata) {
        this.state.treedata = treedata;
        this.state.treedataObject = this.prepareTreedata(this.state.treedata);
        this.state.nodes = this.getNodesFromTreeItem(this.state.treedataObject);
        this.forceUpdate();
    },
    
    // get selected items
    getSelected: function() {
        var resultItems = [];
        var domNode = this.getDOMNode();
        var selectedIcons = $(domNode).find('.treeview-cell-select-container .fa-check-square-o');
        for (var i = 0; i < selectedIcons.length; i ++) {
            var uid = $(selectedIcons[i]).attr('data-uid').split('-')[0];
            var item = this.state.treedataCol[uid];
            resultItems.push(item);
        }
        return resultItems;
    },
    
    render: function() {
        var treenodes = [];
        for (var i = 0; i < this.state.nodes.length; i++) {
            var node = this.state.nodes[i];
            // need to include node properties tied with UI change, for example: isSelected
            var nodeKey = 'treenode-' + node.uid;
            nodeKey += '-' + (node.isSelected ? 'S' : 'NS');
            nodeKey += '-' + (node.isExpanded ? 'E' : 'NE');
            treenodes.push(<TreeviewNode data={ node } key={ nodeKey } />);
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                <div onClick={ this.onClick } >
                    { treenodes }
                </div>
            </div>
        );
    }
});


// TreeviewNode component
var TreeviewNode = React.createClass({
    name: 'treeview-node',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for node' },
            { name:'level', type:'number', required:false, defaultValue:1, note:'node level' },
            { name:'display', type:'string', required:false, defaultValue:'', note:'text display' },
            { name:'hasChildren', type:'boolean', required:false, defaultValue:false, note:'has children flag' },
            { name:'isExpanded', type:'boolean', required:false, defaultValue:false, note:'is expanded flag' },
            { name:'isSelected', type:'boolean', required:false, defaultValue:false, note:'is selected flag' },
            { name:'item', type:'object', required:false, defaultValue:'', note:'original data item' }
        ];
        return attributes;
    },
    
    /*
    onClick: function(event) {
        var element = event.currentTarget;
        var uid = $(element).attr('data-id');
        console.log('clicked on node - uid:', uid, ' data:', this.state.item);
    },
    */
    
    render: function() {
        var items = [];
        var cells = [];
        var level = this.state.level;
        
        // add branch cells 
        for (var i = 1; i < level; i++) {
            var cellData = { text:i, type:'space' };
            var cellKey = 'treeview-text-cell-space-' + i;
            cells.push(
                <TreeviewCell data={ cellData } key={ cellKey } />
            );
        }
        
        // add expand cell if there are children
        var expandCellData = {
            uid: this.state.uid + '-expand',
            type: 'expand',
            iconClass: this.state.isExpanded ? 'fa fa-caret-down' : 'fa fa-caret-right'
        };
        if (!this.state.hasChildren) {
            expandCellData.iconClass = 'fa';
        }
        cells.push(<TreeviewCell data={ expandCellData } key='treeview-expand-cell' />);
        
        // add select cell
        var selectCellData = {
            uid: this.state.uid + '-select',
            type: 'select',
            iconClass: this.state.isSelected ? 'fa fa-check-square-o' : 'fa fa-square-o'
        };
        var selectCellKey = 'treeview-select-cell';
        cells.push(<TreeviewCell data={ selectCellData } key={ selectCellKey } />);
        
        // only add icon cell when iconClass is present
        if (this.state.item.iconClass) {
            var iconCellData = {
                uid: this.state.uid + '-icon',
                type: 'icon',
                iconClass: this.state.item.iconClass
            };
            cells.push(<TreeviewCell data={ iconCellData } key='treeview-icon-cell' />);
        }
        
        // add textbox
        var textboxData = {
            uid: this.state.uid + '-textbox',
            type: 'text',
            text: this.state.display
        };
        cells.push(<TreeviewTextBox data={ textboxData } key='treeview-textbox' />);
        
        return (
            <div className={ this.state.containerClassNames.join(' ') }
                data-id={ this.state.uid } 
                onClick={ this.onClick }
                >
                { cells }
            </div>
        );
    }
});


// TreeviewCell component
var TreeviewCell = React.createClass({
    name: 'treeview-cell',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'iconClass', type:'string', required:false, defaultValue:'', note:'icon CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for cell' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'treeview type' }
        ];
        return attributes;
    },
    
    render: function() {
        // set iconClass
        var displayText = '';
        var iconClass = this.state.iconClass || '';
        var iconContainerClass = 'treeview-cell-' + this.state.type + '-container';
        switch (this.state.type) {
            case 'text':
                displayText = this.state.text;
                break;
            case 'expand':
                iconClass = iconClass || 'fa fa-plus-square-o';
                break;
            case 'select':
                iconClass = iconClass || 'fa fa-check-square-o';
                break;
            case 'icon':
                iconClass = iconClass || '';
                break;
        }
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                <div className={ iconContainerClass }>
                    <i className={ iconClass } data-uid={ this.state.uid } >{ displayText }</i>
                </div>
            </div>
        );
    }
});


// Treeview textbox component
var TreeviewTextBox = React.createClass({
    name: 'treeview-textbox',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'uid', type:'string', required:false, defaultValue:'', note:'unique id for cell' },
            { name:'text', type:'string', required:false, defaultValue:'', note:'display text' },
            { name:'type', type:'string', required:false, defaultValue:'', note:'treeview type' }
        ];
        return attributes;
    },
    
    render: function() {
        // set content
        var displayText = this.state.text;
        return (
            <div className={ this.state.containerClassNames.join(' ') } >
                <div className="treeview-textbox-content"
                    dangerouslySetInnerHTML={{ __html: displayText }}
                />
            </div>
        );
    }
});
