# JavaScript and TypeScript Nightly

VS Code extension that enables the nightly build of TypeScript (`typescript@next`) as VS Code's built-in TypeScript version used to power JavaScript and TypeScript IntelliSense.

## Enabling
This extension replaces VS Code's built-in TypeScript version with `typescript@next`. It does not affect workspace versions of TypeScript, or custom user `typescript.tsdk` settings.

To make sure you are using `typescript@next`:

1. Open a JavaScript or TypeScript file in VS Code.
1. In the VS Code command palette, run the `TypeScript: Select TypeScript version` command.
1. Make sure you have `Use VS Code's version` selected

Note that this extension also includes the [latest JavaScript and TypeScript grammar](https://github.com/microsoft/TypeScript-TmLanguage).
