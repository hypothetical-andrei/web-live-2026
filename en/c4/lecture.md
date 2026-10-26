# Lecture 04 — HTML, CSS, Responsive UI and Accessibility

> Planned duration: 95 minutes  
> Format: three concept blocks, six worked examples, and three retrieval intermezzos

## Learning outcomes

By the end of this lecture, you should be able to choose semantic HTML, express accessible form relationships, diagnose the cascade, calculate box sizes, use Flexbox to position items within a container, identify the containing block for positioned elements, choose Flexbox or Grid, build content-responsive layouts, preserve focus and preference behavior, and review generated markup/CSS with structural and browser evidence.

## Session map

| Segment | Time | Focus |
| --- | ---: | --- |
| Opening document walkthrough | 0–7 min | Identify content and its relationships |
| Concept block 1 | 7–29 min | Document elements, structure, forms |
| Intermezzo 1 | 29–33 min | Semantic relationship checks |
| Concept block 2 | 33–57 min | Cascade, inheritance, box model |
| Intermezzo 2 | 57–61 min | Cascade and sizing checks |
| Concept block 3 | 61–82 min | Flow, positioning, Flex, Grid, focus |
| Intermezzo 3 | 82–86 min | Layout and preference checks |
| Synthesis | 86–95 min | Evidence-driven UI review |

## Opening — describe the document before styling it

Open the [workshop page](examples/01-semantic-form-relationships/workshop.html) and keep its HTML source beside the browser. It has a title, introductory paragraphs, a link to the venue, an image, a list of prerequisites, a timetable, and a registration form. These parts have different purposes even before we choose their fonts, colors, or positions.

Start by identifying the information and its relationships. Mark those relationships in HTML, use CSS to present them, and add JavaScript where interaction requires it. This order makes the page easier to understand and change: a new visual design should not require rewriting its content structure.

## Concept block 1 — from document structure to forms

### 1. HTML represents a structured hypertext document

HTML began as markup for linked documents and still describes a document's content and structure. A browser parses the markup into an element tree, the DOM introduced in Lecture 03. Nesting expresses relationships: list items belong to a list, table cells belong to rows, and labels identify form controls.

A minimal document has a `head` for metadata, including its `title`, and a `body` for page content. Within the body, headings divide the content into named sections and paragraphs express units of prose. The document title names the page; a heading names content within it.

An element is written using tags; attributes on its start tag configure or describe that element. In `<a href="#schedule" class="section-link">Timetable</a>`, `a` is the element name, `href` and `class` are attribute names, and the quoted strings are their values. The text between the tags is the link's content. Some elements, such as `input` and `img`, have no closing tag or child content.

Some attributes apply to particular elements: `href` gives an anchor its destination, while `src` identifies an image's source. **Global attributes** are available on all HTML elements, although their effects depend on the element and context. You will encounter:

| Attribute | Purpose |
| --- | --- |
| `id` | Identifies one element uniquely within the document; used by fragment links, labels, CSS, and scripts. |
| `class` | Assigns space-separated class names that multiple elements can share, commonly for CSS selectors. |
| `lang` | Declares the language of an element's content; descendants inherit it unless they specify another language. |
| `title` | Supplies advisory information, often displayed as a tooltip; it is not a dependable replacement for a visible label. |
| `hidden` | Marks content as not currently relevant for display. |
| `data-*` | Stores custom data, such as `data-session="html"`, which your scripts can read through `dataset`. |

Some attributes are boolean: their presence enables the setting. For example, `required` makes an applicable form control required; `required="false"` still enables it. Omit the attribute to turn it off. Not all attributes work this way: `aria-invalid="false"`, introduced below, has a meaningful string value.

### 2. Choose elements from the purpose of the content

HTML's vocabulary distinguishes common kinds of information and interaction:

