# JavaScript and TypeScript Nightly

VS Code extension that enables the nightly build of TypeScript (`typescript@next`) as VS Code's built-in TypeScript version used to power JavaScript and TypeScript IntelliSense.

> ⚠️ **You do not need this extension to work with JavaScript and TypeScript in VS Code**.
> 
> This extension is **intended for advanced users** who want to test out the latest TypeScript features before they are released. VS Code includes built-in JavaScript and TypeScript support that uses the latest stable TypeScript release. You do not need this extension — or any other extensions — for editing JavaScript and TypeScript in VS Code.
>
> Please only install this extension if you understand what it does and are ok trading a potentially less stable experience for testing out new TypeScript language and tooling features early.

## Enabling

This extension replaces VS Code's built-in TypeScript version with `typescript@next`. It does not affect workspace versions of TypeScript, or custom user `typescript.tsdk` settings.

To make sure you are using `typescript@next`:

1. Open a JavaScript or TypeScript file in VS Code.
1. In the VS Code command palette, run the `TypeScript: Select TypeScript version` command.
1. Make sure you have `Use VS Code's version` selected

Note that this extension also includes the [latest JavaScript and TypeScript grammar](https://github.com/microsoft/TypeScript-TmLanguage).
