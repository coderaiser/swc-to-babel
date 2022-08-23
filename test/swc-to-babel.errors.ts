import toBabel from '../lib/swc-to-babel.js';

// THROWS Expected 1-2 arguments, but got 0.
toBabel();

// THROWS Argument of type 'number' is not assignable to parameter of type 'Module'.
toBabel(1);
