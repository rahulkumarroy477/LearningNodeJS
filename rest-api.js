const express = require("express");
const app = express();
const fs = require("fs");
let movies = require("./mock-data.json");
const PORT = 8000;

// Middleware

// middleware1
app.use(express.urlencoded({ extended: false }));
// middleware2
app.use(express.json()); // To parse JSON bodies

// Ensure logs directory exists
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// REST
app.get("/api/movies", (req, res) => {
    const now = new Date();
    const content = `GET ${now.getTime()} --> ${req.path} visited\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.json(movies);
});

app.get("/movies", (req, res) => {
    const now = new Date();
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
    const now = new Date();
    const movie = movies.find((m) => m.id === Number(req.params.id));
    const movieInfo = movie === undefined ? {} : movie;
    const content = `GET ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(movieInfo)} received\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    return res.send(movieInfo);
});

app.get("/movies/:id", (req, res) => {
    const now = new Date();
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
    const now = new Date();
    const body = req.body;
    const newMovieId = movies.length+1
    movies.push({ id: newMovieId, ...body });
    const content = `POST ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(body)} sent\n`;
    fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
        if (err) console.error("Failed to write log:", err);
    });
    fs.writeFile("./mock-data.json", JSON.stringify(movies, null, 2), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });
        return res.json({ 
            id:newMovieId,
            status: "Done" });
    });
});


// PATCH
app.patch("/api/movies/:id", (req, res) => {
    const now = new Date();
    const movieId = Number(req.params.id);
    console.log(movieId);
    const updates = req.body;
    console.log(updates);
    let content = '';
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);  // array is 0 based but id is starting from 1
    if (movieIndex === -1) {
        content = `PATCH ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(updates)} failed to update, id does not exist\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.status(404).json({ message: "Movie not found" })
    }
    let prevData = movies[movieIndex];
    console.log(prevData);
    const updatedMovie = { ...movies[movieIndex], ...updates };
    console.log(updatedMovie);
    movies[movieIndex] = updatedMovie;
    fs.writeFile("./mock-data.json", JSON.stringify(movies, null, 2), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });

        content = `PATCH ${now.getTime()} --> ${req.path} visited,${JSON.stringify(prevData)} changed to ${JSON.stringify(updatedMovie)} successful\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.json(updatedMovie);
    });
});

// DELETE

app.delete("/api/movies/:id", (req, res) => {
    const now = new Date();
    const movieId = Number(req.params.id);
    console.log(movieId);
    let content = ''
    const movieIndex = movies.findIndex((movie) => movie.id === movieId);
    if (movieIndex === -1) {
        content = `DELETE ${now.getTime()} --> ${req.path} visited, failed to delete, id ${movieId} does not exist\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.status(404).json({ message: "Movie not found" })
    }
    console.log(movieIndex);
    const movieName = movies[movieIndex].name;
    movies = movies.filter(movie => movie.id !== movieId);
    console.table(movies);
    fs.writeFile("./mock-data.json", JSON.stringify(movies, null, 2), (err) => {
        if (err) return res.json({ status: "Failed", error: err.message });

        content = `DELETE ${now.getTime()} --> ${req.path} visited, ${JSON.stringify(movieName)} movie deleted successfully\n`;
        fs.appendFile(`./logs/log-${now.getDate()}.txt`, content, (err) => {
            if (err) console.error("Failed to write log:", err);
        });
        return res.json({ message: `${movieName} deleted` });
    });
});

app.listen(PORT, () => {
    console.log("Server started");
});
