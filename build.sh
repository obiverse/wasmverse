#!/bin/bash
# ============================================================================
# wasmverse / letterverse build script
# ============================================================================
#
# Usage:
#   ./build.sh           # Build all crates
#   ./build.sh euler     # Build only euler framework
#   ./build.sh sorting   # Build only sorting theater
#   ./build.sh stack     # Build only stack machine
#   ./build.sh docs      # Build active crates + copy to docs/pkg/
#   ./build.sh serve     # Build all + start dev server
#   ./build.sh test      # Run all tests

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

build_euler() {
    echo "=== Euler Framework ==="
    cd "$ROOT/crates/euler"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/euler/pkg/"
}

build_compute() {
    echo "=== Path 1: Compute Engine ==="
    cd "$ROOT/crates/compute-engine"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/compute-engine/pkg/"
}

build_gpu() {
    echo "=== Path 2: GPU Renderer ==="
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
    echo "=== Path 4: Sorting Theater ==="
    cd "$ROOT/crates/sorting-theater"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/sorting-theater/pkg/"
}

build_stack() {
    echo "=== Path 5: Stack Machine ==="
    cd "$ROOT/crates/stack-machine"
    wasm-pack build --target web --out-dir pkg
    echo "  → Built: crates/stack-machine/pkg/"
}

build_docs() {
    echo "=== Copying to docs/pkg/ for GitHub Pages ==="

    # Euler framework
    mkdir -p "$ROOT/docs/pkg/euler"
    cp "$ROOT/crates/euler/pkg/euler_bg.wasm" "$ROOT/docs/pkg/euler/"
    cp "$ROOT/crates/euler/pkg/euler.js" "$ROOT/docs/pkg/euler/"

    # Sorting theater
    mkdir -p "$ROOT/docs/pkg/sorting-theater"
    cp "$ROOT/crates/sorting-theater/pkg/sorting_theater_bg.wasm" "$ROOT/docs/pkg/sorting-theater/"
    cp "$ROOT/crates/sorting-theater/pkg/sorting_theater.js" "$ROOT/docs/pkg/sorting-theater/"

    # Stack machine
    mkdir -p "$ROOT/docs/pkg/stack-machine"
    cp "$ROOT/crates/stack-machine/pkg/stack_machine_bg.wasm" "$ROOT/docs/pkg/stack-machine/"
    cp "$ROOT/crates/stack-machine/pkg/stack_machine.js" "$ROOT/docs/pkg/stack-machine/"

    # Circuit simulator
    mkdir -p "$ROOT/docs/pkg/circuit-sim"
    cp "$ROOT/crates/circuit-sim/pkg/circuit_sim_bg.wasm" "$ROOT/docs/pkg/circuit-sim/"
    cp "$ROOT/crates/circuit-sim/pkg/circuit_sim.js" "$ROOT/docs/pkg/circuit-sim/"

    echo "  → Copied to docs/pkg/"

    # Generate version stamp from git hash — SW uses this for cache busting
    VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
    echo "  → Version: $VERSION"
    echo "{\"version\":\"$VERSION\",\"built\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$ROOT/docs/version.json"
    echo "  → Wrote docs/version.json"
}

run_tests() {
    echo "=== Running tests ==="
    cd "$ROOT"
    cargo test --workspace
    echo "  → All tests passed"
}

serve() {
    echo ""
    echo "=== Dev server ==="
    echo "  Library: http://localhost:8080/docs/"
    echo ""
    cd "$ROOT"
    python3 -m http.server 8080
}

case "${1:-all}" in
    euler)   build_euler ;;
    compute) build_compute ;;
    gpu)     build_gpu ;;
    wit)     build_wit ;;
    sorting) build_sorting ;;
    stack)   build_stack ;;
    test)    run_tests ;;
    docs)    build_euler; build_sorting; build_stack; build_docs ;;
    serve)   build_euler; build_sorting; build_stack; build_docs; serve ;;
    all)     build_euler; build_compute; build_gpu; build_wit; build_sorting; build_stack ;;
    *)       echo "Usage: $0 {euler|sorting|stack|compute|gpu|wit|docs|test|serve|all}"; exit 1 ;;
esac

echo ""
echo "Done."
