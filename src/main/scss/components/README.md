# SCSS Components

- Common SCSS files for components are placed in this folder
- Variables for component are defined outside the component definition and post fixed with `!default`
    - Variables are written in BEM style    
- Example: `_my-component.component.scss`
```
$my-component--background-color: red !default;
$my-component__element--font-size: 16px !default;

.#{$root} {
    .my-component {
        background-color: $my-component--background-color;
        
        &__element {
            font-size: $my-component__element--font-size; 
        }
    }
}
```

- Overwriting components for projects are done in own folder `projects/[project]/components/_[component].[project]-component.scss`
- Example of overwriting component for project `xid`: `projects/xid/components/_my-component.component.scss`
```
$my-component--background-color: blue;
$my-component__element--font-size: 14px;
$my-component__other-element--color: orange;

@import "../../../components/my-component.component";

.#{$root} {
    .my-component {
        &__other-element {
            color: $my-component__other-element--color; 
        }
    }
}
```