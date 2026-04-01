"use client";

import {
  Field,
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
import { useState } from "react";
import { Button } from "./ui/button";

export function LinkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ url, title, category, notes });
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

      <form onSubmit={onSubmit} className="flex flex-col items-stretch gap-4">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="url">Research URL</FieldLabel>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/paper"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-5">
              <div className="md:col-span-3">
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Understanding distributed systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
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
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                id="notes"
                placeholder="Why is this source useful? Key takeaways, methodology, or critique."
                className="min-h-20 resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet className="flex items-center justify-between">
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            {/* <Button variant="outline" type="button">
              Cancel
            </Button> */}
          </Field>
        </FieldSet>
      </form>
    </section>
  );
}
