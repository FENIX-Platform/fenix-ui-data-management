#Fenix Data Management

## Configure Site Template

Currently the module support two kind of site template:
- tomenu (default)
- sidemenu

In order to use a non-default site template override the path of the site template within the main.js file of the host page.

Ex:

```javascript
    'fx-d-m/templates/site' : '[path-to-module]/templates/site-sidemenu.hbs'
```