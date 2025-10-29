require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI);

const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model("List", listSchema);

const defaultItems = [
  new Item({ name: "Walk the dogs" }),
  new Item({ name: "Buy milk" }),
  new Item({ name: "Watch movie" }),
];

// --- Unified Home Route (/ and /today) ---
app.get(["/", "/today"], async (req, res) => {
  try {
    const items = await Item.find({});
    if (items.length === 0) {
      await Item.insertMany(defaultItems);
      return res.redirect("/");
    }
    res.render("list", { listTitle: "Today", newListItems: items });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// --- POST / (add new item) ---
app.post("/", async (req, res) => {
  const itemName = req.body.newItem.trim();
  const listName = req.body.list;

  if (!itemName) {
    return res.redirect("/" + (listName === "Today" ? "" : listName));
  }

  const item = new Item({ name: itemName });

  try {
    if (listName === "Today") {
      await item.save();
      res.redirect("/");
    } else {
      let foundList = await List.findOne({ name: listName });
      if (!foundList) {
        foundList = new List({ name: listName, items: [item] });
      } else {
        foundList.items.push(item);
      }
      await foundList.save();
      res.redirect("/" + listName);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// --- Dynamic Custom Lists (/Work, /Yesterday, etc.) ---
app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  // Redirect /today → /
  if (customListName === "Today") {
    return res.redirect("/");
  }

  try {
    let foundList = await List.findOne({ name: customListName });
    if (!foundList) {
      foundList = new List({ name: customListName, items: defaultItems });
      await foundList.save();
      return res.redirect("/" + customListName);
    }
    res.render("list", {
      listTitle: foundList.name,
      newListItems: foundList.items,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// --- Delete item ---
app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  try {
    if (listName === "Today") {
      await Item.deleteOne({ _id: checkedItemId });
      res.redirect("/");
    } else {
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );
      res.redirect("/" + listName);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("✅ Server is running on port 5000");
});