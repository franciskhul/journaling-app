// __tests__/components/CategorySelector.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategorySelector } from "@/components/my-journal/category-selector";
import { Plus, Check } from "lucide-react";

const mockCategories = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "travel", label: "Travel" },
];

describe("CategorySelector", () => {
  const mockOnChange = jest.fn();
  const mockAddCategory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default selected category", () => {
    render(
      <CategorySelector
        selectedCategoryValue="work"
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
