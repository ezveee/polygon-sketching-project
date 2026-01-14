# Polygon Drawing Project

This repository contains two implementations of a simplistic 2D polygon drawing application:

1. **Functional Implementation** (`functional/`) - F# implementation using Elmish architecture
2. **Baseline Implementation** (`baseline/`) - To be implemented in OOP/imperative style

The project is part of the masters course "Functional Programming (by Harald Steinlechner)" @ University of Applied Sciences | Technikum Wien.

## Project Structure

```
polygon-sketching-project/
├── functional/          # F# + Elmish implementation
│   ├── src/            # F# source files
│   ├── tests/          # Test files
│   ├── App.sln         # F# solution file
│   ├── package.json    # NPM dependencies
│   └── vite.config.js  # Vite configuration
├── baseline/           # OOP/imperative baseline (to be implemented)
└── README.md           # This file
```

## Functional Implementation

The functional implementation is based on [Feliz](https://github.com/Zaid-Ajaj/Feliz) and uses [Fable](http://fable.io/) for transpiling F# code to JS.

### Requirements

* [dotnet SDK](https://www.microsoft.com/net/download/core) v8.0 or higher
* [node.js](https://nodejs.org) v18+ LTS

### Editor

To write and edit your code, you can use either VS Code + [Ionide](http://ionide.io/), Emacs with [fsharp-mode](https://github.com/fsharp/emacs-fsharp-mode), [Rider](https://www.jetbrains.com/rider/) or Visual Studio.

### Development

Navigate to the `functional/` directory:
```bash
cd functional
```

Before doing anything, start with installing npm dependencies using `npm install`.

Then to start development mode with hot module reloading, run:
```bash
npm start
```
This will start the development server after compiling the project, once it is finished, navigate to http://localhost:5173 to view the application.

To build the application and make ready for production:
```
npm run build
```
This command builds the application and puts the generated files into the `dist` directory.

## Baseline Implementation

To be implemented using OOP/imperative programming style.
