import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const router = Router();
const controller = new CourseController();

router.get("/courses", async (req, res) => {
    await controller.all(req, res);
});

router.get("/courses/:id", async (req, res) => {
    await controller.findOne(req, res);
});

router.post("/courses", async (req, res) => {
    await controller.save(req, res);
});

router.get("/courses/:lecturerId", async (req, res) => {
    await controller.getCoursesByLecturer(req, res);
});

export default router;