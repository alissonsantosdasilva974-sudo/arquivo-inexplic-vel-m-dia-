---
description: Transform an uploaded narration or voiceover into a
  complete illustrated 2D/2.5D vector-animated video. Analyze the audio,
  build a timed scene plan, create original characters and layered
  environments, animate camera and objects, render, mix optional sound
  design, run quality checks, and deliver the finished video. Use
  whenever the user wants an animated explainer, historical story,
  science story, educational video, or narrated video in the illustrated
  style described below.
name: illustrated-audio-video
---

# Illustrated audio video: voiceover → illustrated animation → finished video

## Goal

Turn the user's supplied narration into a complete, polished animated
video. The narration is the source of truth for duration, pacing, scene
order, and emotional beats. Build the visuals around the voice; never
rewrite, retime, stretch, pitch-shift, denoise, or otherwise alter the
supplied voice track unless the user explicitly requests audio editing.

The target look is **illustrated 2D with convincing 2.5D depth**, not
photorealistic 3D and not generic flat slideshow motion graphics.

## Visual identity

Use this visual language consistently throughout the video:

-   **Characters:** simple, memorable, rounded silhouettes; usually dark
    or softly shaded bodies, small expressive eyes and mouths, readable
    gestures, clean shapes, and restrained facial detail.
-   **Environments:** richly designed illustrated locations with
    architectural detail, props, plants, shelves, tools, furniture,
    landscape layers, and atmospheric depth.
-   **Vector finish:** clean silhouettes, crisp edges, deliberate
    outlines, controlled gradients, painted texture accents, and
    simplified readable shapes.
-   **2.5D depth:** separate foreground, character, prop, architecture,
    and distant-background layers. Use parallax, perspective, camera
    drift, and depth-aware staging to make the world feel dimensional.
-   **Lighting:** cinematic pools of warm or cool light, motivated
    practical lights, soft shadows, subtle haze, and a clear focal
    point.
-   **Palette:** choose a coherent palette for each location or chapter.
    Prefer rich, muted cinematic colors with selective bright accents
    rather than random saturated colors.
-   **Composition:** every shot must have one clear visual idea. Keep
    important faces, props, and actions readable at the final output
    size.
-   **Motion:** animate characters, props, atmosphere, and camera. Avoid
    a sequence of static illustrations with only a zoom applied.

The reference aesthetic is an illustrated storybook / educational
animation: ancient workshops, laboratories, observatories, libraries,
cities, ships, forests, and other complete environments. It should feel
carefully art-directed, warm, atmospheric, and consistent.

## Core rules

1.  The uploaded voiceover is the master timeline. The final video
    duration must match it, within one frame where technically possible.
2.  Never change the voice track's content, speed, pitch, timing, or
    pauses.
3.  Do not invent spoken words or claim that the narration says
    something that cannot be verified.
4.  Build an original visual interpretation. Do not recreate another
    creator's video shot-for-shot.
5.  Maintain character, prop, costume, scale, and location continuity
    across shots.
6.  Every scene must communicate the specific sentence or idea being
    narrated at that moment.
7.  Avoid generic filler footage, unrelated decorative motion, and
    repetitive camera zooms.
8.  No captions, subtitles, labels, or title cards unless requested.
    Text that belongs inside the world (signs, book covers, diagrams,
    inscriptions) is allowed when spelled correctly and intentionally
    placed.
9.  Avoid real, named living people as characters unless the user
    explicitly requests a permitted depiction. Do not use brand mascots
    or logos without a clear request and appropriate rights.
10. Do not depict graphic violence or use shock imagery. Keep sensitive
    historical or scientific subjects informative and respectful.
11. Keep the user informed with concise task updates and a checklist.
    Show a storyboard/contact sheet before the final long render.
12. Do not claim a render, export, or QA step succeeded until the
    relevant command has completed and its output has been checked.

## Defaults

Use these defaults unless the user specifies otherwise:

-   Aspect ratio: 16:9 landscape.
-   Resolution: 1920 × 1080.
-   Frame rate: 30 fps, constant frame rate.
-   Color: Rec.709.
-   Video: H.264 MP4, high quality.
-   Audio: preserve the original voiceover; AAC in the final MP4.
-   Duration: exactly the voiceover duration, with frame count
    `round(duration_seconds × fps)`.
