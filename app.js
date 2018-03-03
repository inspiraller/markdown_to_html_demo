const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const showdown = require('showdown');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

showdown.setOption('noHeaderId', true);

const mdExample = fs.readFileSync('./README.md', 'utf8');
const templateMain = fs.readFileSync('./ejsTemplates/templateMain.ejs', 'utf8');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/assets', express.static(path.join(__dirname, '/dist/assets/')));

app.get('/', (req, res) => {
  const converter = new showdown.Converter();
  const markdownToHtml = converter.makeHtml(mdExample);
  const templatePlusMarkdown = ejs.render(templateMain, {markdownToHtml});
  res.send(templatePlusMarkdown);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
