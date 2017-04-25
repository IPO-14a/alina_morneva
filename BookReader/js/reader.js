'use strict';

var mover = null;

/**
* Функция преднозначена для открытия премера книги,
* загружает событья для обработки нажатия кнопок мыши
* загружает обработких кнопки возврата страницы
*/
function preview()
{
  document.getElementById('menu').style.display = 'none';
  var reader = new FileReader();
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'books/Preview.txt', true)
  xhr.send(null);

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4)
    {
      bookFromText(xhr.responseText);
    }
  }

/**
* Обработчик вызывает функцию evt путем нажатия на кнопку мыши
* ивызывает работу директива mover.
* Если нажатие попало на одну из областей
* работы обработчика, запускаеомя одна из функий.
*/
  document.addEventListener('mousedown', function(evt) {mover = new moving(evt);}, false);
  document.addEventListener('mousemove', function(evt) {mover.mouseMove(evt);}, false);
  document.addEventListener('mouseup', function(evt) {mover.mouseEnd(evt);}, false);
  document.addEventListener('touchstart', function(evt) {mover = new moving(evt);}, false);
  document.addEventListener('touchmove', function(evt) {mover.mouseMove(evt);}, false);
  document.addEventListener('touchend', function(evt) {mover.mouseEnd(evt);}, false);

  var back = document.getElementById('back');

/**
* Обработчик вызывает функцию resetBook 
* путем нажатия на кнопку мыши
*/
  back.addEventListener('click', function() {resetBook();}, false);
}

/**
* Функция открывает file для чтения
* 
* Если файл имеет расширение epub, запускается функция 
* createBook.
* Иначе, вызывается функции bookFromText. 
*/  
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

var book;
/**
* Функция открывает файлы с расширением epub
* 
* Загружает в fileBox элементы файла getElementById
* и отображает главы на странице showChapter
*/ 
function createBook(epub)
{
  book = new JSEpub(epub);

  book.processInSteps(function(step, extras)
  {
    if (step === 5) {
      var fileBox = document.getElementById('fileHolder');
      fileBox.style.display = 'none';
      showChapter();
    }
  });
}

/**
* Функция разбивает текс на страницы
* 
* Загружает в fileBox элементы файла getElementById
* Отображает текст на странице HTML
*/ 
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

/**
* Функция закрывает книгу и возвращает
* на исхожную страницу 
* 
* Сбрасывает переменную book
* Очищает значения input, chapter и pages
* Возвращает нас на страницу menu
*/ 
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

/**
* Функция отображает dir открытого нами файла 
* 
* Если книга существет и главы существуют
* Сохдаем html страницу и помещаем в
* bookBox текст. Если страница закончилась
* увеличиваем переменную chapter. 
*/
function showChapter(dir) {
  if(book && book.opf.spine[chapter])
  {
    var spine = book.opf.spine[chapter];
    var href = book.opf.manifest[spine]['href'];
    var doc = book.files[href];
    var html = new XMLSerializer().serializeToString(doc);
    var bookBox = document.getElementById('pages');
    bookBox.innerHTML = html;
    buildPages();
    chapter += 1;
  } else {
    resetBook();
  }
}

/**
* Функция размещает текст файла на странице
* применяет к нему стили, определяет ширину 
* и высоту экрана
*/
function buildPages()
{
  document.getElementById('pageStyle').innerHTML = '';
  var scrollMaxY = (window.scrollMaxY) ? 
  window.scrollMaxY :
  document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var totalHeight = (window.innerHeight + scrollMaxY);
  var contentWidth = window.innerWidth;

  if (totalHeight - 100 > window.innerHeight)
  {
    var pageRatio = totalHeight / window.innerHeight;
    contentWidth = (window.innerWidth > window.innerHeight) ? (pageRatio * window.innerWidth) + (window.innerWidth) : (pageRatio * window.innerHeight) + window.innerHeight;
    var numCols = Math.ceil(contentWidth / (window.innerWidth - 80));
    contentWidth = numCols * window.innerWidth;
  }

  var style = '#pages{' +
    ' -moz-column-width: ' + (window.innerWidth - 100) + 'px!important;' + 
    ' -webkit-column-width: ' + (window.innerWidth - 100) + 'px!important;' +
    ' width: ' + contentWidth + 'px!important;' +
    '-moz-column-gap: 80px;' +
    '-webkit-column-gap: 80px;' +
    'margin-left: 40px;}';

  document.getElementById('pageStyle').innerHTML = style;
}

