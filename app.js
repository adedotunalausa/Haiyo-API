
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/haiyoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//////////////////Schema and model to handle names in the database//////////////////

const nameSchema = {
  name: String,
  country: String,
  tribe: String,
  meaning: String
}

const Name = mongoose.model("Name", nameSchema);

////////////////////////////////Request targeting all names/////////////////////////////

app.route("/names")

.get((req, res) => {
  Name.find((err, foundNames) => {
    if(!err) {
      res.send(foundNames);
    } else {
      res.send(err);
    }

  });
})

.post((req, res) => {
  const newName = new Name ({
    name: req.body.name,
    country: req.body.country,
    tribe: req.body.tribe,
    meaning: req.body.meaning
  });

  newName.save((err) => {
    if(!err) {
      res.send("Succesfully added");
    } else {
      res.send(err);
    }

  });
})

.delete((req, res) => {
  Name.deleteMany((err) => {
    if(!err) {
      res.send("Successfully deleted the names");
    } else {
      res.send(err);
    }
  });
});


///////////////////////////Request targeting a specific name//////////////////////////

app.route("/names/:requestedName")

.get((req, res) => {
  Name.findOne({name: req.params.requestedName}, (err, foundName) => {
    if(foundName) {
      res.send(foundName);
    } else {
      res.send("No matching name found");
    }
  });
})

.put((req, res) => {
  Name.updateOne(
    {name: req.params.requestedName},
    {
      name:  req.body.name,
      country: req.body.country,
      tribe: req.body.tribe,
      meaning: req.body.meaning
    },
    {overwrite: true},
    (err) => {
      if(!err) {
        res.send("Successfully updated name");
      }
    }
  );
})

.patch((req, res) => {
  Name.updateOne(
    {name: req.params.requestedName},
    {$set: req.body},
    (err) => {
      if(!err) {
        res.send("Successfully updated name");
      } else {
        res.send(err);
      }
    }
  );
})

.delete((req, res) => {
  Name.deleteOne(
    {name: req.params.requestedName},
    (err) => {
      if(!err) {
        res.send("Successfully deleted the name");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(8080, function() {
  console.log("Server started on port 8080");
})
