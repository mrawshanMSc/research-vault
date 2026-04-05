"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LINK_CATEGORIES } from "@/lib/types";
import { Button } from "./ui/button";

// Define the form schema
const linkFormSchema = z.object({
  url: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a research URL.",
        });
        return;
      }
      try {
        new URL(val);
      } catch {
        ctx.addIssue({
          code: "custom",
          message:
            "Enter a valid URL with a protocol (for example https://example.com).",
        });
      }
    }),
  title: z.string().trim().min(1, "Please enter a title for this link."),
  category: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

function getCreateLinkErrorMessage(result: unknown) {
  if (!result || typeof result !== "object") {
    return "Something went wrong while saving the link.";
  }

  if (
    "errors" in result &&
    result.errors &&
    typeof result.errors === "object" &&
    !Array.isArray(result.errors)
  ) {
    const firstError = Object.values(result.errors).find(
      (value) => typeof value === "string" && value.trim().length > 0
    );

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  if ("error" in result && typeof result.error === "string") {
    return result.error;
  }

  return "Something went wrong while saving the link.";
}

// Define the form component
export function LinkForm() {
  const router = useRouter();
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: {
      url: "",
      title: "",
      category: undefined,
      notes: "",
      tags: "",
    },
  });

  const onSubmit = async (data: LinkFormValues) => {
    const formattedData = {
      ...data,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error("Could not create link", {
          description: getCreateLinkErrorMessage(result),
        });
        return;
      } else {
        toast.success("Link created", {
          description: "Your research link has been added to the vault.",
          icon: <CheckIcon className="size-4" />,
        });

        form.reset();
        router.refresh();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    }
  };

  return (
    <section className="flex flex-col justify-start gap-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-medium tracking-tight">
          Capture a research link
        </h2>
        <p className="text-sm">
          Save the source, add quick notes, and keep the research vault
          organized from day one.
        </p>
      </div>

      <form
        id="link-form"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-stretch gap-4"
      >
        <FieldSet>
          <FieldGroup>
            <Controller
              name="url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="link-form-url">Research URL</FieldLabel>
                  <Input
                    {...field}
                    id="link-form-url"
                    type="url"
                    placeholder="https://example.com/paper"
                    autoComplete="url"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-5 md:grid-cols-5">
              <div className="md:col-span-3">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="link-form-title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="link-form-title"
                        type="text"
                        placeholder="Understanding distributed systems"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="link-form-category">
                        Category
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="link-form-category"
                          className="w-full"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {LINK_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </div>

            <Controller
              name="notes"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="link-form-notes">Notes</FieldLabel>
                  <Textarea
                    {...field}
                    id="link-form-notes"
                    placeholder="Why is this source useful? Key takeaways, methodology, or critique."
                    className="min-h-20 resize-y"
                  />
                </Field>
              )}
            />

            <Controller
              name="tags"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  {" "}
                  <FieldLabel htmlFor="link-form-tags">Tags</FieldLabel>{" "}
                  <Input
                    {...field}
                    id="link-form-tags"
                    type="text"
                    placeholder="AI, machine learning, distributed systems"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />{" "}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}{" "}
                  <FieldDescription>
                    Separate tags with commas. Tags help with filtering and
                    faster search
                  </FieldDescription>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet className="flex items-center justify-between">
          <Field orientation="horizontal">
            <Button
              type="submit"
              className="h-10"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  Saving link...
                </>
              ) : (
                <>
                  <PlusIcon className="size-4" aria-hidden />
                  Save link
                </>
              )}
            </Button>
            {/* <Button variant="outline" type="button">
              Cancel
            </Button> */}
          </Field>
        </FieldSet>
      </form>
    </section>
  );
}
