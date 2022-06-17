# EasyConfig-TS

Simple configuration helper for applications in TypeScript and Javascript.

Adds dot file fallback functionality for dotenv.

## Installation

```
npm install easyconfig-ts --save-dev
```

## Usage

Very simple:

```
import EasyConfig from "easyconfig-ts";
// See (or import { EasyConfigOptions } from "easyconfig-ts") EasyConfigOptions in easyconfig.ts
EasyConfig({
    dotFiles: [
        "./first.env",
        "./second.env",
        ...
    ]
});
```

or

```
import EasyConfig from "easyconfig-ts";
EasyConfig([{
    path: "./first.env",
    priority: 1 // Highest priority value - so this will be assessed first
  }, {
    path: "./last.env",
    priority: 0 // Lowest priority value - so this will be assessed last
  },
 ...
 ]);
```

And that's it! The first found dot file provided to EasyConfig will be chosen and
will be used in a Dotenv.config call.
