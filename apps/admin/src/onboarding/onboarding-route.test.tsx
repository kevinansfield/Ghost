import {render, screen} from "@testing-library/react";
import React from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import OnboardingRoute from "./onboarding-route";

const {
    mockNavigate,
    mockOnboarding,
    mockUseBrowseSettings,
    mockUseBrowseSite,
} = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockOnboarding: vi.fn(),
    mockUseBrowseSettings: vi.fn(),
    mockUseBrowseSite: vi.fn(),
}));

vi.mock("@tryghost/admin-x-framework", () => ({
    Navigate: ({to}: {to: string}) => React.createElement("div", {"data-testid": "navigate", "data-to": to}),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("returnTo=/analytics")],
}));

vi.mock("@tryghost/admin-x-framework/api/settings", () => ({
    getSettingValue: vi.fn(),
    useBrowseSettings: mockUseBrowseSettings,
}));

vi.mock("@tryghost/admin-x-framework/api/site", () => ({
    useBrowseSite: mockUseBrowseSite,
}));

vi.mock("@/onboarding/hooks/use-onboarding", () => ({
    useOnboarding: mockOnboarding,
}));

vi.mock("@/onboarding/components/onboarding-checklist", () => ({
    OnboardingChecklist: () => React.createElement("div", {"data-testid": "onboarding-checklist"}),
}));

vi.mock("@/onboarding/components/share-publication-dialog", () => ({
    SharePublicationDialog: () => null,
}));

function mockDefaultOnboarding(overrides = {}) {
    mockOnboarding.mockReturnValue({
        allStepsCompleted: false,
        checklistState: "started",
        completeChecklist: vi.fn(),
        completedSteps: [],
        dismissChecklist: vi.fn(),
        isLoading: false,
        isOwner: true,
        markStepCompleted: vi.fn(),
        nextStep: "customize-design",
        shouldShowChecklist: true,
        ...overrides,
    });
}

describe("OnboardingRoute", () => {
    beforeEach(() => {
        mockNavigate.mockReset();
        mockUseBrowseSettings.mockReturnValue({data: {settings: []}, isLoading: false});
        mockUseBrowseSite.mockReturnValue({data: {site: {description: "", title: "Test site", url: "https://example.com"}}, isLoading: false});
        mockDefaultOnboarding();
    });

    it("redirects users when the checklist should not be shown", () => {
        mockDefaultOnboarding({
            checklistState: "pending",
            shouldShowChecklist: false,
        });

        render(<OnboardingRoute />);

        expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/analytics");
    });

    it("renders the checklist when onboarding is already started", () => {
        render(<OnboardingRoute />);

        expect(screen.getByTestId("onboarding-checklist")).toBeInTheDocument();
    });
});
