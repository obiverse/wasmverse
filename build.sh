#!/bin/bash
# ============================================================================
# wasmverse build script
# ============================================================================
#
# Usage:
#   ./build.sh           # Build all three paths
#   ./build.sh compute   # Build only path 1 (compute engine)
#   ./build.sh gpu       # Build only path 2 (gpu renderer)
#   ./build.sh wit       # Build only path 3 (wit components)
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

serve() {
    echo ""
    echo "=== Starting dev server ==="
    echo "  Path 1 (Compute): http://localhost:8080/web/compute/"
    echo "  Path 2 (GPU):     http://localhost:8080/web/gpu/"
    echo "  Path 3 (WIT):     http://localhost:8080/web/wit/"
    echo ""
    cd "$ROOT"
    python3 -m http.server 8080
}

case "${1:-all}" in
    compute) build_compute ;;
    gpu)     build_gpu ;;
    wit)     build_wit ;;
    serve)   build_compute; build_gpu; build_wit; serve ;;
    all)     build_compute; build_gpu; build_wit ;;
    *)       echo "Usage: $0 {compute|gpu|wit|serve|all}"; exit 1 ;;
esac

echo ""
echo "Done. Run './build.sh serve' to start the dev server."
