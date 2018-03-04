const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const showdown = require('showdown');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

var mds = require('require-all')(__dirname + '/READMES');

console.log('mds = ', mds);

const isProduction = (process.env.NODE_ENV === 'production');

const mdfiles = fs.readdirSync(__dirname + '/READMES/');

console.log('mdfiles = ', mdfiles);

const mdExample = fs.readFileSync('./README.md', 'utf8');
const templateMain = fs.readFileSync('./src/ejsTemplates/templateMain.ejs', 'utf8');

const app = express();

const config = () => {
  showdown.setOption('noHeaderId', true);
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
}

const routes = () => {
  app.use('/assets', express.static(
    path.join(__dirname, `/${isProduction ? 'dist' : 'src'}/assets/`)
  ));

  app.get('/', (req, res) => {
    const converter = new showdown.Converter();
    const markdownToHtml = converter.makeHtml(mdExample);
    const templatePlusMarkdown = ejs.render(templateMain, {markdownToHtml});
    res.send(templatePlusMarkdown);
  });
}

config();
routes();

app.listen(3000, () => {
  console.log(' Example app listening on port 3000!')
});
