# Lecture Example — Delegated event boundary

## Concept demonstrated

One listener on a stable ancestor can interpret events originating in a changing child collection.

## Why this example is in the lecture

The page makes `target`, `closest`, `currentTarget`, and bubbling visible with only two buttons and one listener.

## What to observe

- Clicking the nested `<span>` still resolves the containing action button.
- `event.target` names the originating element.
- `event.currentTarget` remains the stable list that owns the listener.
- Task identity comes from the closest row's `dataset`.

## Run / inspect

Open `index.html` in a browser and click either button. For a repeatable headless check from this directory:

```bash
google-chrome --headless --no-sandbox --disable-gpu --virtual-time-budget=1000 --dump-dom index.html
```

## Explanation

The list listener calls `closest` twice: once to identify an action and once to identify the domain row. Newly inserted rows would use the same listener without additional binding.

## Variations

- Append a third task after binding and confirm that it works.
- Click the whitespace inside the list and observe the guarded no-op path.

## Validation

Validated in headless Chromium. The page programmatically clicks the nested label after load and writes `target=SPAN; currentTarget=tasks; action=toggle; task=t-1` to `#result`.
