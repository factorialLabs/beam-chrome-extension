# beam-chrome-extension
Chrome extension for Beam

### Dev instructions

We're using webpack so we can do cool things like ES6 with polyfill and import/export with ease!
Note, javascript source are in `/src` and other assets (manifest,(s)css,images,html) are in `/app`.
Eventually we might want to extend our webpack script so that we can have everything for development in one folder, and app is
purely what we can package as an extension with no extra fluff.

1. First install dependencies with `npm install`

2. When developing, run `npm run watch` to continuously update compiled JS code that is used by the extension.

3. Run `npm run tests` to run tests. Currently only JS style/syntax checking is set up.

4. Run `npm run build` to ship a production version.

###TODO

- [ ] Set up webpack with LESS/SASS

- [ ] Set up better testing (with flow, phantomJS)

- [ ] Better debugging?

- [ ] We probably want to migrate the client to a better MVC library like React.JS or Vue.js. Jquery is already a pain.

