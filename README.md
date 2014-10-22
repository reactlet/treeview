treeview
========

Reactlet treeview component

[Treeview example](document/image/treeview-filesystem.png)

```
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
