function performClick(elemId) {
   	var elem = document.getElementById(elemId);
   	if(elem && document.createEvent) {
      	var evt = document.createEvent("MouseEvents");
      	evt.initEvent("click", true, false);
      	elem.dispatchEvent(evt);
	}

   	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var f = fso.OpenTextFile(elem.value, 1);

	while (!f.AtEndOfStream) {
    	var r = f.ReadLine();
    	document.write (r + "<br />");
	}

	f.Close();
}

function file_get_contents( url ) {
	var req = null;
	try { req = new ActiveXObject("Msxml2.XMLHTTP"); } catch (e) {
		try { req = new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {
			try { req = new XMLHttpRequest(); } catch(e) {}
		}
	}
	if (req == null) throw new Error('XMLHttpRequest not supported');

	req.open("GET", url, false);
	req.send(null);

	return req.responseText;
}

function processFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
    // Когда это событие активируется, данные готовы.
    // Вставляем их в страницу в элемент <div>
    var output = document.getElementById("fileOutput");   
    output.textContent = e.target.result;
    reader.readAsText(file);
}