-   Shot length: usually 3--8 seconds, but follow narration beats rather
    than forcing a fixed length.
-   Visual density: one dominant action or visual metaphor per shot.
-   Text: no subtitles by default.
-   Vertical 9:16, square, 4K, or other formats only when requested.

## Stage 1: Intake

Always begin by checking the current conversation for an uploaded audio
file.

### If an audio file is attached

-   Identify its filename, format, sample rate, channel count, and
    duration.
-   Proceed to Stage 2.
-   If the user also supplied a script, retain it as the preferred
    transcript and use it to improve alignment.
-   If no script is supplied, transcribe the audio with the best
    available speech-recognition tool.

### If no audio file is attached

Ask the user to upload the narration/voiceover. Ask for the script too
if available, but do not make the script mandatory when the audio can be
transcribed.

### Optional brief clarification

Ask only when a missing choice materially changes the work. The most
useful optional question is whether the video should use a specific
aspect ratio or remain at the 16:9 default. Do not ask a long
questionnaire before beginning.

## Stage 2: Audio analysis and timing

The audio determines the complete edit.

### 2.1 Inspect the source

Use `ffprobe` to inspect the audio. Record:

-   exact duration;
-   sample rate and channel layout;
-   codec and bit rate;
-   peak level and integrated loudness if available;
-   leading/trailing silence and major pauses.

Never overwrite the user's original file. Copy it into the project as a
read-only source asset.

### 2.2 Transcribe and align

Use the best available local speech-to-text / alignment tools, in this
preference order:

1.  Existing transcript supplied by the user, aligned to the audio with
    word timestamps.
2.  Whisper or faster-whisper with word-level timestamps.
3.  A forced aligner such as WhisperX, if installed and compatible.
4.  Phrase-level alignment using detected speech segments and the
    supplied transcript.
5.  If none of these can produce reliable timing, ask the user for the
    exact script rather than guessing.

The transcript is a timing aid. The supplied audio remains authoritative
if the transcript differs.

Create these project files:

-   `work/transcript.txt` --- verified transcript.
-   `work/words.json` --- word-level timestamps where available.
-   `work/phrases.json` --- phrase/sentence start and end times.
-   `work/audio_report.md` --- duration, pauses, confidence issues, and
    timing notes.

Check that sentence boundaries align with natural pauses. Mark uncertain
words and do not build a visual gag around an uncertain transcription.

### 2.3 Convert time to frames

For frame rate `FPS`:

`frame = round(time_seconds * FPS)`

Use a single global timeline. Avoid accumulating rounded shot durations;
calculate each shot's start and end frame from absolute timestamps.

The first frame must already contain a deliberate visual hook. The last
visual payoff should land on or just before the final spoken words,
while the exported video still matches the full audio duration.

## Stage 3: Story and visual breakdown

Create `work/PLAN.md` before writing the animation code.

### 3.1 Divide the narration into visual beats

Split at meaningful changes in:

-   subject or location;
-   time period;
-   action or cause-and-effect;
-   new character or object;
-   explanation or reveal;
-   emotional tone;
-   punchline or conclusion.

Do not create one shot for every sentence mechanically. Combine short
connected phrases when they express one visual action. Split long
sentences when the narration contains multiple distinct actions.

### 3.2 Shot plan format

Make one row per shot with:

  Field         Required content
  ------------- --------------------------------------------------
  Shot          Sequential ID
  Time          Start/end seconds and frames
  Narration     Exact phrase(s) covered
  Visual idea   One-sentence description of what the viewer sees
  Location      Environment and time of day
  Cast          Characters, outfits, expressions, poses
  Action        What changes during the shot
  Camera        Shot size, angle, movement, focal target
  Layers        Foreground, midground, background, atmosphere
  Lighting      Key light, fill, practical lights, mood
  Transition    How this shot connects to the next
  Sound cue     Optional event SFX or ambience

### 3.3 Visual storytelling rules

-   Show the narrated action, not just a character talking about it.
-   Turn abstract concepts into understandable physical metaphors,
    diagrams, objects, or environmental changes.
-   Use establishing shots when a new place or era is introduced.
-   Use inserts and close-ups for important objects, mechanisms, clues,
    and details.
-   Use character reactions to make discoveries and consequences
    emotionally legible.
-   Vary shot sizes: wide environment, medium action, close-up reaction,
    object insert, overhead or side view.
