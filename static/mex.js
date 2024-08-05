var sost = 0; //sost = 0 - включение, sost = 1 - выбор сорта, sost = 2 - выбор размера, sost = 3 - подтверждение загрузки, sost = 4 - старт работы, sost = 5 работа
var sortJS = 0; // sort=1 - black, sort=2 - white
var sizeJS = 0; // size=1 - M, size=2 - L, size=3 - XL
var sizesost = 0;
var modsost = 0;
var countermode = 0;

function clickSTART(){
    if (sost == 0){
        document.getElementById("display").innerHTML = "Добро пожаловать!";
        sost++;
    }
    else {
        if (sost == 1){
            sost--;
            document.getElementById("display").innerHTML = "Добро пожаловать!";
            modsost = 0;
            countermode = 0;
            sortJS = 1;
        }
        else {
            if (sost == 2){
                sost--;
                document.getElementById("display").innerHTML = "> Ржанной хлеб <br>&nbsp &nbsp Белый хлеб";
                modsost = 0;
                sortJS = 1;
            }
            else{
                if (sost == 3){
                   sost--;
                   document.getElementById("display").innerHTML = "> M <br>&nbsp &nbsp L <br>&nbsp &nbsp XL";
                   sizesost = 0;
                   sizeJS = 1;
                }
                else {
                    if (sost == 4){
                        // Старт,цикличный запрос get в flask
                        console.log("444");
                        document.getElementById("panel").insertAdjacentHTML('beforeend', "<br>> Начало работы");
                        sost++;
                        timer = setInterval(UpdateTraffic,1000);
                        sortJS = 0;
                        sizeJS = 0;
                        sizesost = 0;
                        modsost = 0;
                        countermode = 0;
                    }
                    else{
                        if (sost == 5){
                            document.getElementById("display").innerHTML = "Для повторной выпечки <br> перезагрузите систему";
                        }
                    }
                }
            }
        }
    }
}

function clickMODE() {
    countermode++;
    if (sost == 1) {
        if (modsost == 0) {
            document.getElementById("display").innerHTML = "> Ржанной хлеб <br>&nbsp &nbsp Белый хлеб";
            modsost++;
            sortJS = 1;
        }
        else {
            document.getElementById("display").innerHTML = "&nbsp &nbsp Ржанной хлеб <br> > Белый хлеб";
            modsost--;
            sortJS = 2;
        }
    }
}

function clickOK(){
    if(sost == 1 && countermode > 0){
       document.getElementById("display").innerHTML = "> M <br>&nbsp &nbsp L <br>&nbsp &nbsp XL";
       document.getElementById("panel").insertAdjacentHTML('beforeend', "<br>> Выбран сорт хлеба");
       sizesost = 1;
       sizeJS = 1;
       sost++;
    }
    else {
        if (sost == 2) {
            var entry = {
                sort: sortJS,
                size: sizeJS
            };
            fetch("/", {
                method: "POST",
                body: JSON.stringify(entry),
                cache: "no-cache",
                headers: new Headers({
                    "content-type": "application/json"
                })
            })
                .then(function (response){
                    if(response.status != 200){
                        console.log('Response status was not 200: ${response.status}');
                        return
                    }
                    response.json().then(function (data){
                        document.getElementById("spr33").insertAdjacentHTML('beforeend', data);
                    })

                } )
            document.getElementById("display").innerHTML = "Загрузите ингредиенты";
            document.getElementById("panel").insertAdjacentHTML('beforeend', "<br>> Выбран размер хлеба");
            sost++;
        }
        else {
             if (sost == 3){
                document.getElementById("display").innerHTML = "Готов к старту";
                document.getElementById("panel").insertAdjacentHTML('beforeend', "<br>> Ингредиенты загружены. Готов к старту");
                sost++;
            }
        }
    }
}

function clickSIZE() {
    if (sost == 2) {
        if (sizesost == 0) {
            document.getElementById("display").innerHTML = "> M <br>&nbsp &nbsp L <br>&nbsp &nbsp XL";
            sizesost++;
            sizeJS = 1;
        }
        else {
            if (sizesost == 1) {
                document.getElementById("display").innerHTML = "&nbsp &nbsp M <br>> L <br>&nbsp &nbsp XL";
                sizesost++;
                sizeJS = 2;
            }
            else {
                if (sizesost == 2) {
                    document.getElementById("display").innerHTML = "&nbsp &nbsp M <br>&nbsp &nbsp L <br>> XL";
                    sizesost = 0;
                    sizeJS = 3;
                }
            }
        }
    }
}

function UpdateTraffic() {
    fetch("/uplpad", {
        method: "GET",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
        .then(function (response){
            if(response.status != 200){
                console.log('Response status was not 200: ${response.status}');
                return
            }
            response.json().then(function (data){
                if(data == 0){
                    document.getElementById("display").innerHTML = "Хлеб готов!";
                    document.getElementById("panel").insertAdjacentHTML('beforeend', "<br>> Окончание работы");
                    clearInterval(timer);
                }
                else {
                    if ((Math.floor(data / 60)) < 10)
                    document.getElementById("display").innerHTML = (Math.floor(data / 60)) + " : " + (data % 60);
                }
            })

        } )