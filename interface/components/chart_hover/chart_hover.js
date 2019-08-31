// Tooltip on hover for Plotly.js
// style in _hoverinfo.less

define(function (require) {
	function isInt(y) {
		return y.reduce(function(acc, v){
			return !acc ? false : v % 1 === 0;
		}, true)
	}

	function createTable(data) {
		var line = function(point) {
			return '<tr><td><b>'+point.data.name+'</b></td><td>' + d3.format(',.'+(isInt(point.data.y)?'0':'3')+'f')(point.y) + '</td></tr>';
		}
		return '<table>'+ data.points.map(line).join('') + '<tr><td><b>'+data.points[0].xaxis.title.text+'</b></td><td>' + data.points[0].x + '</td></tr></table>';
	}
	
	var hoverInfo;

	return {
		init: function(viscontainer, gd) {
			hoverInfo = document.createElement('div');
		  	hoverInfo.setAttribute('class', 'hoverinfo');
		  	viscontainer.firstChild.after(hoverInfo);

		  	viscontainer.onmousemove = function(e) {
		  		var pos = [
					event.clientX - viscontainer.getBoundingClientRect().left,
					event.clientY - viscontainer.getBoundingClientRect().top
				];

			    hoverInfo.style.left = pos[0] + 'px';
			    hoverInfo.style.top = pos[1] + 'px';

			    // correct right overflow
			    if(hoverInfo.getBoundingClientRect().right > viscontainer.getBoundingClientRect().right) {
			    	hoverInfo.style.left = (pos[0] - (hoverInfo.getBoundingClientRect().right-viscontainer.getBoundingClientRect().right))+'px';
			    }

			    // correct bottom overflow
			    if(hoverInfo.getBoundingClientRect().bottom > viscontainer.getBoundingClientRect().bottom) {
			    	hoverInfo.style.top = (pos[1] - (hoverInfo.getBoundingClientRect().bottom-viscontainer.getBoundingClientRect().bottom))+'px';
			    }
		  	}

			gd.on('plotly_hover', function(data) {
				hoverInfo.style.display = "inline";
			    hoverInfo.innerHTML = createTable(data);
			});
			gd.on('plotly_unhover', function(data) {
				hoverInfo.style.display = "none";
			});
		},
		destroy: function() {
			if(hoverInfo) {
				hoverInfo.parentNode.removeChild(hoverInfo);
			}
		}
	}
});