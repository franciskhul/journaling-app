// __tests__/components/CategorySelector.test.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
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
    expect(screen.getByText(/travel/i)).toBeInTheDocument();
  });

  it("calls onChange when selecting a category", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));
    await fireEvent.click(screen.getByText("Personal"));

    expect(mockOnChange).toHaveBeenCalledWith("personal");
  });

  it("shows checkmark for selected category", async () => {
    render(
      <CategorySelector
        selectedCategoryValue="work"
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));

    const workItem = screen.getByTestId("category-work");
    const checkIcon = within(workItem).getByTestId("check-icon"); // or getByTestId("check-icon")
    expect(checkIcon).toHaveClass("opacity-100");
  });

  it("shows add new category option when no matches found", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));
    await fireEvent.change(
      screen.getByPlaceholderText("Search or add category..."),
      {
        target: { value: "New Category" },
      }
    );

    expect(screen.getByText('Add "New Category"')).toBeInTheDocument();
  });

  it("calls addCategoryAction when adding a new category", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));
    await fireEvent.change(
      screen.getByPlaceholderText("Search or add category..."),
      {
        target: { value: "New Category" },
      }
    );
    await fireEvent.click(screen.getByText('Add "New Category"'));

    expect(mockAddCategory).toHaveBeenCalledWith("New Category");
    expect(mockOnChange).toHaveBeenCalledWith("new category");
  });

  it("does not allow adding duplicate categories", async () => {
    render(
      <CategorySelector
        selectedCategoryValue=""
        categories={mockCategories}
        addCategoryAction={mockAddCategory}
        onChangeAction={mockOnChange}
      />
    );

    await fireEvent.click(screen.getByRole("combobox"));
    await fireEvent.change(
      screen.getByPlaceholderText("Search or add category..."),
      {
        target: { value: "New Category" },
      }
    );

    expect(screen.queryByText('Add "Work"')).not.toBeInTheDocument();
  });
});
