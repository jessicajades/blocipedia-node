const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get(
    "/wikis/:wikiId/collaborators/edit",
    collaboratorController.editPage
);
router.post("/wikis/:wikiId/collaborators/add", collaboratorController.create);
router.post(
    "/wikis/:wikiId/collaborators/remove",
    collaboratorController.destroy
);

module.exports = router;
