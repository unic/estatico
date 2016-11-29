import datasetPolyfill from 'element-dataset';
import 'handlebars/dist/handlebars';
import './helpers/module';
import './helpers/svgspriteloader';

import EstaticoApp from './helpers/estaticoapp';

datasetPolyfill();

let app = new EstaticoApp();

app.start();
