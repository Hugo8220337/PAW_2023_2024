function getDonorCountryData(token) {
    fetch("http://localhost:5000/api/statistics/donors/countries", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw Error(
                    "Erro na ligação! " + response
                );
            }

            return response.json();
        })
        .then((data) => {
            console.log("Data retrieved:", data);

            var dataArray = [["Country", "Popularity"]]; // Initialize data array with header

            // Populate dataArray with retrieved data
            data.forEach((country) => {
                dataArray.push([country.country, country.count]);
            });

            // Call function to draw chart with the retrieved data
            drawRegionsMap(dataArray, "Doadores");
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
}

function getEntityCountryData(token) {

    fetch("http://localhost:5000/api/statistics/entities/countries", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw Error(
                    "Erro na ligação." + response
                );
            }

            return response.json();
        })
        .then((data) => {
            console.log("Data retrieved:", data);

            var dataArray = [["Country", "Popularity"]]; // Initialize data array with header

            // Populate dataArray with retrieved data
            data.forEach((country) => {
                dataArray.push([country.country, country.count]);
            });

            // Call function to draw chart with the retrieved data
            drawRegionsMap(dataArray, "Entidades");
        })
        .catch((error) => {
            console.error(error);
            alert(error);
        });
}

function getDonationsYearyData(token) {
    fetch("http://localhost:5000/api/statistics/donations/year", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw Error(
                "Erro na ligação." + response
            );
        }

        return response.json();
    })
    .then((data) => {
        console.log("Data retrieved:", data);

        let dataArray = [["Ano", "Doações"]]; // Initialize data array with header

        // Populate dataArray with retrieved data
        data.forEach((year) => {
            if(year.year !== null) {
                dataArray.push([year.year.toString(), year.count]); // Convert year to string if necessary
            }
        });

        // Call function to draw chart with the retrieved data
        drawChart(dataArray, "Doações por ano"); //TODO
    })
    .catch((error) => {
        console.error(error);
        alert(error);
    });
}

function getDonationsMonthData(token) {
    fetch("http://localhost:5000/api/statistics/donations/month", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw Error(
                "Erro na ligação." + response
            );
        }

        return response.json();
    })
    .then((data) => {
        console.log("Data retrieved:", data);

        let dataArray = [["Mês", "Doações"]]; // Initialize data array with header

        // Populate dataArray with retrieved data
        data.forEach((mes) => {
            if(mes.month !== "Unknown") {
                dataArray.push([mes.month.toString(), mes.count]); // Convert year to string if necessary
            } // TODO adicionar donations request
        });

        // Call function to draw chart with the retrieved data
        drawChart(dataArray, "Doações por mês");
    })
    .catch((error) => {
        console.error(error);
        alert(error);
    });
}

function drawRegionsMap(data, legend) {
    var regions_div = document.getElementById("regions_div")
    

    var data = google.visualization.arrayToDataTable(data);

    var options = {
        title: legend,
    };

    var chart = new google.visualization.GeoChart(
        document.getElementById("regions_div")
    );

    // Draw the map after a slight delay
    chart.draw(data, options);

    // Preisa do Timeout para o mapa não dar override ao título quando carregar
    setTimeout(() => {
        var titleElement = document.createElement("h2");
        titleElement.textContent = legend;
        regions_div.insertBefore(titleElement, regions_div.firstChild);
    }, 100);


}

function drawChart(data, title) {
    var options = {
        chart: {
            title: title,
        }
    };

    var chart = new google.charts.Bar(document.getElementById('regions_div'));


    chart.draw(google.visualization.arrayToDataTable(data), options); // Convert dataArray to DataTable before drawing

}