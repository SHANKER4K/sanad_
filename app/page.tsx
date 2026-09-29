"use client";

import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Info,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type Category = "safe" | "suicidal_ideation" | "active_suicide_risk";

type Result = {
  choice: Category;
  confidence?: number;
  probabilities?: Partial<Record<Category, number>>;
};

const categories: Category[] = [
  "safe",
  "suicidal_ideation",
  "active_suicide_risk",
];

const labels: Record<Category, string> = {
  safe: "آمن",
  suicidal_ideation: "أفكار انتحارية",
  active_suicide_risk: "خطر انتحار فعلي",
};

const descriptions: Record<Category, string> = {
  safe: "لا توجد أفكار أو نوايا انتحارية في الرسالة.",
  suicidal_ideation:
    "ترد أفكار انتحارية أو رغبة في الموت، دون خطة أو نية واضحة.",
  active_suicide_risk:
    "ترد خطة أو نية أو توقيت أو وسيلة أو تحضير أو محاولة حديثة.",
};

const bannerTone: Record<Category, string> = {
  safe: "bg-risk-safe/10 text-risk-safe",
  suicidal_ideation: "bg-risk-moderate/10 text-risk-moderate",
  active_suicide_risk: "bg-risk-high/10 text-risk-high",
};

const barTone: Record<Category, string> = {
  safe: "[&_[data-slot=progress-indicator]]:bg-risk-safe",
  suicidal_ideation: "[&_[data-slot=progress-indicator]]:bg-risk-moderate",
  active_suicide_risk: "[&_[data-slot=progress-indicator]]:bg-risk-high",
};

const examples = [
  "مرّ أسبوع صعب، لكنني متشوّق لرؤية أصدقائي غدًا.",
  "أشعر أحيانًا أن الجميع سيكون أفضل حالًا من دوني.",
  "قرّرت أن أفعلها الليلة، وقد جهّزت كل شيء بالفعل.",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [example, setExample] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذّر إجراء التحليل.");
      setResult(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إجراء التحليل.");
    } finally {
      setLoading(false);
    }
  }

  const selected =
    result && categories.includes(result.choice) ? result.choice : undefined;

  return (
    <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-6 py-7 md:px-9">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-brand to-primary text-primary-foreground">
            <Activity />
          </span>
          <span className="font-heading text-2xl font-extrabold">سند</span>
          <Badge variant="outline" className="text-muted-foreground">
            منصة وقائية
          </Badge>
        </div>
        <Badge
          variant="secondary"
          className="text-muted-foreground max-sm:hidden"
        >
          <span className="size-1.5 rounded-full bg-risk-safe" />
          متاحة الآن
        </Badge>
      </header>

      <Separator />

      <section className="flex max-w-2xl flex-col gap-4 pt-10 pb-6">
        <Badge variant="secondary" className="w-fit text-primary">
          <Sparkles data-icon="inline-start" />
          كشف مبكر من النص
        </Badge>
        <h1 className="font-heading text-4xl leading-[1.35] font-extrabold text-balance sm:text-5xl">
          نقرأ الخطر في الكلمات{" "}
          <span className="text-primary">قبل فوات الأوان.</span>
        </h1>
        <p className="max-w-lg text-muted-foreground">
          نحلّل الرسائل النصية للكشف المبكر عن مؤشرات التفكير في الانتحار،
          ومساعدة المختصين على التدخّل في الوقت المناسب لإنقاذ الأرواح.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-secondary text-xs font-bold text-primary">
                ٠١
              </span>
              أدخل النص
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="tabular-nums">
                {message.length} / 4000
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <form onSubmit={analyze} className="flex flex-1 flex-col">
              <FieldGroup className="flex-1">
                <Field data-invalid={Boolean(error)}>
                  <FieldLabel htmlFor="message">الرسالة</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setExample("");
                    }}
                    placeholder="اكتب أو الصق الرسالة المطلوب تحليلها…"
                    maxLength={4000}
                    aria-invalid={Boolean(error)}
                    className="field-sizing-fixed min-h-52 resize-y"
                  />
                  <FieldDescription>
                    تُعالَج الرسالة على الخادم لأغراض التصنيف فقط.
                  </FieldDescription>
                  {error ? <FieldError>{error}</FieldError> : null}
                </Field>

                <FieldSet>
                  <FieldLegend variant="label">جرّب مثالًا</FieldLegend>
                  <ToggleGroup
                    variant="outline"
                    size="sm"
                    value={example ? [example] : []}
                    onValueChange={(value) => {
                      const next = value[0] ?? "";
                      setExample(next);
                      if (next) setMessage(examples[Number(next)]);
                    }}
                  >
                    {examples.map((_, index) => (
                      <ToggleGroupItem key={index} value={String(index)}>
                        المثال {["١", "٢", "٣"][index]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FieldSet>

                <Button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Spinner data-icon="inline-start" />
                      جارٍ التحليل…
                    </>
                  ) : (
                    <>
                      حلّل الرسالة
                      <ArrowLeft data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-lg bg-secondary text-xs font-bold text-primary">
                ٠٢
              </span>
              التصنيف
            </CardTitle>
            <CardAction>
              <Badge variant="secondary" className="text-risk-safe">
                <span className="size-1.5 rounded-full bg-risk-safe" />
                مباشر
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            {loading ? (
              <Empty className="flex-1">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Spinner />
                  </EmptyMedia>
                  <EmptyTitle>جارٍ قراءة الإشارة…</EmptyTitle>
                  <EmptyDescription>يتم تقييم النص الآن.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : selected && result ? (
              <div className="flex flex-1 flex-col gap-6">
                <Alert className={cn("p-4", bannerTone[selected])}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-card/80">
                      {selected === "safe" ? (
                        <CheckCircle2 />
                      ) : (
                        <ShieldAlert />
                      )}
                    </span>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <AlertTitle>التصنيف الأساسي</AlertTitle>
                      <AlertDescription className="font-medium text-current">
                        {labels[selected]}
                      </AlertDescription>
                    </div>
                    <span className="font-heading text-2xl font-extrabold tabular-nums">
                      {Math.round((result.confidence ?? 0) * 100)}%
                    </span>
                  </div>
                </Alert>

                <p className="text-sm text-muted-foreground">
                  {descriptions[selected]}
                </p>

                <div className="flex flex-col gap-4">
                  {categories.map((category) => {
                    const value = result.probabilities?.[category] ?? 0;
                    const percent = Math.round(value * 100);
                    return (
                      <div key={category} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {labels[category]}
                          </span>
                          <span className="font-medium tabular-nums">
                            {percent}%
                          </span>
                        </div>
                        <Progress
                          value={percent}
                          className={cn(
                            "flex-col gap-0 [&_[data-slot=progress-track]]:h-2",
                            barTone[category],
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Empty className="flex-1">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ShieldAlert />
                  </EmptyMedia>
                  <EmptyTitle>ستظهر النتيجة هنا</EmptyTitle>
                  <EmptyDescription>
                    أدخل رسالة ثم شغّل التحليل لعرض تقديرات النموذج لكل فئة.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </section>

      <footer className="mt-auto flex flex-col gap-4 pt-6">
        <Separator />
        <div className="flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-2">
            <Info />
            هذه أداة مساعدة وليست تشخيصًا سريريًا.
          </span>
          <span>يُعالَج النص على الخادم فقط، دون تخزينه.</span>
        </div>
      </footer>
    </main>
  );
}
