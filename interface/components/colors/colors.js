define(function (require) {
    var main = [212, 115, 255]

    var colors = {
        min: [135, 200, 255],
        mid: [212, 115, 255],
        max: [230,230,230],
    }

    var _i = function(min,max,percent) {
        return Math.round((max-min) * percent + min) 
    }
    var _fade = function(i, percent) {
        return Math.round((colors.max[i]-colors.min[i]) * percent + colors.min[i]) 
    }
    var _genRGB = function(percent) {
        return 'rgb(' + _fade(0,percent) + ',' + _fade(1,percent) + ',' + _fade(2,percent) + ')'
    }
    var _interpolation = function(begin, end, sequence) {
        if(sequence.length === 1) { return [_genRGB(1)]; }

        return sequence.map(function(item, index) {
            var per = (item - begin) / (end - begin);

            return _genRGB(per);
        });
    }
    
    var _interpolation3 = function(begin, middle, end, sequence) {
        if(sequence.length === 1) { return ['rgb(' + _i(colors.max[0],per) + ',' + _i(colors.max[1],per) + ',' + _i(colors.max[2],per) + ')']; }
        
        return sequence.map(function(item, index) {
            var per;
            var set;
            if(item > middle) {
                per = (item - middle) / (end - middle);
                set = [colors.mid, colors.max]
            } else {
                per = (item - begin) / (middle - begin);
                set = [colors.min, colors.mid]
            }

            return 'rgb(' + _i(set[0][0],set[1][0],per) + ',' + _i(set[0][1],set[1][1],per) + ',' + _i(set[0][2],set[1][2],per) + ')'
        });
    }
    var _mean = function(array) {
        return array.reduce(function(acc, el) { return acc + el },0) / array.length
    }
    var _hexToRGB = function(value) {
         // #XXXXXX -> ["XX", "XX", "XX"]
         var value = value.match(/[A-Za-z0-9]{2}/g);

         // ["XX", "XX", "XX"] -> [n, n, n]
         return value.map(function(v) { return parseInt(v, 16) });
    }
    var _hexToRGB_str = function(value) {
        var value = _hexToRGB(value)
        // [n, n, n] -> rgb(n,n,n)
        return "rgb(" + value.join(",") + ")";
    }
 

    return {
        default_params:{
            colors: "Sequential",
            min:  "#d473ff",
            mid:  "#eeeeee",
            max:  "#87c8ff",
            colorlist: [
                "#d473ff",
                "#FF68CF",
                "#da5e51",
                "#b2d40e",
                "#68ffda",
                "#7294de",
                "#7471c8",
                "#7f39ab",
                "#cfb4f6",
                "#ca345f",
                "#ffb6d9",
                "#FFA570",
                "#FFD15D",
                "#F9F871",
                "#A87BF5",
                "#FF71A9",
                "#008AD9",
                "#0089F9",
                "#00819D",
                "#00735A"
            ],
        },
        Diverging: function(sequence, _colors) {
            if( _colors.min === undefined ||
                _colors.mid === undefined ||
                _colors.max === undefined )
                console.error("Diverging function lacks proper colors arguments")

            colors.min = _hexToRGB(_colors.min) 
            colors.mid = _hexToRGB(_colors.mid)
            colors.max = _hexToRGB(_colors.max) 
            return _interpolation3(_.min(sequence), _mean(sequence), _.max(sequence), sequence)
        },
        Sequential: function(sequence, _colors) {
            if( _colors.min === undefined ||
                _colors.max === undefined )
                console.error("Sequential function lacks proper colors arguments")

            colors.min = _hexToRGB(_colors.min) 
            colors.max = _hexToRGB(_colors.max)
            return _interpolation(_.min(sequence), _.max(sequence), sequence)
        },
        Categorical: function(sequence, _colors) {
            return _colors.colorlist;
        },
    }
});