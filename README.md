# Valory Example

This is a small appserver project meant showcase many examples and patterns for Valory usage. Effort has been taken to make it as complete as possible, so please post an issue if you believe something is missing.

## Installing, Building, and Testing

First, install clone the project and run npm

```bash
npm install

# Optionally, install Valory and Typescript globally for convenience
npm i -g valory typescript
```

Then, build the appserver

```bash
# Compile with Valory and Typescript. You can omit "npx" if you installed them globally
npx valory compile
npx tsc

# You can also just run the included build script
npm run build
```

Now you can test it out locally

```bash
# Start directly (Adaptor Dependant)
node dist/appserver.js

# Start with valory test (Adaptor Agnostic)
npx valory test
```

## Bundling

A small example showcasing Valory support for Parcel is included.

```bash
npm run bundle
```

This will build the project down to a single, dependency-free js file and output to bundle/appserver.js. This file can then be run directly.  For this to work, parcel-plugin-valory is included to add static references to Valory's generated artifacts.

**NOTE:** Valory compile MUST be run before Parcel