| Purpose | Elements | Structural relationship |
| --- | --- | --- |
| Headings and paragraphs | `h1`–`h6`, `p` | Heading levels express hierarchy; paragraphs group prose. |
| Links | `a` with `href` | Connect a document to another resource or a location within a document. |
| Images | `img`, optionally `figure` and `figcaption` | Embed visual content; provide an appropriate text alternative and a caption when needed. |
| Lists | `ul`, `ol`, `li`; `dl`, `dt`, `dd` | Represent unordered items, ordered sequences, or terms and descriptions. |
| Tables | `table`, `caption`, `tr`, `th`, `td` | Relate data through rows, columns, and headers. |
| Forms | `form`, `label`, `input`, `select`, `textarea`, `button` | Collect named values and offer controls for submission or actions. |
| Audio and video | `audio`, `video`, `source`, `track` | Embed timed media with playback controls and supporting tracks such as captions. |

Audio and video were later additions to this vocabulary. The organizing principle remains the purpose of the content: use a table for data with row/column relationships, a list for items, and a paragraph for prose. Spaces, line breaks, and visual alignment cannot express all of these relationships.

For the workshop page, ask: are the prerequisites ordered steps or an unordered list? Does the timetable relate sessions to times and rooms? Is the venue text a link or an action control? These decisions determine the markup before layout begins.

### 3. Separate structure from presentation

Browsers supply default styles, so headings usually look larger and links are often underlined. Those defaults are changeable; a heading's level describes its place in the document, not a requested font size.

HTML's history includes presentational elements such as `font` and `center`, and presentational attributes such as `bgcolor`. CSS moves these choices into style rules that can be shared and changed independently. This separation reduces repeated formatting and lets the same content adapt to different screens or print.

Generic containers, `div` and `span`, group content without naming a particular kind of region. They remain useful when no more specific element fits. Later semantic region elements such as `header`, `nav`, `main`, `article`, `aside`, and `footer` let authors state the purpose of many groups explicitly. This is an extension of HTML's structural vocabulary, rather than a replacement of paragraphs, lists, or generic containers.

The separation has practical limits. CSS `::before` and `::after` can generate displayed content without adding ordinary DOM elements. Use them for decoration or supplementary presentation; keep essential instructions and information in the document rather than making a stylesheet their only source.

### 4. Structure determines reading and navigation

Arrange the workshop page in a meaningful source order: introduction, prerequisites, timetable, registration. Use heading levels to express sections and subsections. A `header` groups introductory material; `nav` identifies navigation links; `main` identifies the main content. These names make structure explicit for maintainers and can expose useful regions to assistive technology.

Links and buttons also have different purposes. An anchor with `href` navigates to a resource or location. A button performs an action, such as submitting a form. Their native focus and keyboard behavior follow these purposes. Choosing the element first avoids having to reconstruct that behavior with click handlers on generic containers.

### 5. Forms submit data; controls provide standard inputs

In the traditional web application cycle, you load an HTML page containing a form, fill in its controls, and click Submit. The browser collects the named controls' values as key–value pairs and sends them to the URL in `action`, using the form's `method`. With `GET`, the encoded pairs go in the URL query; with `POST`, they normally go in the request body. The server's response is displayed as the next page.

For example, `<input name="email" type="email">` contributes a pair such as `email=alex@example.com`. The `name` supplies the submitted key; `id` lets a label or script identify the element. Disabled controls and unchecked checkboxes or radio buttons are not included.

In a single-page application, you commonly handle the form's `submit` event in JavaScript and call `event.preventDefault()` to stop that navigation. You can then read the values, send a request with `fetch`, and update the current page. The controls still give you standard text fields, checkboxes, radio buttons, selectors, buttons, keyboard behavior, and browser validation.

Open the workshop page and inspect its `action`, `method`, and control names. Its local demonstration uses `GET`: submit fictional values and inspect the resulting URL. It has no registration backend. Then examine how labels, hints, and groups help you use those controls.

