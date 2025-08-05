import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function Projects() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Projects Management</h3>
          <p className="text-slate-500">Project management features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
