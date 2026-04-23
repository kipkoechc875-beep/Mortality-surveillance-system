import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">About Web-Based Mortality Surveillance System</h1>
            <p className="text-muted-foreground leading-relaxed">
              This platform helps health authorities securely record and analyse mortality data.
              It is designed to support structured death record entry, trend reporting, and case review for
              public health monitoring.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Users can log in to access protected dashboards, manage records, and generate reports with
              data-driven insights.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Secure Records",
              description: "Protects sensitive mortality data with authenticated access and user controls.",
            },
            {
              title: "Analytics",
              description: "Visualises trends and supports evidence-based decision making.",
            },
            {
              title: "Public Health Focus",
              description: "Built for regional health teams and mortality surveillance officers.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-border bg-background p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Start using the system today</h2>
              <p className="text-sm text-muted-foreground">
                If you are a new user, register now to begin recording mortality data securely.
              </p>
            </div>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
