import { describe, it, expect } from "bun:test";
import { translateCopy } from "../src/lib/siteTranslation";
import { buildBookingGroups } from "../src/lib/bookingCatalog";

describe("customer-facing translations", () => {
  it("translates existing i18n labels and the new landing-page copy", () => {
    expect(translateCopy("View all promotions", "th")).toBe("ดูโปรโมชั่นทั้งหมด");
    expect(translateCopy("Book this package", "zh")).toBe("预约此套餐");
    expect(translateCopy("Select Date", "th")).not.toBe("Select Date");
  });
  it("translates bilingual package titles and duration without changing booking data", () => {
    const groups = buildBookingGroups([{ id: "real-package", title: "นวดออฟฟิศซินโดรม (Office Syndrome Massage) (90 mins)", description: "", price: "799", duration: 90, pictureUrl: "", note: "", type: "promotion", isActive: true }]);
    expect(translateCopy(groups[0].baseTitle, "en")).toBe("Office Syndrome Massage");
    expect(translateCopy(groups[0].baseTitle, "th")).toBe("นวดออฟฟิศซินโดรม");
    expect(translateCopy("นวดออฟฟิศซินโดรม (Office Syndrome Massage) (90 mins)", "zh")).toEndWith("(90 分钟)");
    expect(groups[0].variants[0]).toMatchObject({ id: "real-package", price: 799, duration: 90 });
  });
  it("formats duration from the real number instead of assuming two hours", () => {
    expect(translateCopy("{{duration}} min ({{hours}} hours)", "th", { duration: 150, hours: 2.5 })).toBe("150 นาที (2.5 ชั่วโมง)");
  });
  it("preserves unknown content, names, and contact details", () => {
    expect(translateCopy("GETTHAWHA", "zh")).toBe("GETTHAWHA");
    expect(translateCopy("A new package", "th")).toBe("A new package");
    expect(translateCopy("087-657-9546", "th")).toBe("087-657-9546");
  });
});
