# Balconify Webpage

This is a static frontend project consisting of HTML, CSS, and JavaScript.

## How to run the project

Because this project is built with plain ("Vanilla") web technologies, there's no complex build step required. 

You have a few options to view the website:

### Option 1: Development Server (Recommended)
You can now run the development server via npm (which will use `serve` behind the scenes):
```bash
npm run dev
```
Once it starts, it will give you a `localhost` URL (usually `http://localhost:3000`) that you can open in your browser.

### Option 2: Direct File Opening
You can simply open the `index.html` file directly in your web browser. Just double-click on `index.html` in your file explorer.

### Option 3: VS Code Live Server
If you are using Visual Studio Code, you can install the "Live Server" extension. Once installed, right-click on `index.html` and select **"Open with Live Server"**.

## Why did `npm run dev` fail earlier?
The command failed because there was no `package.json` file in your project directory. Node Package Manager (`npm`) looks for a `package.json` file to find the `scripts` object where `dev` is defined. Because it was missing, `npm` didn't know what to run. 

I've just added a `package.json` file to the project, so `npm run dev` will now work perfectly.
