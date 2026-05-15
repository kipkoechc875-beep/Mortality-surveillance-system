import { useEffect, useState } from "react";
import { Activity, Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MitigationSummary = {
  mostCommonCause: string | null;
  count: number;
  mitigationSteps: string[];
};

export default function Mitigation() {
  const [summary, setSummary] = useState<MitigationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMitigationSummary() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/deaths/public/mitigation");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        setSummary(await response.json());
      } catch (err) {
        setError((err as Error).message || "Unable to load mitigation guidance.");
      } finally {
        setLoading(false);
      }
    }

    fetchMitigationSummary();
  }, []);

  const downloadMitigationPDF = () => {
    if (!summary?.mostCommonCause) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 18;

    doc.setFontSize(18);
    doc.setTextColor(31, 41, 55);
    doc.text("Public Mortality Mitigation Summary", pageWidth / 2, currentY, { align: "center" });

    currentY += 10;
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, currentY, { align: "center" });

    currentY += 16;
    doc.setFontSize(13);
    doc.setTextColor(31, 41, 55);
    doc.text(`Most common cause of death: ${summary.mostCommonCause}`, 15, currentY);

    currentY += 9;
    doc.text(`Recorded cases: ${summary.count}`, 15, currentY);

    currentY += 14;
    doc.setFontSize(14);
    doc.text("Recommended mitigation actions", 15, currentY);

    currentY += 8;
    doc.setFontSize(11);

    summary.mitigationSteps.forEach((step, index) => {
      const wrapped = doc.splitTextToSize(`${index + 1}. ${step}`, pageWidth - 30);
      if (currentY + wrapped.length * 6 > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(wrapped, 15, currentY);
      currentY += wrapped.length * 6 + 3;
    });

    currentY += 4;
    doc.setTextColor(107, 114, 128);
    const note = "This public summary is based on aggregate mortality records and does not include personal record details.";
    doc.text(doc.splitTextToSize(note, pageWidth - 30), 15, currentY);
    doc.save(`public-mitigation-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const hasGuidance = Boolean(summary?.mostCommonCause);

  return (
    <div className="min-h-screen bg-muted/30 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Public Mitigation Guidance</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              View and download recommended actions for the most common cause of death recorded in the system.
            </p>
          </div>
          <Button
            onClick={downloadMitigationPDF}
            disabled={!hasGuidance}
            data-testid="button-download-public-mitigation-pdf"
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              Loading mitigation guidance...
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : !hasGuidance ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              No mitigation advice is available yet because there are no recorded causes of death.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Common Cause</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.mostCommonCause}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Appears most often across aggregate records.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recorded Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.count}</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Personal record details are not shown on this public page.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Mitigation Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {summary?.mitigationSteps.map((step, index) => (
                    <div key={`${summary.mostCommonCause}-${index}`} className="rounded-lg border border-border bg-background p-4">
                      <div className="text-sm font-semibold text-primary">Action {index + 1}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
