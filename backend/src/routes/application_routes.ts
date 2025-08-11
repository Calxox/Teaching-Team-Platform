import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";

const router = Router();
const applicationController = new ApplicationController();

router.get("/applications", async (req, res) => {
    await applicationController.all(req, res);
});

router.get("/applications/:id", async (req, res) => {
    await applicationController.one(req, res);
});

router.post("/applications", async (req, res) => {
    await applicationController.save(req, res);
});


router.get("/applications/courseCode/:courseCode", async (req, res) => {
    await applicationController.getAllApplicationsByCourse(req, res);
});

router.get("/applications/:candidate/:role/:courseCode", async (req, res) => {
    await applicationController.getApplicationsByUser(req, res);
});

router.put("/applications/:id", async (req, res) => {
    await applicationController.editRankandCommentandChosen(req, res);
});

export default router;