### 6. A form control needs an accessible name

A visible `<label>` associated through `for` and `id`, or explicit containment, gives the input a persistent name and a larger activation target. Placeholder text is not a substitute.

### 7. Descriptions supplement names

**ARIA** stands for **Accessible Rich Internet Applications**. It defines roles, states, and properties through which you can describe an interface to assistive technology, such as a screen reader. Browsers use native HTML semantics together with applicable ARIA information to build an accessibility tree: a representation of elements' roles, names, states, and relationships.

Attributes beginning with `aria-` describe properties or states; `role` can identify an element's role. For example, `aria-describedby="email-help"` refers to the element whose `id` is `email-help`. These attributes do not add keyboard handling, validate input, or change appearance. Prefer the native HTML element when it already provides what you need: a real `button` supplies behavior that `role="button"` alone cannot.

Instructions and format hints can be connected with `aria-describedby`. The label answers “what field is this?”; the description answers “what should I know about it?”

### 8. Groups need group semantics

Use `fieldset` and `legend` for related radio buttons or checkboxes. Repeating a visual heading does not create the same programmatic relationship.

### 9. Input types carry behavior

Types such as `email`, `url`, `date`, and `number` can provide appropriate keyboards, parsing expectations, and native validation affordances. Use the type that matches the value being collected.

### 10. Worked example — semantic form relationships

Run [semantic form relationships](examples/01-semantic-form-relationships/):

```bash
node lectures/04-html-css-accessibility/en/examples/01-semantic-form-relationships/validate.js
```

Then navigate with Tab, Shift+Tab, arrow keys, and Enter. Notice how much behavior exists without custom JavaScript.

### 11. Accessibility state must be connected

For validation, associate inline errors, update `aria-invalid` when appropriate, provide a focusable summary for submission failure, and move focus deliberately so the error is discoverable.

### 12. DOM order is the interaction order

CSS can visually rearrange content, but keyboard and reading order generally follow the DOM. Keep source order meaningful rather than using visual placement to repair poor structure.

## Intermezzo 1 — semantic relationships

Use questions prefixed `u04-i1-` in [intermezzo.gift](intermezzo.gift). Take four minutes to answer, then explain how a native button differs from a styled `div`.

## Concept block 2 — cascade, inheritance, and sizing

### 13. Resolve competing declarations in order

A CSS rule has a selector and a declaration block: `p { color: navy; }` selects paragraphs and declares a value for their `color`. Several rules can match the same element. The **cascade** chooses a value for each property separately; it does not choose one whole rule and discard the others.

For the ordinary stylesheet rules you write in this lecture—without `!important`, inline styles, animations, transitions, or `@scope`—use this decision order:

1. **Find applicable declarations.** Keep rules whose selectors match the element and whose conditions, such as media queries, are satisfied. Compare declarations for the same property.
2. **Compare origins.** For normal declarations, your page's author stylesheet takes precedence over user styles, which take precedence over browser defaults. A browser's more specific default selector does not defeat your author rule.
3. **Compare layers within that origin.** For normal declarations, a later declared layer wins over an earlier layer. Unlayered declarations take precedence over named layers.
4. **Compare selector specificity within the winning layer.** A selector with a higher CSS specificity wins even if its rule appears earlier.
5. **Use order of appearance for equal specificity.** If the earlier comparisons tie, the later declaration wins.

Within one layer—or when you use no layers—the central comparison is therefore **higher specificity first, later appearance on a tie**. Layer ordering lets you establish precedence between groups of rules before comparing their selectors.

This list deliberately covers normal stylesheet rules. `!important` changes origin precedence and reverses layer precedence; inline styles have their own precedence over selector-based rules of the same importance. Scoped rules add a proximity comparison after specificity. You do not need these mechanisms for the examples below.

### 14. Specificity is a CSS calculation, not logical narrowness

For the selectors below, count three components and compare them from left to right:

