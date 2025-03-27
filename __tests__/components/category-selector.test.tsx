// __tests__/components/CategorySelector.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it('shows "Select category..." when no value is selected', () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    expect(screen.getByText("Select category...")).toBeInTheDocument();
  });

  it("opens popover when clicked", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));
    expect(
      screen.getByPlaceholderText("Search or add category...")
    ).toBeInTheDocument();
  });

  it("displays all categories in popover", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));

    expect(screen.getByText(/personal/i)).toBeInTheDocument();
    expect(screen.getByText(/work/i)).toBeInTheDocument();
    expect(screen.getByText(/Travel/i)).toBeInTheDocument();
  });
});
