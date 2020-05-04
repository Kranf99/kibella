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

	function createTablePie(data, total_data, tot) {
		var p = data.points[0];
		var i = p.pointNumbers[0];
		var line = function(x, ind) {
			if(x.label.indexOf(":") >= 0)
				x.label= x.label.split(':')[1]
			var percent = ""
			if(x.percent) percent = x.percent.toFixed(2) + "%";

			return '<tr><td>' + x.field + '</td><td>'+x.label+'</td><td>' + d3.format(',.'+(isInt([x.value])?'0':'3')+'f')(x.value)  + " (" + percent + ")" + '</td></tr>';
		}
		
		var v = [{field: p.data.field, value: p.customdata[0], label: p.label, percent: p.data.percents[i]}] //, [p.data.parents[p.pointNumbers], p.data.parents[p.pointNumbers] ]]

		function ap(parent) {
			v.push({field: parent.field, value: parent.size, label: parent.name, percent: parent.percent })
			if(parent.parent)
				ap(parent.parent)
		}
		
		if(p.data.parents && p.data.parents[i]) 
			ap(p.data.parents[i])

		v.reverse()

		return '<table><tr><td><b>field</b></td><td><b>value</b></td><td><b>' + total_data.raw.columns[1].label + '</b></td></tr>'+ v.map(line).join('')+'</table>';
	}

	function createTableWF(data) {
		var reversed = data.points[0].data.orientation === 'h';
		var line = function(point) {
			return '<tr><td><b>'+point.data.name+'</b></td><td>' + (reversed ? point.y : point.x) + '</td></tr>';
		}
		return '<table><tr><td><b>'+data.points[0].data.y_label+'</b></td><td>' + d3.format(',.'+(isInt(reversed ? data.points[0].data.x : data.points[0].data.y)?'0':'3')+'f')(reversed ? data.points[0].x : data.points[0].y) + '</td></tr>' + data.points.map(line).join('') + '</table>';
	}
	
	var hoverInfo;

	return {
		init: function(viscontainer, gd, total_data, tot) {
			hoverInfo = document.createElement('div');
			hoverInfo.setAttribute('class', 'hoverinfo');
			document.body.appendChild(hoverInfo);

		  	viscontainer.onmousemove = function(event) {
				var body = document.body;
		  		var pos = [
					event.clientX - body.getBoundingClientRect().left,
					event.clientY - body.getBoundingClientRect().top
				];

			    hoverInfo.style.left = pos[0] + 'px';
			    hoverInfo.style.top = pos[1] + 'px';

			    // correct right overflow
			    if(hoverInfo.getBoundingClientRect().right > (body.getBoundingClientRect().right+window.scrollX)) {
			    	hoverInfo.style.left = (pos[0] - (hoverInfo.getBoundingClientRect().right-(body.getBoundingClientRect().right+window.scrollX)) - 10)+'px';
			    }

			    // correct bottom overflow
			    if(hoverInfo.getBoundingClientRect().bottom > (body.getBoundingClientRect().bottom+window.scrollY)) {
			    	hoverInfo.style.top = (pos[1] - (hoverInfo.getBoundingClientRect().bottom-(body.getBoundingClientRect().bottom+window.scrollY)) - 10)+'px';
			    }
		  	}

			gd.on('plotly_hover', function(data) {
				hoverInfo.style.display = "inline";
			    hoverInfo.innerHTML = data.points[0].data.type === "pie" ? createTablePie(data, total_data, tot) : data.points[0].data.type === "waterfall" ? createTableWF(data) : createTable(data);
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