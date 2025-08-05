import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Edit, UserMinus, UserPlus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { EmployeeForm } from "./employee-form";
import type { Employee } from "@shared/schema";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onRefetch: () => void;
  showLeftEmployees?: boolean;
}

const roleColors = {
  technician: "bg-blue-100 text-blue-800",
  supervisor: "bg-purple-100 text-purple-800",
  sales: "bg-green-100 text-green-800",
  admin: "bg-gray-100 text-gray-800",
};

const statusColors = {
  available: "bg-blue-100 text-blue-800",
  "on-project": "bg-green-100 text-green-800",
  "on-leave": "bg-yellow-100 text-yellow-800",
};

const specializationLabels = {
  chiller: "Chiller Systems",
  compressor: "Compressor",
  ac: "AC Systems",
  general: "General HVAC",
};

export function EmployeeTable({ employees, isLoading, onRefetch, showLeftEmployees = false }: EmployeeTableProps) {
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [actionEmployee, setActionEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const softDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/employees/${id}/soft-delete`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee removed successfully",
      });
      onRefetch();
      setActionEmployee(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove employee",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/employees/${id}/restore`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee restored successfully",
      });
      onRefetch();
      setActionEmployee(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restore employee",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee);
  };

  const handleEditSuccess = () => {
    setEditEmployee(null);
    onRefetch();
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Specialization</TableHead>
              <TableHead className="hidden lg:table-cell">Current Project</TableHead>
              <TableHead>Status</TableHead>
              {showLeftEmployees && <TableHead className="hidden sm:table-cell">Left Date</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                {showLeftEmployees && <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>}
                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No employees found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Specialization</TableHead>
              <TableHead className="hidden lg:table-cell">Current Project</TableHead>
              <TableHead>Status</TableHead>
              {showLeftEmployees && <TableHead className="hidden sm:table-cell">Left Date</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-300 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-medium text-slate-600">
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-500 truncate">{employee.email}</div>
                      {/* Show role and specialization on mobile */}
                      <div className="sm:hidden text-xs text-slate-400 mt-1">
                        <div>{employee.role} • {specializationLabels[employee.specialization as keyof typeof specializationLabels]}</div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className={roleColors[employee.role as keyof typeof roleColors]}>
                    {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-slate-900">
                  {specializationLabels[employee.specialization as keyof typeof specializationLabels]}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-slate-900">
                  {employee.currentProject || "-"}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[employee.status as keyof typeof statusColors]}>
                    <span className="hidden sm:inline">
                      {employee.status === "on-project" ? "On Project" : 
                       employee.status === "on-leave" ? "On Leave" : 
                       employee.status === "left" ? "Left" : "Available"}
                    </span>
                    <span className="sm:hidden">
                      {employee.status === "on-project" ? "On Project" : 
                       employee.status === "on-leave" ? "Leave" :
                       employee.status === "left" ? "Left" : "Available"}
                    </span>
                  </Badge>
                </TableCell>
                {showLeftEmployees && (
                  <TableCell className="hidden sm:table-cell text-sm text-slate-900">
                    {employee.leftDate ? new Date(employee.leftDate).toLocaleDateString() : "-"}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewEmployee(employee)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {!showLeftEmployees && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActionEmployee(employee)}
                      className="h-8 w-8 p-0"
                    >
                      {showLeftEmployees ? (
                        <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <UserMinus className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Employee Dialog */}
      <Dialog open={!!viewEmployee} onOpenChange={() => setViewEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {viewEmployee && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{viewEmployee.firstName} {viewEmployee.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{viewEmployee.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{viewEmployee.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <p className="text-sm text-gray-900">{viewEmployee.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Specialization</label>
                <p className="text-sm text-gray-900">{specializationLabels[viewEmployee.specialization as keyof typeof specializationLabels]}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-sm text-gray-900">{viewEmployee.status}</p>
              </div>
              {viewEmployee.currentProject && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Project</label>
                  <p className="text-sm text-gray-900">{viewEmployee.currentProject}</p>
                </div>
              )}
              {viewEmployee.emergencyContact && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                  <p className="text-sm text-gray-900">{viewEmployee.emergencyContact}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editEmployee} onOpenChange={() => setEditEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editEmployee && (
            <EmployeeForm employee={editEmployee} onSuccess={handleEditSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionEmployee} onOpenChange={() => setActionEmployee(null)}>
        <AlertDialogContent className="mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showLeftEmployees ? "Restore Employee?" : "Remove Employee?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showLeftEmployees ? (
                <>
                  This will restore{" "}
                  <span className="font-medium">{actionEmployee?.firstName} {actionEmployee?.lastName}</span>{" "}
                  back to active status and they will be available for new projects.
                </>
              ) : (
                <>
                  This will remove{" "}
                  <span className="font-medium">{actionEmployee?.firstName} {actionEmployee?.lastName}</span>{" "}
                  from active employees. They will be moved to the "Left Employees" section and can be restored later if needed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (actionEmployee) {
                  if (showLeftEmployees) {
                    restoreMutation.mutate(actionEmployee.id);
                  } else {
                    softDeleteMutation.mutate(actionEmployee.id);
                  }
                }
              }}
              disabled={softDeleteMutation.isPending || restoreMutation.isPending}
            >
              {(softDeleteMutation.isPending || restoreMutation.isPending) 
                ? (showLeftEmployees ? "Restoring..." : "Removing...") 
                : (showLeftEmployees ? "Restore" : "Remove")
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
