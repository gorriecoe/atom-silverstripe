# Silverstripe

Provides [SilverStripe](http://www.silverstripe.org/) syntax highlighting and snippets.

[![Powered by Sanchez](resources/poweredby.png)](https://github.com/gorriecoe/silverstripe-sanchez)

## Installation

Using `apm`:

```
apm install atom-silverstripe
```

Or search for `atom-silverstripe` in Atom settings view.

## Features

- Reads the project composer.lock file to determine the available snippets.
- Php snippets follow [psr-2 standards](http://www.php-fig.org/psr/psr-2/)
- Snippets add use namespace if required
- Supports 4.\*, 3.\* and even 2.\*
- File icon for .ss
- Uses full word prefixes so you don't have to remember abbreviations
- Includes snippets for addons modules such as [tagfield](https://github.com/silverstripe/silverstripe-tagfield) and [linkable](https://github.com/sheadawson/silverstripe-linkable)
- .ss templates include scope and conditional indentation.
