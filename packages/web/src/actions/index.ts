import { Actions } from '@reactant/core';
import build from './build';
import start from './start';
import test from './test';

export default ({ build, start, test } as unknown) as Actions;