1. ID selectors, such as `#registration`.
2. Class selectors, attribute selectors, and ordinary pseudo-classes, such as `.note`, `[required]`, and `:hover`.
3. Element selectors and pseudo-elements, such as `p` and `::before`.

| Selector | Specificity (IDs, classes/attributes/pseudo-classes, elements/pseudo-elements) |
| --- | --- |
| `p` | `(0, 0, 1)` |
| `div p` | `(0, 0, 2)` |
| `div > p` | `(0, 0, 2)` |
| `.note` | `(0, 1, 0)` |
| `p.note` | `(0, 1, 1)` |
| `#registration p` | `(1, 0, 1)` |

Compare the first differing component; do not add the components into one total. Thus `.note` beats `div p`, and an ID selector beats any number of class selectors in this comparison.

Combinators—spaces, `>`, `+`, and `~`—add no specificity. `div > p` matches only paragraphs that are direct children of a `div`; `div p` also matches more deeply nested paragraphs. The first selects a subset of the second, yet both have specificity `(0, 0, 2)`. CSS does not determine priority by proving which matched set is narrower.

The universal selector `*` also adds no specificity. Some functional pseudo-classes have special rules: `:where(...)` contributes zero, while `:is(...)`, `:not(...)`, and `:has(...)` take the specificity of their most specific argument. Use the simple selectors in the table to establish the basic calculation first.

### 15. Layers order groups of rules explicitly

```css
@layer reset, base, components, utilities;
```

This statement establishes layer order. For normal declarations, `utilities` takes precedence over `components`, then `base`, then `reset`, regardless of their selectors' specificity. Within each layer, compare specificity and then order of appearance as usual. Without layers, your normal stylesheet rules share the unlayered group.

### 16. Worked example — cascade layer order

Open [cascade layer order](examples/02-cascade-layer-order/). A class rule in the later `theme` layer defeats an ID-plus-class rule in `legacy`. Reverse the declared layer order to isolate the cause.

### 17. Trace a specificity tie

```html
<div><p class="note">Bring your laptop.</p></div>
```

```css
div > p { color: navy; } /* (0, 0, 2) */
div p   { color: teal; } /* (0, 0, 2): later, so it wins */
```

Both selectors match this paragraph. Its text is teal even though the earlier selector requires a direct child. Reverse the rules and the text becomes navy. Now add `.note { color: maroon; }` before both: maroon wins because `(0, 1, 0)` outranks `(0, 0, 2)`, regardless of appearance order. These comparisons assume all three declarations are normal author rules in the same layer.

### 18. Inheritance carries selected computed values

Properties such as `color` and font settings commonly inherit. Box dimensions and borders generally do not. An inherited value competes differently from a directly matched declaration.

### 19. Use DevTools computed styles

Inspect the winning declaration, crossed-out competitors, inherited source, layer, and computed value. Do not use `!important` to repair your own CSS. Fix the selector, layer placement, or conflicting declarations instead.

A targeted override can be appropriate when a third-party library injects a normal inline declaration you cannot change:

```html
<div class="vendor-panel" style="width: 900px">Library content</div>
```

```css
/* Override the vendor's injected inline width on narrow screens. */
@media (max-width: 40rem) {
  .vendor-panel { width: 100% !important; }
}
```

A more specific normal selector cannot override that inline width; the important declaration can. Keep the override narrow and explain which external declaration requires it. `!important` gives a declaration higher importance in the existing cascade; it does not increase selector specificity or start a separate cascade. This example overrides a normal inline declaration, not an inline declaration that itself uses `!important`.

### 20. What determines how an element is drawn?

Once you know which CSS declarations win, you still need to work out the result on screen. Inspect these factors:

