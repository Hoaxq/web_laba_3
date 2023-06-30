
// Рисует линейный график
function DrawLinearGrafic_02(data_x, data_y, strX, strY, int_color) {
    // Проверяем, что входные данные являются числами
    if (!Array.isArray(data_x) || !Array.isArray(data_y) || data_x.length !== data_y.length) {
        console.error("Invalid input data");
        return;
    }
    for (var i = 0; i < data_x.length; i++) {
        if (isNaN(data_x[i]) || isNaN(data_y[i])) {
            console.error("Invalid input data");
            return;
        }
    }
    
    // Создаем элемент SVG
    var svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');

    // Создаем функции масштабирования для x и y

    let dat_x = GetMinMaxVal(data_x);
    let dat_y = GetMinMaxVal(data_y);

    var xScale = d3.scaleLinear()
      .domain([dat_x[0], dat_x[1]]) //.domain([0, d3.max(data_x)]) // .domain([0, data_x.length - 1])
      .range([50, 450]);
    
    var yScale = d3.scaleLinear()
      .domain([dat_y[0], dat_y[1]]) //.domain([0, d3.max(data_y)])
      .range([250, 50]);

    // Создаем оси x и y
    var xAxis = d3.axisBottom(xScale);
    //var xAxis;
    //xAxis.tickFormat(d3.format(".0f")).tickValues(data_x.map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));  
    xAxis.tickFormat(d3.format(".0f"))
        .tickValues(data_x.filter((d, i) => i % 2 === 0).map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));

    var yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(Math.ceil(yScale.domain()[0]), Math.floor(yScale.domain()[1]) + 1, 1))
        .tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

    // Добавляем легенды
    svg.append("g")
        .attr("transform", "translate(225," + 290 + ")")
        .append("text")
        .text(strY)
        .attr("class", "x-legend")
        .style("fill", "gray"); // set color to gray

    svg.append("g")
        .attr("transform", "translate(" + 20 + ", "+ 200 + ") rotate(-90)")
        .append("text")
        .text(strX)
        .attr("class", "y-legend")
        .style("fill", "gray"); // set color to gray

    let currColor;

    if(int_color == 0) currColor = "orange";
    else if(int_color == 1) currColor = "lightgreen";
    else if(int_color == 2) currColor = "#00a3ff";

    svg.append("path")
        .datum(data_y)
        .attr("fill", "none")
        .attr("stroke", currColor)
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,0")
        .attr("d", d3.line()
            .x(function(d, i) { return xScale(data_x[i]); })
            .y(function(d) { return yScale(d); })
            .curve(d3.curveCardinal.tension(0.1)) // Задаю степень кривизны линии
        );
}

// Возвращает минимальное и максимальное значение из массива, с небольшим смещением,
// для более красивого отображения графика
function GetMinMaxVal(mass) {
    for(let i = 0; i<mass.length; i++) {
        // Преобразовываю все данные массива в числа
        mass[i] = parseFloat(mass[i]);
    }

    let min = d3.min(mass); 
    let max = d3.max(mass); 
    let gerr = max-min;

    let outMin = min - gerr*0.1;
    let outMax = max + gerr*0.1;

    let outMass = [outMin, outMax];
    console.log('sizeMass = ' + outMass);
    return outMass;
}

/*
function CardioidDraw_01() {
    const width = 300;
    const height = 300;
    const radius = 40;

    const svg = d3.select(".curr-graff")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const angles = d3.range(0, 2 * Math.PI, 0.05);

    const line = d3.line()
      .x(d => radius * (2 * Math.cos(d) - Math.cos(2 * d)))
      .y(d => radius * (2 * Math.sin(d) - Math.sin(2 * d)));

    const path = svg.append("path")
      .datum(angles)
      .attr("d", line)
      .attr("transform", `translate(${width/2}, ${height/2})`)
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("fill", "none");
}
*/