/**
* Функция перелистывает сраницу dir 
* 
* Получаем ID текущей страницы
* Если страница существует, и мышкой
* осуществлены необходимые манипуляции
* текст смещается влево и открывается новая страница page
*/
function nextPage(dir) {
  var pages = document.getElementById('pages');

  if ((page + dir) * (window.innerWidth + 1) >= pages.clientWidth) 
  {
    showChapter(dir);
    page = 0;
    pages.setAttribute('style', '-moz-transform: translate(0, 0);'+'-webkit-transform: translate(0, 0);');
    return;
  }

  pages.setAttribute('style', '-moz-transform: translate(-' + ((page + dir) * (window.innerWidth) - (page )) + 'px, 0);' +
    '-webkit-transform: translate(-' + ((page + dir) * (window.innerWidth) - (page )) + 'px, 0);');
  pages.style.MozTransition = 'all 0.2s ease 0s';
  pages.style.WebkitTransition='all 0.2s ease 0s';
  page += dir;
}

/**
* Функция отображает кнопку возврата menu
* при нажатии на экран, и блокирует его
* при повторном нажатии 
*/
function toggleMenu() {
  var menu = document.getElementById('menu');

  if (menu.style.display === 'none')
  {
    menu.style.display = 'block';
    return;
  }

  menu.style.display = 'none';
}

/**
* Добавляет стили к странице, определяет
* координаты нажатия мыши screenX 
*/
var moving = function(evt) {
  this.pageStyle = document.getElementById('pages').style;
  this.startTime = evt.timeStamp;
  this.startX = evt.screenX;
  this.active = true;
};

moving.prototype = {
  mouseMove: function(callingEvt) {
    if (this.active === true)
    {
      var offset = callingEvt.screenX - this.startX;
      this.pageStyle.MozTransform = 'translateX(-' +
        ((page * (window.innerWidth + 1)) + (-1 * offset)) + 'px)';
      this.pageStyle.WebkitTransform = 'translateX(-' +
        ((page * (window.innerWidth + 1)) + (-1 * offset)) + 'px)';
      this.pageStyle.MozTransition = 'all 0s ease 0s';
      this.pageStyle.WebkitTransition='all 0s ease 0s';
    }
  },

  mouseEnd: function(callingEvt) {
    this.active = false;
    var offset = callingEvt.screenX - this.startX;
    if ((callingEvt.timeStamp - this.startTime) < 250) {
      toggleMenu();
      this.pageStyle.MozTransform = 'translateX(-' +
        ((page + dir) * (window.innerWidth) + (page * 3)) + 'px)';
      this.pageStyle.WebkitTransform = 'translateX(-' +
        ((page + dir) * (window.innerWidth) + (page * 3)) + 'px)';
    } else if ((-1 * offset > (window.innerWidth / 4)) ||
      offset > (window.innerWidth / 4)) {
      var dir = offset > 0 ? -1 : 1;
      nextPage(dir);
      mover = null;
    } else {
      this.pageStyle.MozTransform = 'translateX(-' +
        (((page) * (window.innerWidth)) - (page * 10)) + 'px)';
      this.pageStyle.WebkitTransform = 'translateX(-' +
        (((page) * (window.innerWidth)) - (page * 10)) + 'px)';
    }
  }
};

/**
* Функция загружает обработчики нажатия кнопок,
* стии для страницы, загружает preview
*/
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