1. **Content and source order:** text, images, controls, and the order and nesting of elements in the DOM.
2. **Available space:** the viewport and the containing block—the rectangle used to resolve an element's size and position.
3. **Layout mode:** `display` determines how boxes participate in layout, for example as block or inline content, or as items in Flexbox or Grid.
4. **Box dimensions:** width and height, minimum/maximum sizes, padding, border, margin, and `box-sizing`.
5. **Content sizing:** font metrics, line wrapping, and an image's natural dimensions can affect how much space content needs.
6. **Positioning:** `position` and offsets such as `top` and `left` can move a box or take it out of normal flow.
7. **Painting and overlap:** backgrounds, borders, shadows, clipping, transforms, and stacking order determine what is visible and which overlapping box appears above another.

Layout calculates sizes and locations; painting draws the result. A transform can move the painted box without rearranging its neighbors. `overflow` can clip content without making that content fit. These distinctions help you choose the property that actually changes the problem you see.

Start with the **box model**: content is surrounded by padding, then border, then margin. Padding is space inside the border; margin separates the box from its neighbors. Background normally extends through the padding and underneath the border, while margin is transparent. An element can generate several boxes—for example, inline text wrapping across lines—and `display: none` generates none.

### 21. `content-box` adds padding and border

With a declared width of 200px, 20px padding on each side, and 1px borders, the outer width is 242px under `content-box`.

### 22. `border-box` contains them

Under `border-box`, declared width includes content, padding, and border. This is usually easier for component constraints:

```css
*, *::before, *::after { box-sizing: border-box; }
```

### 23. Worked example — box model sizing

Open [box model sizing](examples/03-box-model-sizing/). The browser reports `242` versus `200` for otherwise identical boxes.

### 24. Content has its own size requirements

**Intrinsic sizing** means determining size from content rather than simply assigning a width from outside. Text depends on the font and available line breaks; an image has natural dimensions and an aspect ratio.

For text, `min-content` is roughly the narrowest width you can reach by taking all permitted wrapping opportunities, often the width of the longest unbreakable word. `max-content` is the width needed without optional line wrapping. These are content-based measurements, not fixed screen widths.

`border-box` changes how a declared size is measured; it does not guarantee that content fits. If a long URL overflows a card, inspect wrapping and minimum sizes. If an image is too wide, consider `max-width: 100%; height: auto`. Hiding overflow merely conceals the excess.

### 25. Prefer logical properties

`margin-inline`, `padding-block`, and `inline-size` express relationships relative to writing direction. They improve adaptability without duplicating left/right rules.

## Intermezzo 2 — cascade and sizing

Use questions prefixed `u04-i2-` in [intermezzo.gift](intermezzo.gift). Take four minutes to answer. Calculate the content-box width and explain the specificity tie before checking your answers.

## Concept block 3 — layout, responsiveness, and preferences

### 26. Begin with normal flow

In ordinary block layout, blocks follow one another vertically in a horizontal writing mode. Inline content, such as text and links, runs along lines and wraps when space runs out. A paragraph grows taller as its text wraps, moving subsequent content down.

`display: block`, `inline`, and `inline-block` change a box's participation in that layout. An inline-block sits within a line while accepting dimensions like a block. `display: flex` or `grid` establishes a different layout for the container's children. Changing `position` is a separate decision.

On the workshop page, paragraphs, the list, the timetable, and the form already appear in a useful sequence without coordinates. Preserve that flow for the main content. Use positioning when you need a deliberate offset, overlay, or attachment during scrolling.

### 27. Flexbox solves one-dimensional distribution

Flexbox coordinates items mainly along one axis. Use it for navigation rows, control groups, card interiors, and alignment where wrapping remains meaningful.

### 28. Allow Flex items to shrink when their content can wrap

Flex items have an automatic minimum size that can keep them as wide as their content requires. A long word or URL may therefore prevent an item from shrinking even when its container is narrow.

Set `min-width: 0` on the item when you want to allow it to shrink below that content-based minimum. Also provide appropriate wrapping, such as `overflow-wrap: anywhere` for long tokens, or another deliberate way to handle excess content. Shrinking the box alone does not make its text fit.

