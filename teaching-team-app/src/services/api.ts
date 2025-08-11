import axios from "axios";
import { User, Course, Application} from "../context/users";



export const api = axios.create({
  baseURL: "http://localhost:4000/api", // Adjust this to match your backend URL
});


export const userApi = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data as User;
  },

  getUserLogin: async (email: string, password: string) => {
    const response = await api.get(`/users/${email}/${password}`);
    return response.data as User; 
  },

  createUser: async (user: Partial<User>) => {
    const response = await api.post("/users", user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const applicationApi = {
  getAllApplications: async () => {
    const response = await api.get("/applications");
    return response.data as Application[];
  },

  getApplicationById: async (id: number) => {
    const response = await api.get(`/applications/${id}`);
    return response.data as Application[];
  },

  createApplication: async (application: Partial<Application>) => {
    const response = await api.post("/applications", application);
    return response.data as Application;
  },

  updateApplication: async (id: number, application: Partial<Application>) => {
    const response = await api.put(`/applications/${id}`, application);
    return response.data;
  },

  deleteApplication: async (id: number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  getApplicationByCourse: async (courseCode: string) => {
    const response = await api.get(`/applications/courseCode/${courseCode}`);
    return response.data as Application[];
  },

  getApplicationbyUser: async (candidate: number, courseCode: string, role: string) => {
    const response = await api.get(`/applications/${candidate}/${courseCode}/${role}`);
    return response.data as Application || null;
  },

  editRankAndCommentAndChosen: async (id: number, ranking: number, comment: string, chosen: boolean) => {
    const response = await api.put(`/applications/${id}`, { ranking, comment, chosen });
    return response.data;
  },
}

export const courseApi = {

  getAllCourses: async () => {
    const response = await api.get("/courses");
    return response.data as Course[];
  },

  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data as Course;
  },

  createCourse: async (course: Partial<Course>) => {
    const response = await api.post("/courses", course);
    return response.data;
  },

  getCourseByLecturer: async (lecturerId: number) => {
    const response = await api.get(`/courses/${lecturerId}`);
    return response.data as Course[];
  },

  
}
