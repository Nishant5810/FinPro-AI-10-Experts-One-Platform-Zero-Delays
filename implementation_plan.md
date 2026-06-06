# Implementation Plan - Transition to Python FastAPI & Vanilla HTML/CSS/JS

This plan details the complete migration of the **FinPro AI** platform from a Next.js (Node/React/TS) stack to a high-performance, lightweight **Python FastAPI backend + Vanilla HTML/CSS/JS frontend**.

We will also directly address the business legal risks by drafting and embedding a legally binding **Financial Copilot Waiver / Terms of Service** within the user interface, protecting the platform from calculation liability.

---

## User Review Required

> [!IMPORTANT]
> **Port Mapping & Transition**: To make the transition clean, we will shut down the Node Next.js development server (running on port 3000) and spin up the FastAPI server on **port 8000** (or port 3000, as preferred).
>
> We will also download and vendor standard lightweight client-side libraries (`marked.js` for markdown rendering, `pdf-lib.js` for client-side PDF downloads) so the app runs instantly and efficiently offline with zero script loads.

---

## Proposed Changes

### Component 1: Python Backend Framework

We will build the backend using **FastAPI**, an asynchronous, lightweight Python web framework. It will run under `uvicorn` and manage both the live Anthropic Claude API streams and serve the static HTML files.

#### [NEW] [main.py](file:///c:/projects/CA/main.py)
The primary FastAPI server module that:
1. Sets up CORS and mounts the `static` directory.
2. Directs `/api/ai` to the Claude stream handler (with automated variable-speed mock streaming fallback when `ANTHROPIC_API_KEY` is missing in the `.env` file).
3. Serves the primary entrypoint `/`.

#### [NEW] [requirements.txt](file:///c:/projects/CA/requirements.txt)
Python package specifications:
- `fastapi` & `uvicorn` for async routing and server operations.
- `anthropic` for LLM Claude integrations.
- `python-dotenv` for local environment bindings.

#### [NEW] [.env](file:///c:/projects/CA/.env)
Stores environment configurations including `ANTHROPIC_API_KEY`.

---

### Component 2: Vanilla Frontend & Theme Layout

We will group all frontend components into a single, high-fidelity `static` directory. The visual aesthetics will remain fully premium, utilizing the **Outfit** Google Font, custom glassmorphism containers, radial indicators, slide-up animations, and distinct theme colors for the 9 modules.

#### [NEW] [index.html](file:///c:/projects/CA/static/index.html)
The dashboard command center containing:
1. Dynamic sidebar navigation links for all 9 modules.
2. Consolidated **Financial Health Scorecard** radial SVG, and the **Unified Compliance Calendar** checklist.
3. Interactive query form featuring a collapsible drag-and-drop **FileUploader dropzone** for horizontal YoY statements.
4. **Legally Binding Copilot Waiver Warning** panel in the output console to indemnify the platform.

#### [NEW] [app.css](file:///c:/projects/CA/static/app.css)
Global styling parameters, grid structures, custom visual scrollbars, animations, and the core HSL color configurations.

#### [NEW] [app.js](file:///c:/projects/CA/static/app.js)
Vanilla JavaScript logic handling:
1. **Dynamic Tab Routing**: Swapping between modules, quick actions, and history pages completely inside the DOM without page reloads.
2. **File Uploader Logic**: Simulated storage uploads with percentage counts.
3. **SSE Streaming Handler**: Streams data line-by-line directly into a rendered markdown display using a client-side parser.
4. **Client-Side PDF Downloader**: Re-implemented multi-page compilation via `pdf-lib` in vanilla JS.

#### [NEW] [mockEngine.js](file:///c:/projects/CA/static/mockEngine.js)
Stores the structured comparative data responses for CA, CS, CMA, and other modules, complete with Horizontal YoY balance sheet metrics.

---

### Component 3: Legal Disclaimers & Indemnity

#### [NEW] [terms.md](file:///c:/projects/CA/legal/terms.md)
The formal **Terms of Service & AI Financial Copilot Liability Waiver** that specifies:
- The platform functions strictly as an analytical accelerator, not a professional replacement.
- Qualified practitioners must sign off on all filings.
- Complete waiver of calculation error liability.

---

## Verification Plan

### Automated Verification
1. We will verify the Python environment is set up and FastAPI boots smoothly.
2. We will run the FastAPI production server using `uvicorn main:app --reload`.

### Manual Verification
- Test that clicking different modules (CA, CS, CMA) adapts the colors, quick actions, and laws perfectly.
- Upload two balance sheet files and click "Generate Report" to verify the horizontal YoY analysis streams chunk-by-chunk.
- Download the generated PDF and inspect the professional waiver disclaimer printed at the bottom of the page.
