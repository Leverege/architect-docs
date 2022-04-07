
A set of useful validators and key validator, to validate user input data.

## Install
```
npm install --save @leverege/validator
```

## Usage
```
const { Validator } = require( '@leverege/validator' );

Validator.isEmail( str ); // true or false
Validator.isPhone( str ); // true or false
```

### keyValidator

There is only the `isAlphaNumeric` method on keyValidator which takes in a key board event and verifies that the character is alphaNumeric

### Validator 

Validator contains 3 methods. `isEmail` verifies that the value provided to it is an email. `isPhone` verifies that the value provided to it is a phone number. `optional` transforms a validator to allow empty or null values.
