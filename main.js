(function(){
    var toggleBtn = document.getElementsByClassName('js-toggle-btn'),
        svg = d3.select('svg'),
        data = [
            [
               { product: 'Hoodie',  count: 10 },
               { product: 'Jacket',  count: 3 },
               { product: 'Snuggie', count: 2 }
           ],
           [
               { product: 'Hoodie',  count: 4 },
               { product: 'Jacket',  count: 7 },
               { product: 'Snuggie', count: 8 }
           ]
       ],
       currentData = data[0];

   toggleBtn[0].addEventListener('click', changeDataForChart);

   function changeDataForChart() {
       setData();
       updateChart();
   }

   $('form').submit(function(e){
       e.preventDefault();
       var choice = $('.new-data-input').val();
       currentData.forEach(function(data, i) {
           if(data.product === choice) {
               currentData[i]['count'] += 1;
           }
       });
       updateChart();
   });


    function updateChart() {
        d3.selectAll("text").remove();
        var x = getXAxis(getMaxCount(currentData)),
            y = getYAxis(currentData),
            rects = svg.selectAll('rect').data(currentData),
            texts = svg.selectAll("text").data(currentData);

        rects.enter()
            .append('rect');

        rects.transition()
            .attr("fill", getColor(currentData))
            .duration(1000)
            .attr('x', x(0))
            .attr('y', function(d, i) {
              return y(d.product);
            })
            .attr('height', y.rangeBand() - 10)
            .attr('width', function(d, i) {
              return x(d.count);
            });

        setTimeout(function(){
            texts.enter()
                .append('text')
                .transition()
                .duration(1000)
                .text(function(d, i){
                    return d.product + ' ' + d.count;
                })
                .attr("x", function(d, i){
                  var rectWidth = 0;
                  svg.selectAll('rect').each(function(rect, idx){
                      if(idx == i){
                          rectWidth = d3.select(this).attr('width');
                      }
                  });
                  return parseInt(rectWidth) + 5;
                })
                .attr("y", function(d, i) {
                    return y(d.product) + (svg.select('rect').attr('height')/2);
                })
                .attr('height', y.rangeBand())
                .attr('width', function(d, i) {
                    return x(d.count);
                });
        }, 1000);

    }

    function createChart() {
        var x = getXAxis(getMaxCount(currentData)),
            y = getYAxis(currentData),
           rects = svg.selectAll('rect').data(currentData),
           texts = svg.selectAll("text").data(currentData);

        rects.enter()
            .append('rect')
            .attr("fill", getColor(currentData))
            .attr('x', x(0))
            .attr('y', function(d, i) {
                return y(d.product);
            })
            .attr('height', y.rangeBand() - 10)
            .attr('width', function(d, i) {
                return x(d.count);
            });

        texts.enter()
          .append("text")
          .text(function(d, i){
              return d.product + ' ' + d.count;
          })
          .attr("x", function(d, i){
            var rectWidth = 0;
            svg.selectAll('rect').each(function(rect, idx){
                if(idx == i){
                    rectWidth = d3.select(this).attr('width');
                }
            });

            return parseInt(rectWidth) + 5;
          })
          .attr("y", function(d, i) {
              return y(d.product) + (svg.select('rect').attr('height')/2);
          })
          .attr('height', y.rangeBand())
          .attr('width', function(d, i) {
              return x(d.count);
          });

    }

    function setData() {
        currentData = (currentData == data[0]) ? data[1] : data[0];
    }

    function getRects() {
        return svg.selectAll('rect').data(currentData);
    }

    function getMaxCount(data) {
        return d3.max(data, function(d, i) {
            return d.count;
        });
    }

    function getXAxis(maxCount) {
        return d3.scale.linear()
            .range([0, 600])
            .domain([0, maxCount]);
    }

    function getYAxis(data) {
        return d3.scale.ordinal()
            .rangeRoundBands([0,170])
            .domain(data.map(function(d, i) {
            return d.product;
        }));
    }

    function getColor(currentData) {
        return (currentData == data[0]) ? 'darkSalmon' : 'teal';
    }

    createChart();

})();
