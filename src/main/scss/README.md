# SCSS Variables

- Common SCSS files for variables are placed in this folder
- Global variables for default colors etc. are defined in these files
- Example: `_variables.scss`
```
$color-blue: blue !default;
$text-size--primary: 14px !default;
```
- Overwriting variables for projects are done in own folder `projects/[project]/variables/_[project]-variables.scss`
- Example of overwriting variables for project `xid`: `projects/xid/variables/_xid-variables.scss`
```
$color-blue: dark-blue;
$text-size--primary: 10px;
```