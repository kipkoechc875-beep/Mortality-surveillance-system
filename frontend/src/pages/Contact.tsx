import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setStatus("Thank you! Your message has been received.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Contact Support</h1>
            <p className="text-muted-foreground leading-relaxed">
              Need assistance with the Mortality Surveillance System? Reach out and our support team will get back to you.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-background p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="How can we help?"
                className="min-h-[150px]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit">Send Message</Button>
              {status && <div className="text-sm text-success">{status}</div>}
            </div>
          </form>
        </section>

        <footer className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>
            Prefer quick access? <Link href="/login" className="text-primary underline">Sign in</Link> or <Link href="/register" className="text-primary underline">register</Link> for an account.
          </p>
        </footer>
      </div>
    </div>
  );
}
