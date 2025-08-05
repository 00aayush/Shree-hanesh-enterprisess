import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, HardHat, AlertTriangle, Plus, ClipboardCheck, FileText, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Employee } from "@shared/schema";

interface DashboardStats {
  totalEmployees: number;
  activeProjects: number;
  onSiteToday: number;
  pendingTasks: number;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentEmployees = employees?.slice(0, 3) || [];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                  <Users className="text-primary h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Total Employees</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats?.totalEmployees || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <FolderOpen className="text-secondary h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Active Projects</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats?.activeProjects || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg">
                  <HardHat className="text-yellow-600 h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">On-Site Today</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats?.onSiteToday || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center">
                <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-accent h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="ml-2 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Available Staff</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-800">{stats?.pendingTasks || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between" size="lg">
                <div className="flex items-center">
                  <ClipboardCheck className="text-primary mr-3 h-5 w-5" />
                  <span className="text-slate-700">Mark Bulk Attendance</span>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
              <Button variant="outline" className="w-full justify-between" size="lg">
                <div className="flex items-center">
                  <Plus className="text-primary mr-3 h-5 w-5" />
                  <span className="text-slate-700">Assign Project</span>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
              <Button variant="outline" className="w-full justify-between" size="lg">
                <div className="flex items-center">
                  <FileText className="text-primary mr-3 h-5 w-5" />
                  <span className="text-slate-700">Generate Report</span>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Employees</h3>
            <div className="space-y-4">
              {recentEmployees.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No employees found</p>
              ) : (
                recentEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Plus className="text-green-600 h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">
                        New employee <span className="font-medium">{employee.firstName} {employee.lastName}</span> added to {employee.role} role
                      </p>
                      <p className="text-xs text-slate-500">Recently added</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
