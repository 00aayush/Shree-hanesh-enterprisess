import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Reports & Analytics</h3>
          <p className="text-slate-500">Reporting features will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
