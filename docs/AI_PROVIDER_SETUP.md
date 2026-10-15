# Flow AI Studio — AI Provider Setup & Architecture Guide

This document describes the exact setup instructions, credentials, endpoints, payload formats, and verification routines for integrating real AI generation providers with **Flow AI Studio**.

---

## 1. Security Architecture Principles

- **Zero Client Secrets**: Third-party API keys (`OPENAI_API_KEY`, `STABILITY_API_KEY`, `RUNWAY_API_KEY`, `REPLICATE_API_KEY`) must **NEVER** be stored in frontend `.env` files or prefixed with `VITE_`.
- **Serverless Edge Function Proxy**: All generation requests from the browser route through Supabase Edge Functions (`/functions/v1/generate-image` and `/functions/v1/generate-video`).
- **Quota Validation Prior to Dispatch**: Edge functions verify that the requesting user possesses adequate credits before calling provider endpoints.
- **Fail-Safe Refunds**: In case of provider HTTP errors (e.g. 429 rate limit or 500 provider error), reserved credits are automatically refunded to the user's ledger.

---

## 2. Supported AI Providers

### A. OpenAI DALL-E 3 (Image Generation)
- **Primary Use**: High-fidelity creative images, prompt adherence, style fidelity.
- **Endpoint**: `https://api.openai.com/v1/images/generations`
- **Method**: `POST`
- **Headers**:
  ```http
  Authorization: Bearer $OPENAI_API_KEY
  Content-Type: application/json
  ```
- **Payload Schema**:
  ```json
  {
    "model": "dall-e-3",
    "prompt": "Cyberpunk city with flying cars and neon rain",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "response_format": "url"
  }
  ```
- **Configuration Step**:
  In Supabase CLI / Dashboard -> Project Settings -> Edge Functions -> Secrets:
  ```bash
  supabase secrets set OPENAI_API_KEY=sk-proj-...
  ```

---

### B. Stability AI (Stable Diffusion XL / SD3)
- **Primary Use**: Fast image generation with negative prompt support and customizable aspect ratios.
- **Endpoint**: `https://api.stability.ai/v2beta/stable-image/generate/core`
- **Method**: `POST`
- **Headers**:
  ```http
  Authorization: Bearer $STABILITY_API_KEY
  Accept: application/json
  ```
- **Payload Schema (multipart/form-data)**:
  - `prompt`: Text description
  - `aspect_ratio`: "1:1", "16:9", "9:16", "4:3", etc.
  - `negative_prompt`: Unwanted features
  - `output_format`: "png"
- **Configuration Step**:
  ```bash
  supabase secrets set STABILITY_API_KEY=sk-...
  ```

---

### C. Replicate (Video Generation — Stable Video Diffusion / Flux)
- **Primary Use**: Text-to-Video and Image-to-Video synthesis.
- **Endpoint**: `https://api.replicate.com/v1/predictions`
- **Method**: `POST`
- **Headers**:
  ```http
  Authorization: Bearer $REPLICATE_API_KEY
  Content-Type: application/json
  ```
- **Payload Schema (Image-to-Video)**:
  ```json
  {
    "version": "3f0457e4619da81c5031f72741d45ff89d7aa7eed7f5d379d1a342502660b638",
    "input": {
      "input_image": "https://storage.supabase.co/user-assets/sample.png",
      "video_length": "14_frames_with_svd",
      "sizing_strategy": "maintain_aspect_ratio",
      "frames_per_second": 6
    }
  }
  ```
- **Polling Lifecycle**:
  - GET `https://api.replicate.com/v1/predictions/{prediction_id}`
  - Check status: `starting` -> `processing` -> `succeeded` -> `failed`.
- **Configuration Step**:
  ```bash
  supabase secrets set REPLICATE_API_KEY=r8_...
  ```

---

### D. RunwayML (Gen-2 API)
- **Primary Use**: High-definition cinematic text-to-video.
- **Endpoint**: `https://api.runwayml.com/v1/tasks`
- **Method**: `POST`
- **Headers**:
  ```http
  Authorization: Bearer $RUNWAY_API_KEY
  X-Runway-Version: 2024-09-13
  Content-Type: application/json
  ```
- **Configuration Step**:
  ```bash
  supabase secrets set RUNWAY_API_KEY=rw_...
  ```

---

## 3. Graceful Missing-Credentials Mode

When live provider keys are not yet configured:
1. The frontend generator detects unconfigured state from server settings.
2. A non-intrusive **Setup Guide Banner** displays the missing environment variable name.
3. Users are guided to configure credentials via Supabase Edge Function Secrets.
4. The system never displays fabricated success states or mock images when a live call was requested.