### 29. Grid coordinates rows and columns

Grid is appropriate when tracks and two-dimensional alignment define the layout. It can create explicit tracks or allow the browser to repeat tracks from available space.

### 30. Choose a positioning mode

`position` determines whether a box keeps its place in normal flow and how offsets are interpreted:

| Value | Space in normal flow | What offsets mean |
| --- | --- | --- |
| `static` (default) | Kept | Normal layout places the box; `top`, `right`, `bottom`, and `left` do not move it. |
| `relative` | Kept at its original location | Offsets shift the box from its normal position without moving its neighbors. |
| `absolute` | Removed | Offsets place the box within its absolute-positioning containing block. |
| `fixed` | Removed | Usually positioned relative to the viewport, remaining there while the document scrolls. |
| `sticky` | Kept | Offsets constrain the box relative to its nearest scrollport as you scroll, within its containing block. |

A **scrollport** is the visible window of a scroll container: the area through which you see its scrolling content. For the document, this is normally the browser viewport.

For a simple absolutely positioned badge, set `position: relative` on its card. That card becomes the badge's containing block. With no such ancestor, an absolutely positioned element uses the initial containing block; it does not automatically use its immediate parent. Other properties, such as `transform`, can also establish containing blocks, including for fixed positioning.

```css
.card { position: relative; }
.badge { position: absolute; top: .75rem; right: .75rem; }
```

The badge reserves no space, so provide enough padding if it would otherwise cover the card's text. For `sticky`, supply an offset such as `top: 0` and enough scrolling space; an ancestor's overflow settings can change which scrollport it follows.

When boxes overlap, `z-index` can control their stacking order in the relevant stacking context. A stacking context groups descendants for painting; increasing a child's `z-index` cannot lift it out of its ancestor's stacking context. You do not need a large arbitrary number to position a badge.

Open [Flex container and positioned child](examples/06-flex-positioned-container/). Inspect the toolbar's `display: flex`, `justify-content`, `align-items`, and `gap`, then the card's `position: relative` and badge's `position: absolute`. Toggle the badge to `static`: it returns to flow. Restore it and remove the card's positioning: inspect where the badge is now anchored.

### 31. Responsive means content adapts

A responsive layout works across available space, zoom, font size, content length, and user preferences. It is not a list of named devices.

### 32. Start narrow and add a breakpoint when content needs it

Begin with a usable single-column flow. Add a media or container condition where the current relationships become crowded—not because a device table names that width.

### 33. Let Grid choose how many columns fit

```css
.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}
```

Read this from the inside out:

- `min(100%, 14rem)` chooses the smaller of the container width and 14rem. This lets a single column fit even when the container is narrower than 14rem.
- `minmax(..., 1fr)` uses that value as a minimum track width and lets the column share remaining space. `fr` represents a fraction of the space available to flexible tracks.
- `repeat(auto-fit, ...)` fits as many columns as the container allows, accounting for gaps, and collapses empty tracks.

This is often called an **intrinsic responsive layout**: the column count follows the available space and your sizing constraints instead of a list of viewport breakpoints. It is not a separate kind of Grid. In this particular rule, 14rem is a width you chose; it is not a measured intrinsic size of the card's content. Keep this distinction separate from `min-content` and `max-content` in section 24.

### 34. Worked example — automatically fitting card columns

Resize [automatically fitting card columns](examples/04-intrinsic-card-grid/). At narrow widths, you get one column; with sufficient space, all three cards fit side by side. The longer card determines the height needed for its row rather than having its text clipped by a fixed height. Inspect the computed columns and account for container padding and gaps when predicting the next column count.

### 35. Show which control has keyboard focus

**Focus** identifies the element currently receiving keyboard input. Press Tab on the workshop page to move between links and form controls; type when a text input has focus. Focus is different from hovering with the pointer and from marking a navigation item as selected.

