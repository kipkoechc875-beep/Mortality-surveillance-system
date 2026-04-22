import { ArrowRight, BarChart3, ClipboardList, FileText, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f4f4" }}>
      <section className="flex flex-col items-center justify-center px-6 pb-16 pt-20 text-center">
        {/* Badge removed as requested */}

        <h1 className="mb-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl" style={{ color: "#111111" }}>
          Mortality Surveillance
          <br />
          <span style={{ color: "#e41e10" }}>& Reporting System</span>
        </h1>

        <p className="mb-10 max-w-xl text-base leading-relaxed" style={{ color: "#555555" }}>
          A secure platform for recording, reviewing, and analysing death records. Built for regional health
          authorities and surveillance officers.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors"
            style={{ backgroundColor: "#e41e10" }}
            data-testid="button-get-started"
          >
            Access the System
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded border px-7 py-3 text-sm font-medium transition-colors"
            style={{ color: "#333333", borderColor: "#cccccc", backgroundColor: "#ffffff" }}
            data-testid="link-learn-more"
          >
            Learn More
          </a>
        </div>
      </section>

      <section className="px-8 pb-12">
        <div
          className="mx-auto grid max-w-4xl grid-cols-3 divide-x overflow-hidden rounded-lg border shadow-sm"
          style={{ borderColor: "#dddddd", backgroundColor: "#ffffff" }}
        >
          {[
            { label: "Records Managed", value: "10,000+", icon: FileText },
            { label: "Health Districts", value: "48", icon: Users },
            { label: "Reports Generated", value: "2,400+", icon: BarChart3 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center px-4 py-6 text-center">
              <Icon className="mb-2 h-5 w-5" style={{ color: "#e41e10" }} />
              <div className="mb-0.5 text-2xl font-bold" style={{ color: "#111111" }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: "#777777" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="px-8 pb-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-bold" style={{ color: "#222222" }}>
            Platform Capabilities
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: ClipboardList,
                title: "Death Record Entry",
                desc: "Register detailed death records including cause, location, demographic information, and dates with built-in validation.",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Visual summaries of mortality trends, causes, locations, and demographic breakdowns across configurable time periods.",
              },
              {
                icon: FileText,
                title: "Records & Reports",
                desc: "Search, filter, and review all records. Export-ready reports for public health authorities and regulatory submissions.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Access Control",
                desc: "Role-based authentication ensures only authorised personnel can view, add, or remove mortality records.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-lg border p-5"
                style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded"
                  style={{ backgroundColor: "#fde8e7" }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color: "#e41e10" }} />
                </div>
                <div>
                  <div className="mb-1 text-sm font-semibold" style={{ color: "#222222" }}>
                    {title}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "#666666" }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-14 text-center" style={{ backgroundColor: "#e41e10" }}>
        <h2 className="mb-3 text-2xl font-bold text-white">Ready to access the system?</h2>
        <p className="mx-auto mb-7 max-w-sm text-sm text-white/80">
          Sign in with your authorised credentials to begin recording and reviewing mortality data.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded bg-white px-8 py-3 text-sm font-semibold shadow transition-colors"
          style={{ color: "#e41e10" }}
          data-testid="button-cta-login"
        >
          Sign In to Continue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer
        className="border-t px-8 py-5 text-center text-xs"
        style={{ borderColor: "#dddddd", color: "#999999", backgroundColor: "#ffffff" }}
      >
        Mortality Surveillance System - Health Records Platform (c) {new Date().getFullYear()}
      </footer>
    </div>
  );
}
