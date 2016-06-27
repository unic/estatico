import datasetPolyfill from 'element-dataset';
import '../../../node_modules/handlebars/dist/handlebars';
import './helpers/module';
import 'babel-polyfill';

import EstaticoApp from './helpers/estaticoapp';

datasetPolyfill();

let app = new EstaticoApp();

app.start();
