import {run} from './core';import {manage} from './manage';process.argv.splice(2,0,'visibility');run(manage);
