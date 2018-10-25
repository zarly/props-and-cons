#!/usr/bin/env ts-node

import * as yargs from 'yargs'

yargs
    .usage('$0 <cmd> [args]')
    .command('ideas', 'Ideas commands')
    .help()
    .argv;
