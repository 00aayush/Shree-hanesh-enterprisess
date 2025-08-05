import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function Attendance() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Attendance Management</h3>
          <p className="text-slate-500">Attendance tracking features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