You need to see where keyboard input will go. Browsers normally draw a focus indicator, often an outline. Keep that indicator or supply an equally clear replacement:

```css
:focus-visible {
  outline: 3px solid #174ea6;
  outline-offset: 3px;
}
```

`:focus` matches the focused element. `:focus-visible` matches when the browser also determines that a visible indicator is appropriate, commonly during keyboard navigation and for text entry. It is not simply a test for whether the last action was a keypress. An outline is drawn without taking layout space, so showing it does not move surrounding content. Do not remove outlines globally with `outline: none`.

### 36. Preferences are input to design

`prefers-reduced-motion` can remove nonessential animation. Contrast, forced colors, zoom, and text spacing can also expose assumptions. Preserve functionality while adapting presentation.

### 37. Worked example — focus and motion preferences

Open [focus and motion preferences](examples/05-focus-and-motion-preferences/), navigate with Tab, and emulate reduced motion. The action remains available while its transition is removed.

### 38. Separate content, presentation, and behavior

HTML records content and structural relationships, CSS controls their presentation, and JavaScript adds stateful behavior. Keeping these responsibilities recognizable makes changes easier to reason about. Revisit the workshop page: its timetable remains a table when its colors or column widths change.

## Intermezzo 3 — responsive and preference behavior

Use questions prefixed `u04-i3-` in [intermezzo.gift](intermezzo.gift). Take four minutes to answer, then explain why the badge uses the card as its containing block.

## Synthesis — diagnose before adding CSS

```text
Is the HTML meaning correct?
→ Which declaration wins and why?
→ What box/intrinsic constraint causes the geometry?
→ Which layout relationship is intended?
→ What changes under narrow space, zoom, keyboard, and preferences?
```

## Common failure modes

- Clickable `div` elements replacing links or buttons.
- Placeholder text replacing labels.
- Heading levels chosen for font size.
- Errors displayed but not programmatically associated.
- Fixing the cascade with `!important`.
- Treating specificity as the entire cascade.
- Forgetting padding and border in width calculations.
- Fixed heights with hidden overflow.
- Absolute positioning for ordinary page layout.
- Device-named breakpoints unrelated to content.
- Removing focus indicators.
- Testing only one viewport and ideal-length fixture.

## Relation to the tutorial

Responsive Card/Grid Reconstruction applies box, Flexbox, Grid, and breakpoint constraints. Accessible Form adds validation state and focus management to semantic relationships. CSS Repair Challenge uses a later repair layer rather than rewriting fixed markup or escalating specificity.

## AI-assisted development considerations

Give an agent the fixed HTML, allowed edit surface, viewport evidence, and accessibility requirements. Ask for a diagnosis of semantics, computed styles, and intrinsic sizing before declarations. Review generated diffs for hard-coded heights, hidden overflow, `!important`, missing focus, visual source reordering, and unrelated markup changes.

## References

- Course migration map, Unit 04.
- `webtech-2025-course/c3/html-basics/`, `c4/css/`, and `c5/`.
- `webTechTutorials-main/S05/` and `S06/`.
- [HTML 2.0: document structure](https://www.w3.org/MarkUp/html-spec/html-spec_5.html) — historical headings, paragraphs, lists, and links.
- [HTML element index](https://html.spec.whatwg.org/dev/indices.html) — current elements and their purposes.
- CSS Cascade, Box Sizing, Flexbox, and Grid specifications.
- WCAG quick reference and WAI form guidance.

Cascade and specificity references: [CSS Cascade](https://www.w3.org/TR/css-cascade-5/#cascade-sort), [Selectors specificity](https://www.w3.org/TR/selectors/#specificity-rules).

Rendering references: [positioning](https://www.w3.org/TR/css-position-3/), [intrinsic sizing](https://www.w3.org/TR/css-sizing-3/#intrinsic-sizes), [focus indicators](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo).
