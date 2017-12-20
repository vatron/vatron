# Contributing to Vatron

## Issues
Head over to the [Issues](https://github.com/andrewward2001/vatron/issues) page to submit a new issue.

### Bugs
When submitting a bug, please include as much information as possible, especially
* Version of vatron
* Operating system and its version (in the case in Windows 10, please include version name (i.e., Fall Creators Update))
* The issue that arose, what caused it (steps leading up to it), and what you expected to happen
Other things that can help out
* Screenshots (GIFs can be helpful)
* Errors
  * Popup window
  * Console (use View -> Toggle Developer Tools or the shortcut Ctrl+Shift+I (Cmd+Shift+I on macOS))
Please check out existing open or closed issues to see if your issue has been resolved or if someone already found it.

### Suggestions
You can also use the Issues system to make suggestions. Please mark these with the Suggestion tag. When making a suggestion, please include as much detail as possible. Mockups are also nice.

Just like with bugs, please check to see if your suggestion has already been made.

## Code style
* Avoid using semicolons (`;`)
* Type coercive operators are preferred (`==` and `!=`) in most places, except where identity operators are required (`===` and `!==`)
* Use two-space indentations. Four spaces is too much and tabs are often rendered incorrectly
* Lambda expressions are always preferred (`() => {}` over `function() {}`)
* Ternary operators are always preferred (`condition ? expr1 : expr2`)
* Use ES6 (ES2015):
  * `const` for defining constants and requires
  * `let` for defining variables (`var` should be used sparingly)
  * Lambda expressions (above)
  * Ternary operators (above)
* CamelCase should be used for ClassNames
* Use mixedCase everywhere else
