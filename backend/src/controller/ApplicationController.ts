import { Request, Response } from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entities/User";
import { Application } from "../entities/Application";

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const applications = await this.applicationRepository.find();

    return response.json(applications) || [];
  }

  /**
   * Retrieves a single application by their ID
   * @param request - Express request object containing the application ID in params
   * @param response - Express response object
   * @returns JSON response containing the application if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }
    return response.json(application) || [];
    }

    async save(request: Request, response: Response) {
  const {
    candidate,
    courseCode,
    name,
    previousRole,
    role,
    skills,
    academics,
    availability,
  } = request.body;

  let application = Object.assign(new Application(), {
    candidate,
    courseCode,
    name,
    previousRole,
    role,
    status: 0,
    skills,
    availability,
    academics,
    chosen: false,
    ranking: -1,
    comment: ""
  });
//   applicationApi.createApplication({
//     candidate: ID,
//     courseCode: courseCode,
//     name: applicantName,
//     previousRole: previousRole,
//     role: rolesApplied,
//     skills: parsedSkills,
//     academics: academics,
//     availability: availability
// });


  try {
    const savedApplication = await this.applicationRepository.save(application);
    return response.json(savedApplication);
  } catch (error) {
    return response.status(500).json({ message: "Error saving application" });
  }
}


    async getAllApplicationsByCourse(request: Request, response: Response) {
      const courseCode = request.params.courseCode;
      const applications = await this.applicationRepository.find({
        where: { courseCode },
      });
      return response.json(applications) || [];
    }

    async getApplicationsByUser(request: Request, response: Response) {
      const candidate = parseInt(request.params.candidate);
      const courseCode = request.params.courseCode;
      const role = request.params.role;
      const applications =  await this.applicationRepository.findOne({
        where: { candidate, courseCode, role },
      });

      return response.json(applications) || [];;
    }

    async editRankandCommentandChosen(request: Request, response: Response) {
      const id = parseInt(request.params.id);
      const { ranking, comment, chosen } = request.body;
      let application = await this.applicationRepository.findOne({ where: { id } });
      if (!application) {
        return response.status(404).json({ message: "Application not found" });
      }
      application = Object.assign(application, { ranking, comment, chosen });

      try{
        const updatedApplication = await this.applicationRepository.save(application);
        return response.json(updatedApplication);
      } catch (error) {
        return response.status(500).json({ message: "Error saving application" });
      }
    }
}

