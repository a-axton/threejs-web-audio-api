# THREE.js and the Web Audio API, best friends forever
A simple starter project for working with three.js and the web audio api. A huge portion of this code is taken from http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/. I simply cleaned it up and seperated some of the components. Currently only input from the mic is supported but I want to add support for streaming files as well.

### What's in it?
- Basic THREE.js camera, scene, renderer, orbit controls
- Web Audio API data via browser microphone. Currently tracks waveform, frequency levels, average volume and beat.
- Debugger panel to show all audio data with visuals

### To run

Install webpack and the development server:

```
> $ npm install webpack-dev-server webpack -g
```
Install other dependencies:

```
> $ npm install
```

Start building!: 

```
> $ npm run dev
```

Go to `http://localhost:8080/`