-   Reserve the strongest camera move and visual reveal for the most
    important narrative beat.
-   Keep the composition uncluttered around the active subject.
-   Use visual transitions motivated by movement, shape, light, or a
    change in time/place.

## Stage 4: Art direction and asset design

Create `work/STYLE_GUIDE.md` before producing the full set of assets.

### 4.1 Style guide

Define:

-   palette with named colors and hex values;
-   outline weight and treatment;
-   shape language;
-   character proportions;
-   face and expression rules;
-   material and texture treatment;
-   lighting rules;
-   environment detail level;
-   depth-layer conventions;
-   camera and animation principles.

Use the same guide for every shot. Do not let each scene drift into a
different illustration style.

### 4.2 Character continuity

Create a character sheet for every recurring character, including:

-   front, side, and three-quarter views where needed;
-   body proportions and silhouette;
-   face, eye, and mouth design;
-   outfit, colors, accessories, and props;
-   neutral, happy, worried, surprised, determined, and other required
    expressions;
-   pose and gesture library.

Store reusable assets in `assets/characters/`. Keep a stable character
ID and do not redesign the character between scenes unless the story
explicitly includes a costume or age change.

### 4.3 Environment continuity

Build reusable environment kits in `assets/environments/`:

-   architecture and structural silhouettes;
-   doors, windows, columns, stairs, shelves, tables, and furniture;
-   plants, rocks, clouds, terrain, and distant buildings;
-   practical lights and atmospheric elements;
-   reusable props and set dressing.

Use a small number of coherent, richly layered environments rather than
generating a completely unrelated visual language for every shot.

### 4.4 Vector asset requirements

Prefer SVG for crisp, scalable vector artwork. Use grouped paths and
named layers so individual parts can be animated. Avoid flattening a
complete character or scene into one uneditable image when the parts
need motion.

For each asset:

-   use a consistent viewBox and coordinate convention;
-   group body parts, face features, clothing, and props separately;
-   keep stroke widths consistent at the target display size;
-   avoid tiny details that disappear at 1080p;
-   use gradients and texture sparingly and deliberately;
-   check SVG rendering in the actual browser renderer;
-   ensure text is not mirrored and paths do not have unexpected fill
    rules.

Raster textures may be used as accents, but the main visual construction
should remain vector-led.

## Stage 5: Technical build

### 5.1 Preferred architecture

Use a browser-rendered animation project so SVG, CSS, JavaScript, and
2.5D scene layers can be combined and rendered deterministically.

Recommended stack:

-   HTML/CSS/JavaScript for scene structure and animation logic;
-   SVG for characters, props, diagrams, and illustrated scenery;
-   Three.js or CSS 3D transforms for depth, perspective, parallax, and
    camera movement when useful;
-   Playwright with Chromium for deterministic frame capture;
-   FFmpeg for audio/video assembly, encoding, and quality checks;
-   Python for audio analysis, timing utilities, contact sheets, and QA.

Prefer local dependencies already installed. Do not rely on remote
assets or runtime network requests. If a dependency is missing, install
only through approved package sources and report any blocker honestly.

### 5.2 Suggested project structure

``` text
project/
├── input/
│   └── voiceover_original.ext
├── assets/
│   ├── characters/
│   ├── environments/
│   ├── props/
│   ├── textures/
│   └── audio/
├── work/
│   ├── transcript.txt
│   ├── words.json
│   ├── phrases.json
│   ├── audio_report.md
│   ├── PLAN.md
│   ├── STYLE_GUIDE.md
│   └── qa/
├── web/
│   ├── index.html
│   ├── main.js
│   ├── scenes.js
│   ├── characters.js
│   ├── environments.js
│   ├── animation.js
│   └── styles.css
├── frames/
├── renders/
├── audio/
├── out/
└── README.md
```

Adapt the structure to the available environment, but keep source
assets, generated frames, intermediate audio, and final exports
separate.

### 5.3 Animation implementation

Represent the entire animation as pure functions of absolute frame
number wherever practical. For example:

-   `sceneAt(frame)` selects the active scene;
-   `cameraAt(frame)` returns camera position, scale, rotation, and
    focus;
-   `charactersAt(frame)` returns character transforms, poses, and
    expressions;
-   `propsAt(frame)` returns prop transforms and states;
-   `effectsAt(frame)` returns particles, atmosphere, and transition
    effects.

