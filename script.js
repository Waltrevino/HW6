$(document).ready(function () {
    
    const APIKey = "4855fab5d3c13cba4c7daa1a66dc6842";

    var city = JSON.parse(localStorage.getItem("city"));

    $(".uv-index").empty();

    createAJAXQuery();

    $("#btn_search").on("click", function (event) {
        event.preventDefault();
        city = $("#city_search").val();
        if (city==="") {
            return; 
        }
        localStorage.setItem("city", JSON.stringify(city));
        createAJAXQuery();
    });

    $(".menu-item").on("click", function (event) {
        city = $(this).text();
        localStorage.setItem("city", JSON.stringify(city));
        createAJAXQuery();
    });

    function createAJAXQuery() {

        queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
            "q=" + city + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
  
            $("#city").text(response.name);

            $("#today-icon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon +"@2x.png")

            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $("#temp").text(tempF.toFixed(0) + " F");
            $("#humidity").text(response.main.humidity + "%");
            $("#wind-speed").text(response.wind.speed.toFixed(0));

            lon = response.coord.lon;
            lat = response.coord.lat;

            var queryOneCallURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=hourly&appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: queryOneCallURL,
                method: "GET"
            }).then(function (response) {
            
                var uvIndex = $(".uv-index").text(response.current.uvi);

                if (response.current.uvi < 3) {
                    
                    $(".uv-index").addClass("uv-index-favorable");
                }
                if ((response.current.uvi >= 3) && (response.current.uvi < 8)) {
                    $(".uv-index").removeClass("uv-index-favorable");
                    $(".uv-index").removeClass("uv-index-severe");
                    $(".uv-index").addClass("uv-index-moderate");
                }
                if (response.current.uvi >= 8) {
                    $(".uv-index").removeClass("uv-index-favorable");
                    $(".uv-index").removeClass("uv-index-moderate");
                    $(".uv-index").addClass("uv-index-severe");
                }

                for (var i = 1; i < 6; i++) {

                    var now = moment().add(i, 'd').format("ddd, MMMM Do");
                 $("#day" + i).text(now);

                 $("#img" + i).attr("src", "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon +"@2x.png")
    
                    var tempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
                    $("#" + i).text(tempF.toFixed(0) + " F");
                    $("#humidity" + i).text(response.daily[i].humidity + "%");
                }
            });
        });
    }
});