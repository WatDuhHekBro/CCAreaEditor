# 1.0.6
- Fixed pixel interpolation for other browsers.
- Updated dependencies.

# 1.0.5
- Added the ability to set the location of a connection/icon/landmark by left clicking without holding it down.

# 1.0.4
- Added type checking before iterating through arrays (loading in an existing floor).
- Reordered `icons` and `handle` in the `Floor` structure.
- Removed silently failing errors when loading in an area that causes an error.

# 1.0.3
- Fixed a bug which prevented users from drawing tiles on the left and top edges.

# 1.0.2
- Added an option in preferences to confirm closing the tab so users can avoid accidentally losing all their progress.
- Updated the `Language` section of the preferences sidebar to more accurately reflect the user's language setting.
- Rewrote `modules/config` to prevent dynamic indexing while also auto-saving via a custom setter.
- Version display now links to the changelog.

# 1.0.1
- Removed debug window variables.
- Removed `landmark` from the icon menu.
- Added a version display.
- Added a changelog.
- Fixed a bug where a map's `LangLabel` would have a `languages` property.
- Added an error bubble for easier bug reporting.

# 1.0.0
First Major Release!