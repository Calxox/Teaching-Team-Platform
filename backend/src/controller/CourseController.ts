import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { Course } from "../entities/Course";

export class CourseController {
    private courseRepository = AppDataSource.getRepository(Course)
    
    async all(request: Request, response: Response) {
        const courses = await this.courseRepository.find()
        return response.json(courses) || [];
    }

    async findOne(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const course = await this.courseRepository.findOne({where: {id}});
        return response.json(course);
    }

    async save(request: Request, response: Response) {
        const { lecturerId,courseCode, courseName, courseDescription } = request.body;

        const course = Object.assign(new Course(), {
            lecturerId,
            courseCode,
            courseName,
            courseDescription,
        });

        try {
            const savedCourse = await this.courseRepository.save(course);
            return response.status(201).json(savedCourse);
            } catch (error) {
            return response
                .status(400)
                .json({ message: "Error creating user", error });
        }
    }

    async getCoursesByLecturer(request: Request, response: Response) {
        const lecturerId = parseInt(request.params.id);
        const courses = await this.courseRepository.find({where: {lecturerId}});
        return response.json(courses as Course[]);
    }
}