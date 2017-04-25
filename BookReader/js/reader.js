'use strict';

function update(file)
{
  document.getElementById('menu').style.display = 'none';
  var reader = new FileReader();
  if(file.item(0).type.indexOf('epub') > -1)
  {
    reader.readAsBinaryString(file.item(0));
    reader.onload = function(event)
    {
      createBook(reader.result);
    };
  } else {
    reader.readAsText(file.item(0));
    reader.onload = function(event)
    {
      bookFromText(reader.result);
    }
  }

}

function bookFromText(txt)
{
  var style = document.createElement('style');
  style.id = 'pageStyle';
  document.body.appendChild(style);
  var pages = document.getElementById('pages'); 
  pages.innerHTML = txt;
  buildPages();
  var fileBox = document.getElementById('fileHolder');
  fileBox.style.display = 'none';
}

function resetBook() {
    book = null;
    document.getElementsByTagName('input')[0].value = '';
    document.getElementById('fileHolder').style.display = 'block';
    document.getElementById('pages').innerHTML = '';
    chapter = 0;
    page = 0;
    document.getElementById('menu').style.display = 'none';
}

var page = 0;
var chapter = 0;

function buildPages()
{
  document.getElementById('pageStyle').innerHTML = '';
  var scrollMaxY = (window.scrollMaxY) ? 
  window.scrollMaxY :
  document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var totalHeight = (window.innerHeight + scrollMaxY);
  var contentWidth = window.innerWidth;

  var style = '#pages{' +
    ' -moz-column-width: ' + (window.innerWidth - 80) + 'px!important;' + 
    ' -webkit-column-width: ' + (window.innerWidth - 80) + 'px!important;' +
    ' width: ' + contentWidth + 'px!important;' +
    '-moz-column-gap: 80px;' +
    '-webkit-column-gap: 80px;' +
    'margin-left: 40px;}';

  document.getElementById('pageStyle').innerHTML = style;
}

function toggleMenu() {
  var menu = document.getElementById('menu');

  if (menu.style.display === 'none')
  {
    menu.style.display = 'block';
    return;
  }

  menu.style.display = 'none';
}

function toggleStyle() {
  var style = document.getElementById('style');

  if (style.getAttribute('href') === 'style/dark.css')
  {
    style.setAttribute('href', 'style/light.css');
    return;
  }

  style.setAttribute('href', 'style/dark.css');
}

var moving = function(evt) {
  this.pageStyle = document.getElementById('pages').style;
  this.startTime = evt.timeStamp;
  this.startX = evt.screenX;
  this.active = true;
};

window.onload = function()
{
  var fileBox = document.getElementsByTagName('input')[0];
  fileBox.addEventListener('change', function() {update(fileBox.files);}, false);
  var previewer = document.getElementById('preview');
  previewer.addEventListener('click', preview, false);
  previewer.addEventListener('touchstart', preview, false);
  var pageStyle = document.createElement('style');
  pageStyle.id = 'pageStyle';
  document.body.appendChild(pageStyle);
};