
This library has methods for manipulating and accessing strings.

## Install
```
npm install --save @leverege/string-util

const StringUtil = require( '@leverege/string-util' );

```

## camelCaseToTitleCase( string, capitalizeAll = false )

returns a space separated title case version of the string

## capitalize( str )

returns the str with the first letter capitalized

## capitalizeAll( str )

returns the str with every letter capitalized

## escapeRegExp( str )

escapes the string

## replaceAll( str, find, replace )

Replaces all instances of the find value in str with the replace value

## isEmpty( str )

returns true if the string is empty or only contains spaces

## nullOrTrim( str, returnNullIfNotString = true )

trims the string if it is a string
