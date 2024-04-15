const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contactController");

router.get("/new", contactController.getContact);

router.post("/create", contactController.createContact);

router.post("/:id/update", contactController.editContact);
router.get("/:id/edit", contactController.getEditContact);


router.get("/", contactController.getContactList);

module.exports = router;
