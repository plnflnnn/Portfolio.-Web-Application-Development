import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route to render the main page
app.get("/", async (req, res) => {
    try {
    const response = await db.query(
            "SELECT * FROM posts;",
        );
      res.render("index.ejs", { posts: response.rows });
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts" });
    }
});

// Route to render the edit page
app.get("/new", (req, res) => {
    res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
  });
  
  app.get("/edit/:id", async (req, res) => {

    try {
        const postId = parseInt(req.params.id); 
        const result = await db.query(
            "SELECT * FROM posts WHERE id = $1; ",
            [postId]
        );

        if (!result) return res.status(404).json({ message: "Post not found" });

        res.render("modify.ejs", {
        heading: "Edit Post",
        submit: "Update Post",
        post: result.rows[0]
        });
    } catch (error) {
      res.status(500).json({ message: "Error fetching post" });
    }
});


//Create a new post
app.post("/api/posts", async (req, res) => {
    try {
        const post = {
          title: req.body.title,
          content: req.body.content,
          author: req.body.author,
          date: new Date(),
        };

        await db.query(
            "INSERT INTO posts (title, content, author, date) VALUES ($1, $2, $3, $4)",
            [post.title, post.content, post.author, post.date]
        );

      res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error creating post" });
    }
});


// Partially update a post
app.post("/api/posts/:id", async (req, res) => {

    try {
        const postId = parseInt(req.params.id);

        if (req.body.title) {
            await db.query(
                "UPDATE posts SET title = $2 WHERE id = $1; ",
                [postId, req.body.title]
            );
        }

        if (req.body.content) {
            await db.query(
                "UPDATE posts SET content = $2 WHERE id = $1; ",
                [postId, req.body.content]
            );
        }

        if (req.body.author) {
            await db.query(
                "UPDATE posts SET author = $2 WHERE id = $1; ",
                [postId, req.body.author]
            );
        }

        if (req.body.title && req.body.content) {
            await db.query(
                "UPDATE posts SET title = $2, content = $3 WHERE id = $1; ",
                [postId, req.body.title, req.body.content]
            );
        }

        if (req.body.title && req.body.author) {
            await db.query(
                "UPDATE posts SET title = $2, author = $3 WHERE id = $1; ",
                [postId, req.body.title, req.body.author]
            );
        }

        if (req.body.content && req.body.author) {
            await db.query(
                "UPDATE posts SET content = $2, author = $3 WHERE id = $1; ",
                [postId, req.body.content, req.body.author]
            );
        }

        if (req.body.title && req.body.content && req.body.author) {
            await db.query(
                "UPDATE posts SET title = $2, content = $3, author = $4 WHERE id = $1; ",
                [postId, req.body.title, req.body.content, req.body.author]
            );
        } 

        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        await db.query(
            "DELETE FROM posts WHERE id = $1; ",
            [postId]
        );
        res.redirect("/");
    } catch (error) {
      res.status(500).json({ message: "Error deleting post" });
    }
});

app.listen(process.env.PORT || 5000);