var Chart = (function(window,d3) {

  var svg, data, x, y, xAxis, yAxis, dim, chartWrapper, line, path, margin = {}, width, height, locator;

  var breakPoint = 768;

  init(); //load data, then initialize chart
  
  //called once the data is loaded
  function init() {
    data = [];
          var startDate = new Date('2014-1-1');
          var endDate = new Date('2015-1-1');
          
          for(var i = startDate; i < endDate; startDate.setDate(startDate.getDate() + 10)) {
            data.push({date: i.toString(), value: Math.random()})
          }

    //initialize scales
    xExtent = d3.extent(data, function(d,i) { return new Date(d.date) });
    yExtent = d3.extent(data, function(d,i) { return d.value });
    x = d3.time.scale().domain(xExtent);
    y = d3.scale.linear().domain(yExtent);

    //initialize axis
    xAxis = d3.svg.axis().orient('bottom');
    yAxis = d3.svg.axis();

    //the path generator for the line chart
    line = d3.svg.line()
      .x(function(d) { return x(new Date(d.date)) })
      .y(function(d) { return y(d.value) });

    //initialize svg
    svg = d3.select('#chart')
      .append('svg')
      .style('pointer-events', 'none');


    chartWrapper = svg
      .append('g')
      .style('pointer-events', 'all');

    path = chartWrapper.append('path').datum(data).classed('line', true);

    chartWrapper.append('g').classed('x axis', true);
    chartWrapper.append('g').classed('y axis', true);

    chartWrapper.on('touchmove', onTouchMove);

    //add locator
    locator = chartWrapper.append('circle')
      .style('display', 'none')
      .attr('r', 10)
      .attr('fill', '#f00');

    touchScale = d3.scale.linear();

    //render the chart
    render();
  }

  function render() {

    //get dimensions based on window size
    updateDimensions(window.innerWidth);
    
    //update x and y scales to new dimensions
    x.range([0, width]);
    y.range([height, 0]);

    touchScale.domain([0,width]).range([0,data.length-1]).clamp(true);

    //update svg elements to new dimensions
    svg
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom);

    chartWrapper
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //update the axis and line
    xAxis.scale(x);
    yAxis.scale(y).orient(window.innerWidth < breakPoint ? 'right' : 'left');

    if(window.innerWidth < breakPoint) {
      xAxis.ticks(d3.time.month, 2)
    }
    else {
      xAxis.ticks(d3.time.month, 1)
    }
    
    svg.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.select('.y.axis')
      .call(yAxis);

    path.attr('d', line);
    renderLabels();
  }

  var labels = [
    {
      x: new Date('03-15-2014'),
      y: .17,
      text: 'Test Label 1',
      orient: 'right'
    },
    {
      x: new Date('11-20-2014'),
      y: .24,
      text: 'Test Label 2',
      orient: 'left'
    }
  ]

  function renderLabels() {

    var _labels = chartWrapper.selectAll('text.label');

    if(_labels[0].length > 0) {
      //labels already exist
      _labels
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return y(d.y) })
    }
    else {
      //append labels if function is called for the first time
      _labels
        .data(labels)
        .enter()
        .append('text')
        .classed('label', true)
        .attr('x', function(d) { return x(d.x) })
        .attr('y', function(d) { return y(d.y) })
        .style('text-anchor', function(d) { return d.orient == 'right' ? 'start' : 'end' })
        .text(function(d) { return d.text });
    }
  }

  function updateDimensions(winWidth) {
    margin.top = 20;
    margin.right = winWidth < breakPoint ? 0 : 50;
    margin.left = winWidth < breakPoint ? 0 : 50;
    margin.bottom = 50;

    width = winWidth - margin.left - margin.right;
    height = .7 * width;
  }

  function onTouchMove() {
    var xPos = d3.touches(this)[0][0];
    var d = data[~~touchScale(xPos)];

    locator.attr({
      cx : x(new Date(d.date)),
      cy : y(d.value)
    })
    .style('display', 'block');
  }

  return {
    render : render
  }

})(window,d3);

window.addEventListener('resize', Chart.render);