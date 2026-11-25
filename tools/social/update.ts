import {run} from './core';import {manage} from './manage';process.argv.splice(2,0,'update');run(manage);
