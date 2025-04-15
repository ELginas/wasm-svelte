# sv

# WebAssembly with wasm-pack setup

In Rust WASM project:

```sh
wasm-pack build --target web
```

This project `package.json`:

```json
"devDependencies": {
  "wasm-starter": "file:../wasm-starter/pkg"
}
```

And then `pnpm link ../wasm-starter/pkg` for proper hot reloading. Without it `.wasm` will only update like once and then every other `pnpm install` run.

Many plugins just choose not to add this as a dependency and then you have 0 autocompletion and red squiggles everywhere.

And then import JS in this project:

```js
import wasmInit from "wasm-starter";
import wasmUrl from "wasm-starter/wasm_starter_bg.wasm?url";

export async function wasmStarterInit() {
  await wasmInit({
    module_or_path: wasmUrl,
  });
}
```

Many plugins for `wasm-pack` do not work because `wasm-pack` has special imports which can be seen with `wasm2wat` from [`wabt`](https://github.com/WebAssembly/wabt) package (also available on pacman) and also in generated `wasm_starter.js` with `--target web`. Also [Vite docs](https://vite.dev/guide/features#webassembly) have info about importing WebAssembly.

Works in dev and prod build client-side. SSR untested.