This makes frames reproducible and allows rendering to resume after
interruption.

Use easing functions for natural movement. Prefer anticipation → action
→ settle for important gestures. Add secondary motion only when it
supports the action.

### 5.4 Character animation

Characters must not remain completely frozen during long holds. Use
subtle idle movement where appropriate:

-   breathing or body bob;
-   blinking;
-   head turns and nods;
-   hand gestures;
-   weight shifts;
-   eye direction changes;
-   cloth, hair, or accessory movement when relevant.

For a speaking character, do not invent lip-sync to narration unless the
character is visibly the narrator. When lip-sync is needed, use the
aligned word/phoneme timing if available; otherwise use restrained
mouth-open/close cycles and avoid claiming phoneme accuracy.

### 5.5 Camera and depth

-   Use foreground, character/action, midground, and background layers.
-   Move layers at different rates for parallax, with the smallest
    movement on distant layers.
-   Use smooth camera glides, pans, pushes, pulls, and restrained tilts.
-   Keep the camera move motivated by the narration and action.
-   Avoid excessive motion that makes the scene difficult to read.
-   Keep important faces and objects inside safe composition areas.
-   Use depth of field only when it improves focus; never blur essential
    information.
-   Ensure the camera path does not pass through geometry or hide the
    main action.

## Stage 6: Scene implementation and animation

Implement the scenes in the order of `work/PLAN.md`.

For each shot:

1.  Build the environment and its depth layers.
2.  Place the characters and important props.
3.  Establish the opening composition.
4.  Animate the main action.
5.  Add secondary character movement and environmental motion.
6.  Animate the camera.
7.  Add a transition that leads naturally into the next shot.
8.  Render a still at the shot's midpoint and at its most important
    action frame.
9.  Check visual continuity with adjacent shots.

### Motion quality rules

-   Every movement needs a clear start, action, and settle.
-   Avoid linear motion for organic actions unless the object is
    mechanical.
-   Use anticipation for jumps, impacts, turns, and reveals.
-   Use staggered timing for multi-part collapses, openings, reveals,
    and transformations.
-   Use restrained environmental movement: drifting dust, swaying
    plants, moving water, smoke, light flicker, stars, or clouds.
-   Do not animate every object at once. Preserve a clear focal
    hierarchy.
-   Avoid random camera shake. Use brief, controlled impact shake only
    when justified.
-   Keep the final action synchronized with the relevant spoken phrase.

## Stage 7: Audio and sound design

The supplied narration is the master audio.

### 7.1 Voiceover protection

-   Keep an untouched copy of the original voiceover.
-   Do not trim meaningful breaths or pauses.
-   Do not time-stretch, pitch-shift, denoise, compress, normalize, or
    otherwise process the narration unless explicitly requested.
-   Do not change the narration's start time relative to the video.
-   If the final container requires a compatible codec, encode a copy
    for delivery while preserving the source file unchanged.

### 7.2 Optional music and effects

Only add music or sound effects when they improve the story and do not
compete with speech.

-   Music should support the era, location, mood, and pacing.
-   Use subtle ambience to make environments feel alive.
-   Add event SFX for meaningful actions: footsteps, doors, tools,
    impacts, water, machinery, page turns, wind, and reveals.
-   Keep all SFX cues tied to visible actions.
-   Keep music clearly below narration. As a starting point, set music
    around 18 dB below the narration's measured RMS and adjust by
    listening.
-   Keep SFX below the narration peak and avoid sudden loud transients.
-   Do not use aggressive ducking or processing that changes the
    original voice track.
-   If no suitable audio assets or synthesis tools are available,
    deliver the video with the original narration only rather than
    inventing a sound-design result.

Create `work/SOUND_PLAN.md` with cue time, duration, sound, and purpose.

## Stage 8: Preview and visual QA

Before the full render, render representative stills:

-   first frame / hook;
-   midpoint of every shot;
-   key action frames;
-   transitions;
-   final payoff.

Create a contact sheet, for example:

``` bash
python3 sheet.py frames_preview work/qa/contact_sheet.jpg
```

Inspect the contact sheet at the actual output aspect ratio. Fix issues
before the full render.

### Visual QA checklist

