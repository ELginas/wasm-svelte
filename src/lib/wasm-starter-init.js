import wasmInit from "wasm-starter";
import wasmUrl from "wasm-starter/wasm_starter_bg.wasm?url";

export async function wasmStarterInit() {
  await wasmInit({
    module_or_path: wasmUrl,
  });
}
