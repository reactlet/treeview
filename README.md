Reactlet Treeview
=================

Reactlet treeview component

![Treeview file system example](res/treeview-filesystem.png)

```
<link rel="stylesheet" href="/component/common/common-style.css"/>
<link rel="stylesheet" href="/component/treeview/treeview.css"/>

<script src="/library/react/react.js"></script>
<script src="/library/react/JSXTransformer.js"></script>
<script type="text/jsx" src="/component/common/common-mixin.js"></script>
<script type="text/jsx" src="/component/treeview/treeview.js"></script>

app.tree4Data = {
    treedata: [
        {
            "name": "website",
            "iconClass": "fa fa-folder-o",
            "children": [
                {
                    "name": "images",
                    "iconClass": "fa fa-folder-o",
                    "children": [
                        {
                            "name": "logo.png",
                            "iconClass": "fa fa-file-image-o"
                        },
                        {
                            "name": "background.png",
                            "iconClass": "fa fa-file-image-o"
                        }
                    ]
                },
                {
                    "name": "index.html",
                    "iconClass": "fa fa-file-text-o"
                },
                {
                    "name": "about.html",
                    "iconClass": "fa fa-file-text-o"
                },
                {
                    "name": "product.html",
                    "iconClass": "fa fa-file-text-o"
                }
            ]
        }
    ]
};
app.treeview4 = React.renderComponent(
    <Treeview data={ app.tree4Data } />,
    document.getElementById('treeview4')
);
```
