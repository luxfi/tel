declare module '*.css';

/** A stylesheet published under a name that does not end in .css, so the pattern
 *  above never reaches it: `@hanzo/font` exports its faces as `./css`. */
declare module '@hanzo/font/css';
