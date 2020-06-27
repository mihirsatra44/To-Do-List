const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _=require("lodash");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Schema Creation
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to the To-Do List!"
});
const item2 = new Item({
  name: "Hit + to add task."
})
const item3 = new Item({
  name: "<-- Hit if completed task."
})
const defaultList = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);

//.use Method
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  let day = date.getDay();
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultList, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log("Successfully Added")
        }
      })
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItem: foundItems
      });
    }
  })
});

app.post("/", function(req, res) {
  let today = date.getDay();
  var itemName = req.body.item;
  var listName = req.body.list;
  const newItem = new Item({
    name: itemName
  })

  if (listName === today) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  let day = date.getDay();
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Successfully removed");
        res.redirect("/");
      }
    })
  } else {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
          if(!err){
            res.redirect("/"+listName);
          }
        })
  }
});

app.get("/:customname", function(req, res) {
  const customListname = _.capitalize(req.params.customname);

  List.findOne({
    name: customListname
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListname,
          items: defaultList
        });
        list.save();
        res.redirect("/" + customListname);
      } else {
        res.render("list", {
          listTitle: customListname,
          newListItem: foundList.items
        });
      }
    }
  })

});

let port=process.env.PORT;
if (port==null||port==""){
  port=3000;
}

app.listen(port, function(req, res) {
  console.log("Server started");
});
