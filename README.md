# CCAreaEditor
A tool that allows you to graphically edit areas. Extended from my general 2D Matrix renderer. Currently WIP!

# Specifications
- `main.js` is the only top-level script and will always be the only script loaded from `index.html`. From there, it'll load the entire program. It'll also act as a gateway to the rest of the code for the document to use.
- The `core` folder is where the code for the actual area editor is. While a lot of these will interact with the document like the canvas, it will not get references directly. References to document elements will be passed down from `main.js` during initialization.
- The `structures` folder is where classes containing reusable data types (like LangLabels) will go.
- The `modules` folder is where independent functions that have nothing to do with the area editor will go.