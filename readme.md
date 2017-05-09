# Static Website Boilerplate

*Still in development.*

## How it works?

**Download the Repo**
```
git clone https://github.com/happycrappie/static-website-boilerplate.git
```

**Install dependencies**
```
yarn
```

or

```
npm install
```

**Run gulp**
```
gulp
```

**There you go!** Project is running!

All your editable files will be inside the **app** folder. Gulp will process everything and spit it into the **build** folder, which will not be going with your commits (you can change that by removing 'build' from the `.gitignore` file).

## Project structure

```
root
 |_ app
    |_ _assets
    |  |_ css
    |  |  |__ bulma.css
    |  |  |__ fontawesome.css
    |  |
    |  |_ fonts
    |  |  |__ font.otf
    |  |  |__ font.eot
    |  |
    |  |_ js
    |     |__ script.js
    |
    |_ _mail
    |  |__ send.php
    |
    |_ css
    |  |_ component
    |  |  |__ component.scss
    |  |
    |  |__ _imports.scss
    |  |__ _typography.scss
    |  |__ style.scss
    |
    |_ js
    |  |__ scripts.js
    |
    |_ views
       |_ _layouts
       |  |__ head.pug
       |
       |__ index.pug
```