# selector-no-unnecessary-nesting

Disallow unnecessary nesting.

Nesting adds complexity to css. The more nesting, the more overrides we have to put in. Sometimes we need to provide a common element style, override with a component class, override with a screen size variation, or a state variation, a browser / device specific override or override because it needs to look different inside parent, and then a parent of that and so forth.

The reason for this rule is to prevent unnecessary nesting.

If you have a component which wraps a child then it's ok to override that with an extra nesting level. 

It is not ok to provide an extra nesting level if that first parent component doesn't exist. 

The advantages of this rule is to allow css developers to clearly understand what the original intention of the styling pattern was used for, ie supposed to be in this component, or supposed to look different if overridden inside another nest component.

It will also reduce the amount of css tech debt that can acrue when providing layers and layers of nesting and then overriding with hacks.


```css
    .grand .parent .child {}
/** ↑
 * This selector */
```

## Options

### `true`

The following patterns are considered errors:

```css
.grand .parent .child{}
```

```css
.grand{
    .parent{
        .child{}
    }
}
```


The following patterns are *not* considered errors:

```css
    .parent .child {}
    .grand .parent .child {}
```

```css

.parent{
    .child{}
}

.grand{
    .parent{
        .child{}
    }
}
```
