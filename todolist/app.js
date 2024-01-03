const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Walk the dogs"
});

const item2 = new Item({
  name: "Buy milk"
});

const item3 = new Item({
  name: "Watch movie"
});


const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.route('/')
  .get((req, res) => {
    Item.find({})
    .then((items) => {
      if (items.length === 0) {
        Item.insertMany(defaultItems);
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: items});
      }

      res.render("list", {listTitle: "Today", newListItems: items});
    });
  })
  .post((req, res) => {
    const listName = req.body.list;
    const itemName = req.body.newItem;
  
    if(itemName.trim().length !== 0) {
      const item = new Item({
        name: itemName
      });
    
      if (listName === "Today"){
        item.save();
        res.redirect("/");
      } else {
        List.findOne({name: listName})
          .then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
          })
      }
    } else {
      if (listName === "Today"){
        res.redirect("/");
      }
      res.redirect("/" + listName);
    }

  })


app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName})
    .then((foundList) => {
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    })
    .catch(() => {
      const list = new List({
        name: customListName
      });
      list.save();
      res.redirect("/" + customListName);
    });
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
      Item.deleteOne({_id: checkedItemId}).then(() => {
        res.redirect("/");
      });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
      .then(() => {
        res.redirect("/" + listName);
      });
  };
});

app.listen(process.env.PORT || 5000);