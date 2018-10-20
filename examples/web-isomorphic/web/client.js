import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import { ClientApp } from '@reactant/web-isomorphic';
import ClientRoot from './ClientRoot';

const app = new ClientApp(ClientRoot, {
  props: {}
});
app.register(StyledComponents);
app.render();

export default app;