const express = require("express");
const auth = require("../middleware/auth");
const bodyParser=require("body-parser");
const routr = express();
routr.use(bodyParser.json());
routr.use(bodyParser.urlencoded({extended:true}));

const {countData,LessonData} = require("../controllers/countControllers");
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");

  const router = express.Router();

  router.route("/count/data").get(countData);
  router.route("/lesson/count/:id").get(LessonData);

  module.exports = router;