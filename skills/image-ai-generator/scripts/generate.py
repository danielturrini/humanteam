#!/usr/bin/env python3
"""
Image Generator — OpenSquad Skill
Generates images through Higgsfield CLI or Magnific MCP.

Two image engines are official for this project (see providers.md at the repo root):

    higgsfield_cli  -> this script drives the CLI end to end (--prompt / --batch)
    magnific_mcp    -> Claude calls the `mcp__magnific__*` tools directly and then hands the
                       resulting URL/file to --save-external, so both engines land in the exact
                       same folder structure with the same metadata.

Engine resolution: explicit user request -> HUMAN_IMAGE_PROVIDER env -> only one available ->
both available: ASK the user (once per run) -> none: do not render, keep the prompts.
Run with --check-providers to see what is available.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)
URL_RE = re.compile(r"https://[^ \"']+\.(?:png|jpg|jpeg|webp)(?:\?[^ \"']*)?", re.I)


def check_providers() -> None:
    """Report the available image engines. Higgsfield is probed here; Magnific lives in the
    MCP layer, so only Claude can confirm it — we return the instructions."""
    if not shutil.which("higgsfield"):
        higgs = {
            "available": False,
            "status": "missing",
            "message": "Higgsfield CLI not found.",
            "fix": "npm install -g @higgsfield/cli",
        }
    else:
        status = run_cmd(["higgsfield", "account", "status"], timeout=60)
        if status.returncode == 0:
            higgs = {"available": True, "status": "ok", "message": "Higgsfield CLI installed and authenticated."}
        else:
            higgs = {
                "available": False,
                "status": "login_required",
                "message": "Higgsfield CLI is installed but not authenticated.",
                "fix": "higgsfield auth login",
            }

    preferred = os.environ.get("HUMAN_IMAGE_PROVIDER", "").strip().lower() or None
    if preferred not in {"higgsfield", "magnific"}:
        preferred = None

    print(json.dumps({
        "preferred_provider_env": preferred,
        "providers": {
            "higgsfield_cli": higgs,
            "magnific_mcp": {
                "available": "unknown_from_script",
                "message": "Check the session for mcp__magnific__* tools. If deferred, use ToolSearch with the query 'magnific'.",
                "fix": "claude mcp add --transport http --scope user magnific https://mcp.magnific.com/mcp",
                "save_results_with": "--save-external",
            },
        },
        "resolution_order": [
            "1. explicit user request",
            "2. env HUMAN_IMAGE_PROVIDER (higgsfield|magnific)",
            "3. only one available -> use it, do not ask",
            "4. both available -> ASK the user which engine to use (once per run)",
            "5. none -> do not render; keep the prompts and guide the setup",
        ],
        "ask_user_when_both_available": True,
        "ask_user_prompt": "Posso gerar as imagens por dois motores: Higgsfield ou Magnific. Qual voce prefere?",
    }, indent=2, ensure_ascii=False))
    sys.exit(0 if higgs["available"] else 2)


def save_external(
    url: str | None,
    file_path: str | None,
    output: str,
    provider: str,
    model: str | None,
    prompt: str | None,
    aspect_ratio: str | None,
    reference_images: list[str] | None,
) -> None:
    """Save an image generated outside the CLI (e.g. Magnific MCP) in the house format."""
    if url:
        with urllib.request.urlopen(url, timeout=180) as resp:
            image_bytes = resp.read()
    else:
        src = Path(file_path or "").expanduser().resolve()
        if not src.exists():
            print(f"ERROR: file does not exist: {src}", file=sys.stderr)
            sys.exit(1)
        image_bytes = src.read_bytes()

    if not image_bytes:
        print("ERROR: empty image.", file=sys.stderr)
        sys.exit(1)

    out = Path(output).expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(image_bytes)

    print(json.dumps({
        "status": "ok",
        "provider": provider,
        "model": model,
        "aspect_ratio": aspect_ratio,
        "prompt": prompt,
        "references": reference_images or [],
        "output": str(out),
        "output_size_kb": len(image_bytes) // 1024,
        "source_url": url,
        "source_file": str(Path(file_path).expanduser().resolve()) if file_path else None,
    }, ensure_ascii=False))
    sys.exit(0)


def model_for_mode(mode: str, asset_type: str = "image") -> str:
    if asset_type == "kv":
        return os.environ.get("HIGGSFIELD_KV_MODEL", "gpt_image_2")
    if mode == "production":
        return os.environ.get("HIGGSFIELD_IMAGE_MODEL_PRODUCTION", os.environ.get("HIGGSFIELD_IMAGE_MODEL", "nano_banana_2"))
    return os.environ.get("HIGGSFIELD_IMAGE_MODEL_TEST", os.environ.get("HIGGSFIELD_IMAGE_MODEL", "nano_banana_2"))


def image_resolution() -> str:
    resolution = os.environ.get("HIGGSFIELD_IMAGE_RESOLUTION", "2k").lower()
    return resolution if resolution in {"1k", "2k", "4k"} else "2k"


def run_cmd(args: list[str], timeout: int = 1800) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout, check=False)


def ensure_higgsfield() -> None:
    if not shutil.which("higgsfield"):
        print("ERROR: Higgsfield CLI not found. Install with: npm install -g @higgsfield/cli", file=sys.stderr)
        sys.exit(1)
    status = run_cmd(["higgsfield", "account", "status"], timeout=60)
    if status.returncode != 0:
        print("ERROR: Higgsfield CLI is not authenticated. Run: higgsfield auth login", file=sys.stderr)
        print(status.stdout[:800], file=sys.stderr)
        sys.exit(1)


def first_uuid(text: str) -> str | None:
    match = UUID_RE.search(text)
    return match.group(0) if match else None


def first_url(text: str) -> str | None:
    match = URL_RE.search(text)
    return match.group(0) if match else None


def upload_reference(path: str) -> str | None:
    result = run_cmd(["higgsfield", "upload", "create", path], timeout=300)
    return first_uuid(result.stdout)


def generate_image(
    prompt: str,
    output_path: str,
    mode: str,
    reference_images: list[str] | None = None,
    aspect_ratio: str | None = None,
    asset_type: str = "image",
    quality: str | None = None,
) -> bool:
    ensure_higgsfield()
    model = model_for_mode(mode, asset_type=asset_type)
    resolution = image_resolution()
    out = Path(output_path).expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    args = ["higgsfield", "generate", "create", model, "--prompt", prompt, "--resolution", resolution, "--json"]
    if aspect_ratio:
        args.extend(["--aspect_ratio", aspect_ratio])
    if quality and model == "gpt_image_2":
        args.extend(["--quality", quality])
    reference_images = reference_images or []
    if asset_type == "kv" and not reference_images:
        print("ERROR: KV generation requires at least one --reference image, preferably a KV/design reference with lettering.", file=sys.stderr)
        return False
    uploaded_refs: list[str] = []
    for reference_image in reference_images:
        ref = upload_reference(reference_image)
        if not ref:
            print(f"  Could not upload reference image: {reference_image}", file=sys.stderr)
            return False
        uploaded_refs.append(ref)
        args.extend(["--image", ref])

    create = run_cmd(args, timeout=300)
    job_id = first_uuid(create.stdout)
    if not job_id:
        print(f"  Higgsfield did not return a job id: {create.stdout[:800]}", file=sys.stderr)
        return False

    wait = run_cmd(["higgsfield", "generate", "wait", job_id, "--wait-timeout", "30m", "--json"], timeout=2100)
    url = first_url(create.stdout + "\n" + wait.stdout)
    if not url:
        print(f"  Higgsfield did not return an image URL: {wait.stdout[:800]}", file=sys.stderr)
        return False

    with urllib.request.urlopen(url, timeout=120) as resp:
        out.write_bytes(resp.read())

    print(json.dumps({
        "status": "ok",
        "provider": "higgsfield_cli",
        "model": model,
        "asset_type": asset_type,
        "resolution": resolution,
        "quality": quality if model == "gpt_image_2" else None,
        "references": reference_images,
        "uploaded_references": uploaded_refs,
        "job_id": job_id,
        "output": str(out),
        "url": url,
    }, ensure_ascii=False))
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate images via Higgsfield CLI or Magnific MCP")
    parser.add_argument("--check-providers", action="store_true", help="Report which image engines are available and exit")
    parser.add_argument("--save-external", action="store_true", help="Save an image generated outside the CLI (e.g. Magnific MCP)")
    parser.add_argument("--from-url", help="With --save-external: URL returned by the provider")
    parser.add_argument("--from-file", help="With --save-external: local file returned by the provider")
    parser.add_argument("--provider", default="magnific_mcp", help="With --save-external: engine name recorded in the metadata")
    parser.add_argument("--model", help="With --save-external: tool/model name used by the provider")
    parser.add_argument("--prompt", help="Text prompt for single image generation")
    parser.add_argument("--output", help="Output file path for single image")
    parser.add_argument("--batch", help="Path to JSON batch file")
    parser.add_argument("--mode", choices=["test", "production"], default="test")
    parser.add_argument("--asset-type", choices=["image", "kv"], default="image", help="Use kv for integrated key visuals rendered via gpt_image_2")
    parser.add_argument("--reference", action="append", help="Path to reference image. Repeat for KV reference, logo, brand assets.")
    parser.add_argument("--aspect-ratio", help="Optional aspect ratio, e.g. 9:16, 4:5, 16:9")
    parser.add_argument("--quality", choices=["low", "medium", "high"], help="Quality for gpt_image_2. Defaults to high for KV.")
    args = parser.parse_args()

    if args.check_providers:
        check_providers()

    if args.save_external:
        if bool(args.from_url) == bool(args.from_file):
            parser.error("--save-external requires exactly one of --from-url or --from-file")
        if not args.output:
            parser.error("--output is required with --save-external")
        save_external(
            args.from_url, args.from_file, args.output, args.provider,
            args.model, args.prompt, args.aspect_ratio, args.reference,
        )

    if not args.prompt and not args.batch:
        parser.error("Either --prompt or --batch is required")

    if args.batch:
        items = json.loads(Path(args.batch).read_text(encoding="utf-8"))
        success = 0
        for item in items:
            ok = generate_image(
                item["prompt"],
                item["output"],
                args.mode,
                reference_images=item.get("references") or ([item["reference"]] if item.get("reference") else args.reference),
                aspect_ratio=item.get("aspect_ratio") or args.aspect_ratio,
                asset_type=item.get("asset_type") or args.asset_type,
                quality=item.get("quality") or args.quality or ("high" if (item.get("asset_type") or args.asset_type) == "kv" else None),
            )
            success += 1 if ok else 0
        sys.exit(0 if success == len(items) else 1)

    if not args.output:
        parser.error("--output is required for single image generation")
    ok = generate_image(
        args.prompt,
        args.output,
        args.mode,
        reference_images=args.reference,
        aspect_ratio=args.aspect_ratio,
        asset_type=args.asset_type,
        quality=args.quality or ("high" if args.asset_type == "kv" else None),
    )
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
