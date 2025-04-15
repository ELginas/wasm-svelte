<script>
  import { wasmStarterInit } from "$lib/wasm-starter-init";
  import { Universe, Size, Position, Cell } from "wasm-starter";

  $effect(async () => {
    await wasmStarterInit();

    const size = new Size(20, 20);
    const universe = new Universe(size);

    console.log(universe.render());
    console.log(universe.set_cell(new Position(15, 15), Cell.Alive));
    console.log(universe.set_cell(new Position(15, 16), Cell.Alive));
    console.log(universe.set_cell(new Position(15, 17), Cell.Alive));
    universe.tick();
    console.log(universe.render());
    universe.tick();
    console.log(universe.render());
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
  documentation
</p>
