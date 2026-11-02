"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { FieldError, TextAreaField, TextField } from "@/components/ui/field";
import { useSupport } from "@/features/support/support-provider";

type Values = { name: string; contact: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", contact: "", message: "", consent: false };
const ORDER: Array<keyof Values> = ["name", "contact", "message", "consent"];

/** Vietnamese mobile (0 + 9 digits) or landline (0 + 10 digits), optionally +84. */
const PHONE = /^(?:\+?84|0)\d{9,10}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Vui lòng nhập họ tên.";
  else if (name.length < 2) errors.name = "Họ tên cần có ít nhất 2 ký tự.";

  const contact = values.contact.trim();
  if (!contact) errors.contact = "Vui lòng nhập số điện thoại hoặc email để bến phản hồi.";
  else if (!EMAIL.test(contact) && !PHONE.test(contact.replace(/[\s.-]/g, "")))
    errors.contact = "Số điện thoại hoặc email chưa đúng định dạng (ví dụ: 0912 345 678 hoặc ten@email.com).";

  const message = values.message.trim();
  if (!message) errors.message = "Vui lòng nhập nội dung cần hỗ trợ.";
  else if (message.length < 10) errors.message = "Nội dung cần có ít nhất 10 ký tự.";

  if (!values.consent) errors.consent = "Vui lòng đồng ý cung cấp thông tin để bến có thể phản hồi.";
  return errors;
}

/**
 * Figma "Gửi yêu cầu" (6:282 / 6:2007). Validates in Vietnamese on submit (then live),
 * and on success opens the "requestSent" support state (6:3260) like the prototype.
 * Nothing is sent anywhere yet — there is no backend in this build.
 */
export function ContactForm() {
  const { open } = useSupport();
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const ids = {
    name: `${uid}-name`,
    contact: `${uid}-contact`,
    message: `${uid}-message`,
    consent: `${uid}-consent`,
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = ORDER.find((key) => nextErrors[key]);
    if (firstInvalid) {
      setSubmitted(true);
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }
    setValues(EMPTY);
    setErrors({});
    setSubmitted(false);
    open("requestSent");
  };

  return (
    <form
      id="loi-nhan"
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={`${uid}-title`}
      className="flex scroll-mt-6 flex-col gap-4 rounded-lg bg-paper p-6"
    >
      <h2 id={`${uid}-title`} className="text-h3 font-bold text-navy">
        Để lại lời nhắn
      </h2>
      <TextField
        id={ids.name}
        name="name"
        label="Họ và tên"
        placeholder="Nhập họ tên"
        autoComplete="name"
        required
        value={values.name}
        error={errors.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <TextField
        id={ids.contact}
        name="contact"
        label="Số điện thoại / Email"
        placeholder="Thông tin để bến phản hồi"
        autoComplete="off"
        required
        value={values.contact}
        error={errors.contact}
        onChange={(e) => update("contact", e.target.value)}
      />
      <TextAreaField
        id={ids.message}
        name="message"
        label="Nội dung"
        placeholder="Bạn cần hỗ trợ điều gì?"
        rows={1}
        required
        maxLength={1000}
        // Figma draws a one-line 78px field; the box grows with the text instead of starting tall.
        style={{ minHeight: 26, resize: "none" }}
        className="field-sizing-content max-h-60"
        value={values.message}
        error={errors.message}
        onChange={(e) => update("message", e.target.value)}
      />
      <div>
        <label htmlFor={ids.consent} className="flex w-fit cursor-pointer items-start gap-2 text-sm text-muted">
          <input
            id={ids.consent}
            name="consent"
            type="checkbox"
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.75 size-4 shrink-0 cursor-pointer accent-primary"
          />
          Tôi đồng ý cung cấp thông tin để được phản hồi.
        </label>
        <FieldError id={`${ids.consent}-error`}>{errors.consent}</FieldError>
      </div>
      <Button type="submit" className="w-full lg:w-80">
        Gửi yêu cầu
      </Button>
    </form>
  );
}
