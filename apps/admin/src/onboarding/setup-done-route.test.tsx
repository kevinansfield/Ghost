import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import SetupDoneRoute from "./setup-done-route";

const {mockOnboarding, mockStartChecklist} = vi.hoisted(() => ({
    mockOnboarding: vi.fn(),
    mockStartChecklist: vi.fn(),
}));

vi.mock("@tryghost/admin-x-framework", () => ({
    Navigate: ({replace, to}: {replace?: boolean; to: string}) => React.createElement("div", {
        "data-replace": String(Boolean(replace)),
        "data-testid": "navigate",
        "data-to": to,
    }),
}));

vi.mock("@/onboarding/hooks/use-onboarding", () => ({
    useOnboarding: mockOnboarding,
}));

function mockDefaultOnboarding(overrides = {}) {
    mockOnboarding.mockReturnValue({
        checklistState: "started",
        isLoading: false,
        isOwner: true,
        shouldShowChecklist: true,
        startChecklist: mockStartChecklist,
        ...overrides,
    });
}

describe("SetupDoneRoute", () => {
    beforeEach(() => {
        mockStartChecklist.mockReset();
        mockStartChecklist.mockResolvedValue(undefined);
        mockDefaultOnboarding();
    });

    it("starts the checklist for owners with pending onboarding", async () => {
        mockDefaultOnboarding({
            checklistState: "pending",
            shouldShowChecklist: false,
        });

        const {container} = render(<SetupDoneRoute />);

        expect(container).toBeEmptyDOMElement();
        await waitFor(() => {
            expect(mockStartChecklist).toHaveBeenCalledOnce();
        });
    });

    it("redirects to the React onboarding route", () => {
        render(<SetupDoneRoute />);

        expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/setup/onboarding?returnTo=/analytics");
        expect(screen.getByTestId("navigate")).toHaveAttribute("data-replace", "true");
    });

    it("redirects non-owner users without starting onboarding", () => {
        mockDefaultOnboarding({
            checklistState: "pending",
            isOwner: false,
            shouldShowChecklist: false,
        });

        render(<SetupDoneRoute />);

        expect(mockStartChecklist).not.toHaveBeenCalled();
        expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/analytics");
    });

    it("redirects users without a visible checklist to analytics", () => {
        mockDefaultOnboarding({
            checklistState: "dismissed",
            shouldShowChecklist: false,
        });

        render(<SetupDoneRoute />);

        expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/analytics");
    });
});
