import { type Employee, type InsertEmployee, type Project, type InsertProject, type Attendance, type InsertAttendance } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Employee methods
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  getActiveEmployees(): Promise<Employee[]>;
  getLeftEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  softDeleteEmployee(id: string): Promise<Employee | undefined>;
  restoreEmployee(id: string): Promise<Employee | undefined>;
  searchEmployees(query: string, filters: { role?: string; specialization?: string; status?: string }): Promise<Employee[]>;
  
  // Project methods
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Attendance methods
  getAttendance(id: string): Promise<Attendance | undefined>;
  getAttendanceByEmployee(employeeId: string, date?: Date): Promise<Attendance[]>;
  getAllAttendance(): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalEmployees: number;
    activeProjects: number;
    onSiteToday: number;
    pendingTasks: number;
  }>;
}

export class MemStorage implements IStorage {
  private employees: Map<string, Employee>;
  private projects: Map<string, Project>;
  private attendance: Map<string, Attendance>;

  constructor() {
    this.employees = new Map();
    this.projects = new Map();
    this.attendance = new Map();
    
    // Add some sample employees for demonstration
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleEmployees = [
      {
        id: "emp-1",
        firstName: "Rajesh",
        lastName: "Kumar",
        email: "rajesh.kumar@sgenterprises.com",
        phone: "+91 98765 43210",
        role: "technician",
        specialization: "chiller",
        emergencyContact: "Sunita Kumar - +91 98765 43211",
        status: "available",
        currentProject: null,
        isActive: "true",
        leftDate: null,
        createdAt: new Date('2024-01-15')
      },
      {
        id: "emp-2", 
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@sgenterprises.com",
        phone: "+91 98765 43212",
        role: "supervisor",
        specialization: "ac",
        emergencyContact: "Amit Sharma - +91 98765 43213",
        status: "on-project",
        currentProject: "Phoenix Mall AC Installation",
        isActive: "true",
        leftDate: null,
        createdAt: new Date('2024-01-20')
      },
      {
        id: "emp-3",
        firstName: "Mohammed",
        lastName: "Ali",
        email: "mohammed.ali@sgenterprises.com", 
        phone: "+91 98765 43214",
        role: "technician",
        specialization: "compressor",
        emergencyContact: "Fatima Ali - +91 98765 43215",
        status: "on-leave",
        currentProject: null,
        isActive: "true",
        leftDate: null,
        createdAt: new Date('2024-02-01')
      },
      {
        id: "emp-4",
        firstName: "Neha",
        lastName: "Patel",
        email: "neha.patel@sgenterprises.com",
        phone: "+91 98765 43216", 
        role: "sales",
        specialization: "general",
        emergencyContact: "Kiran Patel - +91 98765 43217",
        status: "left",
        currentProject: null,
        isActive: "false",
        leftDate: new Date('2024-08-01'),
        createdAt: new Date('2023-11-10')
      }
    ];

    sampleEmployees.forEach(emp => {
      this.employees.set(emp.id, emp as Employee);
    });

    // Add sample projects
    const sampleProjects = [
      {
        id: "proj-1",
        name: "Phoenix Mall AC Installation",
        location: "Phoenix Mall, Mumbai",
        type: "mall",
        status: "active",
        assignedEmployees: ["emp-2"],
        startDate: new Date('2024-08-01'),
        endDate: null,
        createdAt: new Date('2024-07-25')
      },
      {
        id: "proj-2", 
        name: "Tech Park Chiller Maintenance",
        location: "IT Park, Bangalore",
        type: "office",
        status: "active",
        assignedEmployees: ["emp-1"],
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-08-15'),
        createdAt: new Date('2024-07-10')
      }
    ];

    sampleProjects.forEach(proj => {
      this.projects.set(proj.id, proj as Project);
    });
  }

  // Employee methods
  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.email === email,
    );
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getActiveEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(emp => emp.isActive === "true");
  }

  async getLeftEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(emp => emp.isActive === "false");
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id, 
      status: insertEmployee.status || "available",
      emergencyContact: insertEmployee.emergencyContact || null,
      currentProject: insertEmployee.currentProject || null,
      isActive: "true",
      leftDate: null,
      createdAt: new Date(),
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updates };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  async softDeleteEmployee(id: string): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { 
      ...employee, 
      isActive: "false",
      status: "left",
      leftDate: new Date(),
      currentProject: null
    };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async restoreEmployee(id: string): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { 
      ...employee, 
      isActive: "true",
      status: "available",
      leftDate: null
    };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async searchEmployees(query: string, filters: { role?: string; specialization?: string; status?: string; showLeft?: boolean }): Promise<Employee[]> {
    let employees = Array.from(this.employees.values());
    
    // Filter by active/left status first
    if (filters.showLeft) {
      employees = employees.filter(emp => emp.isActive === "false");
    } else {
      employees = employees.filter(emp => emp.isActive === "true");
    }
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      employees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(lowercaseQuery) ||
        emp.lastName.toLowerCase().includes(lowercaseQuery) ||
        emp.email.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (filters.role && filters.role !== "all") {
      employees = employees.filter(emp => emp.role === filters.role);
    }
    
    if (filters.specialization && filters.specialization !== "all") {
      employees = employees.filter(emp => emp.specialization === filters.specialization);
    }
    
    if (filters.status && filters.status !== "all") {
      employees = employees.filter(emp => emp.status === filters.status);
    }
    
    return employees;
  }

  // Project methods
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      status: insertProject.status || "active",
      assignedEmployees: insertProject.assignedEmployees || null,
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Attendance methods
  async getAttendance(id: string): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async getAttendanceByEmployee(employeeId: string, date?: Date): Promise<Attendance[]> {
    let attendanceRecords = Array.from(this.attendance.values()).filter(
      record => record.employeeId === employeeId
    );
    
    if (date) {
      const targetDate = date.toDateString();
      attendanceRecords = attendanceRecords.filter(
        record => record.date.toDateString() === targetDate
      );
    }
    
    return attendanceRecords;
  }

  async getAllAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = randomUUID();
    const attendance: Attendance = { 
      ...insertAttendance, 
      id,
      location: insertAttendance.location || null,
      checkInTime: insertAttendance.checkInTime || null,
      checkOutTime: insertAttendance.checkOutTime || null,
      createdAt: new Date(),
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    
    const updatedAttendance = { ...attendance, ...updates };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async getDashboardStats(): Promise<{
    totalEmployees: number;
    activeProjects: number;
    onSiteToday: number;
    pendingTasks: number;
  }> {
    const activeEmployees = Array.from(this.employees.values()).filter(emp => emp.isActive === "true");
    const totalEmployees = activeEmployees.length;
    const activeProjects = Array.from(this.projects.values()).filter(p => p.status === 'active').length;
    
    const today = new Date().toDateString();
    const todayAttendance = Array.from(this.attendance.values()).filter(
      record => record.date.toDateString() === today && record.status === 'present'
    );
    const onSiteToday = todayAttendance.length;
    
    // For now, pending tasks is a simple calculation
    const pendingTasks = activeEmployees.filter(emp => emp.status === 'available').length;
    
    return {
      totalEmployees,
      activeProjects,
      onSiteToday,
      pendingTasks
    };
  }
}

export const storage = new MemStorage();