/*
function CardioidDraw_02(count) {
    const width = 300;
    const height = 300;
    const radius = 40;
    const pointCount = count; // number of points to draw
  
    const svg = d3.select(".curr-graff")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const angles = d3.range(0, 2 * Math.PI, 2 * Math.PI / pointCount);
  
    const points = angles.map(d => ({
      x: radius * (2 * Math.cos(d) - Math.cos(2 * d)),
      y: radius * (2 * Math.sin(d) - Math.sin(2 * d))
    }));
  
    const dots = svg.selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", d => d.x + width / 2)
      .attr("cy", d => d.y + height / 2)
      .attr("r", 9)
      .attr("fill", "rgba(130, 102, 202, 0.5)");
}
*/


function CardioidDraw_02(count) {
    const width = 300;
    const height = 300;
    const radius = 40;
    const pointCount = count; // number of points to draw
  
    const svg = d3.select(".curr-graff")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const points = []; 
    for (let i = 0; i < pointCount; i++) { 
        const angle = (i / pointCount) * Math.PI * 2; 
        const x = radius * Math.cos(angle) + radius * Math.cos(1 * angle); 
        const y = radius * Math.sin(angle) + radius * Math.sin(1 * angle); 
        points.push({ x, y }); 
    }
  
    const dots = svg.selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", d => d.x + width / 2)
      .attr("cy", d => d.y + height / 2)
      .attr("r", 9)
      .attr("fill", "rgba(130, 102, 202, 0.5)");
}


function GetIntForInput(Elem) {
    let inp = Elem.value;
    //console.log(inp);
    inp = parseInt(inp);
    //console.log(inp);
    if (!(isNaN(parseInt(inp)) || !isFinite(inp))){
        console.log(inp);
        if(inp >= 10 && inp <= 300) {
            return inp;
        } else return 0;
    } else return 0;
}
  
//let input_a = 0; // Жанр / Год выхода
//let input_b = 0; // Макс. кол-во частей / Макс. рейтинг / Мин рейтинг

let graf_container = document.getElementById('graf-container');
let buttDraw = document.getElementById('butt-02');
let textError = document.getElementById('p-1-1');
textError.style.display = 'none';

let inpEl = document.querySelector("div.r-block input");

// Выполняется при нажатии на кнопку "Построить" в блоке графика
buttDraw.addEventListener('click', () => {
    //console.log('Кнопка нажата!');
    //setVisibleElementGraf(true);
    let count = GetIntForInput(inpEl);

    let mainGraf = document.getElementsByClassName('curr-graff');

    if(count != 0) {
        mainGraf[0].style.display = 'block';
        textError.style.display = 'none';

        // Удаляю график        
        mainGraf[0].remove();
        
        // Создаю новый элемент
        let mainGraf2 = document.createElement("div");
        mainGraf2.className = "curr-graff";
        
        // И вставляю его в нужное место    
        //console.log('graf_container.nodeName = ' + graf_container.nodeName);
        graf_container.insertBefore(mainGraf2, graf_container.firstChild);
        
        CardioidDraw_02(count);
    } else {
        mainGraf[0].style.display = 'none';
        textError.style.display = 'block';
    }
});


//let data_x = [1,2,3,4,5]; 
//let data_y = [10,22,54,1,34]; 

// Рисует нужный график, с нужными данными
function MainGenerateGrafic(input_a, input_b) {
    
    /*
    // Получаю новые данные из таблицы на странице
    // Так что графики изменяются, после фильтрации значений
    let data = GetTable(); 

    // Получаю массив значений, для построения графика
    let newDate = CreateOutpMassForDate(data, input_a, input_b);
    
    data_x = Object.keys(newDate);
    data_y = Object.values(newDate);
    */

    let strLett; // Подпись для линейного графика
    
    if(input_b == 0) strLett = "Кол-во частей";
    else if(input_b == 1) strLett = "Max рейтинг";
    else if(input_b == 2) strLett = "Min рейтинг";
    
    DrawLinearGrafic_02(data_x, data_y, strLett, "Год выхода", input_b);
}
