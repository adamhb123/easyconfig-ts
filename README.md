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
EasyConfig("first.env", "second.env", ".env", ...);
```
And that's it! The first found dot file provided to EasyConfig will be chosen and
will be used in a Dotenv.config call.