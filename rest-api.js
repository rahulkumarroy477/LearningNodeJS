const express = require("express");
const app = express();
const fs = require("fs");
let movies = require("./mock-data.json");
const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // To parse JSON bodies

const now = new Date();
// Ensure logs directory exists
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// REST
app.get("/api/movies", (req, res) => {
    const content = `GET ${now.getTime()} --> ${req.path} visited\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.json(movies);
});

app.get("/movies", (req, res) => {
    const html = `
    <ul>
        ${movies.map((movie) => `<li>${movie.name}</li>`).join('')}
    </ul>
    `;
    const content = `GET ${now.getTime()} --> ${req.path} visited\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.send(html);
});

app.get("/api/movies/:id", (req, res) => {
    const movie = movies.find((m) => m.id === Number(req.params.id));
    const movieInfo = movie === undefined ? {} : movie;
    const content = `GET ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(movieInfo)} received\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.send(movieInfo);
});

app.get("/movies/:id", (req, res) => {
    const movie = movies.find((m) => m.id === Number(req.params.id));
    const movieInfo = `<h2>${movie === undefined ? `Movie with given id does not exist` : `Movie name : ${movie.name}`}</h2>`;
    const content = `GET ${now.getTime()} --> ${req.path} visited, ${movieInfo} received\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.send(movieInfo);  // Use send instead of html
});

// POST method
app.post("/api/movies", (req, res) => {
    const body = req.body;
    movies.push({ id: movies.length + 1, ...body });
    const now = new Date();
    const content = `POST ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(body)} sent\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    fs.writeFile("./mock-data.json", JSON.stringify(movies), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });
        return res.json({ status: "Done" });
    });
});

app.patch("/api/movies/:id", (req, res) => {
    const movieId = Number(req.params.id);
    console.log(movieId);
    const updates = req.body;
    console.log(updates);
    let content = '';
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);  // array is 0 based but id is starting from 1
    if (movieIndex === -1) {
        content = `PATCH ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(updates)} failed to updated, id does not exist\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.status(404).json({ message: "Movie not found" })
    }
    console.log(movieIndex);
    const updatedMovie = { ...movies[movieIndex], ...updates };
    console.log(updatedMovie);
    movies[movieIndex] = updatedMovie;
    fs.writeFile("./mock-data.json", JSON.stringify(movies), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });
    });

    content = `PATCH ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(updates)} successful\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.json(updatedMovie);
});

app.delete("/api/movies/:id", (req, res) => {
    const movieId = Number(req.params.id);
    console.log(movieId);
    let content = ''
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (movieIndex === -1) {
        content = `DELETE ${now.getTime()} --> ${req.path} visited, failed to delete, ${movieIndex} does not exist\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.status(404).json({ message: "Movie not found" })
    }
    console.log(movieIndex);
    const movie_name = movies[movieIndex].name;
    movies = movies.filter(movie => movie.id !== movieId);
    console.table(movies);
    fs.writeFile("./mock-data.json", JSON.stringify(movies), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });
    });
    content = `DELETE ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(movie_name)} movie deleted successful\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });

    return res.json({ message: `${movie_name} deleted` });

});

app.listen(PORT, () => {
    console.log("Server started");
});
