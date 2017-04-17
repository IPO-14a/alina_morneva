function appendFileInfo(tbody, data) {
  var tr = document.createElement('tr');
  for(var j = 0; j < data.length; j++) {
      td = document.createElement('td');
      td.innerHTML = data[j] || 'íåèçâåñòíî';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  return tbody;
}
function onFilesSelect(e) {
  // ïîëó÷àåì îáúåêò FileList
  var files = e.target.files,output = document.getElementById('output'),table = document.createElement('table'),tbody = document.createElement('tbody'),row,fr,file,data;
  output.innerHTML = '';
  table.appendChild(tbody);

  for(var i = 0; i < files.length; i++) {    
    file = files[i];
    if(/image.*/.test(file.type)) {
      data = [file.name, file.type, file.size];
      fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = (function (file, data) {
        return function (e) {         
          var img = new Image(),             
            s, td;       
          img.src = e.target.result;

          if(img.complete) {
            img = makePreview(img, 128);
            data.push('<img src="' + img.src + '" width=' + img.width + '" height="' + img.height + '" />');
            appendFileInfo(tbody, data);
          } else {
            img.onload =  function () {
              img = makePreview(img, 128);
              data.push('<img src="' + img.src + '" width=' + img.width + '" height="' + img.height + '" />');
              appendFileInfo(tbody, data);
            }
          }

        }
      }) (file, data);
    } else {
      data = [file.name, file.type, file.size, ''];
      appendFileInfo(tbody, data);
    }      
  }
  output.appendChild(table);  
}

if(window.File && window.FileReader && window.FileList && window.Blob) {

  onload = function () {
    document.querySelector('input').addEventListener('change', onFilesSelect, false);
  }
}