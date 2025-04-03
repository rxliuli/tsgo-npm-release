# Unofficial NPM Package for TypeScript-Go

This package provides an unofficial NPM distribution of [Microsoft's TypeScript-Go](https://github.com/microsoft/typescript-go) project, which is a Go-based port of TypeScript.

## ⚠️ Important Notice

This is **NOT** an official package from the TypeScript team. It is published as a convenience for testing and evaluation purposes only. The TypeScript-Go project is still under active development and considered experimental.

Per [this discussion](https://github.com/microsoft/typescript-go/discussions/466), the official team currently has no plans to publish an NPM package as the project is still very incomplete.

## Why This Package Exists

This unofficial package allows developers to:

- Try TypeScript-Go without building from source
- Test integration with existing tooling
- Experiment with the Go-based TypeScript implementation

## Installation

```bash
npm install @rxliuli/tsgo
```

### Optional Installation Parameters

You may add these environment variables to your system to invoke custom installation parameters:   
- `TSGO_DIRECTORY` : If you do not want to download a copy of `tsgo` that someone else built, you can specify this environment variable. This should be a path to the directory, where the `typescript-go` project is, should contain the partial path `./built/local/tsgo`.
- `TSGO_PROVIDER` : If you want to download a copy of `tsgo` from a custom GitHub user, you can specify this environment variable. This should be a GitHub username that has releases for `tsgo`.

## Usage

This package provides the `tsgo` binary which functions similarly to `tsc`:

```bash
# Check a TypeScript file (similar to tsc)
npx tsgo tsc path/to/file.ts

# Use a tsconfig.json file
npx tsgo tsc --project path/to/tsconfig.json
```

For LSP (Language Server Protocol) usage, please refer to the [official repository](https://github.com/microsoft/typescript-go) for setup instructions.

## Current Limitations

As noted in the official repository, TypeScript-Go is still a work in progress with many features incomplete. Current limitations include:

- Not all resolution modes are supported
- JavaScript-specific inference and JSDoc are not ready
- JSX support is not ready
- Declaration emit is not ready
- Emit (JS output) is in progress (only `target: esnext` is well-supported)
- Watch mode is prototype-only
- Build mode / project references are not ready
- Incremental build is not ready
- Language service (LSP) is prototype-only with minimal functionality

## Updates

This unofficial package will be updated periodically as significant progress is made in the TypeScript-Go repository. When the official team decides to publish an official package, this unofficial package will be deprecated in favor of the official one.

## Contributing

For issues related to TypeScript-Go itself, please file them in the [official repository](https://github.com/microsoft/typescript-go).

For issues specific to this NPM package distribution, please file them in <https://github.com/rxliuli/tsgo-npm-release>.

## License

The TypeScript project is licensed under the [Apache License 2.0](https://github.com/microsoft/typescript-go/blob/main/LICENSE).

