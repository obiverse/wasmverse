#!/bin/bash
# ============================================================================
# wasmverse build script
# ============================================================================
#
# Usage:
#   ./build.sh           # Build all crates
#   ./build.sh compute   # Build only path 1 (compute engine)
#   ./build.sh gpu       # Build only path 2 (gpu renderer)
#   ./build.sh wit       # Build only path 3 (wit components)
#   ./build.sh sorting   # Build only sorting theater
#   ./build.sh stack     # Build only stack machine
#   ./build.sh docs      # Build new crates + copy to docs/pkg/ for GitHub Pages
#   ./build.sh serve     # Build all + start dev server

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

build_compute() {
    echo "=== Path 1: Compute Engine (Figma pattern) ==="
    cd "$ROOT/crates/compute-engine"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/compute-engine/pkg/"
}

build_gpu() {
    echo "=== Path 2: GPU Renderer (WebGPU) ==="
    cd "$ROOT/crates/gpu-renderer"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/gpu-renderer/pkg/"
}

build_wit() {
    echo "=== Path 3: WIT Components ==="
    cd "$ROOT/crates/wit-components"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/wit-components/pkg/"
}

build_sorting() {
    echo "=== Path 4: Sorting Theater (TAOCP Vol.3) ==="
    cd "$ROOT/crates/sorting-theater"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/sorting-theater/pkg/"
}

build_stack() {
    echo "=== Path 5: Stack Machine (Knuth's MIX) ==="
    cd "$ROOT/crates/stack-machine"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/stack-machine/pkg/"
}

build_docs() {
    echo "=== Copying Wasm to docs/pkg/ for GitHub Pages ==="
    mkdir -p "$ROOT/docs/pkg/sorting-theater"
    mkdir -p "$ROOT/docs/pkg/stack-machine"
    cp "$ROOT/crates/sorting-theater/pkg/sorting_theater_bg.wasm" "$ROOT/docs/pkg/sorting-theater/"
    cp "$ROOT/crates/sorting-theater/pkg/sorting_theater.js" "$ROOT/docs/pkg/sorting-theater/"
    cp "$ROOT/crates/stack-machine/pkg/stack_machine_bg.wasm" "$ROOT/docs/pkg/stack-machine/"
    cp "$ROOT/crates/stack-machine/pkg/stack_machine.js" "$ROOT/docs/pkg/stack-machine/"
    # Copy updated treatise
    cp "$ROOT/TREATISE.md" "$ROOT/docs/TREATISE.md"
    echo "  → Copied to docs/pkg/"
}

serve() {
    echo ""
    echo "=== Starting dev server ==="
    echo "  Treatise:          http://localhost:8080/docs/"
    echo "  Path 1 (Compute):  http://localhost:8080/web/compute/"
    echo "  Path 2 (GPU):      http://localhost:8080/web/gpu/"
    echo "  Path 3 (WIT):      http://localhost:8080/web/wit/"
    echo ""
    cd "$ROOT"
    python3 -m http.server 8080
}

case "${1:-all}" in
    compute) build_compute ;;
    gpu)     build_gpu ;;
    wit)     build_wit ;;
    sorting) build_sorting ;;
    stack)   build_stack ;;
    docs)    build_sorting; build_stack; build_docs ;;
    serve)   build_compute; build_gpu; build_wit; build_sorting; build_stack; build_docs; serve ;;
    all)     build_compute; build_gpu; build_wit; build_sorting; build_stack ;;
    *)       echo "Usage: $0 {compute|gpu|wit|sorting|stack|docs|serve|all}"; exit 1 ;;
esac

echo ""
echo "Done. Run './build.sh serve' to start the dev server."
