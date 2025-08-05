import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus, Search, Users, UserMinus } from "lucide-react";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeForm } from "@/components/employees/employee-form";
import type { Employee } from "@shared/schema";

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  const { data: employees, isLoading, refetch } = useQuery<Employee[]>({
    queryKey: ["/api/employees", { 
      search: searchQuery, 
      role: roleFilter, 
      specialization: specializationFilter, 
      status: statusFilter,
      showLeft: activeTab === "left"
    }],
  });

  const { data: leftEmployees, isLoading: isLoadingLeft, refetch: refetchLeft } = useQuery<Employee[]>({
    queryKey: ["/api/employees/left"],
    enabled: activeTab === "left",
  });

  const handleEmployeeAdded = () => {
    setIsAddDialogOpen(false);
    refetch();
  };

  const handleEmployeeAction = () => {
    refetch();
    if (activeTab === "left") {
      refetchLeft();
    }
  };

  const handleExport = () => {
    const dataToExport = activeTab === "left" ? leftEmployees : employees;
    if (!dataToExport || dataToExport.length === 0) return;
    
    const csv = [
      ["Name", "Email", "Phone", "Role", "Specialization", "Status", "Current Project", "Left Date"].join(","),
      ...dataToExport.map(emp => [
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.phone,
        emp.role,
        emp.specialization,
        emp.status,
        emp.currentProject || "",
        emp.leftDate ? new Date(emp.leftDate).toLocaleDateString() : ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab === "left" ? "left-" : ""}employees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentEmployees = activeTab === "left" ? leftEmployees : employees;
  const currentIsLoading = activeTab === "left" ? isLoadingLeft : isLoading;

  return (
    <div className="p-4 sm:p-6">
      <Card>
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Employee Management</h3>
            <div className="mt-3 sm:mt-0 flex flex-wrap gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleExport} size="sm" className="text-xs sm:text-sm">
                <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Export
              </Button>
              {activeTab === "active" && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="text-xs sm:text-sm">
                      <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl mx-4">
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                    </DialogHeader>
                    <EmployeeForm onSuccess={handleEmployeeAdded} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Active Employees</span>
                <span className="sm:hidden">Active</span>
              </TabsTrigger>
              <TabsTrigger value="left" className="flex items-center space-x-2">
                <UserMinus className="h-4 w-4" />
                <span className="hidden sm:inline">Left Employees</span>
                <span className="sm:hidden">Left</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="mt-0">
            {/* Search and Filters */}
            <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="chiller">Chiller Systems</SelectItem>
                    <SelectItem value="compressor">Compressor</SelectItem>
                    <SelectItem value="ac">AC Systems</SelectItem>
                    <SelectItem value="general">General HVAC</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="on-project">On Project</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <EmployeeTable 
              employees={currentEmployees || []} 
              isLoading={currentIsLoading} 
              onRefetch={handleEmployeeAction} 
              showLeftEmployees={false}
            />
          </TabsContent>

          <TabsContent value="left" className="mt-0">
            <EmployeeTable 
              employees={currentEmployees || []} 
              isLoading={currentIsLoading} 
              onRefetch={handleEmployeeAction} 
              showLeftEmployees={true}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