-   [ ] Character design is consistent across shots.
-   [ ] Clothing, props, and proportions do not change accidentally.
-   [ ] Scene composition reads at final resolution.
-   [ ] Main action matches the narration at that moment.
-   [ ] Camera framing does not crop important faces or objects.
-   [ ] No unintended overlaps, clipping, z-fighting, or objects passing
    through each other.
-   [ ] Vector strokes and fine details remain legible.
-   [ ] Lighting and palette remain coherent.
-   [ ] Text inside the scene is correctly spelled and not mirrored.
-   [ ] Transitions do not flash, jump, or reveal incomplete frames.
-   [ ] No shot is unintentionally static for an extended period.
-   [ ] First and final moments feel intentional.

Send the contact sheet to the user with a short shot summary. If the
user requests changes, revise the scenes and recheck the affected shots
before rendering the full video.

## Stage 9: Full render and assembly

### 9.1 Render frames

Render the exact frame range from frame zero to the final frame. Use a
background process and monitor it until completion. Capture logs and
detect non-zero exit codes.

If rendering is interrupted, resume from the last verified frame. Do not
silently skip missing frames.

### 9.2 Assemble video

Use FFmpeg to encode the frames as a constant-frame-rate video, then mux
the original voiceover or a compatible encoded copy.

Example pattern (adapt filenames and frame rate to the project):

``` bash
ffmpeg -framerate 30 -i frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 \
  -r 30 -vsync cfr renders/picture.mp4
```

Then combine the picture with the narration. Use `-shortest` only after
verifying that the frame sequence and audio duration are aligned; do not
let it silently cut the narration.

If optional music and SFX are used, mix them as separate stems while
preserving the original voice track's timing and content.

### 9.3 Export settings

Default final export:

-   MP4 container;
-   H.264 video;
-   1920 × 1080;
-   30 fps constant frame rate;
-   `yuv420p` pixel format for compatibility;
-   AAC audio;
-   original narration duration;
-   sensible high-quality bitrate or CRF 17--20.

If the user requested another format, follow that request.

## Stage 10: Final quality assurance

Run technical checks on the exported MP4.

Verify:

-   file exists and is non-empty;
-   video stream is present;
-   dimensions and frame rate are correct;
-   duration matches the source voiceover within one frame where
    possible;
-   audio stream is present and begins at the intended time;
-   no missing, black, or frozen frame spans;
-   no unexpected silence or audio clipping;
-   no accidental frame duplication or frame-rate drift;
-   final frame is intentional;
-   output can be opened and played.

Use `ffprobe` for stream and duration inspection. Use FFmpeg
black-frame, freeze-frame, and loudness analysis where available.
Inspect the QA report and sample the beginning, middle, and end of the
final file.

If a check fails, fix the cause and rerun the relevant render or export
stage. Never mark a failed check as passed.

## Stage 11: Delivery

Deliver:

1.  The finished MP4.
2.  A concise summary of the scenes and visual approach.
3.  The actual duration, resolution, and frame rate.
4.  A short note confirming whether the original voiceover was preserved
    unchanged.
5.  Any known limitation or incomplete QA check.

Keep project source files and reusable assets if the environment
supports delivery. Do not claim to have attached or delivered a file
unless the file is actually available to the user.

After delivery, offer one useful next step, such as revising a specific
scene, adding subtitles, producing a vertical cut, or creating another
video from a new narration.

## Failure handling

-   **No audio file:** ask for the voiceover upload.
-   **Unreadable or unsupported audio:** report the exact issue and
    request a supported WAV or MP3 copy.
-   **Transcript confidence is low:** ask for the script or confirmation
    of uncertain phrases.
-   **Timing cannot be aligned:** do not guess silently; explain the
    issue and ask for the script or a corrected recording.
-   **Rendering dependency missing:** identify the missing dependency
    and attempt only a safe, supported installation.
-   **GPU unavailable:** use a supported software-rendering path if
    practical; do not pretend GPU acceleration is active.
-   **Render fails:** inspect logs, fix the cause, and resume from
    verified frames.
-   **Audio/video duration mismatch:** correct the frame range or muxing
    process; never retime the voice to hide the mismatch.
-   **Insufficient time or compute:** provide the completed preview and
    clearly state what remains, rather than claiming the final render is
    done.

## Completion standard

The task is complete only when the final MP4 has been rendered,
assembled with the supplied narration, technically inspected, and made
available to the user. A script, storyboard, contact sheet, or preview
alone is not a completed video.
