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
console.log(data)
		//var field_list = total_data.raw.columns.filter(function(el, i) { return i % 2 === 0; }).map(function(el) { return el.label; })

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
	
	var hoverInfo;

	return {
		init: function(viscontainer, gd, total_data, tot) {
			hoverInfo = document.createElement('div');
		  	hoverInfo.setAttribute('class', 'hoverinfo');
		  	viscontainer.firstChild.after(hoverInfo);

		  	viscontainer.onmousemove = function(event) {
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
			    hoverInfo.innerHTML = data.points[0].data.type === "pie" ? createTablePie(data, total_data, tot) : createTable(data);
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