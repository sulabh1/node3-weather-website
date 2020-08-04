const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
//define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "sulabh adhikari",
	});
});

app.get("/about", (req, res) => {
	res.render("about", {
		title: "About Me",
		name: "sulabh adhikari",
	});
});

app.get("/help", (req, res) => {
	res.render("help", {
		helpText: "This is some helpful text.",
		title: "help",
		name: "sulabh adhikari",
	});
});

app.get("/weather", (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "You must provide an address",
		});
	}
	geocode(req.query.address, (error, { lattitude, longitude, location }={}) => {
		if (error) {
			return res.send({
				error,
			});
		}
		forecase(lattitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({
					error,
				});
			}
			res.send({
				forecast: forecastData,
				location,
				address: req.query.address,
			});
		});
	});
	// res.send({
	// 	forecast: "It is snowing",
	// 	location: "kathmandu",
	// 	address: req.query.address,
	// });
});
app.get("/products", () => {
	if (!req.query.search) {
		return res.send({
			error: "You must provide a search term",
		});
	}
	res.send({
		product: [],
	});
});
app.get("/help/*", (req, res) => {
	res.render("404", {
		title: "404",
		name: "sulabh adhikari",
		errorMessage: "Help article not found",
	});
});
app.get("*", (req, res) => {
	res.render("404", {
		title: "404",
		name: "sulabh adhikari",
		errorMessage: "Page not found",
	});
});
app.listen(3000, () => {
	console.log("Server is up on port 3000.");
});
