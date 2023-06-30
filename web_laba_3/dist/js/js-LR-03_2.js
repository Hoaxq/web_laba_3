function myRound(int, okr)
{
    let out = Math.round((int)*10**okr)/10**okr;
    return(out); 
}

// Рисует линейный график
function DrawLinearGrafic_02_2(data_x, data_y, strX, strY, int_color) {
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
    var svg = d3.select(".curr-graff_02")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');

    // Создаем функции масштабирования для x и y

    let dat_x = GetMinMaxVal_2(data_x);
    let dat_y = GetMinMaxVal_2(data_y);

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
    xAxis.tickFormat()
        //.tickValues(data_x.filter((d, i) => i % 2 === 0).map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));

    var yAxis = d3.axisLeft(yScale)
        //.tickValues(d3.range(Math.ceil(yScale.domain()[0]), Math.floor(yScale.domain()[1]) + 1, 1))
        //.tickFormat(d3.format(".0f"));

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
        .attr("transform", "translate(255," + 290 + ")")
        .append("text")
        .text(strY)
        .attr("class", "x-legend")
        //.style("fill", "gray"); // set color to gray

    svg.append("g")
        .attr("transform", "translate(" + 10 + ", "+ 155 + ") rotate(-90)")
        .append("text")
        .text(strX)
        .attr("class", "y-legend")
        //.style("fill", "gray"); // set color to gray

    let currColor;

    if(int_color == 0) currColor = "orange";
    else if(int_color == 1) currColor = "lightgreen";
    else if(int_color == 2) currColor = "#00a3ff";

    // Линейный график не справляется
    /*
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
    */    
    
    svg.selectAll(".dot")
        .data(data_y)
        .enter()
        .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d, i) { return xScale(data_x[i]); })
            .attr("cy", function(d) { return yScale(d); })
            .attr("r", 1.5)
            .attr("fill", "#00a3ff");
    
}

// Возвращает минимальное и максимальное значение из массива, с небольшим смещением,
// для более красивого отображения графика
function GetMinMaxVal_2(mass) {
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

function GenerateMassFromValuesOfFormula(valMass) {
    let f = x => { // Формула f(x)
        //const value = Math.E**(x)/(Math.pow(x, 2) - 25);
        const value = (4*x)/(x*x - 4);
        return value; //isFinite(value) ? value : null; // Проверяем определенность значения
      }; 

    let countOfDots = (valMass[1] - valMass[0])*20; // Задаю количество точек
    if(countOfDots < 300) countOfDots = 300;
    let mapResult = {}; // Выходной массив, структуры x : f(x)

    // Тут код, в котором вычисляется countOfDots точек, и они заносятся в словарь mapResult

    let massOfFinitDots = []

    for (let i = 0; i <= countOfDots; i++) {
        let x = valMass[0] + (i * (valMass[1] - valMass[0])) / countOfDots;

        let currVal = f(x);        

        if(Math.abs(currVal) > 1000) {
            console.log(x + ' - точка разрыва!');
            massOfFinitDots.push(x);
            currVal > 0 ? currVal = 1000 : currVal = -1000;
        } else {
            if(isFinite(currVal) === true){
                currVal = myRound(currVal, 5);
                mapResult[x] = currVal;
            } //else {
                //if(Math.abs(currVal) < 1000) mapResult[x] = 0;
            //}
        }
    }

    for(let i = 0; i < massOfFinitDots.length; i++) {
        let step = 0.000005;
        let widt = 0.03;

        for(let x = massOfFinitDots[i] - widt; x < massOfFinitDots[i] + widt; x += step) {
            let currVal = f(x);

            if ((Math.abs(currVal) < 1000)) {
                if(isFinite(currVal) === true){
                    currVal = myRound(currVal, 5);
                    mapResult[x] = currVal;
                }
            }
        }
    }

    return mapResult;
}

function GetIntForInput_2(Elem) {
    bool_isIntValCorrect = false;
    let inp = Elem.value;
    //console.log(inp);
    inp = parseFloat(inp);
    //console.log(inp);
    if (!(isNaN(parseInt(inp)) || !isFinite(inp))){
        console.log(inp);
        if(inp >= -100 && inp <= 20) {
            bool_isIntValCorrect = true;
            return inp;
        } else return 0;
    } else return 0;
}

let graf_container_2 = document.getElementById('graf-container_02');
let buttDraw_2 = document.getElementById('butt-003');
let textError_2 = document.getElementById('p-1-2');
textError_2.style.display = 'none';

let inpEl_2_01 = document.querySelector("#pg-0-inp-1");
let inpEl_2_02 = document.querySelector("#pg-0-inp-2");

let bool_isIntValCorrect = false;

let data_x = []; 
let data_y = []; 

// Выполняется при нажатии на кнопку "Построить" в блоке графика
buttDraw_2.addEventListener('click', () => {
    console.log('Кнопка нажата!');
    
    let valMass_1_val = GetIntForInput_2(inpEl_2_01);
    let valMass_2_val = GetIntForInput_2(inpEl_2_02);

    let valMass = []; // Корректный интервал [от, до]
    
    let mainGraf_02 = document.getElementsByClassName('curr-graff_02');

    let bool_isAllOk = true;

    if (!(bool_isIntValCorrect == true)) bool_isAllOk = false;
    if (!(valMass_1_val < valMass_2_val)) bool_isAllOk = false;

    //console.log('bool_isAllOk = ' + bool_isAllOk);

    if(bool_isAllOk) {
        valMass[0] = valMass_1_val;
        valMass[1] = valMass_2_val;

        mainGraf_02[0].style.display = 'block';
        textError_2.style.display = 'none';

        //console.log('valMass = ' + valMass);

        let inMap = GenerateMassFromValuesOfFormula(valMass);

        console.log(inMap);

        data_x = Object.keys(inMap);
        data_y = Object.values(inMap);

        // Удаляю график        
        mainGraf_02[0].remove();
        
        // Создаю новый элемент
        let mainGraf2 = document.createElement("div");
        mainGraf2.className = "curr-graff_02";
        
        // И вставляю его в нужное место    
        //console.log('graf_container.nodeName = ' + graf_container.nodeName);
        graf_container_2.insertBefore(mainGraf2, graf_container_2.firstChild);
        
        //CardioidDraw_02(count);
        DrawLinearGrafic_02_2(data_x, data_y, "Y", "X", 0);
    } else {
        mainGraf_02[0].style.display = 'none';
        textError_2.style.display = 'block';
    }
});