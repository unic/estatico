import datasetPolyfill from 'element-dataset';
import '../../../node_modules/handlebars/dist/handlebars';
import './helpers/module';
import './helpers/svgspriteloader';
import EstaticoApp from './core/estaticoapp';

/** Demo modules **/
import SkipLinks from '../../demo/modules/skiplinks/skiplinks';
import SlideShow from '../../demo/modules/slideshow/slideshow';
/* autoinsertmodulereference */

datasetPolyfill();

const app = new EstaticoApp();

app.registerModuleClass(SlideShow.name, SlideShow);
app.registerModuleClass(SkipLinks.name, SkipLinks);
/* autoinsertmodule */

app.start();
